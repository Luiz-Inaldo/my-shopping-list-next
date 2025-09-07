import { Frown } from 'lucide-react'
import React from 'react'

export default function ErrorFetchData() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Frown size={48} className="text-paragraph" />
            <p className="mt-2 text-sm text-paragraph">Ocorreu um erro ao tentar buscar os dados.</p>
        </div>
    )
}
