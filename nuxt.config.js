
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Knowledge Graph Viewer',
    meta: [
      { charset: 'utf-8' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no, viewport-fit=cover' },
      { name: 'theme-color', content: '#282828' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'og:title', content: 'Knowledge Graph Viewer' },
      { property: 'og:description', name: 'description', content: 'Umožňuje zkoumání vztahů mezi entitami v rámci Google Knowledge Graph.' },
      { property: 'og:url', content: 'localhost:3000' }, //TODO změnit po nasazení na produkci
      { property: 'og:image', content: 'localhost:3000/ogimage.jpg' }, //TODO změnit po nasazení na produkci
      { property: 'og:site_name', content: 'Knowledge Graph Viewer' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'cs_CZ' },
      { name: 'msapplication-TileColor', content: '#2b5797' }
    ],
    link: [
      { href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap&subset=latin-ext', rel: 'stylesheet' },
      { rel: 'author', href: 'http://skaramart.in' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    "~assets/styles/grid/resets.scss",
    "~assets/styles/grid/utils.scss",
    "skar-is/assets/scss/components/menu.scss"
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~plugins/grid.js"
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources'
  ],
  styleResources: {
    scss: ["~assets/styles/grid/settings.scss", "~assets/styles/grid/functions.scss", "~assets/styles/grid/mixins.scss"]
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
