# ToDo

- is preamturely if index is further than last guessed
  -> when index further than last guessed, current is lastguessed + 1,

- letzte verdeckende karte ist summarykarte
- add to collection after import doesnt work
- move cards animationstates to seperate file
- only show buttons on desktop
- sho 'wiggle' and info toast every x seconds when user doesnt interact for y seconds,
- only render the current cards?
- make the calss setting vars non signals

- unifiy type setup:
  - add change language mutator:
    -> checks if language combo exists, activates bank with that combo or creates new empty one
  - clean up overview page and facade thoroughly
  - store, export and import are wordbanks (types and stuff)
  - collection can have collections
  - collections can be stacked

- refactor and simpify ai service?

- settings: active bank
  - show languaghes in select
  - add create bank input, providing speaking learning inputs
- make export app config export complete store
- add merge learnables function to mutoators: when a lexeme exists, but the words dont match: update the translation to trans1 / trans2
- add language change option in settings and store
- refactor bulkEdit mit add altest ids and mark them in overview facede and overview

- unify share and import form
- greater: hello, this is how it works
- you can do this and that
- add your. language now
- allow selection of ttl: 5 min, 1 day, 1 month
- deploy via cloudflare pages, worker and upstash redis
- allow multiple languages
  - pairing, welches cards und collections enthaelt
- add load more cards on scroll / pagination?

make settinggsstore simple service with update function and effect that writes to sessionstorage?

## Later

- link similar cards (multiple translations)
- how to handle sharing multiple selection
- notes mode
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

- ersetze aktuellen array mit fake array. Das erlaubt das index weiterbewegen ohne dependency auf practice. dieser hat:
  - auf -1 letzte karte
  - auf 0 aktuelle karte
  - auf 1 summary
- lege aktuelle 0 karte weg ohne vote, sodass summary nach rueckt
