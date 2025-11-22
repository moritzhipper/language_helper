export type SwipeProgress = {
  xRNorm: number
  xLNorm: number
  xDelta: number
  guessRight: boolean
  guessWrong: boolean
}

export const voteThreshold = 250
export const indicatorActivationThreshold = 50

export const getSwipeProgress = (progressPx: number): SwipeProgress => {
  return {
    xDelta: progressPx,
    xRNorm: normalize(progressPx, voteThreshold),
    xLNorm: normalize(progressPx, -voteThreshold),
    guessRight: progressPx > voteThreshold,
    guessWrong: progressPx < -voteThreshold
  }
}

/**
 *
 * Returns value between (0 and 1)
 *
 * @param val input
 * @param ceil max / min ceiling
 * @returns
 */
const normalize = (val: number, ceil: number) => {
  return Math.max(0, Math.min(val / ceil, 1))
}
