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
