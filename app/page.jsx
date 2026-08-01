import TopBar from '@/components/shell/TopBar'
import Hero from '@/components/landing/Hero'
import WorkspaceRail from '@/components/intake/WorkspaceRail'
import {
  Capabilities,
  Footer,
  Honesty,
  HowItWorks,
  KillShot,
  Outputs,
} from '@/components/landing/Sections'

export default function Home() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <WorkspaceRail />
        <KillShot />
        <Outputs />
        <HowItWorks />
        <Honesty />
        <Capabilities />
      </main>
      <Footer />
    </>
  )
}
