'use client'

/* eslint-disable react/no-unknown-property */
import { Component, Suspense, useRef, useLayoutEffect, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber'
import {
  OrbitControls,
  useGLTF,
  useProgress,
  Html,
  Environment,
} from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'motion/react'

const isTouch =
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0)
const deg2rad = (d: number) => (d * Math.PI) / 180
const ROTATE_SPEED = 0.005
const INERTIA = 0.925
const PARALLAX_MAG = 0.05
const PARALLAX_EASE = 0.12
const HOVER_MAG = deg2rad(6)
const HOVER_EASE = 0.15

class CanvasErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function ModelFallback({ url }: { url: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.07] to-transparent">
      <img src={url.includes('hoodie') ? '/media/hoodie-f1.png' : '/media/ferrari-front.png'} alt="Collection preview" className="h-[86%] w-[86%] object-contain opacity-90" />
    </div>
  )
}

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <span className="text-[10px] uppercase tracking-[0.4em] text-white/50">
        {Math.round(progress)}%
      </span>
    </Html>
  )
}

function DesktopControls({
  pivot,
  min,
  max,
  zoomEnabled,
}: {
  pivot: THREE.Vector3
  min: number
  max: number
  zoomEnabled: boolean
}) {
  const ref = useRef<any>(null)
  useFrame(() => ref.current?.target.copy(pivot))
  return (
    <OrbitControls
      ref={ref}
      makeDefault
      enablePan={false}
      enableRotate={false}
      enableZoom={zoomEnabled}
      minDistance={min}
      maxDistance={max}
    />
  )
}

type InnerProps = {
  url: string
  xOff: number
  yOff: number
  pivot: THREE.Vector3
  initYaw: number
  initPitch: number
  minZoom: number
  maxZoom: number
  enableMouseParallax: boolean
  enableManualRotation: boolean
  enableHoverRotation: boolean
  enableManualZoom: boolean
  autoFrame: boolean
  fadeIn: boolean
  autoRotate: boolean
  autoRotateSpeed: number
  inViewRef: React.RefObject<boolean>
  onLoaded?: () => void
}

