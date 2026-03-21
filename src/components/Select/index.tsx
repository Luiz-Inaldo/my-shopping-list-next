import React from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ShadSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  children: React.ReactNode;
  label?: string;
  name: string;
  defaultValue?: string;
  className?: string;
}

export const ShadSelect = ({
  control,
  children,
  label,
  name,
  defaultValue,
  className,
}: ShadSelectProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue ?? ''}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => (
        <Select onValueChange={onChange} value={value ?? ''}>
          <SelectTrigger
            className={cn(
              className
            )}
          >
            <SelectValue className='text-sketch-muted' placeholder={label ?? ''} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
      )}
    />
  );
};
