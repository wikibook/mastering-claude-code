# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static developer portfolio website built with vanilla HTML, CSS, and JavaScript (no frameworks). The design follows a "Modern Cyberpunk Terminal" aesthetic with glassmorphism effects, neon glow, and an interactive terminal-style command interface.

## Architecture

The application is structured as a single-page application with three main files:

- **index.html**: Contains the terminal window structure with Mac-style window controls and welcome message
- **styles.css**: Implements the cyberpunk theme with CSS custom properties for colors, glassmorphism effects, neon glows, and smooth animations
- **script.js**: Handles the terminal command system and user interactions

### Key Design Patterns

**Command System**: The portfolio uses a command-based interface where users type commands to navigate content. Commands are defined in the `commands` object (script.js:63-235), where each command has a `description` and `execute()` function that returns HTML.

**Portfolio Data Object**: All personal information is centralized in the `portfolioData` object at the top of script.js (lines 2-51). This makes customization simple - users only need to edit this object to personalize their portfolio.

**Animation Strategy**: Uses CSS keyframe animations for visual effects (fade-in, slide-in, card animations) with staggered delays for sequential items. The terminal maintains a custom cursor animation instead of using the native browser cursor.

**Glassmorphism Implementation**: The terminal window uses backdrop-filter with blur and a semi-transparent background (styles.css:88-101) to create the glass effect. Multiple layered box-shadows create the neon glow appearance.

## Customization

To personalize the portfolio, edit the `portfolioData` object in script.js:

```javascript
const portfolioData = {
    name: "Your Name",
    title: "Your Title",
    email: "your@email.com",
    // ... update with your information
};
```

## Available Commands

The terminal supports these commands (defined in script.js):
- `help` - Display all available commands
- `whoami` - Show developer information
- `skills` - Display tech stack (frontend/backend/tools)
- `projects` - Show project portfolio with tech tags
- `experience` - Display work history
- `contact` - Show contact links
- `ls` - Demo file system display
- `clear` - Clear terminal output
- `banner` - Redisplay welcome message

## Color System

The cyberpunk theme uses CSS custom properties defined in :root (styles.css:11-38):
- Background: Dark navy/purple gradient (`--bg-primary`, `--bg-secondary`, `--bg-tertiary`)
- Neon accents: Pink, blue, purple, yellow, green (`--neon-*` variables)
- Syntax highlighting: VS Code-inspired colors for different text types

## Interactive Features

- Command history navigation with arrow keys (↑/↓)
- Tab completion for commands
- Auto-focus on command input (clicking anywhere focuses the input)
- Window control buttons with visual effects (close/minimize/maximize)
- Konami code easter egg (script.js:378-400)
- Animated noise texture background effect

## Running the Project

Simply open index.html in a web browser. No build process, dependencies, or server required.
