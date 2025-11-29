import { Practice, UserLearnable } from '../../../../types_and_schemas/types'
import {
  ActivePracticeSummary,
  PracticeRating
} from './practice-summary-card/practice-summary-card'

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

  // assumes finished early because current index is not last guess index + 1
  if (currentIndex !== lastGuessIndex + 1) {
    return getVMforFinishedEarly(lastGuessIndex, cards, practice)
  } else {
    return getVM(currentIndex, cards, practice)
  }
}

/**
 * Return array of maximum four CardViewModel items, because four cards are accountet for and animated in view.
 * last guessed, current to guess, next guessable, and the one after that.
 *
 * When no next cards are available, summary card is added to the guess queue
 */
const getVM = (
  focusIndex: number,
  cards: UserLearnable[],
  practice: Practice
): CardViewModel[] => {
  const indexes = [-1, 0, 1, 2]
  return indexes.reduce<CardViewModel[]>((vms, relIndex) => {
    const cardIndex = focusIndex + relIndex
    if (cardIndex >= 0 && cardIndex < practice.guessables.length) {
      vms.push({
        content: cards[cardIndex],
        viewIndex: relIndex
      })
    } else if (cardIndex === practice.guessables.length) {
      // finished card
      vms.push({ content: createSummary(practice), viewIndex: relIndex })
    }

    return vms
  }, [])
}

/**
 * Animates all active cards to the guessed stack (viewIndex -1) when practice finishes early
 * and adds summary card to focused position
 *
 * @returns viewmodel for finished early practice
 */
const getVMforFinishedEarly = (
  focusIndex: number,
  cards: UserLearnable[],
  practice: Practice
): CardViewModel[] => {
  // when no guess was done, focusindex can be -1, so ensure at least 0
  const index = Math.max(0, focusIndex)
  const currentCard = cards[index]
  const nextCard = cards[index + 1]

  const viewModel: CardViewModel[] = [
    { content: currentCard, viewIndex: -1 },
    { content: createSummary(practice), viewIndex: 0 }
  ]

  // when practice was started with only one card, there is no next card to put away
  if (!nextCard) return viewModel
  return viewModel.concat([{ content: nextCard, viewIndex: -1 }])
}

const createSummary = (practice: Practice): ActivePracticeSummary => {
  const correctGuesses = practice.guessables.filter(
    (g) => g.guessed === 'right'
  ).length
  const wrongGuesses = practice.guessables.filter(
    (g) => g.guessed === 'wrong'
  ).length
  const unansweredGuesses = practice.guessables.filter(
    (g) => g.guessed === 'unanswered'
  ).length

  const guessesDone = correctGuesses + wrongGuesses
  const guessedRightPercent =
    guessesDone === 0
      ? 0
      : Math.round((correctGuesses / practice.guessables.length) * 100)

  return {
    correctGuesses,
    wrongGuesses,
    unansweredGuesses,
    guessedRightPercent,

    rating: getRating(guessedRightPercent)
  }
}

const getRating = (guessedRightPercent: number): PracticeRating => {
  if (guessedRightPercent === 100) return 'excellent'
  if (guessedRightPercent >= 80) return 'good'
  if (guessedRightPercent >= 50) return 'okay'
  if (guessedRightPercent >= 20) return 'atleast'
  return 'noteven'
}
