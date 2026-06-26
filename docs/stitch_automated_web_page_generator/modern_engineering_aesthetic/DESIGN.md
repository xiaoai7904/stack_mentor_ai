---
name: Modern Engineering Aesthetic
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
  api-teal: '#0D9488'
  source-purple: '#7C3AED'
  call-chain-blue: '#2563EB'
  graph-indigo: '#4F46E5'
  surface-gray: '#F9FAFB'
  border-subtle: '#E5E7EB'
  code-bg: '#1E1E1E'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  sidebar-width: 260px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for the modern developer—focusing on clarity, technical precision, and a high-performance "workspace" feel. The brand personality is that of an expert mentor: authoritative yet accessible, minimizing cognitive load while maximizing information density.

The visual style is **Corporate / Modern** with a **Minimalist** foundation. It prioritizes:
- **Functional Clarity:** Removing unnecessary ornamentation to focus on code and logic.
- **Developer Familiarity:** Utilizing UI patterns found in modern IDEs and technical documentation.
- **Visual Breathability:** Leveraging generous whitespace and a restricted color palette to prevent fatigue during long deep-dive sessions.
- **Tactile Logic:** Using subtle depth and borders to define functional zones without cluttering the view.

## Colors

The palette is anchored by a vibrant Indigo primary, selected for its strong presence in professional development environments. The background utilizes a very light gray (`#F9FAFB`) to reduce screen glare and differentiate from the pure white (`#FFFFFF`) surface cards.

### Functional Accents
Each module is assigned a distinct semantic color to aid mental mapping as users switch between tools:
- **API Explainer:** Teal, representing clarity and definition.
- **Source Reader:** Purple, representing depth and discovery.
- **Call Chain:** Blue, representing flow and logic.
- **Knowledge Graph:** Indigo, aligning with the core brand identity.

### Code & Surfaces
Code blocks should utilize a high-contrast dark theme (Monaco style) to ensure syntax highlighting remains the focal point of the analysis experience. Borders use a consistent subtle gray to define structure without adding visual noise.

## Typography

The typography system is built on **Inter**, chosen for its exceptional legibility in data-heavy interfaces. It provides a clean, neutral canvas for complex technical content.

- **Scale:** A tight scale ensures hierarchy is clear even in compact sidebars and nested cards.
- **Weights:** Semi-bold (600) is used for headings to provide contrast against regular (400) body text.
- **Monospace:** **JetBrains Mono** is utilized for all code blocks, inline code snippets, and file paths to provide a distinct visual break from prose.
- **Readability:** Line heights are optimized for technical reading, with body text set to 1.5x font size for comfortable scanning.

## Layout & Spacing

This design system uses a **Fluid Grid** model with fixed sidebar constraints. The layout is divided into a persistent navigation sidebar and a flexible content stage.

### Layout Philosophy
- **Structure:** 12-column grid for the main content stage on desktop, collapsing to 4 columns on mobile.
- **Rhythm:** An 8px base unit drives all spacing (8, 16, 24, 32, 48, 64).
- **Density:** High density for code and graph areas; moderate density for dashboards and educational prose to prevent overwhelming the user.

### Adaptive Behavior
- **Desktop (1280px+):** Full 260px sidebar and multi-pane workspace layout.
- **Tablet (768px - 1279px):** Sidebar collapses to icons or a hamburger menu; content stacks vertically where necessary.
- **Mobile (<767px):** Single-column stack with horizontal scrolling for large code blocks or charts.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Low-Contrast Outlines**. Shadows are used sparingly to signify interactivity or focus.

- **Level 0 (Background):** `#F9FAFB`. The canvas for the workspace.
- **Level 1 (Cards/Surfaces):** Pure `#FFFFFF` with a 1px solid border in `#E5E7EB`. This is the primary container for content.
- **Level 2 (Overlays/Dropdowns):** Pure `#FFFFFF` with a subtle, diffused shadow (`0 4px 6px -1px rgb(0 0 0 / 0.1)`).
- **Interactive Depth:** Buttons and clickable cards use a subtle "lift" effect on hover, achieved through a slight increase in shadow spread rather than a color change alone.

## Shapes

The shape language is **Soft** and professional. 
- **Standard UI Elements:** (Buttons, Inputs, Cards) use a `0.25rem` (4px) or `0.5rem` (8px) radius to maintain a clean, architectural feel.
- **Navigation Items:** Rounded-md (`0.375rem`) for sidebar active states.
- **Pill Tags:** Used exclusively for status indicators (e.g., "Pro," "Stable," "Deprecated") and category tags to differentiate them from functional buttons.

## Components

### Buttons
- **Primary:** Solid Indigo with white text. High-contrast.
- **Secondary:** White background with a gray border and indigo text.
- **Ghost:** No background or border, indigo text. Used for less frequent actions in the sidebar.

### Cards
- White background, 1px border (`#E5E7EB`).
- Header section should be separated by a subtle horizontal rule or a light gray background tint.

### Sidebar
- Fixed-width, light gray background.
- Active states use a subtle indigo background tint (`#EEF2FF`) and a 2px left-side indigo border accent.

### Code Blocks (Monaco Style)
- Background: `#1E1E1E`.
- Padding: `1rem`.
- Font: JetBrains Mono.
- Integration: Must include a copy-to-clipboard action and language indicator.

### Tags & Labels
- Small font size (`12px`), medium weight.
- Use module-specific accent colors for background tints (e.g., Teal-50 background with Teal-700 text for API tags).

### Transitions
- Use **Vue Bits** inspired micro-interactions.
- Page transitions should be a subtle `0.2s` fade-in and vertical slide (4px).
- Accordion and list expansions should use a "spring" ease for a more tactile, responsive feel.