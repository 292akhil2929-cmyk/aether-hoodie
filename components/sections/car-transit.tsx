'use client'

/* eslint-disable react/no-unknown-property */
import { Suspense, useMemo, useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useMotionValueEvent,
  type MotionValue,
} from 'motion/react'
import { Canvas, useFrame, invalidate } from '@react-three/fiber'
import { useGLTF, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/**
 * CAR TRANSIT — the bridge between the F1 world and the Anime world.
 * A Ferrari drives across the screen, driven entirely by scroll:
 * scroll forward and it accelerates toward a neon portal; the paddock
 * dissolves into the anime dimension around it.
 */
export function CarTransit({ onEnter }: { onEnter?: (accent: string) => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: rawProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // mirror to force the JS path — see note in sections/shared.tsx
  const scrollYProgress = useMotionValue(rawProgress.get())

  useMotionValueEvent(rawProgress, 'change', (v) => {
    scrollYProgress.set(v)
    if (ref.current) ref.current.dataset.p = v.toFixed(3)
    if (v > 0.02 && v < 0.98) onEnter?.(v < 0.5 ? '#ff2d2d' : '#22d3ee')
  })

  // world morph — paddock fades, neon rises
  const f1Opacity = useTransform(scrollYProgress, [0.25, 0.6], [1, 0])
  const animeOpacity = useTransform(scrollYProgress, [0.35, 0.7], [0, 1])

  // portal grows on the right, then swallows the screen
  const portalScale = useTransform(scrollYProgress, [0.45, 0.88], [0.25, 1.6])
  const portalOpacity = useTransform(scrollYProgress, [0.45, 0.6, 0.75, 0.92], [0, 1, 1, 1])
  const flashOpacity = useTransform(scrollYProgress, [0.86, 0.9, 0.94, 1], [0, 0.65, 1, 0])

  // captions
  const cap1 = useTransform(scrollYProgress, [0.06, 0.14, 0.4, 0.48], [0, 1, 1, 0])
  const cap2 = useTransform(scrollYProgress, [0.52, 0.6, 0.82, 0.88], [0, 1, 1, 0])

  // ground shadow follows the car
  const shadowX = useTransform(scrollYProgress, [0.04, 0.86], ['-30%', '105%'])
  const shadowOpacity = useTransform(scrollYProgress, [0.02, 0.1, 0.82, 0.9], [0, 0.55, 0.55, 0])

  // speed streaks intensify mid-run
  const streakOpacity = useTransform(scrollYProgress, [0.15, 0.3, 0.75, 0.85], [0, 0.7, 0.7, 0])
  const streakX = useTransform(scrollYProgress, [0.1, 0.9], ['40%', '-70%'])

  return (
    <section
      ref={ref}
      id="transit"
      aria-label="Formula 1 to Anime transition"
      className="relative"
      style={{ height: '250vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* ------ backdrop: paddock → neon dimension ------ */}
        <motion.div style={{ opacity: f1Opacity }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 60% at 50% 100%, rgba(255,45,45,0.16), transparent 65%), linear-gradient(180deg, #050505 0%, #0b0708 100%)',
            }}
          />
          {/* receding tarmac grid */}
          <div
            className="absolute inset-x-0 bottom-0 h-[42vh] opacity-40"
            style={{
              background:
                'repeating-linear-gradient(90deg, rgba(255,80,80,0.14) 0 2px, transparent 2px 110px), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 42px)',
              transform: 'perspective(460px) rotateX(64deg)',
              transformOrigin: 'bottom',
            }}
          />
        </motion.div>

        <motion.div style={{ opacity: animeOpacity }} className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 55% at 78% 45%, rgba(34,211,238,0.22), transparent 60%), radial-gradient(60% 50% at 20% 80%, rgba(232,62,140,0.14), transparent 65%), linear-gradient(180deg, #04060c 0%, #070312 100%)',
            }}
          />
          {/* neon horizon strips */}
          <div
            className="absolute inset-x-0 bottom-0 h-[42vh] opacity-50"
            style={{
              background:
                'repeating-linear-gradient(90deg, rgba(34,211,238,0.18) 0 2px, transparent 2px 90px), repeating-linear-gradient(0deg, rgba(232,62,140,0.1) 0 1px, transparent 1px 36px)',
              transform: 'perspective(460px) rotateX(64deg)',
              transformOrigin: 'bottom',
            }}
          />
        </motion.div>

        {/* ------ speed streaks ------ */}
        <motion.div
          style={{ opacity: streakOpacity }}
          className="pointer-events-none absolute inset-0 z-[4] overflow-hidden"
          aria-hidden="true"
        >
          {[16, 30, 44, 62, 76].map((top, i) => (
            <motion.span
              key={top}
              style={{
                top: `${top}%`,
                x: streakX,
                width: `${30 + (i % 3) * 18}%`,
                background: `linear-gradient(90deg, transparent, ${
                  i % 2 ? 'rgba(34,211,238,0.8)' : 'rgba(255,255,255,0.7)'
                }, transparent)`,
              }}
              className="absolute left-full h-px"
            />
          ))}
        </motion.div>

        {/* ------ neon portal ------ */}
        <motion.div
          style={{ scale: portalScale, opacity: portalOpacity }}
          className="pointer-events-none absolute right-[6%] top-1/2 z-[5] h-[64vh] w-[64vh] -translate-y-1/2"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(34,211,238,0.9)',
              boxShadow:
                '0 0 60px rgba(34,211,238,0.55), inset 0 0 80px rgba(34,211,238,0.3), 0 0 140px rgba(232,62,140,0.25)',
            }}
          />
          <div
            className="absolute inset-6 rounded-full opacity-70"
            style={{
              background:
                'conic-gradient(from 90deg, transparent, rgba(34,211,238,0.25), transparent, rgba(232,62,140,0.2), transparent)',
              filter: 'blur(6px)',
            }}
          />
          <span
            className="display absolute inset-0 flex items-center justify-center text-6xl text-white/80"
            style={{ textShadow: '0 0 30px rgba(34,211,238,0.9)' }}
          >
            アニメ
          </span>
        </motion.div>

        {/* ------ the car (3D, scroll-driven) ------ */}
        <div className="absolute inset-0 z-[6]">
          <Canvas
            frameloop="demand"
            dpr={[1, 1.25]}
            gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
            camera={{ fov: 38, position: [0, 1.1, 9.5], near: 0.1, far: 60 }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.outputColorSpace = THREE.SRGBColorSpace
            }}
          >
            {/* procedural studio reflections — no network fetch */}
            <Environment resolution={256} frames={1}>
              <Lightformer intensity={4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[14, 6, 1]} />
              <Lightformer intensity={2} color="#ff5a5a" position={[-8, 2, -4]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} />
              <Lightformer intensity={2.4} color="#22d3ee" position={[8, 2, -4]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} />
            </Environment>
            <ambientLight intensity={0.25} />
            <directionalLight position={[4, 8, 6]} intensity={1.4} />
            <Suspense fallback={null}>
              <ScrollCar progress={scrollYProgress} />
            </Suspense>
          </Canvas>
        </div>

        {/* car ground shadow (DOM, synced) */}
        <motion.div
          style={{ left: shadowX, opacity: shadowOpacity }}
          className="pointer-events-none absolute top-[63%] z-[3] h-10 w-[28rem] -translate-x-1/2 rounded-full bg-black blur-2xl"
          aria-hidden="true"
        />

        {/* ------ captions ------ */}
        <motion.div
          style={{ opacity: cap1 }}
          className="absolute left-1/2 top-[16%] z-10 -translate-x-1/2 select-none text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/50">Leaving the paddock</span>
          <div className="display mt-2 text-4xl text-white sm:text-5xl">FULL THROTTLE</div>
        </motion.div>
        <motion.div
          style={{ opacity: cap2 }}
          className="absolute left-1/2 top-[16%] z-10 -translate-x-1/2 select-none text-center"
        >
          <span className="text-[10px] uppercase tracking-[0.5em]" style={{ color: '#22d3ee' }}>
            Crossing dimensions
          </span>
          <div className="display mt-2 text-4xl text-white sm:text-5xl">INTO THE SPIRIT LINE</div>
        </motion.div>

        {/* ------ warp lines converging on the portal ------ */}
        <WarpLines progress={scrollYProgress} />

        {/* ------ portal flash handoff ------ */}
        <motion.div
          style={{ opacity: flashOpacity }}
          className="pointer-events-none absolute inset-0 z-20"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.95), rgba(34,211,238,0.85) 40%, rgba(7,3,18,0.98) 100%)',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}

