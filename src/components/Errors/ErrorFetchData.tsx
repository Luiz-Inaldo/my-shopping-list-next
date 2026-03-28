import { Frown, RefreshCcw } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

export default function ErrorFetchData({ retryFn, isRetrying }: { retryFn?: () => void, isRetrying?: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Frown size={140} strokeWidth={2.5} className="text-sketch-muted mx-auto" />
            <div className="space-y-5">
                <p className="font-sketch text-paragraph text-center font-medium">Algo deu errado</p>
                {retryFn && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={retryFn}
                    >
                        <RefreshCcw className={`mr-2 size-4 ${isRetrying ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                        Tentar Novamente
                    </Button>
                )}
            </div>
        </div>
    )
}
