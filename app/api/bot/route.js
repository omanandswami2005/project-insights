import { NextResponse } from 'next/server'
import { handleTelegramUpdate } from '@/lib/bot/telegram'

export async function POST(request) {
  try {
    const update = await request.json()
    const result = await handleTelegramUpdate(update)
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    console.error('Error handling Telegram webhook:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  const configured = Boolean(process.env.TELEGRAM_BOT_TOKEN)
  return NextResponse.json({
    status: 'online',
    botConfigured: configured,
    supportedCommands: ['/analyze <idea>', '/remind <idea>', '/help'],
    message: configured
      ? 'Telegram bot endpoint ready for webhook'
      : 'Telegram bot endpoint active in fallback/fixture mode (set TELEGRAM_BOT_TOKEN to enable Telegram API delivery)',
  })
}
