import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'

export const ShadSelect = ({control, children, label, name, defaultValue, className}: {
    control: any,
    children: React.ReactNode,
    label?: string,
    name: string,
    defaultValue?: string,
    className?: string
}) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue || ""}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
                <Select onValueChange={onChange} value={value || ""}>
                    <SelectTrigger className={cn("w-full bg-app-background text-subtitle text-sm rounded-full border px-3 py-2 h-8", className)}>
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
