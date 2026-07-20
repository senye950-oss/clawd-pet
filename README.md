# Clawd 🦀

A tiny pixel art desktop pet for web pages. Zero dependencies, ~5KB.

Clawd is a draggable, pokeable, state-aware pixel creature that lives in the corner of your page.

## Features

- **Three states**: idle (sleeping), busy (typing on laptop), offline (greyed out)
- **Draggable**: drag anywhere, tuck into screen edges (peeks out at 22°)
- **Pokeable**: tap for random lines, poke 3+ times for spam reactions, 6% rare easter eggs
- **Night mode**: different lines after 23:00
- **Mini terminal**: shows animated code lines and rotating status text when busy
- **Customizable**: colors, dialogue lines, busy phrases, callbacks
- **Remembers position**: saves drag position to localStorage
- **Mobile friendly**: touch support, pointer events

## Quick Start

```html
<script src="clawd.js"></script>
<script>
  var pet = new Clawd().mount()
</script>
```

That's it. A pixel pet appears in the bottom-right corner of your page.

## Connect to Your AI

```js
var pet = new Clawd({
  busyPhrases: ['$ thinking...', '$ writing...']
}).mount()

// When your AI starts responding:
pet.busy()

// When it finishes:
pet.idle()

// If connection drops:
pet.offline()

// Make it say something:
pet.say('Hello!', 3000)  // disappears after 3s
```

## Customize Lines

```js
var pet = new Clawd({
  lines: {
    poke:  ['hey!', 'boop', 'hi there'],
    night: ['sleepy?', 'zzz'],
    busy:  ['working...', 'one sec'],
    spam:  ['stop it!', 'ok ok ok'],
    rare:  ['<3', 'secret line!']   // 6% chance
  }
}).mount()
```

## Customize Colors

```js
var pet = new Clawd({
  colors: {
    body: '#D97757',        // main body color
    eyes: '#1F1512',        // eye color
    bubbleBg: 'rgba(20,25,40,0.92)',
    bubbleText: '#fff',
    termBg: '#1a1d24',      // mini terminal background
    termText: '#7ee787'     // terminal text color
  }
}).mount()
```

## API

### Constructor

```js
new Clawd(options)
```

| Option | Type | Description |
|--------|------|-------------|
| `lines` | `object` | Dialogue lines per category: `poke`, `night`, `busy`, `spam`, `rare` |
| `colors` | `object` | Color overrides (see above) |
| `busyPhrases` | `string[]` | Rotating status text shown in mini terminal |
| `onStateChange` | `function(state)` | Called when state changes |
| `onPoke` | `function(line, streak)` | Called when pet is poked |

### Methods

| Method | Description |
|--------|-------------|
| `.mount(container?)` | Add to DOM (defaults to `document.body`) |
| `.busy()` | Switch to busy state (typing animation) |
| `.idle()` | Switch to idle state (sleeping) |
| `.offline()` | Switch to offline state (greyed out) |
| `.say(text, ms?)` | Show speech bubble (default 3000ms, pass 0 for permanent) |
| `.setLines(lines)` | Update dialogue lines |
| `.destroy()` | Remove from DOM |

### Interaction

- **Click/tap**: poke → random line from pool
- **Drag**: move anywhere on screen
- **Edge snap**: drag to screen edge → tucks in and peeks out
- **Rapid poke** (3+ within 4s): triggers `spam` pool
- **Night** (23:00–05:00): mixes `night` + `poke` pools
- **Rare** (6% chance): triggers `rare` pool

## License

MIT
