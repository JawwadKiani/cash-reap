import { db } from "./db";
import { eq, inArray, and } from "drizzle-orm";
import { users, creditCards, stores, merchantCategories, cardCategoryRewards, userSavedCards, userSearchHistory, userSpendingProfiles, purchasePlans, welcomeBonusTracking, userPreferences, cardComparisons } from "../shared/schema";
import crypto from "crypto";

class DatabaseStorage {
  constructor() {
    this.seedData();
  }

  // User operations
  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData: any) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({ target: users.id, set: { ...userData, updatedAt: new Date().toISOString() } }).returning();
    return user;
  }

  // Credit Cards
  async getCreditCards() {
    return await db.select().from(creditCards).where(eq(creditCards.isActive, 1));
  }
  async getCreditCard(id: string) {
    const [card] = await db.select().from(creditCards).where(eq(creditCards.id, id));
    return card;
  }

  // Stores & Categories
  async getStores() {
    return await db.select().from(stores);
  }
  async getStoreWithCategory(storeId: string) {
    const [store] = await db.select().from(stores).where(eq(stores.id, storeId));
    return store;
  }
  async getMerchantCategories() {
    return await db.select().from(merchantCategories);
  }

  // Card Recommendations
  async getCardRecommendationsForStore(storeId: string, userId?: string) {
    const store = await this.getStoreWithCategory(storeId);
    if (!store) return [];
    const categoryRewards = await db.select({ cardId: cardCategoryRewards.cardId, rewardRate: cardCategoryRewards.rewardRate }).from(cardCategoryRewards).where(eq(cardCategoryRewards.categoryId, store.categoryId));
    const cardIds = categoryRewards.map(r => r.cardId);
    if (cardIds.length === 0) return await db.select().from(creditCards).limit(5);
    let cards = await db.select().from(creditCards).where(inArray(creditCards.id, cardIds));
    const rewardMap = new Map(categoryRewards.map(r => [r.cardId, r.rewardRate]));
    cards = (cards as any[]).map(card => ({ ...card, rewardRate: parseFloat(String(rewardMap.get(card.id) ?? "0")) }));
    (cards as any[]).sort((a, b) => (a.rewardRate ?? 0) < (b.rewardRate ?? 0) ? 1 : -1);
    return cards.slice(0, 5);
  }

  // User Search History
  async addUserSearchHistory(history: any) {
    const historyWithId = { ...history, id: crypto.randomUUID() };
    const [newHistory] = await db.insert(userSearchHistory).values(historyWithId).returning();
    return newHistory;
  }

  // User Saved Cards
  async getUserSavedCards(userId: string) {
    return await db.select().from(userSavedCards).where(eq(userSavedCards.userId, userId));
  }
  async saveCard(savedCard: any) {
    const savedCardWithId = { ...savedCard, id: crypto.randomUUID(), savedAt: new Date().toISOString() };
    const [newSavedCard] = await db.insert(userSavedCards).values(savedCardWithId).returning();
    return newSavedCard;
  }
  async unsaveCard(userId: string, cardId: string) {
    const deletedRows = await db.delete(userSavedCards).where(and(eq(userSavedCards.userId, userId), eq(userSavedCards.cardId, cardId))).returning();
    return deletedRows.length > 0;
  }

  // User Spending Profiles
  async getUserSpendingProfile(userId: string) {
    return await db.select().from(userSpendingProfiles).where(eq(userSpendingProfiles.userId, userId));
  }
  async updateSpendingProfile(profile: any) {
    const [result] = await db.insert(userSpendingProfiles).values({ ...profile, id: crypto.randomUUID(), updatedAt: new Date().toISOString() }).onConflictDoUpdate({ target: [userSpendingProfiles.userId, userSpendingProfiles.categoryId], set: { monthlySpending: profile.monthlySpending, updatedAt: new Date().toISOString() } }).returning();
    return result;
  }

  // Purchase Plans
  async getUserPurchasePlans(userId: string) {
    return await db.select().from(purchasePlans).where(eq(purchasePlans.userId, userId));
  }
  async createPurchasePlan(plan: any) {
    const newPlan = { ...plan, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const [result] = await db.insert(purchasePlans).values(newPlan).returning();
    return result;
  }
  async updatePurchasePlan(id: string, updates: any) {
    const [result] = await db.update(purchasePlans).set(updates).where(eq(purchasePlans.id, id)).returning();
    return result;
  }
  async deletePurchasePlan(id: string) {
    const deletedRows = await db.delete(purchasePlans).where(eq(purchasePlans.id, id)).returning();
    return deletedRows.length > 0;
  }

  // Welcome Bonus Tracking
  async getUserWelcomeBonusTracking(userId: string) {
    return await db.select().from(welcomeBonusTracking).where(eq(welcomeBonusTracking.userId, userId));
  }
  async createWelcomeBonusTracking(tracking: any) {
    const newTracking = { ...tracking, id: crypto.randomUUID() };
    const [result] = await db.insert(welcomeBonusTracking).values(newTracking).returning();
    return result;
  }
  async updateWelcomeBonusTracking(id: string, updates: any) {
    const [result] = await db.update(welcomeBonusTracking).set(updates).where(eq(welcomeBonusTracking.id, id)).returning();
    return result;
  }

  // User Preferences
  async getUserPreferences(userId: string) {
    const [result] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result;
  }
  async updateUserPreferences(preferences: any) {
    const preferencesWithIdAndUpdatedAt = { ...preferences, id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
    const [result] = await db.insert(userPreferences).values(preferencesWithIdAndUpdatedAt).onConflictDoUpdate({ target: userPreferences.userId, set: { ...preferences, updatedAt: new Date().toISOString() } }).returning();
    return result;
  }

  // Card Comparisons
  async getUserCardComparisons(userId: string) {
    return await db.select().from(cardComparisons).where(eq(cardComparisons.userId, userId));
  }
  async createCardComparison(comparison: any) {
    const newComparison = { ...comparison, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const [result] = await db.insert(cardComparisons).values(newComparison).returning();
    return result;
  }

  // Seeding logic
  async seedData() {
    // Implement comprehensive business and card seeding logic here
    // Only one store/business database, no duplicates
  }
}

export const storage = new DatabaseStorage();
