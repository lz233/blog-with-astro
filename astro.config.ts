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