import { getSentimentAnalysis } from "../recommendationEngine";
import { pipeline } from "transformer.ts";

jest.mock("transformer.ts", () => ({
  pipeline: jest.fn().mockResolvedValue(() => {
    pipeline: jest.fn();
  }),
}));

describe("getSentimentAnalysis", () => {
  it("should return the positive sentiment score for a given text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(() => {
      return Promise.resolve([{ label: "5" }]); 
    });
    const text = "I love this food";
    const sentimentScore = await getSentimentAnalysis(text);
    const expectedScore = 100; 

    expect(sentimentScore).toBe(expectedScore);
  });

  it("should return the negative sentiment score for a given text", async () => {
    (pipeline as jest.Mock).mockResolvedValue(() => {
      return Promise.resolve([{ label: "1" }]);
    });
    const text = "I hate this food";
    const sentimentScore = await getSentimentAnalysis(text);
    const expectedScore = 20;

    expect(sentimentScore).toBe(expectedScore);
  });

   it("should return the average sentiment score for a given text", async () => {
     (pipeline as jest.Mock).mockResolvedValue(() => {
       return Promise.resolve([{ label: "3" }]);
     });
     const text = "The food was average";
     const sentimentScore = await getSentimentAnalysis(text);
     const expectedScore = 60;

     expect(sentimentScore).toBe(expectedScore);
   });

  it("should handle errors and throw exceptions for invalid input", async () => {
   (pipeline as jest.Mock).mockResolvedValue(() => {
     return Promise.resolve([]); 
   });


    const text = "";

    await expect(getSentimentAnalysis(text)).rejects.toThrow(
      "Invalid sentiment analysis result"
    );
  });
});
