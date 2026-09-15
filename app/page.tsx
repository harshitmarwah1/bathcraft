import BathroomPlanningSection from "@/components/site/BathroomPlanningSection";
import BrandComparison from "@/components/site/BrandComparison";
import FinalCTA from "@/components/site/FinalCTA";
import Footer from "@/components/site/Footer";
import Hero from "@/components/site/Hero";
import HowItWorks from "@/components/site/HowItWorks";
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
        <section className="mx-auto max-w-[1280px] 2xl:max-w-[1440px] px-5 py-14 sm:px-6 lg:py-16">
          {/* grid-cols-1 is doing real work on phones, not decoration. Without an
              explicit track the single implicit column is sized `auto`, whose
              floor is the content's min-content width — here 502px, inside a
              327px container. `grid-cols-1` emits minmax(0, 1fr), which is
              allowed to shrink below that. main's overflow-x-clip was hiding
              the result rather than scrolling, so 175px of the planner was
              simply invisible on a phone. */}
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[58fr_42fr]">
            <PlannerDemo />
            <div className="flex flex-col gap-8">
              <StyleExplorer />
              <BrandComparison />
              <TileVisualizer />
            </div>
          </div>
        </section>

        <Testimonials />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}
