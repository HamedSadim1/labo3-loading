# Pull Request

## 📋 Samenvatting

Deze PR voegt code quality tools toe en werkt de development dependencies bij om de codebase te verbeteren en de CI pipeline uit te breiden.

## 🔧 Wijzigingen

### Nieuwe Tools

| Tool                          | Beschrijving                          | Configuratie                             |
| ----------------------------- | ------------------------------------- | ---------------------------------------- |
| **cspell**                    | Spellcheck voor code en documentatie  | `cspell.json` met Nederlandse dictionary |
| **knip**                      | Detectie van ongebruikte code         | `knip.json`                              |
| **commitizen**                | Conventional commits interface        | Geïntegreerd met commitlint              |
| **@commitlint/cz-commitlint** | Commitlint integratie voor commitizen | Configuratie in package.json             |

### Configuratie Bestanden

- ✨ **`.editorconfig`** - Consistente code opmaak across editors
- 🔤 **`cspell.json`** - Spellcheck configuratie met NL dictionary
- 🗑️ **`knip.json`** - Unused code detectie configuratie

### Husky Hooks

- 📝 **`commit-msg`** - Valideert commit berichten met commitlint
- 🎨 **`pre-commit`** - Voert lint-staged uit (eslint + prettier)
- 🚀 **`pre-push`** - Voert typecheck en build uit

### CI Pipeline

Nieuwe stappen toegevoegd aan `.github/workflows/ci.yml`:

- 🔤 **Spellcheck** - Controleert op spelfouten
- 🗑️ **Unused code check** - Detecteert ongebruikte code

## 📦 Nieuwe Dependencies

### Development Dependencies

```json
{
  "@commitlint/cz-commitlint": "^21.2.0",
  "@cspell/dict-nl-nl": "^2.4.2",
  "commitizen": "^4.3.2",
  "cspell": "^10.0.1",
  "knip": "^6.31.0"
}
```

## 🔄 Workflow

### Nieuwe Scripts

| Script               | Beschrijving                              |
| -------------------- | ----------------------------------------- |
| `npm run commit`     | Open commitizen voor conventional commits |
| `npm run spellcheck` | Voer spellcheck uit op alle bestanden     |
| `npm run knip`       | Controleer op ongebruikte code            |

### Automatische Checks

Bij elke commit worden automatisch uitgevoerd:

1. **Pre-commit**: ESLint + Prettier op staged bestanden
2. **Commit-msg**: Commitlint validatie
3. **Pre-push**: Typecheck + Build

## ✅ Checklist

- [x] cspell configuratie met Nederlandse dictionary
- [x] knip configuratie voor unused code detectie
- [x] Husky hooks geconfigureerd
- [x] CI pipeline uitgebreid
- [x] Documentatie bijgewerkt
- [x] Alle tests geslaagd

## 🧪 Testen

```bash
# Spellcheck
npm run spellcheck

# Unused code check
npm run knip

# Lint
npm run lint

# Typecheck
npm run typecheck

# Build
npm run build
```

## 📝 Notities

- De Nederlandse dictionary (`@cspell/dict-nl-nl`) is geconfigureerd voor spellcheck
- `knip.json` ignoreert dependencies die automatisch worden geladen
- Alle hooks werken samen om code kwaliteit te waarborgen

---

**Gerelateerde Issues**: N/A
