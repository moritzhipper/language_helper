# ToDo

## Right Now

- add config file, add: suffix, exportfile name
- add favicon
- show popup after import
- add collection selector in practice view
- add notes function in learning view

- form width auf desktop min width setzen

remove collection mentions on remove -> just iterate through all collections and remove cardids of not exisitng cards? use bridge table?

## Later

- linked signal anstatt getExportable store method?
- unify naming of components (.comp vs -comp)
- rename FIleImportService back to Blobservice
- fix place where import export methods are put: some in store, some in utils, some in components
  sned toasts after succesfull import
- allow in practice view:
  - selection of collection OR all cards with max amount of cards (use slider)
- empty states

- refactor forms handling to allow escape to cancel
- import cards functionality (using zod as validation)
  - export and import not only exports the cards, but also a collection having all of the card ids
  - request name of collection on export
- prohibit scroll on open modal
- close navbar after selection of link

- save practices history
  - "spaced repetition"
  - show last practice times in collection view
  - also show stats like in practice comp

# sources

https://remixicon.com/icon/arrow-up-s-line

## Put in readme

whats an ai kez
what does the confidence level mean
what do the dots mean
relationship between collections and all cards
