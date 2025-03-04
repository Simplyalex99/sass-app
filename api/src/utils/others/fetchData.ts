export const fetchData = async <T = unknown>(
  path: string,
  opts: RequestInit = {}
): Promise<T> => {
  const res = await fetch(path, opts)
  const body = await res.json()
  return body as T
}
