export const fetchData = async <T = unknown>(
  path: string,
  opts: RequestInit = {}
) => {
  const req = await fetch(path, opts)
  return (await req.json()) as T
}
