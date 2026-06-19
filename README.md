# FieldNotes 📝📍

A small offline-first journal app for React Native (Expo). Capture short field notes,
attach a photo from your **camera or gallery**, and tag each note with your **current
GPS location**. Everything is stored on the device, so the app works fully offline, and
an optional **PIN lock** keeps your notes private.

> Built for the *Mobile Programming Languages* laboratory. Targets **Expo SDK 56**
> (React Native 0.85, React 19.2) and runs in **Expo Go** or via **EAS Build**.

---

## Screenshots

|<img width="268" height="474" alt="image" src="https://github.com/user-attachments/assets/54120580-9269-495a-a3f5-6ac1848a869a" />
| |<img width="269" height="475" alt="image" src="https://github.com/user-attachments/assets/fd1a8ae6-2e15-4b6c-ad4a-4d27318f4706" />
|

| <img width="288" height="470" alt="image" src="https://github.com/user-attachments/assets/98f64dd8-b048-4fed-a1f6-600550e726cd" />
 |
| <img width="532" height="942" alt="image" src="https://github.com/user-attachments/assets/bc847c37-77a1-4a7d-a728-5efa39414f2d" />
  | <img width="250" height="459" alt="image" src="https://github.com/user-attachments/assets/fe513e0d-5d3b-403f-9ef2-159df2ed7b77" />
 | <img width="271" height="455" alt="image" src="https://github.com/user-attachments/assets/3ed5f869-db35-4cf1-9ef2-9ddcc4a1ebb8" />
 | <img width="244" height="452" alt="image" src="https://github.com/user-attachments/assets/28916202-6935-4fa2-950d-634b8e85ce78" />
 |

---

## Features

- Create, view and delete journal entries (title, note, photo, location)
- Take a photo with the **camera** or pick one from the **gallery**
- Attach the device's **current location** (with reverse-geocoded address)
- Works **offline** — entries persist locally and load with no connection
- Offline banner driven by live connectivity status
- Optional **app lock** with a 4-digit PIN stored securely
- Subtle **haptic feedback** on key actions (save, delete, errors)
- Loading / empty / error states for every async operation

---

## Tech stack

- **React Native** + **Expo** (SDK 56), **TypeScript** (strict)
- **Expo Router** — file-based navigation (stack + tabs + modal)
- **Context API + useReducer** — global state
- Native modules: `expo-image-picker`, `expo-location`, `expo-secure-store`,
  `expo-haptics`, `@react-native-async-storage/async-storage`,
  `@react-native-community/netinfo`
- **Jest** + **React Native Testing Library** — unit & component tests
- **ESLint** (`eslint-config-expo`) + **Prettier**

---

## Getting started

> Requires Node.js 18+ and the Expo tooling. A classmate should be able to clone and
> run this in a few minutes.

```bash
# 1. Install JS dependencies
npm install

# 2. Align native module versions to the installed Expo SDK (recommended)
npx expo install --fix

# 3. Start the dev server
npx expo start
```

Then scan the QR code with **Expo Go**, or press `a` (Android emulator) / `i` (iOS
simulator). Grant the camera and location permissions when prompted.

### Run the tests

```bash
npm test
```

### Lint & format

```bash
npm run lint
npm run format
```

---

## Project structure

```
fieldnotes/
├─ app/                      # Expo Router screens (the "container" layer)
│  ├─ _layout.tsx            # Providers, ErrorBoundary, lock gate, root Stack
│  ├─ new.tsx                # New-entry form (modal)
│  ├─ entry/[id].tsx         # Entry detail (route param)
│  └─ (tabs)/                # Bottom tabs
│     ├─ _layout.tsx         # Tabs navigator + offline banner
│     ├─ index.tsx           # Entries list (FlatList)
│     └─ settings.tsx        # App lock + clear data
├─ src/
│  ├─ components/            # Reusable presentational components
│  ├─ constants/             # theme.ts + config constants
│  ├─ context/               # EntriesContext, SettingsContext, pure reducer
│  ├─ hooks/                 # useEntries, useSettings, useConnectivity
│  ├─ services/              # storage, secureStore, location, media, haptics
│  ├─ types/                 # shared TypeScript types
│  └─ utils/                 # formatDate, validation, id (pure, unit-tested)
└─ assets/                   # icon, adaptive icon, splash
```

---

## Architecture & key decisions

**Pattern:** Context API + `useReducer` with a presentational/container split.

- **Why Context, not Redux?** The app has a single primary entity (entries) and
  modest global state. Context + a pure reducer gives predictable, easily testable
  state transitions with zero extra dependencies. Redux Toolkit would be the right
  call for a larger app with many slices.
- **Containers vs. presentational:** the files under `app/` own data and navigation;
  the components under `src/components/` are presentational and reused across screens.
- **Services layer:** all side effects (storage, secure storage, GPS, camera) live in
  `src/services/`, so screens stay declarative and the side effects are easy to mock.
- The reducer in `src/context/entriesReducer.ts` is intentionally **pure** — that is
  what makes the state logic straightforward to unit test.

---

## How the grading criteria are addressed

| # | Criteria | Where |
| --- | --- | --- |
| 1 | Architecture | Context + reducer, container/presentational split, services layer |
| 2 | Screen sizes / orientation | Flexbox, `%`, `useWindowDimensions`, safe-area insets — no hardcoded container widths |
| 3 | Code quality | ESLint + Prettier, typed strictly, small components, clear naming |
| 4 | Tests | 19 tests (utils, reducer, components) — `npm test` |
| 5 | Documentation | This README + comments explaining *why* |
| 6 | Native features | Camera/gallery, GPS location, SecureStore, haptics |
| 7 | Async operations | `async/await` everywhere with loading/success/error states |
| 8 | Navigation | Expo Router: tabs + stack + modal, route params on detail screen |
| 9 | Performance | `FlatList` with `keyExtractor`, `React.memo` rows, `useMemo`/`useCallback` |
| 10 | Style & UI/UX | Central `theme.ts`, consistent spacing, press feedback |
| 11 | State management | `EntriesContext` / `SettingsContext` (justified above) |
| 12 | Error handling | try/catch + user-friendly messages, `ErrorBoundary`, NetInfo |
| 13 | Offline mode | AsyncStorage cache; entries load and persist with no network |
| 14 | Security | PIN in SecureStore, input validation, no secrets in the repo, HTTPS-only (no plain-text creds) |
| 15 | Deployment | `app.json` configured (icon, splash, ids), EAS `preview` profile below |

---

## Security notes

- The optional app-lock PIN is stored with **`expo-secure-store`** (Keychain / Keystore),
  never in AsyncStorage.
- The app ships **no API keys or secrets**; `.env` is git-ignored as a matter of habit.
- All text input is validated before it is saved (`src/utils/validation.ts`).

---

## Building with EAS

```bash
# one-time
npm install -g eas-cli      # or use npx eas-cli
eas login
eas build:configure

# build an installable Android APK (preview profile in eas.json)
eas build --platform android --profile preview
```

EAS returns a download link for the `.apk`; install it on an Android device to run the
production-style build.

---

## Tests
<img width="975" height="511" alt="image" src="https://github.com/user-attachments/assets/6dadfc00-3665-4fa7-9fb5-c10923ad85ce" />
<img width="964" height="217" alt="image" src="https://github.com/user-attachments/assets/7031f4f7-e4ae-477d-ace2-2aad0e3a58ef" />



