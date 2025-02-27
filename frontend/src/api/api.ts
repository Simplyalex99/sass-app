export const fetchSignUp = async (data: unknown) => {
  const res = await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  const body = await res.json()
  return body
}
