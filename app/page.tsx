import BathroomPlanningSection from "@/components/site/BathroomPlanningSection";
import BrandComparison from "@/components/site/BrandComparison";
import FinalCTA from "@/components/site/FinalCTA";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import HowItWorks from "@/components/site/HowItWorks";
import MetricsBar from "@/components/site/MetricsBar";
import Navbar from "@/components/site/Navbar";
import PlannerDemo from "@/components/site/PlannerDemo";
import StyleExplorer from "@/components/site/StyleExplorer";
import Testimonials from "@/components/site/Testimonials";
import TileVisualizer from "@/components/site/TileVisualizer";
import ValuePropositionBar from "@/components/site/ValuePropositionBar";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* The navbar is fixed, so the page starts below its 72px. */}
      <main className="overflow-x-clip pt-[72px]">
        <Hero />
        <ValuePropositionBar />
        <BathroomPlanningSection />
        <HowItWorks />

        {/* Planner left, the three explore cards stacked right. */}
        <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 lg:py-16">
          <div className="grid items-stretch gap-6 lg:grid-cols-[58fr_42fr]">
            <PlannerDemo />
            <div className="flex flex-col gap-8">
              <StyleExplorer />
              <BrandComparison />
              <TileVisualizer />
            </div>
          </div>
        </section>

        <MetricsBar />
        <Testimonials />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
