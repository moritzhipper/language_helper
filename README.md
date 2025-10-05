# Language Helper

## Store

- has array of learnables
  - Is never directly displayed to user, only through pseudo collections
- has collections
  - User created collections having, name, created date, etc...
  - has automatic pseudocollections
    - All cards
    - Cards not sorted into any collections

## Share Functionality

- A unique iq is assigned to the user on first load and then persisted in localStorage
- Shared Cards can not be unshared
- Recent shares of user are identified as follows
  - via user id
- Format / Type of shared cards is 'Bank'
- A 'Bank' can contain 0 to n Collections and Cards
