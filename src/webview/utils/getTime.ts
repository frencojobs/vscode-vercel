export function getTime(d: number) {
  const date = new Date(d)
  return `${date.toLocaleTimeString('en-GB')}.${date.getMilliseconds()}`
}
