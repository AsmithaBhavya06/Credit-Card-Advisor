import cards from '@/data/cards.json';

export function getRecommendation(messages: any[]) {
    const lastUserInput = messages.filter(m => m.role === 'user').slice(-1)[0].content.toLowerCase();

    // Example simplistic logic (expand later)
    if (lastUserInput.includes('travel')) {
        const travelCards = cards.filter(card => card.benefits.includes('Travel'));
        return `Based on your interest in travel, I recommend: ${travelCards.map(c => c.name).join(', ')}.`;
    } else if (lastUserInput.includes('cashback')) {
        const cashbackCards = cards.filter(card => card.benefits.includes('Cashback'));
        return `For cashback, consider: ${cashbackCards.map(c => c.name).join(', ')}.`;
    }

    return "Can you tell me more about your preferences (travel, cashback, lounge access)?";
}
