# Dark Mode Implementation Guide

## Übersicht

Der Dark Mode wurde mit einem React Context implementiert, der es ermöglicht, den Dark Mode Status global zu verwalten und für jede SCSS-Klasse separate `.darkMode` Stile zu definieren.

## Architektur

### 1. DarkModeContext (`src/contexts/DarkModeContext.tsx`)

```typescript
import { useDarkMode } from '../../contexts/DarkModeContext';

const { darkMode, toggleDarkMode } = useDarkMode();
```

- **darkMode**: Boolean-Wert für den aktuellen Dark Mode Status
- **toggleDarkMode**: Funktion zum Umschalten des Dark Mode
- Automatische Speicherung im localStorage
- Standardmäßig aktiviert (true)

### 2. App.tsx Integration

```typescript
const AppContent: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`${styles.app} ${darkMode ? styles.darkMode : ''}`}>
      <button onClick={toggleDarkMode}>
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      {/* ... */}
    </div>
  );
};
```

## Verwendung in Komponenten

### 1. Context importieren

```typescript
import { useDarkMode } from '../../contexts/DarkModeContext';
```

### 2. Dark Mode Status verwenden

```typescript
export const MyComponent: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
      {/* Komponenten-Inhalt */}
    </div>
  );
};
```

## SCSS Dark Mode Stile

### Grundstruktur

```scss
// Light Mode (Standard)
.myClass {
  background-color: #ffffff;
  color: #333333;
  transition: all 0.3s ease;
}

// Dark Mode
.darkMode .myClass {
  background-color: #2d2d2d;
  color: #ffffff;
}
```

### Best Practices

1. **Transition hinzufügen**: Für smooth Übergänge
```scss
.myClass {
  transition: all 0.3s ease;
}
```

2. **Konsistente Farben verwenden**:
   - Hintergrund: `#1a1a1a` (Haupt), `#2d2d2d` (Sekundär)
   - Text: `#ffffff` (Primär), `#cccccc` (Sekundär)
   - Akzent: `#ff6b00` (Orange)
   - Border: `#404040`

3. **Verschachtelte Selektoren**:
```scss
.darkMode {
  .container {
    background-color: #2d2d2d;
    
    .title {
      color: #ffffff;
    }
    
    .button {
      background-color: #ff6b00;
      
      &:hover {
        background-color: #e55a00;
      }
    }
  }
}
```

## Beispiel: Neue Komponente

### 1. TypeScript Komponente

```typescript
// src/components/MyComponent/MyComponent.tsx
import React from 'react';
import styles from './MyComponent.module.scss';
import { useDarkMode } from '../../contexts/DarkModeContext';

export const MyComponent: React.FC = () => {
  const { darkMode } = useDarkMode();

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
      <h2 className={styles.title}>Mein Titel</h2>
      <p className={styles.description}>Meine Beschreibung</p>
      <button className={styles.button}>Mein Button</button>
    </div>
  );
};
```

### 2. SCSS Stile

```scss
// src/components/MyComponent/MyComponent.module.scss
@use '../../styles/variables' as *;

.container {
  padding: $spacing-lg;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: $shadow-md;
  transition: all 0.3s ease;
}

.title {
  color: #333333;
  font-size: $font-size-2xl;
  margin-bottom: $spacing-md;
  transition: color 0.3s ease;
}

.description {
  color: #666666;
  line-height: 1.6;
  margin-bottom: $spacing-lg;
  transition: color 0.3s ease;
}

.button {
  background-color: $primary-orange;
  color: #ffffff;
  border: none;
  padding: $spacing-sm $spacing-lg;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: darken($primary-orange, 10%);
    transform: translateY(-1px);
  }
}

// Dark Mode Stile
.darkMode {
  .container {
    background-color: #2d2d2d;
    border: 1px solid #404040;
  }

  .title {
    color: #ffffff;
  }

  .description {
    color: #cccccc;
  }

  .button {
    background-color: #ff6b00;

    &:hover {
      background-color: #e55a00;
    }
  }
}
```

## Globale Dark Mode Stile

### index.scss

Globale Stile für alle Elemente:

```scss
// Dark Mode Styles
.darkMode {
  background-color: #1a1a1a;
  color: #ffffff;
  
  // CSS-Variablen
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --border-color: #404040;
}

// Spezifische Elemente
.darkMode input {
  background-color: #2d2d2d;
  border-color: #404040;
  color: #ffffff;
}

.darkMode a {
  color: #ff6b00;
}
```

## Tipps

1. **Konsistente Übergänge**: Verwende `transition: all 0.3s ease` für smooth Übergänge
2. **Kontrast beachten**: Stelle sicher, dass Text gut lesbar ist
3. **Testen**: Teste beide Modi auf verschiedenen Bildschirmgrößen
4. **Performance**: Vermeide zu viele verschachtelte Selektoren
5. **Accessibility**: Stelle sicher, dass Farbkontraste WCAG-konform sind

## Troubleshooting

### Dark Mode funktioniert nicht
- Prüfe, ob `useDarkMode()` korrekt importiert ist
- Stelle sicher, dass die Komponente im `DarkModeProvider` eingeschlossen ist
- Prüfe die Browser-Konsole auf Fehler

### Stile werden nicht angewendet
- Prüfe die CSS-Spezifität der Selektoren
- Stelle sicher, dass `.darkMode` vor der Klasse steht
- Prüfe, ob die SCSS-Datei korrekt kompiliert wird
