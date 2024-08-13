import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Controller } from 'react-hook-form'

export const ShadSelect = ({control, children}: {
    control: any,
    children: React.ReactNode
}) => {
    return (
        <Controller
            name='category'
            control={control}
            defaultValue=''
            rules={{ required: true }}
            render={({ field:{ onChange, value} }) => (
                <Select onValueChange={onChange} value={value}>
                    <SelectTrigger className="w-full text-paragraph rounded border border-gray-400 px-3 py-2 h-8">
                        <SelectValue placeholder="Escolha a categoria..." />
                    </SelectTrigger>
                    <SelectContent>
                        {children}
                    </SelectContent>
                </Select>
            )}
        />

    )
}
