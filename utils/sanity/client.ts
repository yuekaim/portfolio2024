// ./src/utils/sanity/client.ts
import { createClient } from "next-sanity"

export const client = createClient({
    projectId: '4ksy39ot',
    dataset: 'production',
    useCdn: true, // set to `false` to bypass the edge cache
    apiVersion: '2024-06-03', // use current date (YYYY-MM-DD) to target the latest API version
})