# ToDo

## Right Now

- remove sizes from all forms
- form width auf desktop min width setzen -> use the page wrapper logic?
- edit card from practice mode
- check overview and collections for unused things

## Later

- refactor forms handling to allow escape to cancel
- prohibit scroll on open modal
- theme toggle

- animations! -> angular 20.2 bring them back woop woop
- save practices history
  - "spaced repetition"
  - show last practice times in collection view
  - also show stats like in practice comp

### Suche

- Sucht nur nach **Lexemen**

### Practice-Flow

- **Editieren** direkt aus der Practice heraus:
  - **Rechter Button**: erstellt eine Note
  - **Linker Button**: beendet die Practice

### Note

- Einfaches kleines Textfeld

### Desktop-Design

- **Überschrift**: zentriert, sehr groß
- **Icon**:
  - Groß, leicht hinter der Überschrift
  - Oben links positioniert
  - Im `LageWrapper` als `Icon` definieren
  - Optional: `outline`-Modus fürs Icon

### Modals

- **Form Handling**:
  - Form bekommt nur den **Wrapper** als `reference`
  - Der Wrapper übernimmt `submit` und `cancel`

### Page Wrapper vs. Modal

- Unterschiedlich behandelt
- **Reusable Modal-Komponente**:
  - Props:
    - `Überschrift`
    - `Content`
    - `Label Confirm`
  - Layout:
    - Desktop: feste Größe
    - Mobile: volle Breite/Höhe

# sources

https://remixicon.com/icon/arrow-up-s-line

## Put in readme

words are filtered before and after ebcause of translation and token reduction
phrases are not
whats an ai key
what does the confidence level mean
what do the dots mean
relationship between collections and all cards
