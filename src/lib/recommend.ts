export function getRecommendation(answers: { [key: string]: string }) {
  // Handle manual prompt
  if (answers.prompt) {
    const prompt = answers.prompt.toLowerCase();

    // Check for specific card names
    if (prompt.includes("idfc")) {
      return "We recommend: IDFC FIRST Millennia Credit Card – great for rewards on dining, travel, and online shopping with no annual fee!";
    }
    if (prompt.includes("regalia")) {
      return "We recommend: HDFC Regalia Credit Card – ideal for travel and lounge access.";
    }
    if (prompt.includes("elite")) {
      return "We recommend: SBI Elite Credit Card – premium benefits including lounge access and travel perks.";
    }
    if (prompt.includes("amazon") || prompt.includes("icici")) {
      return "We recommend: Amazon Pay ICICI Credit Card – best for cashback on Amazon purchases.";
    }
    if (prompt.includes("flipkart") || prompt.includes("axis")) {
      return "We recommend: Flipkart Axis Bank Credit Card – perfect for shopping on Flipkart and partner stores.";
    }
    if (prompt.includes("fuel")) {
      return "We recommend: IndianOil Citi Credit Card – excellent savings on fuel purchases.";
    }

    // Fallback
    return "Sorry, no matching card found for your prompt.";
  }

  // Structured answers logic
  if (
    answers.spendingType === "Travel" &&
    answers.benefit === "Lounge Access"
  ) {
    return "We recommend: HDFC Regalia or SBI Elite for travel and lounge access!";
  }
  if (
    answers.spendingType === "Online Shopping" &&
    answers.benefit === "Cashback"
  ) {
    return "We recommend: Amazon Pay ICICI or Flipkart Axis for online shopping cashback!";
  }
  if (answers.spendingType === "Fuel") {
    return "We recommend: IndianOil Citi Credit Card for fuel savings!";
  }

}
