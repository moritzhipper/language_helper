# ToDo

## Right Now

- allow imprt in cards view to show imported cards
  - use import function of store
  - linked signal anstatt getExportable store method?
  - build import form in bubbles

- form width auf desktop min width setzen
- build import and export mapping
  - remove guesses and created date
  - somehow communicate name of collection
  - implement file parse methods from utils in blob service

- add notes function in learning view

remove collection mentions on remove -> just iterate through all collections and remove cardids of not exisitng cards? use bridge table?

## Later

- rename FIleImportService back to Blobservice
- fix place where import export methods are put: some in store, some in utils, some in components
  sned toasts after succesfull import
- allow in practice view:
  - selection of collection OR all cards with max amount of cards (use slider)
- "spaced repetition"

- refactor forms handling to allow escape to cancel
- import cards functionality (using zod as validation)
  - export and import not only exports the cards, but also a collection having all of the card ids
  - request name of collection on export

- save practices history
  - also show stats like in practice comp

# sources

https://remixicon.com/icon/arrow-up-s-line

## Put in readme

whats an ai kez
what does the confidence level mean
what do the dots mean
relationship between collections and all cards
