"use client"
import { useEffect, useRef } from "react"

// Adicione a Patrick Hand ao seu layout.tsx ou _document.tsx:
// <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet" />

export function AnimatedLogo({ className = "" }: { className?: string }) {
  const strokeTextRef = useRef<SVGTextElement>(null)
  const fillTextRef = useRef<SVGTextElement>(null)
  const dotRef = useRef<SVGCircleElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const separatorRef = useRef<SVGLineElement>(null)
  const subtitleRef = useRef<SVGTextElement>(null)

  useEffect(() => {
    const strokeText = strokeTextRef.current
    const fillText = fillTextRef.current
    const dot = dotRef.current
    const svg = svgRef.current
    const separator = separatorRef.current
    const subtitle = subtitleRef.current
    if (!strokeText || !fillText || !dot || !svg || !separator || !subtitle) return

    dot.style.opacity = "0"

    requestAnimationFrame(() => {
      const length = strokeText.getComputedTextLength()

      const textStartX = 10
      const gap = 10
      const dotX = textStartX + length + gap
      const dotY = 55

      dot.setAttribute("cx", String(dotX))
      dot.setAttribute("cy", String(dotY))
      dot.style.transformOrigin = `${dotX}px ${dotY}px`
      dot.style.transform = "scale(0)"
      dot.style.opacity = "1"

      const svgWidth = dotX + 12
      svg.setAttribute("viewBox", `0 0 ${svgWidth} 115`)
      svg.setAttribute("width", String(svgWidth))
      svg.setAttribute("height", "115")

      separator.setAttribute("x1", "10")
      separator.setAttribute("x2", String(dotX + 6))
      separator.setAttribute("y1", "74")
      separator.setAttribute("y2", "74")

      const separatorLength = dotX + 6 - 10
      separator.style.strokeDasharray = `${separatorLength}`
      separator.style.strokeDashoffset = `${separatorLength}`

      const centerX = (10 + dotX + 6) / 2
      subtitle.setAttribute("x", String(centerX))
      subtitle.setAttribute("text-anchor", "middle")

      strokeText.style.strokeDasharray = `${length}`
      strokeText.style.strokeDashoffset = `${length}`
      strokeText.style.opacity = "1"

      const PAUSE = 800

      // ─── FORWARD ───────────────────────────────────────────
      strokeText.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        { duration: 1800, easing: "ease-out", fill: "forwards" }
      )

      fillText.animate(
        [{ opacity: 0 }, { opacity: 0, offset: 0.6 }, { opacity: 1 }],
        { duration: 2000, easing: "ease-out", fill: "forwards" }
      )

      setTimeout(() => {
        dot.animate(
          [
            { transform: "scale(0)", offset: 0 },
            { transform: "scale(1.2)", offset: 0.4 },
            { transform: "scale(0.85)", offset: 0.6 },
            { transform: "scale(1.05)", offset: 0.8 },
            { transform: "scale(1)", offset: 1 },
          ],
          { duration: 500, easing: "ease-out", fill: "forwards" }
        )
      }, 2000)

      setTimeout(() => {
        separator.animate(
          [{ strokeDashoffset: separatorLength }, { strokeDashoffset: 0 }],
          { duration: 600, easing: "ease-out", fill: "forwards" }
        )
      }, 2600)

      setTimeout(() => {
        subtitle.animate(
          [{ opacity: 0 }, { opacity: 1 }],
          { duration: 500, easing: "ease-out", fill: "forwards" }
        )
      }, 3100)

      // ─── REVERSE ───────────────────────────────────────────
      const reverseStart = 3100 + 500 + PAUSE

      setTimeout(() => {
        subtitle.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 400, easing: "ease-in", fill: "forwards" }
        )
      }, reverseStart)

      setTimeout(() => {
        separator.animate(
          [{ strokeDashoffset: 0 }, { strokeDashoffset: separatorLength }],
          { duration: 500, easing: "ease-in", fill: "forwards" }
        )
      }, reverseStart + 400)

      setTimeout(() => {
        dot.animate(
          [
            { transform: "scale(1)", offset: 0 },
            { transform: "scale(1.05)", offset: 0.2 },
            { transform: "scale(0)", offset: 1 },
          ],
          { duration: 400, easing: "ease-in", fill: "forwards" }
        )
      }, reverseStart + 900)

      setTimeout(() => {
        fillText.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 600, easing: "ease-in", fill: "forwards" }
        )
      }, reverseStart + 1100)

      setTimeout(() => {
        strokeText.animate(
          [{ strokeDashoffset: 0 }, { strokeDashoffset: length }],
          { duration: 1600, easing: "ease-in", fill: "forwards" }
        )
      }, reverseStart + 1300)
    })
  }, [])

  return (
    <svg
      ref={svgRef}
      width="325"
      height="115"
      viewBox="0 0 325 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        ref={strokeTextRef}
        x="10"
        y="55"
        fontFamily="'Patrick Hand', cursive"
        fontSize="52"
        fontWeight="500"
        fill="none"
        stroke="#fafafa"
        strokeWidth="1"
        style={{ opacity: 0 }}
      >
        E-Shoplist
      </text>
      <text
        ref={fillTextRef}
        x="10"
        y="55"
        fontFamily="'Patrick Hand', cursive"
        fontSize="52"
        fontWeight="500"
        fill="#fafafa"
        style={{ opacity: 0 }}
      >
        E-Shoplist
      </text>
      <circle
        ref={dotRef}
        r="6"
        fill="#D0BEFF"
        style={{ opacity: 0 }}
      />
      <line
        ref={separatorRef}
        stroke="#D0BEFF"
        strokeWidth="1.5"
      />
      <text
        ref={subtitleRef}
        x="10"
        y="95"
        fontFamily="'Patrick Hand', cursive"
        fontSize="16"
        fontWeight="400"
        fill="#fafafa"
        style={{ opacity: 0 }}
      >
        Facilitando suas compras
      </text>
    </svg>
  )
}
