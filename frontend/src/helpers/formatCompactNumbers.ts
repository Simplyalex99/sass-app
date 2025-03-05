const compactNumberFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
})

export const formatCompactNumbers = (number: number) =>
  compactNumberFormatter.format(number)
