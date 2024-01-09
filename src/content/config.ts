
import { defineCollection, z } from "astro:content";
import { rssSchema } from './rssSchema';

const postsCollection = defineCollection({
  type: 'content',
  schema: rssSchema
});

export const collections = {
  posts: postsCollection,
};
