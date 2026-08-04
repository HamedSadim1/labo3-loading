# Labo 3 - Loading App

Een moderne React-applicatie gebouwd met Vite, die een elegante loading-ervaring demonstreert met glassmorphism effecten. Dit project is ontwikkeld als onderdeel van het Webframeworks labo aan de AP Hogeschool.

## ✨ Features

- **Moderne UI**: Gebruikt Tailwind CSS voor styling met glassmorphism effecten (transparante achtergronden, blur-effecten en schaduwen).
- **Snelle Development**: Gebouwd met Vite voor razendsnelle hot module replacement en builds.
- **Responsive Design**: Werkt naadloos op desktop en mobiele apparaten.
- **TypeScript**: Volledig getypt voor betere ontwikkelaarervaring en foutpreventie.
- **Modulaire Structuur**: Georganiseerd volgens DRY-principes met gescheiden componenten, utilities en constants.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Loading Component**: React Loader Spinner

## 🚀 Installatie

1. **Clone de repository**:

   ```bash
   git clone https://github.com/HamedSadim1/labo3-loading.git
   cd labo3-loading
   ```

2. **Installeer dependencies**:

   ```bash
   npm install
   ```

3. **Start de development server**:

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in je browser.

## 📖 Gebruik

De app toont een centraal paneel met een "Start Loading" knop. Klik op de knop om een 3-seconden durende loading animatie te starten met een elegante spinner en glassmorphism styling.

## 📜 Scripts

- `npm run dev`: Start de development server
- `npm run build`: Bouw de app voor productie
- `npm run preview`: Preview de productie build lokaal
- `npm run lint`: Controleer de code met ESLint
- `npm run lint:fix`: Los ESLint-problemen automatisch op
- `npm run format`: Formatteer alle bestanden met Prettier
- `npm run format:check`: Controleer of alle bestanden geformatteerd zijn
- `npm run typecheck`: Controleer de TypeScript-types
- `npm run release`: Publiceer een nieuwe release met semantic-release

## 🛠️ Ontwikkeltools

- **ESLint**: Linting met TypeScript, React Hooks en React Refresh regels.
- **Prettier**: Automatische code formatting.
- **commitlint**: Valideert commit messages volgens Conventional Commits.
- **Husky + lint-staged**: Git hooks die linting en formatting draaien bij elke commit.
- **semantic-release**: Automatische versiebeheer en releases op basis van Conventional Commits. Vereist een `GITHUB_TOKEN` (of `GH_TOKEN`) environment variabele.

Commit messages volgen het [Conventional Commits](https://www.conventionalcommits.org/) formaat, bijvoorbeeld:

```bash
git commit -m "feat: add loading animation"
git commit -m "fix: correct spinner alignment"
git commit -m "chore: update dependencies"
```

## 🤖 CI/CD

De [GitHub Actions workflow](.github/workflows/ci.yml) draait bij elke push en pull request lint, typecheck en build (de `verify` job). Bij een merge naar `main` draait daarna automatisch semantic-release (de `release` job), die een changelog bijwerkt, een versie bepaalt en een GitHub Release aanmaakt — maar alleen als alle checks geslaagd zijn. Hiervoor heeft de workflow alleen het automatische `GITHUB_TOKEN` nodig; er zijn geen extra secrets vereist.

## 📁 Project Structuur

```text
src/
├── components/          # React componenten
│   ├── Background.tsx   # Achtergrond component
│   ├── GlassCard.tsx    # Glazen paneel component
│   ├── Header.tsx       # Titel component
│   └── Loading.tsx      # Loading logica en UI
├── constants/           # Constante waarden
│   └── app.ts           # App-specifieke constants
├── svg/                 # SVG assets
│   └── spinner.svg      # Voorbeeld spinner SVG
└── utils/               # Helper functies
    └── delay.ts         # Delay utility functie
```

## 🤝 Bijdragen

Dit is een educatief project voor het Webframeworks labo. Voor vragen of verbeteringen, neem contact op met de ontwikkelaar.

## 📄 Licentie

Dit project is eigendom van AP Hogeschool en bedoeld voor educatieve doeleinden.
