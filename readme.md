
Working on [Idea 006 Procedurally Generated Glowing Mushroom Pcb](https://blog.abluestar.com/idea006-procedurally-generated-glowing-mushroom-pcb/) Using [p5js](https://p5js.org/) to generate the mushroom and [svg2shenzhen](https://github.com/badgeek/svg2shenzhen) to convert the SVG to KiCad.

For [Game of Shroom 2023](https://yumfactory.com/gameofshrooms/)

## Build

1. Open `p5js/index.html` in a browser
2. Right click and inspect the image, find the svg, copy the element, past the svg text into a new text document, save it as `output.svg`
3. Install [svg2shenzhen](https://github.com/badgeek/svg2shenzhen)
4. Open `output.svg` in inkscape.
5. Extention->svg2shenzhen->`1. Prep Document...`
6. Resize the image to fit within the page.
7. Copy red outline to the `edge.cuts` layer
8. Copy the black body to the `f.Cu` layer
9. Extention->svg2shenzhen->`2. Export to KiCad`

## Example

![Example](https://github.com/funvill/GameOfShrooms2023/blob/main/example.png?raw=true)
