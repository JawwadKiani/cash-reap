import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  X, Plus, CreditCard, DollarSign, Calendar, Star, Check, Info
} from "lucide-react";

interface CreditCardData {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  baseReward: number;
  description: string;
  creditScoreRequired?: string;
  welcomeBonus?: string;
  features?: string[];
}

interface CardComparisonProps {
  selectedCards?: CreditCardData[];
  onCardRemove?: (cardId: string) => void;
  onCardAdd?: () => void;
  className?: string;
}

const SAMPLE_CARDS: CreditCardData[] = [
  // sample card data omitted for brevity (unchanged)
];

const COMPARISON_CATEGORIES = [
  { key: "annualFee", label: "Annual Fee", type: "fee" },
  { key: "baseReward", label: "Base Rewards", type: "reward" },
  { key: "welcomeBonus", label: "Welcome Bonus", type: "text" },
  { key: "creditScoreRequired", label: "Credit Score", type: "text" },
  { key: "features", label: "Key Benefits", type: "list" }
];

export function CardComparison({
  selectedCards = SAMPLE_CARDS.slice(0, 2),
  onCardRemove,
  onCardAdd,
  className
}: CardComparisonProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const columnGrid = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3"
  }[selectedCards.length as 1 | 2 | 3] || "grid-cols-1";

  const comparisonGrid = {
    1: "grid-cols-[200px_1fr]",
    2: "grid-cols-[200px_1fr_1fr]",
    3: "grid-cols-[200px_1fr_1fr_1fr]"
  }[selectedCards.length as 1 | 2 | 3] || "grid-cols-[200px_1fr]";

  const formatValue = (card: CreditCardData, category: any) => {
    switch (category.type) {
      case "fee":
        return card.annualFee === 0 ? "No Annual Fee" : `$${card.annualFee}`;
      case "reward":
        return `${card.baseReward}%`;
      case "text":
        return (card as any)[category.key] || "Not specified";
      case "list":
        return card.features || [];
      default:
        return (card as any)[category.key] || "—";
    }
  };

  const getBestValue = (category: any) => {
    if (category.type === "fee") return Math.min(...selectedCards.map(c => c.annualFee));
    if (category.type === "reward") return Math.max(...selectedCards.map(c => c.baseReward));
    return null;
  };

  const isHighlighted = (card: CreditCardData, category: any, best: any) => {
    if (best === null) return false;
    return category.type === "fee"
      ? card.annualFee === best
      : category.type === "reward"
      ? card.baseReward === best
      : false;
  };

  if (!selectedCards.length) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">Compare Credit Cards</CardTitle>
          <CardDescription className="mb-4">
            Select cards to see a detailed side-by-side comparison
          </CardDescription>
          <Button onClick={onCardAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add Cards to Compare
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Card Comparison</h3>
          <p className="text-sm text-muted-foreground">
            Compare {selectedCards.length} cards side by side
          </p>
        </div>
        {selectedCards.length < 3 && (
          <Button variant="outline" size="sm" onClick={onCardAdd}>
            <Plus className="w-4 h-4 mr-2" /> Add Card
          </Button>
        )}
      </div>

      {/* Card Headers */}
      <div className={`grid gap-4 ${columnGrid}`}>
        {selectedCards.map((card) => (
          <Card key={card.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{card.name}</CardTitle>
                  <CardDescription className="text-sm">{card.issuer}</CardDescription>
                </div>
                {onCardRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCardRemove(card.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant={card.annualFee === 0 ? "secondary" : "outline"} className="text-xs">
                  {card.annualFee === 0 ? "No Fee" : `$${card.annualFee}`}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {card.baseReward}% Base
                </Badge>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          {COMPARISON_CATEGORIES.map((category, index) => {
            const bestValue = getBestValue(category);

            return (
              <div key={category.key}>
                <div className={`grid gap-4 p-4 ${comparisonGrid}`}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {category.label}
                    {category.key === "features" && (
                      <Info className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>

                  {selectedCards.map((card) => {
                    const value = formatValue(card, category);
                    const highlight = isHighlighted(card, category, bestValue);

                    if (category.type === "list") {
                      const features = value as string[];
                      const isExpanded = expandedCardId === card.id;
                      return (
                        <div key={card.id} className="space-y-1">
                          {features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <Check className="h-3 w-3 text-green-600" />
                              <span>{feat}</span>
                            </div>
                          ))}
                          {features.length > 3 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs p-0 text-muted-foreground"
                              onClick={() =>
                                setExpandedCardId(isExpanded ? null : card.id)
                              }
                            >
                              {isExpanded ? "Show less" : `+${features.length - 3} more`}
                            </Button>
                          )}
                          {isExpanded && (
                            <div className="space-y-1 pt-2">
                              {features.slice(3).map((feat, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs">
                                  <Check className="h-3 w-3 text-green-600" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <div
                        key={card.id}
                        className={`text-sm ${
                          highlight ? "font-semibold text-green-600" : ""
                        }`}
                      >
                        {highlight && <Star className="h-3 w-3 inline mr-1 text-green-600" />}
                        {value}
                      </div>
                    );
                  })}
                </div>
                {index < COMPARISON_CATEGORIES.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Bottom Summary */}
      <Card className="bg-muted/50">
        <CardContent className="p-4 text-center">
          <h4 className="font-semibold mb-2">Quick Recommendation</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Based on general spending patterns, here’s our suggestion:
          </p>
          {selectedCards.length >= 2 && (
            <div className="space-y-2">
              <div className="flex justify-center gap-4 text-xs">
                <div>
                  <div className="font-medium">Best for No Fee</div>
                  <div className="text-muted-foreground">
                    {selectedCards.find(c => c.annualFee === 0)?.name || "None"}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Highest Base Rate</div>
                  <div className="text-muted-foreground">
                    {
                      selectedCards.find(
                        c => c.baseReward === Math.max(...selectedCards.map(c => c.baseReward))
                      )?.name || "None"
                    }
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">Get Personalized Recommendation</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
