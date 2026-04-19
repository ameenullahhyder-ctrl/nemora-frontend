'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import { GardenScene } from '@/components/three/garden-scene'
import { useCO2Store } from '@/lib/store'

export function MyGarden() {
  const { gardenStats, co2History, totalCO2Saved } = useCO2Store()

  const totalTreesCO2 = gardenStats.reduce((sum, tree) => sum + tree.co2Saved, 0)

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
          My <span className="text-neon-green neon-text">Garden</span>
        </h1>
        <p className="text-muted-foreground font-mono text-sm">
          Watch your sustainable coding efforts grow into a forest
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3D Garden */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-4 h-[400px] lg:h-[500px]"
        >
          <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#00FF88" />
              <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4488FF" />
              <GardenScene />
              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={3}
                maxDistance={10}
                autoRotate
                autoRotateSpeed={0.3}
              />
              <Environment preset="forest" />
            </Suspense>
          </Canvas>
        </motion.div>

        {/* Stats & Timeline */}
        <div className="flex flex-col gap-6">
          {/* Overall Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-sans font-bold text-foreground mb-4">Garden Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-neon-green neon-text">
                  {gardenStats.length}
                </p>
                <p className="text-xs font-mono text-muted-foreground">Trees Planted</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-neon-green neon-text">
                  {totalTreesCO2.toFixed(1)}g
                </p>
                <p className="text-xs font-mono text-muted-foreground">CO2 Captured</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-neon-green neon-text">
                  {totalCO2Saved.toFixed(0)}g
                </p>
                <p className="text-xs font-mono text-muted-foreground">Total Saved</p>
              </div>
            </div>
          </motion.div>

          {/* Tree List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6 flex-1 overflow-hidden"
          >
            <h3 className="font-sans font-bold text-foreground mb-4">Your Trees</h3>
            <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
              {gardenStats.map((tree, index) => (
                <motion.div
                  key={tree.treeId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-black/20 rounded-lg"
                >
                  <div
                    className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center"
                    style={{
                      boxShadow: `0 0 ${tree.co2Saved}px rgba(0, 255, 136, 0.5)`,
                    }}
                  >
                    <span className="text-neon-green text-sm">🌲</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-mono text-sm text-foreground">Tree #{tree.treeId}</p>
                    <p className="text-xs text-muted-foreground">
                      Planted {tree.plantedDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-neon-green font-bold">
                      {tree.co2Saved.toFixed(1)}g
                    </p>
                    <p className="text-xs text-muted-foreground">CO2 saved</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="font-sans font-bold text-foreground mb-4">Weekly Progress</h3>
            <div className="flex items-end justify-between gap-2 h-24">
              {co2History.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className="flex-1 flex flex-col items-center gap-1"
                  style={{ transformOrigin: 'bottom' }}
                >
                  <div
                    className="w-full bg-gradient-to-t from-neon-green/50 to-neon-green rounded-t"
                    style={{
                      height: `${(day.saved / 30) * 100}%`,
                      minHeight: '8px',
                      boxShadow: '0 0 10px rgba(0, 255, 136, 0.3)',
                    }}
                  />
                  <span className="text-xs font-mono text-muted-foreground">
                    {day.date}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
