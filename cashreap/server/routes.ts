import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import { storage } from "./storage";

export async function registerRoutes(app: Express) {
  // --- Auth ---
  app.post("/api/auth/signup", async (req, res) => {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) return res.status(400).json({ message: "Email or phone and password required" });
    try {
      const id = email || phone;
      const existing = await storage.getUser(id);
      if (existing) return res.status(409).json({ message: "User already exists" });
      const hash = await bcrypt.hash(password, 10);
      const user = await storage.upsertUser({ id, email, phone, passwordHash: hash, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      res.json({ id: user.id, email: user.email, phone: user.phone });
    } catch {
      res.status(500).json({ message: "Signup failed" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) return res.status(400).json({ message: "Email or phone and password required" });
    try {
      const id = email || phone;
      const user = await storage.getUser(id);
      if (!user || !user.passwordHash) return res.status(401).json({ message: "Invalid credentials" });
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });
      res.json({ id: user.id, email: user.email, phone: user.phone });
    } catch {
      res.status(500).json({ message: "Signin failed" });
    }
  });

  // --- Stores ---
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getStores();
      res.json(stores);
    } catch {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") return res.status(400).json({ message: "Search query is required" });
      const allStores = await storage.getStores();
      let results = allStores.filter(store => store.name && store.name.toLowerCase().includes(q.toLowerCase()));
      // Deduplicate .com/physical stores
      const deduped = [];
      const seen = new Set();
      for (const store of results) {
        const norm = store.name.toLowerCase().replace(/\.com$/, "").replace(/[^a-z0-9]/gi, "");
        if (!seen.has(norm)) {
          deduped.push(store);
          seen.add(norm);
        }
      }
      // Attach card recommendations for each store
      const storesWithCards = await Promise.all(deduped.map(async store => {
        let cards = await storage.getCardRecommendationsForStore(store.id);
        return { ...store, recommendations: cards };
      }));
      res.json(storesWithCards);
    } catch {
      res.status(500).json({ message: "Failed to search stores" });
    }
  });

  app.get("/api/stores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const store = await storage.getStoreWithCategory(id);
      if (!store) return res.status(404).json({ message: "Store not found" });
      res.json(store);
    } catch {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.get("/api/stores/:id/recommendations", async (req, res) => {
    try {
      const { id } = req.params;
      let recommendations = await storage.getCardRecommendationsForStore(id);
      res.json(recommendations);
    } catch {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // --- Credit Cards ---
  app.get("/api/credit-cards", async (req, res) => {
    try {
      const cards = await storage.getCreditCards();
      res.json(cards);
    } catch {
      res.status(500).json({ message: "Failed to fetch credit cards" });
    }
  });

  app.get("/api/credit-cards/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const card = await storage.getCreditCard(id);
      if (!card) return res.status(404).json({ message: "Credit card not found" });
      res.json(card);
    } catch {
      res.status(500).json({ message: "Failed to fetch credit card" });
    }
  });

  // --- Categories ---
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getMerchantCategories();
      res.json(categories);
    } catch {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // --- User Search History ---
  app.get("/api/search-history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await storage.addUserSearchHistory(userId);
      res.json(history);
    } catch {
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });

  app.post("/api/search-history", async (req, res) => {
    try {
      const { storeId, userId } = req.body;
      const history = await storage.addUserSearchHistory({ storeId, userId, searchedAt: new Date().toISOString() });
      res.json(history);
    } catch {
      res.status(500).json({ message: "Failed to add to search history" });
    }
  });

  // --- User Saved Cards ---
  app.get("/api/saved-cards/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const savedCards = await storage.getUserSavedCards(userId);
      res.json(savedCards);
    } catch {
      res.status(500).json({ message: "Failed to fetch saved cards" });
    }
  });

  app.post("/api/saved-cards", async (req, res) => {
    try {
      const { cardId, userId } = req.body;
      const savedCard = await storage.saveCard({ cardId, userId, savedAt: new Date().toISOString() });
      res.json(savedCard);
    } catch {
      res.status(500).json({ message: "Failed to save card" });
    }
  });

  app.delete("/api/saved-cards/:userId/:cardId", async (req, res) => {
    try {
      const { userId, cardId } = req.params;
      const success = await storage.unsaveCard(userId, cardId);
      if (!success) return res.status(404).json({ message: "Saved card not found" });
      res.json({ message: "Card unsaved successfully" });
    } catch {
      res.status(500).json({ message: "Failed to unsave card" });
    }
  });

  // --- Purchase Plans ---
  app.get('/api/purchase-plans/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const plans = await storage.getUserPurchasePlans(userId);
      res.json(plans);
    } catch {
      res.status(500).json({ message: "Failed to fetch purchase plans" });
    }
  });

  app.post('/api/purchase-plans', async (req, res) => {
    try {
      const plan = await storage.createPurchasePlan(req.body);
      res.json(plan);
    } catch {
      res.status(500).json({ message: "Failed to create purchase plan" });
    }
  });

  app.patch('/api/purchase-plans/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.updatePurchasePlan(id, req.body);
      res.json(plan);
    } catch {
      res.status(500).json({ message: "Failed to update purchase plan" });
    }
  });

  app.delete('/api/purchase-plans/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePurchasePlan(id);
      if (!success) return res.status(404).json({ message: "Purchase plan not found" });
      res.json({ message: "Purchase plan deleted successfully" });
    } catch {
      res.status(500).json({ message: "Failed to delete purchase plan" });
    }
  });

  // --- Welcome Bonus Tracking ---
  app.get('/api/welcome-bonus-tracking/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const trackings = await storage.getUserWelcomeBonusTracking(userId);
      res.json(trackings);
    } catch {
      res.status(500).json({ message: "Failed to fetch welcome bonus tracking" });
    }
  });

  app.post('/api/welcome-bonus-tracking', async (req, res) => {
    try {
      const tracking = await storage.createWelcomeBonusTracking(req.body);
      res.json(tracking);
    } catch {
      res.status(500).json({ message: "Failed to create welcome bonus tracking" });
    }
  });

  app.patch('/api/welcome-bonus-tracking/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const tracking = await storage.updateWelcomeBonusTracking(id, req.body);
      res.json(tracking);
    } catch {
      res.status(500).json({ message: "Failed to update welcome bonus tracking" });
    }
  });

  // --- Card Comparisons ---
  app.post('/api/card-comparisons', async (req, res) => {
    try {
      const comparison = await storage.createCardComparison(req.body);
      res.json(comparison);
    } catch {
      res.status(500).json({ message: "Failed to create card comparison" });
    }
  });
}
