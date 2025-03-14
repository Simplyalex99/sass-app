'use client'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { fetchData } from '@/utils/others/fetchData'
import { deleteProductApi } from '@/constants/api'
import { DeleteProductBody } from '@/types/api'
import { useTransition } from 'react'

export const DeleteProductAlertDialogContent = ({ id }: { id: string }) => {
  const [isDeletePending, startDeleteTransition] = useTransition()

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete this
          product.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            startDeleteTransition(async () => {
              const response = await fetchData<DeleteProductBody>(
                `${deleteProductApi}/${id}`,
                {
                  method: 'POST',
                }
              )
              const data = response.body
              if (data.message) {
                toast(data.error ? 'Error' : 'Success', {
                  description: data.message,
                  className: data.error ? 'destructive' : 'default',
                })
              }
            })
          }}
          disabled={isDeletePending}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
