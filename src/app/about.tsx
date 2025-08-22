import { CompetitiveAdvantages } from "@/components/competitive-advantages";
import { InnovationHighlights } from "@/components/innovation-highlights";
import { UniqueFeaturesSection } from "@/components/unique-features-section";

export default function About() {
  return (
    <main className="p-8 min-h-screen bg-background">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-green-700">About CashReap</h1>
      <section className="mb-12">
        <UniqueFeaturesSection />
      </section>
      <section className="mb-12">
        <CompetitiveAdvantages />
      </section>
      <section>
        <InnovationHighlights />
      </section>
    </main>
  );
}
