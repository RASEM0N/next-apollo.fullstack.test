export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
export const isServer = () => typeof window === 'undefined'
