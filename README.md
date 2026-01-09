# QR code generator

This is a simple, easy-to-use QR code generator, featuring PNG and SVG export.

You can use it at https://qr.matteason.co.uk

<img width="1031" height="543" alt="Screenshot of QR code generator linked above" src="https://github.com/user-attachments/assets/f403a244-a651-430d-9223-a0fc617fb96e" />

## Why?

The Google results for 'qr code generator' are filled with junk results that:

- make you create an account to download your QR code
- delay generating your QR code to make you stare at an ad
- don't show a live preview of your QR code (because then you could screenshot it and you wouldn't look at the ads)
- put your link behind a redirect / link shortener that they control - so your QR code can stop working at any time
- don't let you copy directly to the clipboard

This QR code generator doesn't do any of that. You get a live preview, there's no redirect / link shortener / analytics, you can download or copy to clipboard as PNG or SVG. That's it!

Built with [Vue](https://vuejs.org/), [GOV.UK Vue](https://github.com/govuk-vue/govuk-vue), and [QR Code generator library](https://github.com/nayuki/QR-Code-generator) by Project Nayuki. 

## Project setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
