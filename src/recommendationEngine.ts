import { pipeline } from "transformer.ts";

export async function getSentimentAnalysis(text: string): Promise<number> {
  try {
    const classifier = await pipeline(
      "sentiment-analysis",
      "Xenova/bert-base-multilingual-uncased-sentiment"
    );
    const result: any = await classifier(text);

    if (!result || !result[0] || !result[0].label) {
      throw new Error("Invalid sentiment analysis result");
    }
    const sentimentLabel = result[0].label;
    const star = parseInt(sentimentLabel[0]); 
    console.log("Sentiment label:", sentimentLabel);
    console.log("Star:", star);
    if (isNaN(star) || star < 1 || star > 5) {
      throw new Error("Invalid sentiment label or score");
    }

     const sentimentScorePercent = star * 20;
    console.log("Sentiment score:", sentimentScorePercent);

    return sentimentScorePercent;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    throw error;
  }
}
