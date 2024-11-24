import React from 'react'
import Header from '../Header'
import Footer from '../Footer'

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='flex flex-col gap-10 justify-between bg-primary-dark max-w-[430px] min-h-dvh mx-auto'>
            <Header />
            {children}
            <Footer />
        </div>
    )
}

export default LoggedLayout