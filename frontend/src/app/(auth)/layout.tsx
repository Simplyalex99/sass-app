import { WithReactQuery } from '@/components/providers/withReactQuery'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
      <WithReactQuery>{children}</WithReactQuery>
    </div>
  )
}
export default AuthLayout
