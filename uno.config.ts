import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  presetWebFonts
} from "unocss";
import transformerDirectives from "@unocss/transformer-directives";
import { THEME_CONFIG } from "./src/theme.config";

const {socials, themeStyle} = THEME_CONFIG;

let foregroundLight = "#373C38";
let backgroundLight = "#FCFAF2";

let foregroundDark = "#FCFAF2";
let backgroundDark = "#202226";

export default defineConfig({
  presets: [
    presetUno({
      //dark: themeStyle === 'auto' ? 'media' : 'class',
    }),
    presetAttributify({ nonValuedAttribute: true }),
    presetIcons({
      scale: 1.2,
      warn: true,
      cdn: 'https://esm.sh/',
      collections: {
        mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        mingcute: () => import('@iconify-json/mingcute/icons.json').then(i => i.default),
        ri: () => import('@iconify-json/ri/icons.json').then(i => i.default),
        academicons: () => import('@iconify-json/academicons/icons.json').then(i => i.default),
      },
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        Noto: [
          {
            name: 'Noto Sans HK',
            weights: ['400','600'],
            italic: true,
          },
          {
            name: 'Noto Sans SC',
            weights: ['400','600'],
            italic: true,
          },
          {
            name: 'Noto Serif HK',
            weights: ['400','700'],
            italic: true,
          },
          {
            name: 'Noto Serif SC',
            weights: ['400','700'],
            italic: true,
          },
        ],
      },
    }),
  ],
  theme: {
    colors: {
      "foregroundLight": foregroundLight,
      "backgroundLight": backgroundLight,
      "foregroundDark": foregroundDark,
      "backgroundDark": backgroundDark,
    },
    fontFamily: {
      sans: '"Noto Sans HK","Noto Sans SC","PingFang SC","PingFang HK","PingFang TC","Source Sans Pro","Roboto","Helvetica","Helvetica Neue","Source Han Sans SC","Source Han Sans TC",sans-serif',
      serif: '"Noto Serif HK","Noto Serif SC","HiraMinProN-W6","Source Han Serif CN","Source Han Serif SC","Source Han Serif TC",serif',
      //serif: '"TeX Gyre Pagella", "NotoSerifSC", UbuntuMono, Menlo, Monaco, monospace, sans-serif',
    },
    animation: {
      keyframes: {
        "fadein-down":
          "{from {opacity: 0;transform: translateY(-20px);}to {opacity: 1;transform: translateY(0);}}",
        "fadein-left":
          "{from {opacity: 0;transform: translateX(20px);}to {opacity: 1;transform: translateX(0);}}",
      },
    },
  },
  shortcuts: [
    ['icon', 'inline-block '],
    ['post-title', 'text-6 font-bold lh-7.5 m-0'],
  ],
  rules: [

  ],
  transformers: [
    transformerDirectives(),
  ],
  safelist: [
    //...socials.map((social) => `i-${social.icon}`),
    'i-mdi-twitter',
    'i-ri-bluesky-fill',
    'i-mdi-mastodon',
    'i-ri-unsplash-fill',
    'i-mdi-github',
    'i-academicons-orcid',
    'i-mingcute-telegram-fill',
    'i-mdi-email',
    'i-mdi-microsoft-onedrive',
    'i-mdi-link',
    'i-mdi-rss',
  ],
})
