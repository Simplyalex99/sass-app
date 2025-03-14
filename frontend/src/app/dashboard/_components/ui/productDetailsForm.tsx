'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { RequiredLabelIcon } from '@/components/ui/icons/requiredLabelIcon'
import { productDetailsSchema } from '@/lib/zod/schemas/dashboard/productDetails'
import { CreateProductBody, UpdateProductBody } from '@/types/api'
import { fetchData } from '@/utils/others/fetchData'
import { createProductApi, updateProductApi } from '@/constants/api'
import { useRouter } from 'next/navigation'
export const ProductDetailsForm = ({
  product,
}: {
  product?: {
    id: string
    name: string
    description: string | null
    url: string
  }
}) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof productDetailsSchema>>({
    resolver: zodResolver(productDetailsSchema),
    defaultValues: product
      ? { ...product, description: product.description ?? '' }
      : {
          name: '',
          url: '',
          description: '',
        },
  })

  async function onSubmit(values: z.infer<typeof productDetailsSchema>) {
    if (!product) {
      try {
        const response = await fetchData<CreateProductBody>(createProductApi, {
          method: 'POST',
          body: JSON.stringify({ ...values }),
        })
        const { body } = response
        if (body?.error) {
          toast(body.error ? 'Error' : 'Success', {
            description: body.error,
            className: body.error ? 'destructive' : 'default',
          })
          return
        }
        router.push(`/dashboard/products/${body.productId}/edit?tab=countries`)
      } catch (err) {
        console.log(err)
        return
      }
    }
    const response = await fetchData<UpdateProductBody>(
      `${updateProductApi}/${product?.id}`,
      {
        method: 'POST',
        body: JSON.stringify({ ...values }),
      }
    )
    const { body } = response
    if (body?.message) {
      toast(body.error ? 'Error' : 'Success', {
        description: body.message,
        className: body.error ? 'destructive' : 'default',
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Product Name
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Enter your website URL
                  <RequiredLabelIcon />
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Include the protocol (http/https) and the full path to the
                  sales page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-20 resize-none" {...field} />
              </FormControl>
              <FormDescription>
                An optional description to help distinguish your product from
                other products
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="self-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}
