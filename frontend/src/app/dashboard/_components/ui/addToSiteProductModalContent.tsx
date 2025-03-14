'use client'

import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CopyCheckIcon, CopyIcon, CopyXIcon } from 'lucide-react'
import { useState } from 'react'

type CopyState = 'idle' | 'copied' | 'error'

export const AddToSiteProductModalContent = ({ id }: { id: string }) => {
  const [copyState, setCopyState] = useState<CopyState>('idle')
  const code = `<script src="${process.env.NEXT_PUBLIC_URL}/api/products/${id}/banner"></script>`
  const Icon = getCopyIcon(copyState)

  return (
    <DialogContent className="max-w-max">
      <DialogHeader>
        <DialogTitle className="text-2xl">Start Earning PPP Sales!</DialogTitle>
        <DialogDescription>
          All you need to do is copy the below script into your site and your
          customers will start seeing PPP discounts!
        </DialogDescription>
      </DialogHeader>
      <pre className="mb-4 max-w-screen-xl overflow-x-auto rounded bg-secondary p-4 text-secondary-foreground">
        <code>{code}</code>
      </pre>
      <div className="flex gap-2">
        <Button
          onClick={() => {
            navigator.clipboard
              .writeText(code)
              .then(() => {
                setCopyState('copied')
                setTimeout(() => setCopyState('idle'), 2000)
              })
              .catch(() => {
                setCopyState('error')
                setTimeout(() => setCopyState('idle'), 2000)
              })
          }}
        >
          {<Icon className="mr-2 size-4" />}
          {getChildren(copyState)}
        </Button>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  )
}

const getCopyIcon = (copyState: CopyState) => {
  switch (copyState) {
    case 'idle':
      return CopyIcon
    case 'copied':
      return CopyCheckIcon
    case 'error':
      return CopyXIcon
  }
}

const getChildren = (copyState: CopyState) => {
  switch (copyState) {
    case 'idle':
      return 'Copy Code'
    case 'copied':
      return 'Copied!'
    case 'error':
      return 'Error'
  }
}
