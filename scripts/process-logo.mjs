import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const SRC = "C:/Users/SAHIL/Downloads/Business/logo.svg";
let svg = readFileSync(SRC, "utf8");

// 1) Remove the solid white background square (the first fill="#FFFFFF" path),
//    leaving the colourful monogram on a transparent background.
svg = svg.replace(/<path fill="#FFFFFF"[\s\S]*?z"\/>\s*/, "");

// 2) Tight-crop the viewBox to the artwork (badge spans ~x:298-1747, y:277-1735)
//    and drop the fixed width so it scales to its container.
svg = svg.replace(/\s*width="100%"/, "");
svg = svg.replace(/viewBox="0 0 2000 2000"/, 'viewBox="255 255 1505 1505"');

// 3) Add an accessible label.
svg = svg.replace(/<svg /, '<svg role="img" aria-label="CS Collections" ');

mkdirSync("public/logos", { recursive: true });
writeFileSync("public/logos/logo.svg", svg);
writeFileSync("src/app/icon.svg", svg);

console.log("Wrote public/logos/logo.svg and src/app/icon.svg");
console.log("First 220 chars:\n" + svg.slice(0, 220));
console.log("Contains white bg path still?", /<path fill="#FFFFFF"/.test(svg));
