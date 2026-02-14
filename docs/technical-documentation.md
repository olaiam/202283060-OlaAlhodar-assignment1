# Technical Documentation

## 1. Project Overview

This project is a front-end personal portfolio website built using HTML, CSS, and JavaScript.  
The goal of the implementation is to demonstrate clean structure, responsive design, and interactive user interface behavior while keeping the codebase simple and maintainable.

The website is fully client-side and does not rely on any backend services.

---

## 2. File and Folder Structure

The project follows a clear separation of concerns:

- **index.html**  
  Contains the semantic structure and content of the website, including all sections such as About, Projects, and Contact.

- **css/styles.css**  
  Responsible for all visual styling, layout, animations, transitions, and responsive behavior.

- **js/script.js**  
  Handles interactivity and dynamic behavior such as theme toggling, scroll-based animations, and form validation.

- **assets/images/**  
  Stores image assets used in the Projects section.

- **docs/**  
  Contains documentation files:
  - `ai-usage-report.md`
  - `technical-documentation.md`

This structure makes the project easy to read, debug, and extend.

---

## 3. HTML Structure and Semantics

The HTML file uses semantic elements to improve readability and accessibility:

- `<header>` for navigation and site branding  
- `<main>` to contain all primary content  
- `<section>` elements to divide logical parts of the page  
- `<article>` elements for individual project cards  
- `<footer>` for copyright and navigation support  

Each section is assigned clear class names and IDs to support styling and JavaScript interaction.

Accessibility considerations include:
- Use of `alt` text for images
- Logical heading hierarchy
- Skip-to-content link for keyboard navigation

---

## 4. CSS Styling and Layout Strategy

### 4.1 Layout System

The layout is built using **Flexbox and CSS Grid**, depending on the section:

- Grid is used for:
  - Project cards layout
  - Responsive section alignment
- Flexbox is used for:
  - Navigation bar
  - Buttons and content alignment
  - Vertical stacking of card content

This hybrid approach allows flexibility while keeping the layout predictable.

---

### 4.2 Responsive Design

Responsive behavior is achieved using:

- Relative units (%, `rem`, `vh`)
- Media queries for tablet and mobile breakpoints
- Flexible containers instead of fixed widths

The layout adapts smoothly across:
- Desktop screens
- Tablets
- Mobile devices

---

### 4.3 Visual Design and Transitions

The design uses:
- Rounded cards and containers
- Subtle shadows for depth
- Smooth hover effects and transitions
- Scroll-based reveal animations for sections

Animations are implemented carefully to enhance user experience without affecting performance.

Support for reduced motion is included using:
```css
@media (prefers-reduced-motion: reduce)
