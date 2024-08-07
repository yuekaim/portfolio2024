// ./src/utils/sanity/client.ts
import { createClient } from "next-sanity"

export const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: 'production',
    useCdn: false, // set to `false` to bypass the edge cache
    apiVersion: '2024-06-03', // use current date (YYYY-MM-DD) to target the latest API version
})