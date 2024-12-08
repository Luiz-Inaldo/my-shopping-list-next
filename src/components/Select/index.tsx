import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Controller } from 'react-hook-form'

export const ShadSelect = ({control, children, label, name}: {
    control: any,
    children: React.ReactNode,
    label?: string,
    name: string
}) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue=''
            rules={{ required: true }}
            render={({ field:{ onChange, value} }) => (
                <Select onValueChange={onChange} value={value}>
                    <SelectTrigger className="w-full text-paragraphdark rounded border border-gray-400 px-3 py-2 h-8">
                        <SelectValue placeholder={label || ''} />
                    </SelectTrigger>
                    <SelectContent>
                        {children}
                    </SelectContent>
                </Select>
            )}
        />

    )
}
