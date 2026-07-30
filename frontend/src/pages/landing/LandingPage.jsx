import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import MRISection from "./components/MRISection";
import WorkflowSection from "./components/WorkflowSection";
import StatsSection from "./components/StatsSection";
import ResearchSection from "./components/ResearchSection";
import CTASection from "./components/CTASection";


export default function LandingPage() {

  return (

    <>

      {/* Hero Introduction */}
      <HeroSection />


      {/* Core AI Capabilities */}
      <FeaturesSection />


      {/* Deep dive into MRI + Attention U-Net */}
      <MRISection />


      {/* AI Pipeline Workflow */}
      <WorkflowSection />


      {/* Research Metrics */}
      <StatsSection />


      {/* Research & Technology Highlights */}
      <ResearchSection />


      {/* Final Conversion */}
      <CTASection />


    </>

  );

}