import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30',
        success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
        danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
        destructive: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
        purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
        secondary: 'bg-slate-800 text-slate-300 border border-slate-700',
        outline: 'border border-slate-700 text-slate-300 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
