import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CaretLeftIcon } from '@radix-ui/react-icons'
type Props = {
  children: React.ReactNode
  backButtonHref: string
  pageTitle: string
}
export const PageWithBackButton = ({
  backButtonHref,
  pageTitle,
  children,
}: Props) => {
  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
      <Button asChild className="rounded-full" size="icon" variant="outline">
        <Link href={backButtonHref}>
          <div className="sr-only">back</div>
          <CaretLeftIcon className="!size-8" />
        </Link>
      </Button>
      <h1 className="self-center text-2xl font-semibold">{pageTitle}</h1>
      <div className="col-start-2">{children}</div>
    </div>
  )
}
