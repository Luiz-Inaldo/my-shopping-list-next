import { LoaderCircle } from 'lucide-react'
import React from 'react'

const GlobalLoader = () => {
  return (
    <div className='h-screen w-full grid place-items-center'>
        <LoaderCircle size={85} className='animate-spin' />
    </div>
  )
}

export default GlobalLoader