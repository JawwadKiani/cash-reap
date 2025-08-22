
import { db } from "./db";
import { cardCategoryRewards, creditCards } from "@shared/schema";

// Dynamic recommendation function
export async function getBestCardRecommendation(categoryId: string) {
  // Get all reward rates for this category
  const rewards = await db.select().from(cardCategoryRewards).where(cardCategoryRewards.categoryId.eq(categoryId));
  if (!rewards.length) return null;

  // Get card details for all matching rewards
  const cardIds = rewards.map(r => r.cardId);
  const cards = await db.select().from(creditCards).where(creditCards.id.in(cardIds));

  // Find the best reward rate
  const bestReward = Math.max(...rewards.map(r => r.rewardRate));
  const bestCards = rewards.filter(r => r.rewardRate === bestReward).map(r => r.cardId);
  const recommendedCards = cards.filter(c => bestCards.includes(c.id));

  // Add dynamic description
  return recommendedCards.map(card => ({
    id: card.id,
    name: card.name,
    issuer: card.issuer,
    rewardRate: bestReward,
    description: `Best for this category: ${bestReward}% cash back with ${card.name}${card.annualFee > 0 ? ` (Annual Fee: $${card.annualFee})` : ''}`,
    annualFee: card.annualFee,
    baseReward: card.baseReward,
    welcomeBonus: card.welcomeBonus,
    creditScoreRequired: card.minCreditScore,
  }));
}
