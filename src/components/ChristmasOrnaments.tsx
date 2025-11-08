'use client'

import { useEffect, useRef } from 'react'

interface Ornament {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  type: 'ball' | 'star' | 'snowflake'
}

export default function ChristmasOrnaments() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ornamentsRef = useRef<Ornament[]>([])
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configurar tamanho do canvas - cobrir toda a página, não apenas viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      // Altura total do documento para cobrir toda a página
      canvas.height = Math.max(window.innerHeight, document.documentElement.scrollHeight)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Cores natalinas sutis
    const colors = [
      '#C9A961', // Dourado quente
      '#8B9D83', // Verde sálvia
      '#2D5016', // Verde floresta
      '#D4AF37', // Dourado claro
      '#6B2C2C', // Vermelho vinho
    ]

    // Criar ornamentos
    const createOrnaments = () => {
      const ornaments: Ornament[] = []
      // Reduzido para melhorar performance - máximo 15 ornamentos
      const count = Math.min(15, Math.floor(window.innerWidth / 80))

      for (let i = 0; i < count; i++) {
        const types: ('ball' | 'star' | 'snowflake')[] = ['ball', 'star', 'snowflake']
        ornaments.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          radius: Math.random() * 15 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: types[Math.floor(Math.random() * types.length)]
        })
      }
      return ornaments
    }

    ornamentsRef.current = createOrnaments()

    // Desenhar ornamento
    const drawOrnament = (ornament: Ornament) => {
      ctx.save()
      ctx.globalAlpha = 0.35 // Aumentado de 0.15 para 0.35
      ctx.fillStyle = ornament.color
      ctx.strokeStyle = ornament.color
      ctx.lineWidth = 2

      if (ornament.type === 'ball') {
        // Bola de Natal
        ctx.beginPath()
        ctx.arc(ornament.x, ornament.y, ornament.radius, 0, Math.PI * 2)
        ctx.fill()
        
        // Brilho
        ctx.globalAlpha = 0.5 // Aumentado de 0.3 para 0.5
        ctx.beginPath()
        ctx.arc(
          ornament.x - ornament.radius / 3,
          ornament.y - ornament.radius / 3,
          ornament.radius / 3,
          0,
          Math.PI * 2
        )
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()
      } else if (ornament.type === 'star') {
        // Estrela
        ctx.globalAlpha = 0.4 // Aumentado de 0.2 para 0.4
        const spikes = 5
        const outerRadius = ornament.radius
        const innerRadius = ornament.radius / 2

        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const angle = (i * Math.PI) / spikes
          const x = ornament.x + Math.cos(angle) * radius
          const y = ornament.y + Math.sin(angle) * radius
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
      } else {
        // Floco de neve
        ctx.globalAlpha = 0.35 // Aumentado de 0.15 para 0.35
        const arms = 6
        for (let i = 0; i < arms; i++) {
          const angle = (i * Math.PI * 2) / arms
          ctx.beginPath()
          ctx.moveTo(ornament.x, ornament.y)
          ctx.lineTo(
            ornament.x + Math.cos(angle) * ornament.radius,
            ornament.y + Math.sin(angle) * ornament.radius
          )
          ctx.stroke()
        }
      }

      ctx.restore()
    }

    // Animação com throttling para melhor performance
    let lastTime = performance.now()
    const targetFPS = 30 // Reduzir FPS para melhorar performance
    const frameInterval = 1000 / targetFPS

    const animate = (currentTime: number) => {
      if (currentTime - lastTime < frameInterval) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ornamentsRef.current.forEach((ornament) => {
        // Atualizar posição
        ornament.x += ornament.vx
        ornament.y += ornament.vy

        // Colisão com bordas (bounce)
        if (ornament.x + ornament.radius > canvas.width || ornament.x - ornament.radius < 0) {
          ornament.vx *= -0.9 // Amortecimento
        }
        if (ornament.y + ornament.radius > canvas.height || ornament.y - ornament.radius < 0) {
          ornament.vy *= -0.9
        }

        // Manter dentro dos limites
        ornament.x = Math.max(ornament.radius, Math.min(canvas.width - ornament.radius, ornament.x))
        ornament.y = Math.max(ornament.radius, Math.min(canvas.height - ornament.radius, ornament.y))

        // Gravidade sutil
        ornament.vy += 0.05

        // Desenhar
        drawOrnament(ornament)
      })

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // Interação com mouse - throttled para melhor performance
    let mouseThrottle = 0
    const handleMouseMove = (e: MouseEvent) => {
      mouseThrottle++
      if (mouseThrottle % 3 !== 0) return // Processar apenas 1 a cada 3 eventos

      const mouseX = e.clientX
      const mouseY = e.clientY

      ornamentsRef.current.forEach((ornament) => {
        const dx = mouseX - ornament.x
        const dy = mouseY - ornament.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Repelir ornamentos próximos ao cursor
        if (distance < 150) {
          const force = (150 - distance) / 150
          ornament.vx -= (dx / distance) * force * 1.5 // Reduzido de 2 para 1.5
          ornament.vy -= (dy / distance) * force * 1.5
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none z-0"
      style={{ 
        mixBlendMode: 'multiply',
        width: '100%',
        height: '100%',
        willChange: 'transform' // Otimização de renderização
      }}
    />
  )
}
