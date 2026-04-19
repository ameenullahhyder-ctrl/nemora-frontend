'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import { ArenaScene } from '@/components/three/arena-scene'
import { useCO2Store } from '@/lib/store'

export function Arena() {
  const { leaderboard, dailyChallenge, updateDailyChallengeCode } = useCO2Store()
  const [code, setCode] = useState(dailyChallenge.currentCode)

  useEffect(() => {
    updateDailyChallengeCode(code)
  }, [code, updateDailyChallengeCode])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-neon-green'
    if (score >= 70) return 'text-yellow-400'
    return 'text-neon-red'
  }

  const getScoreGlow = (score: number) => {
    if (score >= 90) return 'shadow-[0_0_20px_rgba(0,255,136,0.5)]'
    if (score >= 70) return 'shadow-[0_0_20px_rgba(255,200,0,0.5)]'
    return 'shadow-[0_0_20px_rgba(255,68,102,0.5)]'
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl lg:text-5xl font-sans font-bold text-foreground mb-2">
          The <span className="text-neon-green neon-text">Arena</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Compete, optimize, and climb the eco-leaderboard
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Trophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-4 h-[300px] lg:col-span-1"
        >
          <Canvas camera={{ position: [0, 1, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[5, 5, 5]} intensity={1} color="#00FF88" />
              <pointLight position={[-5, 3, -5]} intensity={0.5} color="#FFaa44" />
              <ArenaScene />
              <OrbitControls enableZoom={false} enablePan={false} />
              <Environment preset="night" />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h3 className="font-sans font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-neon-green">⚡</span> Global Leaderboard
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-mono text-muted-foreground border-b border-glass-border">
                  <th className="pb-3 pr-4">Rank</th>
                  <th className="pb-3 pr-4">Player</th>
                  <th className="pb-3 pr-4 text-right">Score</th>
                  <th className="pb-3 text-right">CO2 Saved</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((player, index) => (
                  <motion.tr
                    key={player.rank}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className={`border-b border-glass-border/50 ${
                      player.name === 'You' ? 'bg-neon-green/10' : ''
                    }`}
                  >
                    <td className="py-3 pr-4">
                      <span
                        className={`font-mono font-bold ${
                          player.rank <= 3 ? 'text-neon-green' : 'text-muted-foreground'
                        }`}
                      >
                        #{player.rank}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`font-sans ${
                          player.name === 'You' ? 'text-neon-green font-bold' : 'text-foreground'
                        }`}
                      >
                        {player.name}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <span className={`font-mono font-bold ${getScoreColor(player.score)}`}>
                        {player.score}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-mono text-neon-green">{player.co2Saved.toFixed(1)}g</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Daily Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-6 lg:col-span-3"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Challenge Info */}
            <div className="lg:w-1/3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                <h3 className="font-sans font-bold text-foreground">Daily Challenge</h3>
              </div>
              <h4 className="text-xl font-bold text-neon-green mb-2">{dailyChallenge.title}</h4>
              <p className="text-sm text-muted-foreground mb-4">{dailyChallenge.description}</p>

              {/* Score Display */}
              <div className="glass-card p-4">
                <p className="text-xs font-mono text-muted-foreground mb-2">Efficiency Score</p>
                <div className="flex items-center gap-4">
                  <div
                    className={`text-4xl font-bold font-mono ${getScoreColor(
                      dailyChallenge.efficiencyScore
                    )} ${getScoreGlow(dailyChallenge.efficiencyScore)} rounded-lg p-2`}
                  >
                    {dailyChallenge.efficiencyScore}
                  </div>
                  <div className="flex-1">
                    <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dailyChallenge.efficiencyScore}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full ${
                          dailyChallenge.efficiencyScore >= 90
                            ? 'bg-neon-green'
                            : dailyChallenge.efficiencyScore >= 70
                            ? 'bg-yellow-400'
                            : 'bg-neon-red'
                        }`}
                      />
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      Target: {dailyChallenge.targetScore}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hints */}
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <p className="text-xs font-mono text-neon-green mb-1">💡 Optimization Hints:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use Promise.all for parallel requests</li>
                  <li>• Implement caching strategies</li>
                  <li>• Batch operations when possible</li>
                </ul>
              </div>
            </div>

            {/* Code Editor */}
            <div className="lg:w-2/3">
              <p className="text-xs font-mono text-muted-foreground mb-2">
                Optimize this code to improve your score:
              </p>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 bg-black/40 backdrop-blur-sm border border-glass-border rounded-xl 
                           text-neon-green font-mono text-sm resize-none
                           focus:outline-none focus:border-neon-green focus:ring-2 focus:ring-neon-green/30
                           transition-all duration-300"
                spellCheck={false}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs font-mono text-muted-foreground">
                  {code.split('\n').length} lines
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCode(dailyChallenge.currentCode)}
                  className="px-4 py-2 bg-glass-bg border border-glass-border rounded-lg
                             text-xs font-mono text-foreground hover:border-neon-green
                             transition-colors duration-300"
                >
                  Reset Code
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
