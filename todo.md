# ToDo

<<<<<<< HEAD
=======
- do angular workspace setup
>>>>>>> connect_api
- community shares
  - section trending: all languages
  - section for you: shares having your language
  - add see more for each section
  - show five top per section, then link to new page for more

- show 'wiggle' and info toast every x seconds when user doesnt interact for y seconds,
- swipes count in stats
- add html lang call to ai service, save it as option in language config.
- change blobcreation and download to happen on click, not in a reactive manner -> faster
  - implement in overview, share and settings

- unifiy type setup:
  - clean up overview page and facade thoroughly
  - store, export and import are wordbanks (types and stuff)
  - collection can have collections
  - collections can be stacked

- add merge learnables function to mutoators: when a lexeme exists, but the words dont match: update the translation to trans1 / trans2
- refactor bulkEdit mit add altest ids and mark them in overview facede and overview

- deploy via cloudflare pages, worker and upstash redis
- add load more cards on scroll / pagination?

- stats page:
  - has practice history -> you can see cards here, most held card and stuff

make settinggsstore simple service with update function and effect that writes to sessionstorage?

## Later

- link similar cards (multiple translations)
- how to handle sharing multiple selection
- stats page with collections, top and worst, most ppracticed, hardest words, progressgraph
- enter leave directive
- split create cards exactly like i split phrases
- erst mal alles bauen, dann capital yo
- collection ids on cards?
- fix openai + zod issue: remove helper function from utils
- print view
- implement protected and private corrrectly throughout

# sources

https://remixicon.com/icon/arrow-up-s-line

## Hosting

https://www.netcup.com/en/deals
hetzner

## Put in readme

whats an ai key

wenn quit early:
summarycard: nicht aufdeckbar, sobald gezogen immer aufgedeckt

- ersetze aktuellen array mit fake array. Das erlaubt das index weiterbewegen ohne dependency auf practice. dieser hat:
  - auf -1 letzte karte
  - auf 0 aktuelle karte
  - auf 1 summary
- lege aktuelle 0 karte weg ohne vote, sodass summary nach rueckt
- mit viwmodelIndex arbeiten?
