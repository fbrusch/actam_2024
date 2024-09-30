---
marp: true
theme: default
paginate: true
---

# ACTAM: How to build and deploy a webpage

## 30/09/2024

---

## Class outline

- Short introduction
- In-editor demo
- **Hands-on:** Set-up code editor and work on a webpage

- Break (5 min)

- Demo github pages deployment
- **Hands-on:** Replicate deployment 

---

## Easy goals

- Build a webpage using HTML and CSS
- Deploy it to GitHub Pages

---

## What is a webpage (without JavaScript)?

- A collection of HTML, CSS and assets.
- HTML is the _structure_ , CSS is the _look_ , and the assets are the _content_ of your page.
- You can use any text editor to build a webpage.
- But there's a better way: code editors!

---

![](assets/3bodies.png)

---

## Browser's rendering journey 

1) Rendering engines parse the HTML into a Document Object Model (DOM) tree.
2) A DOM tree is made of nodes ( **elements** <div>, <p>; **text**; **attributes**)
3) The **rendering engine** builds another tree (Render Tree)
4) Each node of the Render Tree is assigned coordinates that determine where it will appear on the screen
5) Once the layout is computed, the rendering engine paints each node onto the screen based on its visual attributes

---

![](assets/rendering.png)

---

## Common HTML Elements

Headings  `(<h1> to <h6>) `
Division: `<div> ... </div>` 
Paragraphs: `<p> ... </p>`
Links  `<a href="..."> ... </a>`
Images  `<img src="..." alt="...">` (self closing)
Lists  `<li> ... </li>`

---

## No "Style," no party: Why CSS Matters

- HTML is just a collection of tags, and tags are not styled by default. 
- CSS (Cascading Style Sheets) allows us to add color, spacing, layout... personality!

---

![](assets/css-declaration.png)

---

## Css is all about boxes


![](assets/cssbox.png)

---

## two CSS layout models

- `display: Flexbox` 1D layout (to align items in a single row or column)
- `display: Grid`: 2D layout (to create more complex layouts)

go [here](https://developer.mozilla.org/en-US/docs/Web/CSS/display) for in-depth explanation about display property

---

![](assets/flexgrid.webp)

---

## Three ways to be cool with styles

1) Inline: `<div style="...">` (Avoid for large projects)
2) Internal: `<style>...</style>` (Good for single-page projects)
3) External: `<link rel="stylesheet" href="filename.css">` (Scalable code across multiple pages)

---

## Mental model

1) Draw a sketch and fit it into the html skeleton
2) Arrange your layout (flexbox, grid, etc.)
3) Fill with content (paragraphs, images etc)
4) Adjust the style (improve typography, colors, spacing)
5) Refine responsivness and accessibility

---

## Resources

- https://developer.mozilla.org/en-US/docs/Web/HTML
- https://pages.github.com/



