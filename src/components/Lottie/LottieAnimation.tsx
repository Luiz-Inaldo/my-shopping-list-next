import Lottie from 'lottie-react'
import React, { useRef } from 'react'

interface LottieAnimationProps {
  animationData: any
  className?: string
  loop?: boolean
  autoplay?: boolean
  playOnHover?: boolean
  width?: number | string
  height?: number | string
}

export function LottieAnimation({ 
  animationData, 
  className = '', 
  loop = true, 
  autoplay = true,
  playOnHover = false,
  width = '100%',
  height = '100%'
}: LottieAnimationProps) {
  const lottieRef = useRef<any>(null)

  const handleMouseEnter = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.stop()
    }
  }

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={loop}
      autoplay={playOnHover ? false : autoplay}
      style={{ width, height }}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}