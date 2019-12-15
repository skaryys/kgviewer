<template>
  <div>
    <nuxt />
  </div>
</template>

<style lang="scss">
  //font-weight
  $regular: 400;
  $bold: 700;

  //colors
  $white: white;
  $black: black;

  //fonts
  $baseFont: -apple-system, system-ui, "Segoe UI", Roboto, Oxygen, "Fira Sans", "Droid Sans", Ubuntu, Cantarell, sans-serif;

  //breakpoints in em (Breakpoint * font size = breakpoint in pixels)
  $screen-xs: 30em;
  $screen-sm: 48em;
  $screen-md: 64em;
  $screen-lg: 75em;
  $screen-xl: 82.5em;

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(255,255,255,0);
  }

  html {
    font-family: $baseFont;
    background-color: $white;
    position: relative;
    font-style: normal;
    font-size: 62.5%;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    min-height: 100%;
  }

  ::selection {
    color: $black;
    background-color: $white;
  }

  body {
    margin: 0;
    font-size: 1.6rem;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  h1,h2,h3 {
    font-weight: inherit;
  }

  h1, h2, h3, p {
    margin: 0;
    padding: 0;
  }

  main {
    display: block;
  }

  a {
    cursor: pointer;
    color: inherit;
    text-decoration: none;
    touch-action: manipulation;
    &:hover,&:active,&:visited,&:focus {
      text-decoration: none;
    }
  }

  button {
    overflow: visible;
    border: 0;
    font: inherit;
    -webkit-font-smoothing: inherit;
    letter-spacing: inherit;
    background: none;
    cursor: pointer;
    touch-action: manipulation;
  }

  ::-moz-focus-inner {
    padding: 0;
    border: 0;
  }

  :focus {
    outline: 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border: 0;
  }
</style>
