import { BankShare, LearnableWithId } from '../../../types_and_schemas/types'

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
  type
})

// Seed data for generating random banks
const bankTemplates = [
  {
    name: 'Business Presentation',
    collectionNames: ['Meeting Vocabulary', 'Financial Terms', 'All Business'],
    learnables: [
      {
        lexeme: 'quarterly report',
        translation: 'Quartalsbericht',
        type: 'phrase' as const,
        notes: 'Used in financial presentations'
      },
      {
        lexeme: 'stakeholder',
        translation: 'Interessenvertreter',
        type: 'word' as const
      },
      {
        lexeme: 'to schedule a meeting',
        translation: 'ein Treffen ansetzen',
        type: 'phrase' as const
      },
      { lexeme: 'agenda', translation: 'Tagesordnung', type: 'word' as const },
      { lexeme: 'deadline', translation: 'Frist', type: 'word' as const }
    ]
  },
  {
    name: 'Cafe',
    collectionNames: ['Ordering Food', 'Drinks'],
    learnables: [
      {
        lexeme: 'espresso',
        translation: 'Espresso',
        type: 'word' as const,
        notes: 'Strong coffee'
      },
      {
        lexeme: 'Can I have the menu?',
        translation: 'Kann ich die Speisekarte haben?',
        type: 'phrase' as const
      },
      { lexeme: 'croissant', translation: 'Croissant', type: 'word' as const },
      {
        lexeme: 'The bill, please',
        translation: 'Die Rechnung, bitte',
        type: 'phrase' as const
      }
    ]
  },
  {
    name: 'Light Conversation',
    collectionNames: ['Greetings', 'Small Talk', 'Getting to Know Someone'],
    learnables: [
      {
        lexeme: 'How are you?',
        translation: 'Wie geht es dir?',
        type: 'phrase' as const
      },
      { lexeme: 'weather', translation: 'Wetter', type: 'word' as const },
      {
        lexeme: 'What do you do for a living?',
        translation: 'Was machst du beruflich?',
        type: 'phrase' as const
      },
      { lexeme: 'hobby', translation: 'Hobby', type: 'word' as const },
      { lexeme: 'weekend', translation: 'Wochenende', type: 'word' as const },
      {
        lexeme: 'Nice to meet you',
        translation: 'Schön dich kennenzulernen',
        type: 'phrase' as const
      }
    ]
  },
  {
    name: 'Selling Stuff Online',
    collectionNames: [
      'Transaction Terms',
      'Product Inquiries',
      'Complete E-commerce'
    ],
    learnables: [
      { lexeme: 'shipping', translation: 'Versand', type: 'word' as const },
      {
        lexeme: 'Is this item still available?',
        translation: 'Ist dieser Artikel noch verfügbar?',
        type: 'phrase' as const
      },
      { lexeme: 'discount', translation: 'Rabatt', type: 'word' as const },
      {
        lexeme: 'payment method',
        translation: 'Zahlungsmethode',
        type: 'phrase' as const
      },
      {
        lexeme: 'refund',
        translation: 'Rückerstattung',
        type: 'word' as const
      },
      {
        lexeme: 'What is the condition?',
        translation: 'Wie ist der Zustand?',
        type: 'phrase' as const
      },
      { lexeme: 'brand new', translation: 'brandneu', type: 'phrase' as const }
    ]
  },
  {
    name: 'Talking to a Cute Dog',
    collectionNames: ['Dog Compliments', 'Dog Questions'],
    learnables: [
      {
        lexeme: 'What a cute dog!',
        translation: 'Was für ein süßer Hund!',
        type: 'phrase' as const
      },
      { lexeme: 'breed', translation: 'Rasse', type: 'word' as const },
      {
        lexeme: 'Can I pet your dog?',
        translation: 'Darf ich deinen Hund streicheln?',
        type: 'phrase' as const
      },
      {
        lexeme: 'How old is he/she?',
        translation: 'Wie alt ist er/sie?',
        type: 'phrase' as const
      },
      { lexeme: 'playful', translation: 'verspielt', type: 'word' as const }
    ]
  },
  {
    name: 'Travel Essentials',
    collectionNames: ['Airport', 'Hotel', 'Directions'],
    learnables: [
      {
        lexeme: 'Where is the gate?',
        translation: 'Wo ist das Gate?',
        type: 'phrase' as const
      },
      { lexeme: 'passport', translation: 'Reisepass', type: 'word' as const },
      {
        lexeme: 'I have a reservation',
        translation: 'Ich habe eine Reservierung',
        type: 'phrase' as const
      },
      { lexeme: 'luggage', translation: 'Gepäck', type: 'word' as const }
    ]
  },
  {
    name: 'Shopping',
    collectionNames: ['Clothing', 'Prices', 'Returns'],
    learnables: [
      {
        lexeme: 'How much does this cost?',
        translation: 'Wie viel kostet das?',
        type: 'phrase' as const
      },
      { lexeme: 'receipt', translation: 'Quittung', type: 'word' as const },
      {
        lexeme: 'Do you have this in a different size?',
        translation: 'Haben Sie das in einer anderen Größe?',
        type: 'phrase' as const
      },
      { lexeme: 'sale', translation: 'Ausverkauf', type: 'word' as const }
    ]
  },
  {
    name: 'Medical Vocabulary',
    collectionNames: ['Symptoms', 'Doctor Visit'],
    learnables: [
      {
        lexeme: 'I have a headache',
        translation: 'Ich habe Kopfschmerzen',
        type: 'phrase' as const
      },
      { lexeme: 'prescription', translation: 'Rezept', type: 'word' as const },
      { lexeme: 'pharmacy', translation: 'Apotheke', type: 'word' as const },
      {
        lexeme: 'I need to see a doctor',
        translation: 'Ich muss einen Arzt sehen',
        type: 'phrase' as const
      }
    ]
  }
]

