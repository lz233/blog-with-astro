import { defineConfig, passthroughImageService } from 'astro/config';
import UnoCSS from 'unocss/astro';
import { THEME_CONFIG } from "./src/theme.config";
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: THEME_CONFIG.website,
  server: {
    port: 4321,
    host: true
  },
  redirects:{
    //'/': '/posts/page/1'
  },
  prefetch: true,
  markdown: {
    shikiConfig: {
      // Use build-in Shiki theme
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      //theme: 'one-dark-pro',
      // Or visit here for more themes
      // https://shikiji.netlify.app/guide/dual-themes#light-dark-dual-themes
      experimentalThemes: {
         light: 'github-light',
         dark: 'github-dark',
      },
      // Add your customized languages
      // Note that shiki has many build-in langs including .astro！
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // auto wrap for better display
      wrap: true,
    },
  },
  image: {
    service: passthroughImageService()
  },
  integrations: [
    UnoCSS({
      injectReset: true
    }),
    robotsTxt(),
    sitemap(),
    mdx()
  ]
});