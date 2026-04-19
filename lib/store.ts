import { create } from 'zustand'

export function calculateCO2(tokenCount: number): number {
  return tokenCount * 0.002
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

interface CO2State {
  currentPrompt: string
  currentCO2: number
  totalCO2Saved: number
  co2History: { date: string; saved: number }[]
  gardenStats: { treeId: number; co2Saved: number; plantedDate: string }[]
  leaderboard: { rank: number; name: string; score: number; co2Saved: number }[]
  dailyChallenge: {
    title: string
    description: string
    targetScore: number
    currentCode: string
    efficiencyScore: number
  }
  setCurrentPrompt: (prompt: string) => void
  addCO2Saved: (amount: number) => void
  updateDailyChallengeCode: (code: string) => void
}

const mockGardenStats = [
  { treeId: 1, co2Saved: 15.2, plantedDate: '2024-01-15' },
  { treeId: 2, co2Saved: 8.7, plantedDate: '2024-01-20' },
  { treeId: 3, co2Saved: 22.4, plantedDate: '2024-02-01' },
  { treeId: 4, co2Saved: 12.1, plantedDate: '2024-02-10' },
  { treeId: 5, co2Saved: 18.9, plantedDate: '2024-02-15' },
  { treeId: 6, co2Saved: 5.3, plantedDate: '2024-02-20' },
]

const mockLeaderboard = [
  { rank: 1, name: 'EcoMaster', score: 98, co2Saved: 456.2 },
  { rank: 2, name: 'GreenDev', score: 95, co2Saved: 423.1 },
  { rank: 3, name: 'SustainCoder', score: 92, co2Saved: 398.7 },
  { rank: 4, name: 'You', score: 87, co2Saved: 312.4 },
  { rank: 5, name: 'EarthFirst', score: 85, co2Saved: 287.9 },
  { rank: 6, name: 'CleanCode', score: 82, co2Saved: 265.3 },
]

const mockCO2History = [
  { date: 'Mon', saved: 12.4 },
  { date: 'Tue', saved: 18.2 },
  { date: 'Wed', saved: 8.7 },
  { date: 'Thu', saved: 24.1 },
  { date: 'Fri', saved: 15.9 },
  { date: 'Sat', saved: 21.3 },
  { date: 'Sun', saved: 19.8 },
]

export const useCO2Store = create<CO2State>((set, get) => ({
  currentPrompt: '',
  currentCO2: 0,
  totalCO2Saved: 312.4,
  co2History: mockCO2History,
  gardenStats: mockGardenStats,
  leaderboard: mockLeaderboard,
  dailyChallenge: {
    title: 'Optimize API Calls',
    description: 'Reduce the number of API calls by implementing efficient caching',
    targetScore: 90,
    currentCode: `// Optimize this function
async function fetchData(ids) {
  const results = [];
  for (const id of ids) {
    const res = await fetch(\`/api/item/\${id}\`);
    results.push(await res.json());
  }
  return results;
}`,
    efficiencyScore: 45,
  },
  setCurrentPrompt: async (prompt: string) => {
    set({ currentPrompt: prompt })
    try {
      const response = await fetch('http://localhost:5000/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_prompt: prompt })
      })
      const data = await response.json()
      set({ currentCO2: data.co2_estimate })
    } catch (error) {
      const tokens = estimateTokens(prompt)
      const co2 = calculateCO2(tokens)
      set({ currentCO2: co2 })
    }
  },
  addCO2Saved: (amount: number) => {
    const current = get().totalCO2Saved
    set({ totalCO2Saved: current + amount })
  },
  updateDailyChallengeCode: (code: string) => {
    let score = 45

    if (code.includes('Promise.all')) score += 25
    if (code.includes('cache') || code.includes('Cache')) score += 15
    if (code.includes('batch') || code.includes('Batch')) score += 10
    if (!code.includes('for (') && !code.includes('forEach')) score += 5

    score = Math.min(100, score)

    set((state) => ({
      dailyChallenge: {
        ...state.dailyChallenge,
        currentCode: code,
        efficiencyScore: score,
      },
    }))
  },
}))