function ModelInner({
  url,
  xOff,
  yOff,
  pivot,
  initYaw,
  initPitch,
  minZoom,
  maxZoom,
  enableMouseParallax,
  enableManualRotation,
  enableHoverRotation,
  enableManualZoom,
  autoFrame,
  fadeIn,
  autoRotate,
  autoRotateSpeed,
  inViewRef,
  onLoaded,
}: InnerProps) {
  const outer = useRef<THREE.Group>(null!)
  const inner = useRef<THREE.Group>(null!)
  const { camera, gl } = useThree()

  const vel = useRef({ x: 0, y: 0 })
  const tPar = useRef({ x: 0, y: 0 })
  const cPar = useRef({ x: 0, y: 0 })
  const tHov = useRef({ x: 0, y: 0 })
  const cHov = useRef({ x: 0, y: 0 })
  const restingRotation = useRef({ x: initPitch, y: initYaw })

  // clone per instance — useGLTF caches one scene per url, and multiple
  // viewers (hero + F1 stage) must not mutate the same object graph
  const { scene } = useGLTF(url)
  const content = useMemo(() => {
    const c = scene.clone(true)
    c.traverse((o: any) => {
      if (o.isMesh && o.material) o.material = o.material.clone()
    })
    return c
  }, [scene])

  const pivotW = useRef(new THREE.Vector3())
  useLayoutEffect(() => {
    if (!content) return
    const g = inner.current
    g.updateWorldMatrix(true, true)

    const sphere = new THREE.Box3()
      .setFromObject(g)
      .getBoundingSphere(new THREE.Sphere())
    const s = 1 / (sphere.radius * 2)
    g.position.set(-sphere.center.x, -sphere.center.y, -sphere.center.z)
    g.scale.setScalar(s)

    g.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true
        o.receiveShadow = true
        if (fadeIn) {
          o.material.transparent = true
          o.material.opacity = 0
        }
      }
    })

    g.getWorldPosition(pivotW.current)
    pivot.copy(pivotW.current)
    restingRotation.current = { x: initPitch, y: initYaw }
    outer.current.rotation.set(initPitch, initYaw, 0)

    if (autoFrame && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const persp = camera as THREE.PerspectiveCamera
      const fitR = sphere.radius * s
      const d = (fitR * 1.2) / Math.sin((persp.fov * Math.PI) / 180 / 2)
      persp.position.set(pivotW.current.x, pivotW.current.y, pivotW.current.z + d)
      persp.near = d / 10
      persp.far = d * 10
      persp.updateProjectionMatrix()
    }

    if (fadeIn) {
      let t = 0
      const id = setInterval(() => {
        t += 0.05
        const v = Math.min(t, 1)
        g.traverse((o: any) => {
          if (o.isMesh) o.material.opacity = v
        })
        invalidate()
        if (v === 1) {
          clearInterval(id)
          onLoaded?.()
        }
      }, 16)
      return () => clearInterval(id)
    } else onLoaded?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  useEffect(() => {
    if (!enableManualRotation || isTouch) return
    const el = gl.domElement
    let drag = false
    let lx = 0
    let ly = 0
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return
      drag = true
      lx = e.clientX
      ly = e.clientY
      window.addEventListener('pointerup', up)
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - lx
      const dy = e.clientY - ly
      lx = e.clientX
      ly = e.clientY
      restingRotation.current.y += dx * ROTATE_SPEED
      restingRotation.current.x += dy * ROTATE_SPEED
      vel.current = { x: dx * ROTATE_SPEED, y: dy * ROTATE_SPEED }
      invalidate()
    }
    const up = () => (drag = false)
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl, enableManualRotation])

  useEffect(() => {
    if (isTouch) return
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      if (enableMouseParallax)
        tPar.current = { x: -nx * PARALLAX_MAG, y: -ny * PARALLAX_MAG }
      if (enableHoverRotation)
        tHov.current = { x: ny * HOVER_MAG, y: nx * HOVER_MAG }
      invalidate()
    }
    window.addEventListener('pointermove', mm)
    return () => window.removeEventListener('pointermove', mm)
  }, [enableMouseParallax, enableHoverRotation])

  useFrame((state, dt) => {
    let need = false
    cPar.current.x += (tPar.current.x - cPar.current.x) * PARALLAX_EASE
    cPar.current.y += (tPar.current.y - cPar.current.y) * PARALLAX_EASE
    const phx = cHov.current.x
    const phy = cHov.current.y
    cHov.current.x += (tHov.current.x - cHov.current.x) * HOVER_EASE
    cHov.current.y += (tHov.current.y - cHov.current.y) * HOVER_EASE

    const ndc = pivotW.current.clone().project(camera)
    ndc.x += xOff + cPar.current.x
    ndc.y += yOff + cPar.current.y
    outer.current.position.copy(ndc.unproject(camera))

    // Keep the front graphic as the resting pose; the motion is a subtle sway,
    // not a showroom spin. Manual drag adjusts the resting angle permanently.
    const sway = autoRotate && inViewRef.current ? Math.sin(state.clock.elapsedTime * autoRotateSpeed) * deg2rad(20) : 0
    outer.current.rotation.x = restingRotation.current.x + cHov.current.x
    outer.current.rotation.y = restingRotation.current.y + cHov.current.y + sway

    if (autoRotate && inViewRef.current) {
      need = true
    }

    restingRotation.current.y += vel.current.x
    restingRotation.current.x += vel.current.y
    vel.current.x *= INERTIA
    vel.current.y *= INERTIA
    if (Math.abs(vel.current.x) > 1e-4 || Math.abs(vel.current.y) > 1e-4)
      need = true

    if (
      Math.abs(cPar.current.x - tPar.current.x) > 1e-4 ||
      Math.abs(cPar.current.y - tPar.current.y) > 1e-4 ||
      Math.abs(cHov.current.x - tHov.current.x) > 1e-4 ||
      Math.abs(cHov.current.y - tHov.current.y) > 1e-4
    )
      need = true

    if (need) invalidate()
  })

  if (!content) return null
  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={content} />
      </group>
    </group>
  )
}

