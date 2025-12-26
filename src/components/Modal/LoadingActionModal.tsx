'use client';

import React from 'react'
import ReactDOM from 'react-dom'
import { LoaderCircle } from 'lucide-react'

export function LoadingActionModal({ text }: { text: string }) {
    return ReactDOM.createPortal((
        <div className="fixed overflow-hidden inset-0 bg-black/70 grid place-items-center z-[5]">
            <div className="w-[90%] bg-app-container rounded-lg p-6 border border-app-border flex items-center gap-5">
                <LoaderCircle size={24} className='animate-spin text-app-primary' />
                <p className="text-paragraph">{text}</p>
            </div>
        </div>
    ), document.body)
}
