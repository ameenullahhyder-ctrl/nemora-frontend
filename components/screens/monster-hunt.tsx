'use client'

import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import { PollutionShard } from '@/components/three/pollution-shard'
import { CrystalOrb } from '@/components/three/crystal-orb'
import { useCO2Store } from '@/lib/store'

export function MonsterHunt() {
  const { addCO2Saved } = useCO2Store()
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    original: { text: string; co2: number }
    optimized: { text: string; co2: number }
    savings: number
    coins_reward: number
  } | null>(null)

  const handleOptimize = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/v1/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_prompt: prompt })
      })
      const data = await response.json()
      setResult(data)
      addCO2Saved(data.savings)
    } catch (error) {
      console.error('Optimization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-sans font-bold text-foreground mb-2">
          <span className="text-neon-red">Monster</span>{' '}
          <span className="text-neon-green neon-text">Hunt</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Optimize your prompt and slash its carbon footprint
        </p>
      </motion.div>

      {/* Prompt Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-6xl mb-8"
      >
        <div className="glass-card p-6">
          <p className="text-xs font-mono text-muted-foreground mb-2">Enter your prompt to optimize:</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a long prompt here and watch it get optimized..."
            className="w-full h-32 p-4 bg-black/30 border border-glass-border rounded-xl
                       text-foreground font-mono text-sm resize-none
                       focus:outline-none focus:border-neon-green focus:ring-2 focus:ring-neon-green/30
                       transition-all duration-300 placeholder:text-muted-foreground"
          />
          <button
            onClick={handleOptimize}
            disabled={isLoading || !prompt.trim()}
            className="mt-4 w-full py-3 px-6 bg-neon-green/20 border border-neon-green text-neon-green 
                       font-mono font-bold rounded-xl hover:bg-neon-green/30 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            {isLoading ? 'Optimizing...' : '⚡ Hunt the Monster'}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl"
        >
          {/* Stats Bar */}
          <div className="glass-card p-4 mb-6 flex items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-xs font-mono text-muted-foreground">CO2 Saved</p>
              <p className="text-2xl font-bold text-neon-green neon-text">{result.savings.toFixed(3)}g</p>
            </div>
            <div className="h-10 w-px bg-glass-border" />
            <div className="text-center">
              <p className="text-xs font-mono text-muted-foreground">Coins Earned</p>
              <p className="text-2xl font-bold text-neon-green neon-text">🪙 {result.coins_reward}</p>
            </div>
            <div className="h-10 w-px bg-glass-border" />
            <div className="text-center">
              <p className="text-xs font-mono text-muted-foreground">Reduction</p>
              <p className="text-2xl font-bold text-neon-green neon-text">
                {result.original.co2 > 0 
                  ? Math.round((result.savings / result.original.co2) * 100) 
                  : 0}%
              </p>
            </div>
          </div>

          {/* Split View */}
          <div className="grid grid-cols-2 gap-4 lg:gap-8">
            {/* Left: Original */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card-red p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-neon-red animate-pulse" />
                <h2 className="font-sans font-bold text-neon-red">Original Prompt</h2>
              </div>
              <div className="h-[200px] mb-4">
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[5, 5, 5]} intensity={1} color="#FF4466" />
                    <PollutionShard />
                    <OrbitControls enableZoom={false} enablePan={false} />
                    <Environment preset="night" />
                  </Suspense>
                </Canvas>
              </div>
              <div className="space-y-3">
                <pre className="bg-black/30 p-3 rounded-lg text-xs font-mono text-neon-red overflow-x-auto whitespace-pre-wrap">
                  {result.original.text}
                </pre>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">CO2:</span>
                  <span className="text-neon-red font-bold">{result.original.co2.toFixed(3)}g</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Optimized */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-card-green p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
                <h2 className="font-sans font-bold text-neon-green">Optimized Prompt</h2>
              </div>
              <div className="h-[200px] mb-4">
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[5, 5, 5]} intensity={1} color="#00FF88" />
                    <CrystalOrb />
                    <OrbitControls enableZoom={false} enablePan={false} />
                    <Environment preset="night" />
                  </Suspense>
                </Canvas>
              </div>
              <div className="space-y-3">
                <pre className="bg-black/30 p-3 rounded-lg text-xs font-mono text-neon-green overflow-x-auto whitespace-pre-wrap">
                  {result.optimized.text}
                </pre>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">CO2:</span>
                  <span className="text-neon-green font-bold">{result.optimized.co2.toFixed(3)}g</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}