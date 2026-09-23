'use client'

import { useEffect, useRef } from 'react'

interface Mote {
  x: number
  y: number
  radius: number
  phase: number
  speed: number
  color: number
  drift: number
}

const MOTES: Mote[] = Array.from({ length: 24 }, (_, index) => ({
  x: ((index * 47) % 97) / 100,
  y: ((index * 71 + 13) % 101) / 100,
  radius: 1.1 + (index % 4) * 0.55,
  phase: index * 0.93,
  speed: 0.1 + (index % 5) * 0.025,
  color: index % 3,
  drift: 8 + (index % 6) * 3,
}))

export default function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reducedMotion = motionQuery.matches
    let animationFrame = 0
    let lastPaint = 0
    let width = window.innerWidth
    let height = window.innerHeight

    const palette = () => {
      const isLight = document.documentElement.dataset.theme === 'light'
      return isLight
        ? ['0, 111, 187', '101, 64, 204', '196, 62, 86']
        : ['53, 221, 234', '139, 108, 245', '255, 122, 114']
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const density = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(width * density)
      canvas.height = Math.round(height * density)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(density, 0, 0, density, 0, 0)
      draw(performance.now())
    }

    const drawRibbon = (
      color: string,
      y: number,
      amplitude: number,
      phase: number,
      opacity: number
    ) => {
      const gradient = context.createLinearGradient(0, 0, width, 0)
      gradient.addColorStop(0, `rgba(${color}, 0)`)
      gradient.addColorStop(0.24, `rgba(${color}, ${opacity})`)
      gradient.addColorStop(0.72, `rgba(${color}, ${opacity * 0.72})`)
      gradient.addColorStop(1, `rgba(${color}, 0)`)

      context.beginPath()
      context.moveTo(-60, y + Math.sin(phase) * amplitude)
      context.bezierCurveTo(
        width * 0.22,
        y - amplitude + Math.cos(phase * 0.7) * 18,
        width * 0.67,
        y + amplitude + Math.sin(phase * 0.45) * 24,
        width + 60,
        y - Math.cos(phase) * amplitude * 0.5
      )
      context.strokeStyle = gradient
      context.lineWidth = 1.2
      context.stroke()
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)
      const colors = palette()
      const seconds = reducedMotion ? 0 : time / 1000
      const isLight = document.documentElement.dataset.theme === 'light'

      context.save()
      drawRibbon(colors[0], height * 0.22, 42, seconds * 0.14, isLight ? 0.13 : 0.2)
      drawRibbon(colors[1], height * 0.54, 58, seconds * -0.1 + 2.1, isLight ? 0.1 : 0.17)
      drawRibbon(colors[2], height * 0.82, 34, seconds * 0.12 + 4.4, isLight ? 0.08 : 0.13)

      MOTES.forEach((mote) => {
        const x = mote.x * width + Math.sin(seconds * mote.speed + mote.phase) * mote.drift
        const y = mote.y * height + Math.cos(seconds * mote.speed * 0.8 + mote.phase) * mote.drift
        const color = colors[mote.color]
        const pulse = reducedMotion ? 0.72 : 0.62 + Math.sin(seconds * 0.55 + mote.phase) * 0.2

        const halo = context.createRadialGradient(x, y, 0, x, y, mote.radius * 7)
        halo.addColorStop(0, `rgba(${color}, ${pulse * (isLight ? 0.2 : 0.28)})`)
        halo.addColorStop(1, `rgba(${color}, 0)`)
        context.beginPath()
        context.arc(x, y, mote.radius * 7, 0, Math.PI * 2)
        context.fillStyle = halo
        context.fill()

        context.beginPath()
        context.arc(x, y, mote.radius, 0, Math.PI * 2)
        context.fillStyle = `rgba(${color}, ${pulse * (isLight ? 0.45 : 0.68)})`
        context.fill()
      })
      context.restore()
    }

    const animate = (time: number) => {
      if (time - lastPaint >= 33) {
        draw(time)
        lastPaint = time
      }
      animationFrame = window.requestAnimationFrame(animate)
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      window.cancelAnimationFrame(animationFrame)
      if (reducedMotion) {
        draw(performance.now())
      } else {
        lastPaint = 0
        animationFrame = window.requestAnimationFrame(animate)
      }
    }

    const themeObserver = new MutationObserver(() => draw(performance.now()))
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    window.addEventListener('resize', resize, { passive: true })
    motionQuery.addEventListener('change', handleMotionChange)
    resize()
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      motionQuery.removeEventListener('change', handleMotionChange)
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />
}
