
import { defineCollection, z } from "astro:content";
import { rssSchema } from './rssSchema';

const postsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    banner: image()
      .refine((img) => Math.max(img.width, img.height) <= 4096, {
        message: "Width and height of the banner must less than 4096 pixels"
      })
      .optional(),
    categories: z.array(z.string()),
    author: z.string().optional(),
    commentsUrl: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