// Helper function to create a collection
const createCollection = (name: string, cardIds: string[] = []) => ({
  id: crypto.randomUUID(),
  name,
  cardIds
})

// Helper to create language pair
const enDe = { speaking: 'English', learning: 'German' }

// Helper function to create a BankShare from template
const createBankShareFromTemplate = (
  template: (typeof bankTemplates)[number],
  index: number
): BankShare => {
  const learnables = template.learnables.map((l) =>
    createLearnable(l.lexeme, l.translation, l.type, l.notes ?? '')
  )
  const learnableIds = learnables.map((l) => l.id)
  const collections = template.collectionNames.map((name) =>
    createCollection(name, learnableIds)
  )

  // Generate dates based on index for variety
  const baseDate = new Date('2024-01-01')
  const created = new Date(
    baseDate.getTime() + index * 30 * 24 * 60 * 60 * 1000
  )
  const expires = new Date(created.getTime() + 2 * 365 * 24 * 60 * 60 * 1000)

  return {
    id: crypto.randomUUID(),
    created,
    expires,
    name: template.name,
    language: enDe,
    learnables,
    collections
  }
}

/**
 * Generate mock user banks
 * @param amount Number of banks to generate (cycles through templates if amount > templates)
 */
export const mockUserBanks = (amount = 2): BankShare[] => {
  return Array.from({ length: amount }, (_, i) => {
    const template = bankTemplates[i % bankTemplates.length]
    const suffix =
      i >= bankTemplates.length
        ? ` (${Math.floor(i / bankTemplates.length) + 1})`
        : ''
    return createBankShareFromTemplate(
      { ...template, name: template.name + suffix },
      i
    )
  })
}

/**
 * Generate mock online banks
 * @param amount Number of banks to generate (cycles through templates if amount > templates)
 */
export const mockOnlineBanks = (amount = 3): BankShare[] => {
  // Start from a different offset to get different banks than userBanks by default
  return Array.from({ length: amount }, (_, i) => {
    const offset = 3 // Start from template index 3
    const template = bankTemplates[(i + offset) % bankTemplates.length]
    const suffix =
      i >= bankTemplates.length
        ? ` (${Math.floor(i / bankTemplates.length) + 1})`
        : ''
    return createBankShareFromTemplate(
      { ...template, name: template.name + suffix },
      i + 100 // Different base index for different dates
    )
  })
}
