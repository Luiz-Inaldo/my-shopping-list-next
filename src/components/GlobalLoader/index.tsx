import { LoaderCircle } from 'lucide-react'
import React from 'react'

// CSS
import "./loader.css"

const GlobalLoader = () => {
  return (
    <div className='h-screen w-full grid place-items-center bg-primary-dark'>
        {/* <LoaderCircle size={85} className='animate-spin' /> */}
        <div className='loader'></div>
    </div>
  )
}

export default GlobalLoader