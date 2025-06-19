import cards from '../data/cards.json';

// Card and Answers types
interface Card {
  name: string;
  issuer: string;
  fee: string;
  benefits: string[];
  rewardRate: string;
  eligibility: string;
  perks: string;
  image: string;
  link: string;
  estimatedReward?: number;
}

interface Answers {
  prompt?: string;
  creditScore?: string;
  spendingType?: string;
  benefit?: string;
  monthlySpend?: string;
}

// Helper: Estimate yearly reward (very basic simulation)
function estimateReward(card: Card, answers: Answers): number {
  const spend = parseInt(answers.monthlySpend || '10000', 10); // default Rs. 10,000/month
  let reward = 0;
  if (card.rewardRate.includes('%')) {
    const match = card.rewardRate.match(/(\d+(?:\.\d+)?)%/);
    if (match) reward = spend * 12 * (parseFloat(match[1]) / 100);
  } else if (card.rewardRate.match(/points per Rs\.(\d+)/)) {
    const match = card.rewardRate.match(/(\d+) points per Rs\.(\d+)/);
    if (match) reward = spend * 12 / parseInt(match[2]) * parseInt(match[1]);
  } else if (card.rewardRate.match(/on Amazon/)) {
    reward = spend * 12 * 0.05;
  }
  return Math.round(reward);
}

export function getRecommendation(answers: Answers) {
  let filtered: Card[] = cards as Card[];
  if (answers.creditScore) {
    const score = parseInt(answers.creditScore, 10);
    filtered = filtered.filter(card => {
      if (score < 700) return !card.eligibility || !card.eligibility.includes('8L') && !card.eligibility.includes('18L');
      return true;
    });
  }
  if (answers.spendingType) {
    filtered = filtered.filter(card => card.benefits && card.benefits.includes(answers.spendingType!));
  }
  if (answers.benefit) {
    filtered = filtered.filter(card => card.benefits && card.benefits.includes(answers.benefit!));
  }

  filtered = filtered.map(card => ({
    ...card,
    estimatedReward: estimateReward(card, answers)
  })).sort((a, b) => (b.estimatedReward || 0) - (a.estimatedReward || 0));

  return filtered.slice(0, 5).map(card => ({
    name: card.name,
    issuer: card.issuer,
    fee: card.fee,
    benefits: card.benefits,
    rewardRate: card.rewardRate,
    eligibility: card.eligibility,
    perks: card.perks,
    image: card.image,
    link: card.link,
    estimatedReward: card.estimatedReward,
    rewardSimulation: `You could earn Rs. ${(card.estimatedReward || 0).toLocaleString()}/year cashback/rewards`
  }));
}
