import { BankBase, LearnableWithId } from '../../../types_and_schemas/types'

// Mock learnables for various scenarios
const businessLearnables: LearnableWithId[] = [
  {
    id: crypto.randomUUID(),
    lexeme: 'quarterly report',
    translation: 'Quartalsbericht',
    notes: 'Used in financial presentations',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'stakeholder',
    translation: 'Interessenvertreter',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'to schedule a meeting',
    translation: 'ein Treffen ansetzen',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'agenda',
    translation: 'Tagesordnung',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'deadline',
    translation: 'Frist',
    notes: '',
    type: 'word'
  }
]

const cafeLearnables: LearnableWithId[] = [
  {
    id: crypto.randomUUID(),
    lexeme: 'espresso',
    translation: 'Espresso',
    notes: 'Strong coffee',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'Can I have the menu?',
    translation: 'Kann ich die Speisekarte haben?',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'croissant',
    translation: 'Croissant',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'The bill, please',
    translation: 'Die Rechnung, bitte',
    notes: '',
    type: 'phrase'
  }
]

const conversationLearnables: LearnableWithId[] = [
  {
    id: crypto.randomUUID(),
    lexeme: 'How are you?',
    translation: 'Wie geht es dir?',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'weather',
    translation: 'Wetter',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'What do you do for a living?',
    translation: 'Was machst du beruflich?',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'hobby',
    translation: 'Hobby',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'weekend',
    translation: 'Wochenende',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'Nice to meet you',
    translation: 'Schön dich kennenzulernen',
    notes: '',
    type: 'phrase'
  }
]

const onlineSellingLearnables: LearnableWithId[] = [
  {
    id: crypto.randomUUID(),
    lexeme: 'shipping',
    translation: 'Versand',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'Is this item still available?',
    translation: 'Ist dieser Artikel noch verfügbar?',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'discount',
    translation: 'Rabatt',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'payment method',
    translation: 'Zahlungsmethode',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'refund',
    translation: 'Rückerstattung',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'What is the condition?',
    translation: 'Wie ist der Zustand?',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'brand new',
    translation: 'brandneu',
    notes: '',
    type: 'phrase'
  }
]

const dogLearnables: LearnableWithId[] = [
  {
    id: crypto.randomUUID(),
    lexeme: 'What a cute dog!',
    translation: 'Was für ein süßer Hund!',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'breed',
    translation: 'Rasse',
    notes: '',
    type: 'word'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'Can I pet your dog?',
    translation: 'Darf ich deinen Hund streicheln?',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'How old is he/she?',
    translation: 'Wie alt ist er/sie?',
    notes: '',
    type: 'phrase'
  },
  {
    id: crypto.randomUUID(),
    lexeme: 'playful',
    translation: 'verspielt',
    notes: '',
    type: 'word'
  }
]

export const mockUserBanks: BankBase[] = [
  {
    name: 'Business Presentation',
    learnables: businessLearnables,
    collections: [
      {
        name: 'Meeting Vocabulary',
        learnableIDs: [businessLearnables[2].id, businessLearnables[3].id]
      },
      {
        name: 'Financial Terms',
        learnableIDs: [businessLearnables[0].id, businessLearnables[1].id]
      },
      {
        name: 'All Business',
        learnableIDs: businessLearnables.map((l) => l.id)
      }
    ]
  },
  {
    name: 'Cafe',
    learnables: cafeLearnables,
    collections: [
      {
        name: 'Ordering Food',
        learnableIDs: [cafeLearnables[1].id, cafeLearnables[3].id]
      }
    ]
  },
  {
    name: 'Light Conversation',
    learnables: conversationLearnables,
    collections: [
      {
        name: 'Greetings',
        learnableIDs: [
          conversationLearnables[0].id,
          conversationLearnables[5].id
        ]
      },
      {
        name: 'Small Talk',
        learnableIDs: [
          conversationLearnables[1].id,
          conversationLearnables[3].id,
          conversationLearnables[4].id
        ]
      },
      {
        name: 'Getting to Know Someone',
        learnableIDs: [
          conversationLearnables[2].id,
          conversationLearnables[3].id,
          conversationLearnables[5].id
        ]
      }
    ]
  }
]

export const mockOnlineBanks: BankBase[] = [
  {
    name: 'Selling Stuff Online',
    learnables: onlineSellingLearnables,
    collections: [
      {
        name: 'Transaction Terms',
        learnableIDs: [
          onlineSellingLearnables[0].id,
          onlineSellingLearnables[3].id,
          onlineSellingLearnables[4].id
        ]
      },
      {
        name: 'Product Inquiries',
        learnableIDs: [
          onlineSellingLearnables[1].id,
          onlineSellingLearnables[5].id,
          onlineSellingLearnables[6].id
        ]
      },
      {
        name: 'Complete E-commerce',
        learnableIDs: onlineSellingLearnables.map((l) => l.id)
      }
    ]
  },
  {
    name: 'Talking to a Cute Dog',
    learnables: dogLearnables,
    collections: [
      {
        name: 'Dog Compliments',
        learnableIDs: [dogLearnables[0].id, dogLearnables[4].id]
      },
      {
        name: 'Dog Questions',
        learnableIDs: [
          dogLearnables[1].id,
          dogLearnables[2].id,
          dogLearnables[3].id
        ]
      }
    ]
  }
]
