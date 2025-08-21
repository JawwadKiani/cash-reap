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
      <CardComparison
        selectedCards={cards}
        onCardRemove={handleCardRemove}
        onCardAdd={handleCardAdd}
      />
    </main>
  );
}
