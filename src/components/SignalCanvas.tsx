'use client'
import { useEffect, useRef } from 'react'

// Predefined wire paths as [xFraction, yFraction] waypoints
// Right-angle paths only — PCB aesthetic
const WIRE_PATHS = [
  [[0.0, 0.15], [0.20, 0.15], [0.20, 0.42], [0.50, 0.42], [0.50, 0.70], [0.82, 0.70], [0.82, 0.90], [1.0, 0.90]],
  [[0.12, 0.0],  [0.12, 0.28], [0.38, 0.28], [0.38, 0.58], [0.68, 0.58], [0.68, 0.32], [0.92, 0.32], [0.92, 0.0]],
  [[0.62, 0.0],  [0.62, 0.22], [0.88, 0.22], [0.88, 0.52], [1.0,  0.52]],
  [[0.0,  0.52], [0.16, 0.52], [0.16, 0.78], [0.44, 0.78], [0.44, 0.95], [0.72, 0.95]],
  [[0.48, 0.0],  [0.48, 0.35], [0.76, 0.35], [0.76, 0.82], [1.0,  0.82]],
  [[0.0,  0.78], [0.28, 0.78], [0.28, 0.55], [0.58, 0.55], [0.58, 0.18], [0.78, 0.18], [0.78, 0.0]],
  [[0.0,  0.35], [0.08, 0.35], [0.08, 0.62], [0.32, 0.62], [0.32, 0.88], [0.55, 0.88]],
  [[0.72, 0.0],  [0.72, 0.48], [0.42, 0.48], [0.42, 0.68], [0.18, 0.68], [0.18, 1.0]],
]

interface Packet {
  pathIdx: number
  segIdx: number
  progress: number
  speed: number
  colorBase: string
  trail: Array<[number, number]>
}

export default function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0, animId: number

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    resize()
    window.addEventListener('resize', resize)

    const toPixel = (path: number[][]): [number, number][] =>
      path.map(([fx, fy]) => [fx * W, fy * H])

    const packets: Packet[] = []

    const spawnPacket = () => {
      if (packets.length > 14) return
      const pathIdx = Math.floor(Math.random() * WIRE_PATHS.length)
      const colors = ['rgba(0,212,255,', 'rgba(0,212,255,', 'rgba(124,58,237,']
      packets.push({
        pathIdx,
        segIdx: 0,
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      })
    }

    // Stagger initial spawns
    for (let i = 0; i < 9; i++) setTimeout(spawnPacket, i * 700)
    const respawnId = setInterval(spawnPacket, 1600)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Draw wire paths (static, very faint)
      ctx.strokeStyle = 'rgba(0,212,255,0.04)'
      ctx.lineWidth = 1
      WIRE_PATHS.forEach(path => {
        const pts = toPixel(path)
        ctx.beginPath()
        pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
        ctx.stroke()
      })

      // Draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        const path = WIRE_PATHS[p.pathIdx]
        const pts = toPixel(path)

        if (p.segIdx >= pts.length - 1) { packets.splice(i, 1); continue }

        const [sx, sy] = pts[p.segIdx]
        const [ex, ey] = pts[p.segIdx + 1]
        const cx = sx + (ex - sx) * p.progress
        const cy = sy + (ey - sy) * p.progress

        p.trail.push([cx, cy])
        if (p.trail.length > 14) p.trail.shift()

        // Trail
        p.trail.forEach(([tx, ty], ti) => {
          const ratio = ti / p.trail.length
          ctx.beginPath()
          ctx.arc(tx, ty, 0.8 + ratio * 1.4, 0, Math.PI * 2)
          ctx.fillStyle = `${p.colorBase}${ratio * 0.55})`
          ctx.fill()
        })

        // Head
        ctx.beginPath()
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `${p.colorBase}0.9)`
        ctx.fill()

        // Glow halo
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, 9)
        grd.addColorStop(0, `${p.colorBase}0.28)`)
        grd.addColorStop(1, `${p.colorBase}0)`)
        ctx.beginPath()
        ctx.arc(cx, cy, 9, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Advance
        p.progress += p.speed
        if (p.progress >= 1) { p.progress = 0; p.segIdx++; p.trail = [] }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(respawnId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
