import React from 'react'
import Header from '../Header'
import Footer from '../Footer'

const LoggedLayout = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className='container bg-primary-dark'>
            {children}
            <Footer />
        </div>
    )
}

export default LoggedLayout