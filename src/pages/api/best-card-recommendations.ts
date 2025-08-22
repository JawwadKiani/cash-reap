import { NextApiRequest, NextApiResponse } from "next";
import { getBestCardRecommendation } from "@/server/cardRecommendations";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { categoryId } = req.query;
  if (!categoryId || typeof categoryId !== "string") {
    return res.status(400).json({ error: "Missing or invalid categoryId" });
  }
  try {
    const recommendations = await getBestCardRecommendation(categoryId);
    res.status(200).json(recommendations || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
