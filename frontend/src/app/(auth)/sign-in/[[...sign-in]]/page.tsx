import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Label,
  Input,
  Icons,
} from '@/components'
import { brandLogoName } from '@/constants'
import Link from 'next/link'
const SignInPage = () => {
  return (
    <Card className="p-6">
      <CardHeader className="space-y-1">
        <CardTitle className="text-center text-2xl">
          Sign in to {brandLogoName}
        </CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <form action={'/api/auth/callback/github'} method="POST">
            <Button
              variant="outline"
              className="hover:bg-slate-100"
              type="submit"
            >
              <Icons.gitHub /> GitHub
            </Button>
          </form>

          <Button variant="outline" className="hover:bg-slate-100">
            <Icons.google />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs capitalize">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create account</Button>
      </CardFooter>
      <CardFooter>
        <div className="relative grid w-full items-center">
          <div className="mb-4 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs capitalize">
            <span className="bg-background px-2 text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-bold">
                Sign Up
              </Link>
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default SignInPage
