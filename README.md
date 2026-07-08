# Isha Patro's Portfolio

A modern, responsive portfolio website showcasing experience, projects, research, and achievements in quantitative finance and software engineering.

**Live:** [isha-patro.com](https://isha-patro.com)

## Quick Start

### Prerequisites
- Python 3.x (usually pre-installed on macOS/Linux)

### Run Locally

```bash
cd patro.isha.github.io
python3 -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

Press `Ctrl+C` in the terminal to stop the server.

> **Why a server?** The site fetches `data.json` dynamically. Browsers block `fetch()` over `file://`, so a local HTTP server is required.

## Project Structure

```
patro.isha.github.io/
├── index.html          # Main page
├── data.json           # All portfolio content (single source of truth)
├── js/
│   └── v2.js           # Renders data.json into the page
├── css/                # Stylesheets
├── scss/               # SCSS source files
├── images/             # Portfolio images & media
├── fonts/              # Custom web fonts
├── resume.pdf          # Resume/CV
└── README.md           # This file
```

## Content Management

All text content lives in **`data.json`**. Update any section (experience, projects, skills, etc.) and refresh the page—no build step needed.

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — responsive design, animations
- **JavaScript (vanilla)** — dynamic content rendering from JSON
- **SCSS** — compiled to CSS

## Browser Support

Modern browsers (Chrome, Safari, Firefox, Edge). Responsive design optimized for desktop and mobile.