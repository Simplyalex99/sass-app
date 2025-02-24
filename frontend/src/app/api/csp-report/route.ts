import { log } from '@/utils/others/log'
export const POST = async (req: Request) => {
  log.error('CSP Violation:', req.body)
  return
}
