export const fetchData = async <T = unknown>(
  path: string,
  opts: RequestInit = {}
): Promise<{ body: T; res: Response }> => {
  const res = await fetch(path, opts)
  const body = await res.json()
  return { body: body as T, res }
}
