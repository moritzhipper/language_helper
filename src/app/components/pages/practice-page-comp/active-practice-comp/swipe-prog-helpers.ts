export type SwipeProgress = {
  xNorm: number
  xDelta: number
  guessRight: boolean
  guessWrong: boolean
}

export const voteThreshold = 150
export const indicatorActivationThreshold = 50

export const getSwipeProgress = (progressPx: number): SwipeProgress => {
  return {
    xDelta: progressPx,
    xNorm: normalize(progressPx, voteThreshold),
    guessRight: progressPx > voteThreshold,
    guessWrong: progressPx < -voteThreshold
  }
}

/**
 *
 * Returns value between (-1 and 1)
 * Negative val returns value between -1 and 0
 * Positive val returns value between 0 and 1
 *
 * @param val input
 * @param ceil max / min ceiling
 * @returns
 */
const normalize = (val: number, ceil: number) => {
  return Math.max(-1, Math.min(val / ceil, 1))
}
