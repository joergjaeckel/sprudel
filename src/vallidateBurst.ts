export type Burst = {
  count: number
  cycleCount: number
  repeatInterval: number
  time: number
}

export type RuntimeBurst = Burst & {
  cycle: number
}

export const defaultBurst = {
  count: 10,
  cycleCount: -1,
  repeatInterval: 1,
  time: 0,

  /* Internal */
  cycle: 0,
}

export const validateBurst = (burst: Burst): RuntimeBurst => {
  return Object.assign({}, defaultBurst, burst)
}
