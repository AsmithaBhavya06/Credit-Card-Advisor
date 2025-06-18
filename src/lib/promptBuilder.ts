export function buildPrompt(messages, cards) {
    const lastUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

    const cardData = cards.map(card => `
  Name: ${card.name}
  Issuer: ${card.issuer}
  Fee: Rs.${card.fee}
  Benefits: ${card.benefits.join(', ')}
  Reward: ${card.rewardRate}
  Eligibility: ${card.eligibility}
  Perks: ${card.perks}
  Link: ${card.link}
  `).join('\n');

    return `
User said: "${lastUserMsg}"
Here are the available credit cards:

${cardData}

Based on the user's input, suggest the best 3 credit cards. Explain why these are suitable.
`;
}
