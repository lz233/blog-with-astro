import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
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
        
      }
    }),
  ],
  theme: {
    colors: {
      "foregroundLight": foregroundLight,
      "backgroundLight": backgroundLight,
      "foregroundDark": foregroundDark,
      "backgroundDark": backgroundDark
    },
    fontFamily: {
      sans: '"Source Sans Pro","Roboto","Helvetica","Helvetica Neue","Source Han Sans SC","Source Han Sans TC","PingFang SC","PingFang HK","PingFang TC",sans-serif',
      serif: '"HiraMinProN-W6","Source Han Serif CN","Source Han Serif SC","Source Han Serif TC",serif',
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
    ['post-title', 'text-6 font-bold lh-7.5 m-0']
  ],
  rules: [

  ],
  transformers: [
    transformerDirectives(),
  ],
  safelist: [
    ...socials.map((social) => `i-mdi-${social.name}`),
  ],
})
