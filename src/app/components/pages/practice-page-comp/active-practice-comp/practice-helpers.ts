import { Practice, UserLearnable } from '../../../../types_and_schemas/types'
import { ActivePracticeSummary } from './practice-stats-bar-comp/practice-stats-bar-comp'

// do this
// then add classes to parent
// make summary always focused
// get rid of index completely,j ust add finished early condition?
export type CardViewModel = {
  content: UserLearnable | ActivePracticeSummary
  viewIndex: number
}

export const getCardsViewModel = (
  practice: Practice,
  cards: UserLearnable[]
): CardViewModel[] => {
  const currentIndex = practice.index
  const lastGuessIndex = practice.guessables.findLastIndex(
    (g) => g.guessed !== 'unanswered'
  )
  const isFinishedEarly = currentIndex !== lastGuessIndex + 1

  if (isFinishedEarly) {
    return getVMforFinishedEarly(lastGuessIndex, cards, practice)
  } else {
    return getVM(currentIndex, cards, practice)
  }
}

// add function that returns array of CardViewModel Items
// cards view model view has four positions: previous, current, next, hidden
// currrent is the one to guess or focus one

const getVM = (
  focusIndex: number,
  cards: UserLearnable[],
  practice: Practice
): CardViewModel[] => {
  const indexes = [-1, 0, 1, 2]
  return indexes.reduce<CardViewModel[]>((vms, relIndex) => {
    const cardIndex = focusIndex + relIndex
    if (cardIndex >= 0 && cardIndex < cards.length) {
      vms.push({
        content: cards[cardIndex],
        viewIndex: relIndex
      })
    } else if (cardIndex === cards.length) {
      // finished card
      vms.push({ content: createSummary(practice), viewIndex: relIndex })
    }

    return vms
  }, [])
}
const getVMforFinishedEarly = (
  focusIndex: number,
  cards: UserLearnable[],
  practice: Practice
): CardViewModel[] => {
  const index = Math.max(0, focusIndex)
  return [
    { content: cards[index], viewIndex: -1 },
    { content: createSummary(practice), viewIndex: 0 }
  ]
}

const createSummary = (practice: Practice): ActivePracticeSummary => {
  return {
    correctGuesses: 0,
    guessesDone: 0,
    guessesLeft: 0,
    progressPercent: 0
  }
}