export type ModelViewerProps = {
  url: string
  width?: number | string
  height?: number | string
  modelXOffset?: number
  modelYOffset?: number
  defaultRotationX?: number
  defaultRotationY?: number
  defaultZoom?: number
  minZoomDistance?: number
  maxZoomDistance?: number
  enableMouseParallax?: boolean
  enableManualRotation?: boolean
  enableHoverRotation?: boolean
  enableManualZoom?: boolean
  ambientIntensity?: number
  keyLightIntensity?: number
  fillLightIntensity?: number
  rimLightIntensity?: number
  environmentPreset?: string
  autoFrame?: boolean
  fadeIn?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  onModelLoaded?: () => void
}

export default function ModelViewer({
  url,
  width = 400,
  height = 400,
  modelXOffset = 0,
  modelYOffset = 0,
  defaultRotationX = -20,
  defaultRotationY = 10,
  defaultZoom = 2,
  minZoomDistance = 0.8,
  maxZoomDistance = 10,
  enableMouseParallax = true,
  enableManualRotation = true,
  enableHoverRotation = true,
  enableManualZoom = false,
  ambientIntensity = 0.4,
  keyLightIntensity = 1.1,
  fillLightIntensity = 0.5,
  rimLightIntensity = 1,
  environmentPreset = 'city',
  autoFrame = true,
  fadeIn = true,
  autoRotate = true,
  autoRotateSpeed = 0.35,
  onModelLoaded,
}: ModelViewerProps) {
  useEffect(() => void useGLTF.preload(url), [url])
  const reduceMotion = useReducedMotion()
  const pivot = useRef(new THREE.Vector3()).current
  const containerRef = useRef<HTMLDivElement>(null)
  const inViewRef = useRef(true)
  const [contextLost, setContextLost] = useState(false)

  // pause auto-rotate renders while scrolled out of view
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      inViewRef.current = e.isIntersecting
      if (e.isIntersecting) invalidate()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const initYaw = deg2rad(defaultRotationX)
  const initPitch = deg2rad(defaultRotationY)
  const camZ = Math.min(Math.max(defaultZoom, minZoomDistance), maxZoomDistance)

  return (
    <div
      ref={containerRef}
      style={{ width, height, touchAction: 'pan-y pinch-zoom', position: 'relative' }}
      data-cursor-hover
    >
      <CanvasErrorBoundary fallback={<ModelFallback url={url} />}>
      {contextLost ? <ModelFallback url={url} /> : <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        gl={{
          preserveDrawingBuffer: false,
          antialias: true,
          alpha: true,
          powerPreference: 'default',
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.domElement.addEventListener('webglcontextlost', () => setContextLost(true), { once: true })
        }}
        camera={{ fov: 50, position: [0, 0, camZ], near: 0.01, far: 100 }}
        style={{ touchAction: 'pan-y pinch-zoom', background: 'transparent' }}
      >
        {environmentPreset !== 'none' && (
          <Environment preset={environmentPreset as any} background={false} />
        )}

        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[5, 5, 5]} intensity={keyLightIntensity} />
        <directionalLight position={[-5, 2, 5]} intensity={fillLightIntensity} />
        <directionalLight position={[0, 4, -5]} intensity={rimLightIntensity} />

        <Suspense fallback={<Loader />}>
          <ModelInner
            url={url}
            xOff={modelXOffset}
            yOff={modelYOffset}
            pivot={pivot}
            initYaw={initYaw}
            initPitch={initPitch}
            minZoom={minZoomDistance}
            maxZoom={maxZoomDistance}
            enableMouseParallax={enableMouseParallax}
            enableManualRotation={enableManualRotation}
            enableHoverRotation={enableHoverRotation}
            enableManualZoom={enableManualZoom}
            autoFrame={autoFrame}
            fadeIn={fadeIn}
            autoRotate={autoRotate && !reduceMotion}
            autoRotateSpeed={autoRotateSpeed}
            inViewRef={inViewRef}
            onLoaded={onModelLoaded}
          />
        </Suspense>

        {!isTouch && (
          <DesktopControls
            pivot={pivot}
            min={minZoomDistance}
            max={maxZoomDistance}
            zoomEnabled={enableManualZoom}
          />
        )}
      </Canvas>}
      </CanvasErrorBoundary>
    </div>
  )
}
