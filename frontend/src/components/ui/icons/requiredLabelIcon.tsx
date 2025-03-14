import { cn } from '@/utils/others/cn'
import { AsteriskIcon } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'

export const RequiredLabelIcon = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof AsteriskIcon>) => {
  return (
    <AsteriskIcon
      {...props}
      className={cn('inline size-3 align-top text-destructive', className)}
    />
  )
}