/* radial speed lines converging on the portal as the car dives in */
function WarpLines({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.7, 0.8, 0.9, 0.97], [0, 0.55, 0.55, 0])
  const rotate = useTransform(progress, [0.7, 1], [0, 24])

  return (
    <motion.div
      style={{ opacity, rotate }}
      className="pointer-events-none absolute right-[6%] top-1/2 z-[7] h-[170vh] w-[170vh] -translate-y-1/2 translate-x-1/2"
      aria-hidden="true"
    >
      <div
        className="h-full w-full rounded-full"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, rgba(34,211,238,0.5) 0deg 1deg, transparent 1deg 9deg)',
          maskImage: 'radial-gradient(circle, transparent 22%, black 40%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 22%, black 40%, transparent 72%)',
        }}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* ScrollCar — the Ferrari, materials per the three.js car example,   */
/* position + wheel spin driven by scroll progress.                    */
/* ------------------------------------------------------------------ */

const WHEEL_NAMES = ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr']

function ScrollCar({ progress }: { progress: MotionValue<number> }) {
  const group = useRef<THREE.Group>(null!)
  const target = useRef(progress.get())
  const current = useRef(progress.get())
  const { scene } = useGLTF('/media/car.glb')

  const { car, wheels } = useMemo(() => {
    const car = scene.clone(true)

    const body = new THREE.MeshPhysicalMaterial({
      color: 0xd0021b,
      metalness: 1.0,
      roughness: 0.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    })
    const details = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.4,
    })
    // NOTE: no `transmission` — it forces a whole extra render pass per frame
    const glass = new THREE.MeshStandardMaterial({
      color: 0x14161c,
      metalness: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.55,
    })

    const setMat = (name: string, mat: THREE.Material) => {
      const o = car.getObjectByName(name) as THREE.Mesh | undefined
      if (o && (o as THREE.Mesh).isMesh) o.material = mat
    }
    setMat('body', body)
    for (const n of ['rim_fl', 'rim_fr', 'rim_rl', 'rim_rr', 'trim']) setMat(n, details)
    setMat('glass', glass)

    const wheels = WHEEL_NAMES.map((n) => car.getObjectByName(n)).filter(Boolean) as THREE.Object3D[]
    return { car, wheels }
  }, [scene])

  useMotionValueEvent(progress, 'change', (v) => {
    target.current = v
    invalidate()
  })

  useFrame(() => {
    const prev = current.current
    current.current += (target.current - current.current) * 0.1
    const p = current.current
    const g = group.current
    if (!g) return

    // drive left → right, exiting into the portal
    const x = THREE.MathUtils.lerp(-8.5, 8.5, THREE.MathUtils.clamp((p - 0.04) / 0.82, 0, 1))
    g.position.x = x
    g.position.y = -1.15 + Math.sin(p * 40) * 0.015

    // face direction of travel, slight scroll-velocity pitch,
    // then bank away into the portal at the end of the run
    const vel = p - prev
    const bank = THREE.MathUtils.clamp((p - 0.72) / 0.24, 0, 1)
    g.rotation.y = Math.PI / 2 + 0.08 + bank * 0.55
    g.rotation.z = THREE.MathUtils.clamp(-vel * 14, -0.05, 0.05)

    // shrink as it dives into the portal
    const s = 1 - bank * 0.3
    g.scale.setScalar(s)

    // wheel spin proportional to distance travelled
    for (const w of wheels) w.rotation.x = x * 2.6

    if (Math.abs(target.current - current.current) > 0.0005) invalidate()
  })

  return (
    <group ref={group}>
      <primitive object={car} />
    </group>
  )
}

useGLTF.preload('/media/car.glb')
