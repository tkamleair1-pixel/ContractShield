# 🛡️ ContractShield

**Understand before you sign.** AI-powered contract analysis that highlights red flags, negotiation points, and gives you a trust score.

## 🚀 Features

- ✅ **Instant Analysis**: Paste any contract and get results in seconds
- 🎯 **Trust Score**: 0-100 rating with detailed breakdown
- 🔴🟡🟢 **Color-Coded Clauses**: Red flags, negotiation points, and standard terms
- 💬 **Plain English**: Legal jargon translated to simple language
- 📋 **Negotiation Scripts**: Exact words to use when discussing concerns
- 📊 **Score Breakdown**: 5 metrics (fairness, clarity, completeness, legal compliance, balance)
- 📄 **PDF Support**: Upload contracts directly
- 🎨 **Beautiful UI**: Animated, responsive, modern design

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: Google Gemini 1.5 Flash API
- **PDF**: pdf-parse
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/contractshield.git
cd contractshield

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your GEMINI_API_KEY to .env.local

# Run development server
npm run dev
```
