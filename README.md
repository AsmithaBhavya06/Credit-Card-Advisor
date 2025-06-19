# Credit Card Advisor

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

**Credit Card Advisor** is an AI-powered web application that provides personalized credit card recommendations for Indian users based on their spending habits and preferences.

## Features

- Interactive chat interface for collecting user preferences
- AI-driven recommendations using Anthropic Claude API
- Card comparison and summary view
- Responsive, modern UI

## Working Demo

[![Watch the demo](https://drive.google.com/file/d/1yoEsgij0y56pXBNhH6L4GMnkieS2ar1M/view?usp=sharing)
> Click the image above or [watch the demo video here](https://drive.google.com/file/d/1yoEsgij0y56pXBNhH6L4GMnkieS2ar1M/view?usp=sharing).

# Credit Card Advisor

...

## Agent Flow

The agent (AI assistant) guides the user through a series of questions to collect their preferences and then provides personalized credit card recommendations. The flow is as follows:

1. **User Interaction**:  
   The user is presented with a sequence of questions (see [`questions`](src/components/ChatBox.tsx)) about their spending habits, income, preferred benefits, bank preference, credit score, and existing cards.
2. **Answer Collection**:  
   Each answer is stored in the `answers` state.
3. **Recommendation Trigger**:  
   After all questions are answered, the collected preferences are sent to the backend API ([`/api/recommend`](src/app/api/recommend/route.ts)).
4. **AI Processing**:  
   The backend uses the [`buildPrompt`](src/lib/promptBuilder.ts) function to generate a prompt for the Anthropic Claude API, which returns a natural language recommendation.
5. **Result Display**:  
   The frontend parses and displays the recommended cards, allowing users to compare and view details.

## Prompt Design

The prompt sent to the AI model is carefully constructed to maximize relevant and actionable recommendations. The prompt template (see [`buildPrompt`](src/lib/promptBuilder.ts)) includes:

- A summary of the user's preferences:
  - Spending Type
  - Income Range
  - Preferred Benefit
  - Bank Preference
- A list of available cards with their benefits and eligibility.
- A direct instruction to recommend 3 cards and provide reasons for each.

**Example Prompt:**
```
Based on the following user preferences:
- Spending Type: Travel
- Income Range: 6L-12L
- Preferred Benefit: Lounge Access
- Bank Preference: HDFC

Which 3 credit cards from the list below would you recommend? Provide reasons for each.

Available cards:
Name: HDFC Regalia, Benefits: Lounge Access, Dining Discounts, Bank: HDFC, Income Eligibility: 6L+
Name: SBI Cashback, Benefits: Cashback on online shopping, Bank: SBI, Income Eligibility: 3L+
...
```

This approach ensures the AI has all necessary context to make informed, user-specific recommendations.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.