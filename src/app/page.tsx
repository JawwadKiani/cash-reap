import { useState } from 'react';
import { CardComparison } from '@/components/card-comparison';

export default function Home() {
  const [cards, setCards] = useState(/* initial cards or [] */);

  const handleCardRemove = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId));
  };

  const handleCardAdd = () => {
    // your logic to add cards, e.g., open modal or add a default card
  };

  return (
    <main className="p-8 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-12 mb-8">
  <img src="/src/assets/usp-better.png" alt="CashReap agricultural theme illustration showing harvest rewards" className="w-32 h-32 mb-4 drop-shadow-lg" />
        <h1 className="text-4xl font-extrabold mb-4 text-green-700">Harvest Your Rewards</h1>
        <p className="text-lg text-muted-foreground max-w-xl mb-6">
          The only app with an agricultural theme that makes earning cash back feel like reaping what you sow. Try our privacy-first, instant guest access and business-specific search for smarter rewards.
        </p>
        <a href="/my-cards">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold text-lg">Get Started</button>
        </a>
      </section>
      {/* Main Feature: Card Comparison */}
      <CardComparison
        selectedCards={cards}
        onCardRemove={handleCardRemove}
        onCardAdd={handleCardAdd}
      />
    </main>
  );
}
