// lib/promptBuilder.ts
export function buildPrompt(preferences: Record<string, string>, cards: any[]) {
  const { spendingType, income, benefit, bank } = preferences;

  return `
Based on the following user preferences:
- Spending Type: ${spendingType}
- Income Range: ${income}
- Preferred Benefit: ${benefit}
- Bank Preference: ${bank}

Which 3 credit cards from the list below would you recommend? Provide reasons for each.

Available cards:
${cards.map(card => `Name: ${card.name}, Benefits: ${card.benefits}, Bank: ${card.bank}, Income Eligibility: ${card.eligibility}`).join('\n')}
`;
}
