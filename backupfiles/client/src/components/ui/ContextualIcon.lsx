import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import { withContextualColor } from '@/lib/iconColorGenerator';
import { cn } from '@/lib/utils';

interface ContextualIconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
  state?: 'base' | 'hover' | 'muted' | 'accent';
}

export function ContextualIcon({ 
  icon, 
  state = 'base',
  className,
  ...props 
}: ContextualIconProps) {
  const StyledIcon = withContextualColor(icon, state);

  return (
    <StyledIcon
      className={cn('transition-colors duration-200', className)}
      {...props}
    />
  );
}