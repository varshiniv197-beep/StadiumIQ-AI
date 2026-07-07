# StadiumIQ AI - Accessibility Audit (WCAG 2.2)

StadiumIQ AI incorporates dedicated design architectures to achieve AA compliance under WCAG 2.2 standards, ensuring operations are accessible to volunteers, fans, and operators with diverse needs.

---

## Core Accessibility Features

### 1. High Contrast Mode
- **Override Classes**: Toggling High Contrast activates custom CSS selectors applying high-contrast background and foreground colors:
  - Default background shifts to solid dark black (`#000000`).
  - Text shifts to high-visibility yellow (`#facc15` or `#ffff00`) or clean white.
  - Border indicators shift to solid yellow.
- **Aesthetic Contrast**: Exceeds the standard `4.5:1` minimum ratio, reaching ratios above `7:1` to support visual impairments and color-blind users.

### 2. Live Font Size Scaler
- **State Provider**: The web application integrates a global font multiplier.
- **Ranges**:
  - `Normal` (Default base: `16px`)
  - `Large` (Multiplied by `1.25x` $\rightarrow$ `20px`)
  - `Extra Large` (Multiplied by `1.5x` $\rightarrow$ `24px`)
  - `Maximum Scale` (Multiplied by `2.0x` $\rightarrow$ `32px` to meet WCAG text resizing guidelines without breaking layouts).

### 3. Full Keyboard Navigation
- **Focus Management**: All interactive items (cards, buttons, input bars, switches) use native focus styling:
  - Custom `:focus-visible` ring parameters in orange/gold highlighting the active element.
  - Logical tab order (`tabIndex`) matching the visual grid direction.
  - Key event bindings: Dialogues and drawers can be dismissed with the `Escape` key, and buttons can be selected with `Enter` or `Spacebar`.

### 4. Assistive AI Technologies
- **Voice Commands (Speech-To-Text)**: Fans and volunteers can dictate search inputs or queries using browser Web Speech API.
- **Text-To-Speech (TTS) Synthesis**: The assistant chatbot outputs spoken statements for visually impaired users.
- **Sign Language AI Avatar Concept**: A vector graphics visual showcase that illustrates basic safety procedures through an animated sign language assistant.
- **Screen Reader Announcements**: Implements dynamic `aria-live="polite"` containers so that background logs, simulator alerts, or transit delay updates are announced to screen readers.
