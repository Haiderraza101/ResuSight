export const analyzeText = async (text: string) => {
  const lower = text.toLowerCase();
  let sentiment = "neutral";

  if (lower.includes("good") || lower.includes("happy")) sentiment = "positive";
  else if (lower.includes("bad") || lower.includes("sad")) sentiment = "negative";

  return { sentiment, text };
};
