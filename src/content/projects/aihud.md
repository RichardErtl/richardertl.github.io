---
name: AIHUD
tagline: See what matters while AI writes the code
summary: A narrow live display for Claude Code, Codex, and Antigravity sessions. It reads local transcripts and makes no model calls.
status: open-source
order: 2
technologies:
  - Node.js
  - Claude Code
  - Codex
  - Antigravity
capabilities:
  - Context fill
  - Session and turn time
  - Subagents
  - Tokens
  - Tools and skills
install: npx aihud
links:
  github: https://github.com/RichardErtl/aihud
  npm: https://www.npmjs.com/package/aihud
demo:
  video:
    src: /videos/aihud-demo.mp4
    poster: /images/projects/aihud-demo-poster.webp
    width: 1080
    height: 1920
    label: AIHUD demo video
    caption: The real tiles, with context values driven for the demo.
  screenshots:
    - src: /images/projects/aihud-hud.webp
      alt: AIHUD strip showing context fill, session time, subagents, and tokens by model
      width: 392
      height: 1200
    - src: /images/projects/aihud-composer.webp
      alt: The AIHUD layout composer with a tile panel on the left and a layout grid in the middle
      width: 1600
      height: 1029
---

AIHUD is a live heads-up display for AI coding agent sessions. The terminal shows what the agent writes. AIHUD keeps its state in view: context fill, session and turn time, subagents, tokens, tools, and skills. It is open source under the MIT license.

## Local by design

AIHUD reads the session transcripts these agents already keep on disk, and it only reads them. There are no model calls, no token cost, and no account. The server binds to localhost only, and a test enforces that shipped tiles make no network calls.

## Built from tiles

The display is composed of tiles, and every tile follows a versioned, machine-readable contract. A drag-and-drop composer arranges tiles into layouts, a command line validates tiles and manages layouts, and a Claude Code skill lets the agent build new tiles.

## Limits

AIHUD depends on transcript files that are internal to these tools and are not a public interface, so an update to any of them can break it. Antigravity sessions have reduced coverage. Node.js 22 or newer is required.

AIHUD is an independent project and is not affiliated with Anthropic, OpenAI, or Google.
