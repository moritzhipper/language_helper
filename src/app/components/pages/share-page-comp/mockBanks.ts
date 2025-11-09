import {
  BankExportOnline,
  LearnableWithId
} from '../../../types_and_schemas/types'

// Helper function to create a learnable
const createLearnable = (
  lexeme: string,
  translation: string,
  type: 'word' | 'phrase',
  notes = ''
): LearnableWithId => ({
  id: crypto.randomUUID(),
  lexeme,
  translation,
  notes,
  type,
  collectionIds: []
})

// Mock learnables for various scenarios
const businessLearnables: LearnableWithId[] = [
  createLearnable(
    'quarterly report',
    'Quartalsbericht',
    'phrase',
    'Used in financial presentations'
  ),
  createLearnable('stakeholder', 'Interessenvertreter', 'word'),
  createLearnable('to schedule a meeting', 'ein Treffen ansetzen', 'phrase'),
  createLearnable('agenda', 'Tagesordnung', 'word'),
  createLearnable('deadline', 'Frist', 'word')
]

const cafeLearnables: LearnableWithId[] = [
  createLearnable('espresso', 'Espresso', 'word', 'Strong coffee'),
  createLearnable(
    'Can I have the menu?',
    'Kann ich die Speisekarte haben?',
    'phrase'
  ),
  createLearnable('croissant', 'Croissant', 'word'),
  createLearnable('The bill, please', 'Die Rechnung, bitte', 'phrase')
]

const conversationLearnables: LearnableWithId[] = [
  createLearnable('How are you?', 'Wie geht es dir?', 'phrase'),
  createLearnable('weather', 'Wetter', 'word'),
  createLearnable(
    'What do you do for a living?',
    'Was machst du beruflich?',
    'phrase'
  ),
  createLearnable('hobby', 'Hobby', 'word'),
  createLearnable('weekend', 'Wochenende', 'word'),
  createLearnable('Nice to meet you', 'Schön dich kennenzulernen', 'phrase')
]

const onlineSellingLearnables: LearnableWithId[] = [
  createLearnable('shipping', 'Versand', 'word'),
  createLearnable(
    'Is this item still available?',
    'Ist dieser Artikel noch verfügbar?',
    'phrase'
  ),
  createLearnable('discount', 'Rabatt', 'word'),
  createLearnable('payment method', 'Zahlungsmethode', 'phrase'),
  createLearnable('refund', 'Rückerstattung', 'word'),
  createLearnable('What is the condition?', 'Wie ist der Zustand?', 'phrase'),
  createLearnable('brand new', 'brandneu', 'phrase')
]

const dogLearnables: LearnableWithId[] = [
  createLearnable('What a cute dog!', 'Was für ein süßer Hund!', 'phrase'),
  createLearnable('breed', 'Rasse', 'word'),
  createLearnable(
    'Can I pet your dog?',
    'Darf ich deinen Hund streicheln?',
    'phrase'
  ),
  createLearnable('How old is he/she?', 'Wie alt ist er/sie?', 'phrase'),
  createLearnable('playful', 'verspielt', 'word')
]

// Helper function to create a collection
const createCollection = (name: string) => ({
  id: crypto.randomUUID(),
  name
})

// Helper to create language pair
const enDe = { speaking: 'English', learning: 'German' }

// Helper function to create a BankExportOnline
const createBankExport = (
  name: string,
  learnables: LearnableWithId[],
  collectionNames: string[],
  created: Date,
  expires: Date
): BankExportOnline => ({
  id: crypto.randomUUID(),
  created,
  expires,
  name,
  bank: {
    language: enDe,
    learnables,
    collections: collectionNames.map(createCollection)
  }
})

export const mockUserBanks: BankExportOnline[] = [
  createBankExport(
    'Business Presentation',
    businessLearnables,
    ['Meeting Vocabulary', 'Financial Terms', 'All Business'],
    new Date('2024-01-15'),
    new Date('2026-01-15')
  ),
  createBankExport(
    'Cafe',
    cafeLearnables,
    ['Ordering Food'],
    new Date('2024-02-10'),
    new Date('2026-02-10')
  ),
  createBankExport(
    'Light Conversation',
    conversationLearnables,
    ['Greetings', 'Small Talk', 'Getting to Know Someone'],
    new Date('2024-03-20'),
    new Date('2026-03-20')
  )
]

export const mockOnlineBanks: BankExportOnline[] = [
  createBankExport(
    'Selling Stuff Online',
    onlineSellingLearnables,
    ['Transaction Terms', 'Product Inquiries', 'Complete E-commerce'],
    new Date('2024-04-15'),
    new Date('2026-04-15')
  ),
  createBankExport(
    'Talking to a Cute Dog',
    dogLearnables,
    ['Dog Compliments', 'Dog Questions'],
    new Date('2024-05-01'),
    new Date('2026-05-01')
  )
]
