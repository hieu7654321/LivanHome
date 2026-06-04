# Shopify Theme Development - Heritage-based Theme

# LivanHome

This is a Spanish Website About Household Furniture

The purpose of this repository is to further developing my skill as a developer by working on a theme with a mindset of making this theme as close to the original website as possible.

This repository is ONLY used for studying purposes and not for commercials or planning to publish it.

Preview Link: ```https://livan-home-2.myshopify.com/```
Password: daoglo

# Results
This projects is mostly finished with the design closely matched with the figma design. Measured with the pagespeed insight from google, this shopify website was optimized for speed and accessibility with the following result:
- Performance ( mobile ) achieved > 75, while ( desktop ) > 95
- Accessibility > 90
- Best Practices > 90
- SEO ( Search Engine Optimization ) > 90
- 
# Project Structure

```
├── assets/          # CSS, JS, ảnh
├── blocks/          # Các blocks cho sections
├── config/          # Theme settings & menus
├── layout/          # Base page layouts
├── locales/         # Thư mục chứa các ngôn ngữ
├── Sass/            # Thư mục chứa các file sass
├── sections/        # Customizable sections
├── snippets/        # Reusable components
└── templates/       # Page templates
```


## Getting Started

1. **Clone or download**: ```git clone https://github.com/hieu7654321/LivanHome.git```
2. **Install dependencies**: ```npm install```
3. **Connect to Shopify**: Configure `shopify.app.toml`
4. **Start development**: ```npm run dev```
5. **Pull change from editor**: ```npm run pull```

## Build/Compile Sass/Scss
```
npm run build:css
```

## Watch Sass/Scss

```
npm run watch:css
```

## Requirements
- Shopify CLI
- Node.js 14+
- A Shopify development store
- Sass 1.98.1+
