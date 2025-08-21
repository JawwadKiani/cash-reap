import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, CreditCard, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Store {
  id: string;
  name: string;
  categoryId: string;
  isOnline?: boolean;
  recommendations?: CardRecommendation[];
}

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CardRecommendation {
  id: string;
  name: string;
  issuer: string;
  baseReward: string;
  annualFee: number;
  minCreditScore: number;
  welcomeBonus: string;
  description: string;
  categoryId: string;
}

interface GuestCardFinderProps {
  onSignUpClick: () => void;
}

export function GuestCardFinder({ onSignUpClick }: GuestCardFinderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showCategoryFallback, setShowCategoryFallback] = useState(false);
  const [estimatedSpend, setEstimatedSpend] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<Store[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: stores = [] } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    enabled: showCategoryFallback,
  });

  const { data: recommendations = [] } = useQuery<CardRecommendation[]>({
    queryKey: selectedStore 
      ? [`/api/stores/${selectedStore.id}/recommendations`]
      : selectedCategory
      ? [`/api/categories/${selectedCategory}/recommendations`]
      : [],
    enabled: !!(selectedStore || selectedCategory),
  });

  // Filter stores based on search
  const filteredStores = stores.filter((store: Store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5);

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setSelectedCategory("");
    setSearchTerm(store.name);
    setShowCategoryFallback(false);
    setSearchResults([]);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedStore(null);
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setSearchTerm(`${category.name} business`);
    }
    setSearchResults([]);
  };

  // Live search as user types
  const handleSearchChange = async (value: string) => {
    setSearchTerm(value);
    if (value.length > 1) {
      setIsSearching(true);
      setSelectedStore(null);
      setSelectedCategory("");
      setShowCategoryFallback(true);
      try {
        const res = await fetch(`/api/stores/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch {
        setSearchResults([]);
      }
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = () => {
    if (searchResults.length > 0) {
      handleStoreSelect(searchResults[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Store Search */}
      <Card className="border-primary/20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Try It Now - No Sign Up Required
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Search any major US business to see the best credit card for maximum rewards
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input for guests */}
          {!selectedStore && !selectedCategory && (
            <div className="mb-4 flex flex-col items-center gap-2">
              <Input
                type="text"
                placeholder="Type any business name..."
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearchSubmit(); }}
                className="w-full max-w-md text-lg px-4 py-2 border border-primary rounded-lg shadow"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">Press Enter to search or select a popular store below.</p>
            </div>
          )}
          {/* Popular Stores Quick Select */}
          {!selectedStore && !selectedCategory && searchTerm.length <= 1 && (
            <div>
              <p className="text-sm font-medium mb-2">Popular Stores:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Target", "Amazon", "Starbucks", "Netflix", "Walmart", "Costco"].map((storeName) => {
                  const store = stores.find(s => s.name === storeName);
                  return store ? (
                    <Badge
                      key={store.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 transition-colors"
                      onClick={() => handleStoreSelect(store)}
                    >
                      {storeName}
                    </Badge>
                  ) : null;
                })}
              </div>
              <p className="text-xs text-muted-foreground">Or type any business name above and press Enter to search.</p>
            </div>
          )}
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Search Results:</p>
              <div className="flex flex-wrap gap-3">
                {searchResults.map(store => {
                  const bestCard = store.recommendations && store.recommendations.length > 0 ? store.recommendations[0] : null;
                  return (
                    <Card key={store.id} className="p-3 w-64 border border-primary/30 bg-white dark:bg-gray-900 shadow cursor-pointer" onClick={() => handleStoreSelect(store)}>
                      <CardHeader>
                        <CardTitle className="text-lg font-bold">{store.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Category: {store.categoryId}</p>
                        {bestCard ? (
                          <div className="mt-2 p-2 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900">
                            <h4 className="font-bold text-green-800 dark:text-green-200 mb-1">Best Card: {bestCard.name}</h4>
                            <p className="text-green-700 dark:text-green-300 text-sm mb-1">{bestCard.baseReward}% cash back</p>
                            <p className="text-xs text-muted-foreground">Issuer: {bestCard.issuer}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-2">No card recommendation for this category yet.</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Recommendations Results */}
      {(selectedStore || selectedCategory) && (
        <Card className="border-green-300 bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-950 dark:via-green-900 dark:to-green-800 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-200 text-2xl font-bold">
              <CreditCard className="w-6 h-6" />
              {selectedStore && typeof selectedStore === 'object' && selectedStore !== null && 'name' in selectedStore
                ? `Best Card for ${(selectedStore as Store).name}`
                : `Best Card for ${categories.find(c => c.id === selectedCategory)?.name || 'Selected Category'}`
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {/* Only show the best card */}
                {(() => {
                  const card = recommendations[0];
                  if (!card) return null;
                  return (
                    <div key={card.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 shadow-md flex flex-col items-center">
                      {/* Card image placeholder (replace with real image if available) */}
                      <div className="mb-3">
                        <img src={`/cards/${card.id}.png`} alt={card.name} className="w-32 h-20 object-contain rounded-lg shadow" onError={e => {e.currentTarget.style.display='none';}} />
                      </div>
                      <h4 className="font-bold text-xl text-green-800 dark:text-green-200 mb-2">{card.name}</h4>
                      <p className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">{card.baseReward}% cash back</p>
                      {/* Estimated spend input */}
                      <div className="flex flex-col items-center gap-2 mb-2">
                        <label htmlFor="spend" className="text-sm text-muted-foreground">Estimate your spend:</label>
                        <input
                          id="spend"
                          type="number"
                          min="0"
                          placeholder="Enter amount (USD)"
                          className="border rounded px-2 py-1 w-32 text-center"
                          value={estimatedSpend}
                          onChange={e => {
                            const val = parseFloat(e.target.value);
                            setEstimatedSpend(isNaN(val) ? 0 : val);
                          }}
                        />
                        {typeof estimatedSpend === 'number' && estimatedSpend > 0 && (
                          <p className="text-green-800 dark:text-green-200 text-sm font-medium">You’ll earn <span className="font-bold">${(estimatedSpend * (parseFloat(card.baseReward) / 100)).toFixed(2)}</span> cash back</p>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-4">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2 animate-bounce" />
                <p className="text-green-700 dark:text-green-300">
                  No match yet, but we’re learning! Try another store or category.
                </p>
              </div>
            )}
            {/* Call to Action */}
            <div className="pt-4 border-t border-green-200 dark:border-green-800">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Want to see all recommendations and save your favorite cards?
                </p>
                <Button 
                  onClick={onSignUpClick}
                  className="w-full bg-gradient-to-r from-primary to-green-500 text-white font-bold shadow-lg hover:scale-105 transition-transform"
                  size="lg"
                >
                  Sign Up for Full Access
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedStore(null);
                    setSelectedCategory("");
                    setSearchTerm("");
                    setShowCategoryFallback(false);
                    setEstimatedSpend(0);
                    setSearchResults([]);
                  }}
                  className="w-full text-green-700 dark:text-green-300 font-semibold hover:bg-green-100 dark:hover:bg-green-900"
                  size="sm"
                >
                  Search Another Store
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}