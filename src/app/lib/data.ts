// app/actions.ts
"use server"; 

import { sql } from '@vercel/postgres';
import { LatestArtRaw } from '@/app/lib/definitions';
import { neon } from "@neondatabase/serverless";
import { formatCurrency } from "@/app/lib/utils";

export async function fetchArts() {
  try {
    // Initialize the Neon SQL connection
    const sql = neon(process.env.POSTGRES_URL); 

    // Fetch data from the "arts" table
    const rows  = await sql`SELECT * FROM arts`;

    // Format the data
    const arts = rows.map((art) => ({
      ...art,
      priceFormatted: formatCurrency(art.price), // Ensure `formatCurrency` is implemented correctly.
    }));

    return arts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch arts.");
  }
}