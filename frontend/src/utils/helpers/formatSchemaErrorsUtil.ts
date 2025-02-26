import { ZodIssue } from 'zod'
export const formatSchemaErrorMessages = (issues: ZodIssue[]) => {
  return issues.map((issue) => issue.message).join(', ')
}
