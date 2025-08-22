import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CardRecommendation } from "@/components/card-recommendation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  Search, 
  CreditCard, 
  Scale, 
  Sparkles,
  MapPin,
  Star,
  Heart,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { StoreBrowser } from "@/components/store-browser";

interface Store {
  id: string;
  name: string;
  categoryId: string;
  isOnline?: boolean;
}

interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  creditScoreRequired: string;
  baseRewardRate: number;
  description: string;
  features: string[];
  welcomeBonus: string;
}

interface SavedCard {
  id: string;
  cardId: string;
  card: CreditCard;
  addedAt: string;
}

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showStoreBrowser, setShowStoreBrowser] = useState(false);
  const queryClient = useQueryClient();

  // Get stores for search
  const { data: stores = [] } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  // Get user's saved cards
  const userId = user?.id ?? "";
  const { data: savedCards = [] } = useQuery<SavedCard[]>({
    queryKey: ["/api/saved-cards", userId],
    enabled: !!userId,
  });


  // Get best card recommendations for selected store/category
  const { data: recommendations = [], isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["/api/best-card-recommendations", selectedStore?.categoryId],
    enabled: !!selectedStore,
    queryFn: async () => {
      if (!selectedStore) return [];
      const res = await fetch(`/api/best-card-recommendations?categoryId=${selectedStore.categoryId}`);
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (cardId: string) => {
      if (!userId) throw new Error("User not authenticated");
      const response = await fetch("/api/saved-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, cardId }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to save card");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-cards", userId] });
    },
  });

  return (
    <div className="min-h-screen bg-surface pb-6">
      <main className="max-w-md mx-auto px-4 py-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <h1 className="text-2xl font-bold text-on-surface mb-2">
            Find Your Perfect Card
          </h1>
          <p className="text-on-surface-variant text-sm">
            Get the highest cash back for any store
          </p>
        </div>

        {/* Store Search */}
        {!selectedStore && (
          <Card className="p-4 border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-on-surface">Where are you shopping?</h2>
            </div>
            <Button
              onClick={() => setShowStoreBrowser(true)}
              className="w-full"
              size="lg"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Stores
            </Button>
          </Card>
        )}

        {/* Selected Store & Recommendations */}
        {selectedStore && (
          <div className="space-y-4">
            <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    {selectedStore.name}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Best cards for maximum rewards
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStore(null)}
                >
                  Change
                </Button>
              </div>
            </Card>

            {/* Recommendations */}
            <div className="space-y-3">
              <h3 className="font-semibold text-on-surface">Recommended Cards</h3>
              {isLoadingRecommendations ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                recommendations.slice(0, 3).map((card) => (
                  <CardRecommendation
                    key={card.id}
                    card={card}
                    rewardRate={card.rewardRate}
                    categoryMatch={selectedStore?.name}
                    onViewDetails={() => {}}
                    isSaved={savedCards.some(saved => saved.cardId === card.id)}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Quick Actions for returning users */}
        {!selectedStore && Array.isArray(savedCards) && savedCards.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-on-surface">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => navigate("/my-cards")}
                variant="outline"
                className="h-auto py-3 flex flex-col items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">My Cards</span>
              </Button>
              <Button
                onClick={() => navigate("/card-comparison")}
                variant="outline" 
                className="h-auto py-3 flex flex-col items-center gap-2"
              >
                <Scale className="w-5 h-5" />
                <span className="text-xs">Compare</span>
              </Button>
            </div>
          </div>
        )}

        {/* AI Insights Section - Simplified */}
        {!selectedStore && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">AI Recommendation</h3>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
              Based on your spending, you could save $234/year by switching to the Capital One Savor for dining purchases.
            </p>
            <Button
              onClick={() => navigate("/ai-recommendations")}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              View All Insights
            </Button>
          </div>
        )}

        {/* Simple Browse Section */}
        {!selectedStore && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-on-surface">Explore More</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => navigate("/browse-cards")}
                variant="outline"
                size="sm"
              >
                Browse All Cards
              </Button>
              <Button
                onClick={() => navigate("/reward-calculator")}
                variant="outline"
                size="sm"
              >
                Calculate Rewards
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Store Browser Modal */}
      {showStoreBrowser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface w-full max-w-md h-[90vh] max-h-[600px] rounded-xl shadow-xl flex flex-col overflow-hidden">
            <StoreBrowser
              onStoreSelect={(store) => {
                setSelectedStore(store);
                setShowStoreBrowser(false);
              }}
              selectedStore={selectedStore}
              onClose={() => setShowStoreBrowser(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}