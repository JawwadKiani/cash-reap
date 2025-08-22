import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function CompetitiveAdvantages() {
  const comparison = [
    {
      feature: "Privacy (No Bank Sync)",
      cashreap: true,
      maxrewards: false,
      cardpointers: true,
      importance: "high"
    },
    {
      feature: "Guest/Try Before Signup",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "high"
    },
    {
      feature: "Business-Specific Search",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "medium"
    },
    {
      feature: "Streaming Services Optimized",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "medium"
    },
    {
      feature: "95+ Major US Businesses",
      cashreap: true,
      maxrewards: true,
      cardpointers: false,
      importance: "medium"
    },
    {
      feature: "Agricultural/Harvest Theme",
      cashreap: true,
      maxrewards: false,
      cardpointers: false,
      importance: "low"
    }
  ];

  const CheckIcon = ({ has }: { has: boolean }) => (
    has ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    )
  );

  return (
  <Card className="max-w-4xl mx-auto focus:outline-none focus:ring-2 focus:ring-primary" tabIndex={0} aria-label="Competitive Advantages Table">
      <CardHeader>
        <CardTitle>Competitive Advantages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-2 text-left">Feature</th>
                <th className="py-2 px-2 text-center">CashReap</th>
                <th className="py-2 px-2 text-center">MaxRewards</th>
                <th className="py-2 px-2 text-center">CardPointers</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-3 px-2">
                    <span className="font-medium">{item.feature}</span>
                    {item.importance === "high" && (
                      <Badge className="ml-2" variant="default">High</Badge>
                    )}
                    {item.importance === "medium" && (
                      <Badge className="ml-2" variant="secondary">Medium</Badge>
                    )}
                    {item.importance === "low" && (
                      <Badge className="ml-2" variant="outline">Low</Badge>
                    )}
                  </td>
                  <td className="text-center py-3 px-2">
                    <CheckIcon has={item.cashreap} />
                  </td>
                  <td className="text-center py-3 px-2">
                    <CheckIcon has={item.maxrewards} />
                  </td>
                  <td className="text-center py-3 px-2">
                    <CheckIcon has={item.cardpointers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>CashReap's Key Advantage:</strong> We respect your privacy and let you try our recommendations instantly without requiring bank access or immediate signup.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}