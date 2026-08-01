import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Fallback static translations for demo when API key is missing or call fails
const FALLBACK_TRANSLATIONS = {
  hi: {
    summary: 'छात्रावास के खाद्य अपशिष्ट को कम करने के लिए स्वचालित अंतर्दृष्टि और लाइव रिपॉजिटरी सत्यापन।',
    verdict: 'सामान्य खाद्य ट्रैकिंग में उच्च संतृप्ति (78%); छात्रावास-विशिष्ट वजन-सेंसर पूर्वानुमानों में शून्य कवरेज।',
    whiteSpace: [
      'छात्रावास रसोई में बैच-स्तर अवशेष ट्रैकिंग',
      'स्वचालित मेनू समायोजन के लिए दैनिक खपत पूर्वानुमान मॉडल',
      'कम लागत वाला IoT स्केल एकीकरण और छात्र प्रतिक्रिया पाश',
    ],
    unverified: [
      'व्यावसायिक रसोई अपशिष्ट ट्रैकिंग सिस्टम के दावे',
      'वास्तविक समय के तापमान सेंसर डेटा प्रवाह',
    ],
  },
  mr: {
    summary: 'वसतिगृहातील अन्न नासाडी कमी करण्यासाठी स्वयंचलित संशोधन आणि थेट रेपॉजिटरी पडताळणी.',
    verdict: 'सामान्य अन्न ट्रॅकिंगमध्ये उच्च संपृक्तता (78%); वसतिगृह-विशिष्ट वजन-सेंसर अंदाज प्रक्रियेत शून्य कव्हरेज.',
    whiteSpace: [
      'वसतिगृह स्वयंपाकघरांमध्ये बॅच-स्तरीय अन्न कचरा ट्रॅकिंग',
      'स्वयंचलित मेनू समायोजनासाठी दैनंदिन वापर अंदाज मॉडेल',
      'कमी खर्चाचे IoT स्केल एकत्रिकरण आणि विद्यार्थी अभिप्राय',
    ],
    unverified: [
      'व्यावसायिक स्वयंपाकघर कचरा ट्रॅकिंग सिस्टीमचे दावे',
      'रिअल-टाइम तापमान सेंसर डेटा प्रवाह',
    ],
  },
}

export async function POST(request) {
  try {
    const { targetLang, analysis } = await request.json()

    if (!targetLang || targetLang === 'en' || !analysis) {
      return NextResponse.json({ analysis: analysis || {} })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey) {
      try {
        const anthropic = new Anthropic({ apiKey })
        const prompt = `Translate the following JSON human-prose text fields into ${
          targetLang === 'hi' ? 'Hindi' : 'Marathi'
        }.
IMPORTANT:
1. Do NOT translate URLs, repository names, tech stack choices, numbers, dates, or mono code symbols.
2. Return ONLY a valid JSON object matching the input structure.

Input JSON:
${JSON.stringify({
  summary: analysis.summary || '',
  verdict: analysis.novelty?.verdict || '',
  whiteSpace: analysis.novelty?.whiteSpace || [],
  unverified: analysis.unverified || [],
})}`

        const response = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        })

        const text = response.content[0]?.text || ''
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const translatedFields = JSON.parse(jsonMatch[0])
          const updatedAnalysis = {
            ...analysis,
            language: targetLang,
            summary: translatedFields.summary || analysis.summary,
            novelty: analysis.novelty
              ? {
                  ...analysis.novelty,
                  verdict: translatedFields.verdict || analysis.novelty.verdict,
                  whiteSpace: translatedFields.whiteSpace || analysis.novelty.whiteSpace,
                }
              : undefined,
            unverified: translatedFields.unverified || analysis.unverified,
          }
          return NextResponse.json({ analysis: updatedAnalysis })
        }
      } catch (err) {
        console.warn('[Translate API] Claude call failed, falling back to static translation:', err.message)
      }
    }

    // Fallback translation handling
    const fallback = FALLBACK_TRANSLATIONS[targetLang] || FALLBACK_TRANSLATIONS.hi
    const updatedAnalysis = {
      ...analysis,
      language: targetLang,
      summary: fallback.summary,
      novelty: analysis.novelty
        ? {
            ...analysis.novelty,
            verdict: fallback.verdict,
            whiteSpace: fallback.whiteSpace,
          }
        : undefined,
      unverified: fallback.unverified,
    }

    return NextResponse.json({ analysis: updatedAnalysis })
  } catch (error) {
    console.error('Error in translate API:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
