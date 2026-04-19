'use client'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { EarthTree } from '@/components/three/earth-tree'
import { useCO2Store } from '@/lib/store'

export function PromptLab() {
  const { currentPrompt, currentCO2, setCurrentPrompt, totalCO2Saved } = useCO2Store()
  const [displayCO2, setDisplayCO2] = useState(0)

  // Animate the CO2 value
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDisplayCO2(currentCO2)
    }, 100)
    return () => clearTimeout(timeout)
  }, [currentCO2])

  const gaugeData = [
    {
      name: 'CO2',
      value: Math.min(displayCO2, 10),
      fill: displayCO2 > 5 ? '#FF4466' : '#00FF88',
    },
  ]

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-8 p-8">
      {/* Left: 3D Canvas */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/2 h-[400px] lg:h-[500px]"
      >
        <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00FF88" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4488FF" />
            <EarthTree />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Right: Prompt Input & Gauge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full lg:w-1/2 flex flex-col gap-6"
      >
        {/* Hero Text */}
        <div className="text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-4xl lg:text-5xl font-sans font-bold text-foreground mb-2"
          >
            <span className="text-neon-green neon-text">Prompt</span> Lab
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-muted-foreground font-mono text-sm"
          >
            Craft eco-conscious AI prompts and track your carbon impact
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-mono text-muted-foreground">Total CO2 Saved</p>
            <p className="text-2xl font-bold text-neon-green neon-text">
              {totalCO2Saved.toFixed(1)}g
            </p>
          </div>
          <div className="h-12 w-px bg-glass-border" />
          <div>
            <p className="text-xs font-mono text-muted-foreground">Current Prompt</p>
            <p className="text-2xl font-bold text-foreground">
              {(currentCO2 ?? 0).toFixed(3)}g
            </p>
          </div>
        </motion.div>

        {/* Prompt Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="relative"
        >
          <textarea
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="Enter your AI prompt here..."
            className="w-full h-40 p-4 bg-glass-bg backdrop-blur-xl border border-glass-border rounded-xl 
                       text-foreground font-mono text-sm resize-none
                       focus:outline-none focus:border-neon-green focus:ring-2 focus:ring-neon-green/30
                       transition-all duration-300 placeholder:text-muted-foreground"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span>{currentPrompt.length} chars</span>
            <span className="text-neon-green">•</span>
            <span>~{Math.ceil(currentPrompt.length / 4)} tokens</span>
          </div>
        </motion.div>

        {/* CO2 Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="glass-card p-6 flex flex-col items-center"
        >
          <p className="text-xs font-mono text-muted-foreground mb-2">
            Real-time CO2 Emission Gauge
          </p>
          <div className="relative">
            <RadialBarChart
              width={200}
              height={150}
              cx={100}
              cy={100}
              innerRadius={60}
              outerRadius={90}
              barSize={12}
              data={gaugeData}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 10]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={6}
                animationDuration={300}
              />
            </RadialBarChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <span
                className={`text-2xl font-bold font-mono ${
                  displayCO2 > 5 ? 'text-neon-red' : 'text-neon-green'
                }`}
              >
                {displayCO2.toFixed(3)}g
              </span>
              <span className="text-xs text-muted-foreground">CO2</span>
            </div>
          </div>
          <p className="text-xs font-mono text-center mt-2 text-muted-foreground">
            {displayCO2 < 1 ? 'Minimal impact' : displayCO2 < 5 ? 'Moderate usage' : 'Consider optimizing'}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
