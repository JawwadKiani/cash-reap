import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sqliteTable, text, integer, real, blob } from "drizzle-orm/sqlite-core";
// Credit Cards Table
export const creditCards = sqliteTable("credit_cards", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  annualFee: integer("annual_fee").notNull().default(0),
  minCreditScore: integer("min_credit_score").notNull().default(600),
  baseReward: real("base_reward").notNull().default(1.00),
  welcomeBonus: text("welcome_bonus"),
  description: text("description"),
  isActive: integer("is_active").notNull().default(1)
});
// Merchant Categories Table
export const merchantCategories = sqliteTable("merchant_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  iconClass: text("icon_class")
});
// Card Category Rewards Table
export const cardCategoryRewards = sqliteTable("card_category_rewards", {
  id: text("id").primaryKey(),
  cardId: text("card_id").notNull(),
  categoryId: text("category_id").notNull(),
  rewardRate: real("reward_rate").notNull(),
  isRotating: integer("is_rotating").notNull().default(0),
  rotationPeriod: text("rotation_period")
});
// Stores Table
export const stores = sqliteTable("stores", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  categoryId: text("category_id").notNull(),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  isChain: integer("is_chain").notNull().default(0)
});
// User Search History Table
export const userSearchHistory = sqliteTable("user_search_history", {
  id: text("id").primaryKey(),
  storeId: text("store_id").notNull(),
  userId: text("user_id").notNull(),
  searchedAt: text("searched_at").notNull()
});

// Session storage table for Auth
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: blob("sess").notNull(),
    expire: text("expire").notNull(),
  }
);

// User storage table for  Auth
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const userSavedCards = sqliteTable("user_saved_cards", {
  id: text("id").primaryKey(),
  cardId: text("card_id").notNull(),
  userId: text("user_id").notNull(),
  savedAt: text("saved_at").notNull(),
});

// New tables for enhanced features

export const userSpendingProfiles = sqliteTable("user_spending_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  categoryId: text("category_id").notNull(),
  monthlySpending: real("monthly_spending").notNull().default(0.00),
  updatedAt: text("updated_at").notNull()
});

export const purchasePlans = sqliteTable("purchase_plans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  amount: real("amount").notNull(),
  storeId: text("store_id"),
  categoryId: text("category_id"),
  targetDate: text("target_date"),
  isCompleted: integer("is_completed").notNull().default(0),
  createdAt: text("created_at").notNull()
});

export const welcomeBonusTracking = sqliteTable("welcome_bonus_tracking", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  cardId: text("card_id").notNull(),
  requiredSpending: real("required_spending").notNull(),
  currentSpending: real("current_spending").notNull().default(0.00),
  timeframeMonths: integer("timeframe_months").notNull().default(3),
  startDate: text("start_date").notNull(),
  isCompleted: integer("is_completed").notNull().default(0)
});

export const userPreferences = sqliteTable("user_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  creditScoreRange: text("credit_score_range").notNull().default("650-700"),
  maxAnnualFee: integer("max_annual_fee").notNull().default(0),
  preferredIssuers: text("preferred_issuers"),
  notificationsEnabled: integer("notifications_enabled").notNull().default(1),
  updatedAt: text("updated_at").notNull()
});

export const cardComparisons = sqliteTable("card_comparisons", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  cardIds: text("card_ids").notNull(),
  comparisonName: text("comparison_name"),
  createdAt: text("created_at").notNull()
});

// Insert schemas
export const insertCreditCardSchema = createInsertSchema(creditCards).omit({ id: true });
export const insertMerchantCategorySchema = createInsertSchema(merchantCategories).omit({ id: true });
export const insertCardCategoryRewardSchema = createInsertSchema(cardCategoryRewards).omit({ id: true });
export const insertStoreSchema = createInsertSchema(stores).omit({ id: true });
export const insertUserSearchHistorySchema = createInsertSchema(userSearchHistory).omit({ id: true });
export const insertUserSavedCardSchema = createInsertSchema(userSavedCards).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertUserSpendingProfileSchema = createInsertSchema(userSpendingProfiles).omit({ id: true, updatedAt: true });
export const insertPurchasePlanSchema = createInsertSchema(purchasePlans).omit({ id: true, createdAt: true });
export const insertWelcomeBonusTrackingSchema = createInsertSchema(welcomeBonusTracking).omit({ id: true });
export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({ id: true, updatedAt: true });
export const insertCardComparisonSchema = createInsertSchema(cardComparisons).omit({ id: true, createdAt: true });

// Types
export type CreditCard = typeof creditCards.$inferSelect;
export type InsertCreditCard = z.infer<typeof insertCreditCardSchema>;
export type MerchantCategory = typeof merchantCategories.$inferSelect;
export type InsertMerchantCategory = z.infer<typeof insertMerchantCategorySchema>;
export type CardCategoryReward = typeof cardCategoryRewards.$inferSelect;
export type InsertCardCategoryReward = z.infer<typeof insertCardCategoryRewardSchema>;
export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type UserSearchHistory = typeof userSearchHistory.$inferSelect;
export type InsertUserSearchHistory = z.infer<typeof insertUserSearchHistorySchema>;
export type UserSavedCard = typeof userSavedCards.$inferSelect;
export type InsertUserSavedCard = z.infer<typeof insertUserSavedCardSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type UserSpendingProfile = typeof userSpendingProfiles.$inferSelect;
export type InsertUserSpendingProfile = z.infer<typeof insertUserSpendingProfileSchema>;
export type PurchasePlan = typeof purchasePlans.$inferSelect;
export type InsertPurchasePlan = z.infer<typeof insertPurchasePlanSchema>;
export type WelcomeBonusTracking = typeof welcomeBonusTracking.$inferSelect;
export type InsertWelcomeBonusTracking = z.infer<typeof insertWelcomeBonusTrackingSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type CardComparison = typeof cardComparisons.$inferSelect;
export type InsertCardComparison = z.infer<typeof insertCardComparisonSchema>;

// Extended types for API responses
export type StoreWithCategory = Store & {
  category: MerchantCategory;
};

export type CardRecommendation = CreditCard & {
  rewardRate: string;
  categoryMatch: string;
  isRotating: boolean;
  rotationPeriod?: string;
};

export type LocationData = {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
};

// Enhanced API response types
export type SpendingAnalysis = {
  categoryId: string;
  categoryName: string;
  monthlySpending: number;
  recommendedCards: CardRecommendation[];
  potentialEarnings: number;
};

export type PurchasePlanWithRecommendations = PurchasePlan & {
  store?: StoreWithCategory;
  category?: MerchantCategory;
  recommendedCards: CardRecommendation[];
  potentialEarnings: number;
};

export type WelcomeBonusProgress = WelcomeBonusTracking & {
  card: CreditCard;
  progressPercentage: number;
  remainingSpending: number;
  daysRemaining: number;
};

export type CardWithEarnings = CreditCard & {
  projectedAnnualEarnings: number;
  topCategories: Array<{
    categoryName: string;
    rewardRate: string;
    monthlyEarnings: number;
  }>;
};
