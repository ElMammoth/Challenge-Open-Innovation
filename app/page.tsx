import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Parcours from "@/components/Parcours";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import HCSFExplainer from "@/components/HCSFExplainer";
import Simulator from "@/components/Simulator";

import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Parcours />
        <HowItWorks />
        <Features />
        <HCSFExplainer />
        <Simulator />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
