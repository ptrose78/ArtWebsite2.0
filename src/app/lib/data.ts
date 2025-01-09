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

export async function deleteArts(cart) {
  try {
    if (!Array.isArray(cart.items) || cart.items.length === 0) {
      throw new Error("Cart is empty or not an array")
    }
    const sql = neon(process.env.POSTGRES_URL);

  // Extract the IDs from `cart.items`
  const itemIds = cart.items.map((item) => item.id);

   // Generate a query with parameterized placeholders for the IDs
   const placeholders = itemIds.map((_, index) => `$${index + 1}`).join(", ");
   const query = `DELETE FROM arts WHERE id IN (${placeholders}) RETURNING id`;

   // Execute the query with the cart as the parameters
   const result = await sql(query, itemIds);

    if (result.length === 0) {
      throw new Error("No items in the cart were found for deletion.");
    }

    return { 
      success: true,
      message: `Successfully deleted ${result.length} items.`,
      deletedIds: result.map((row: { id: string }) => row.id), // Return IDs of deleted items
    };
  } catch(error) {
    console.error("Database error", error);
    throw new Error("Failed to delete the art.");
  }
}

export async function addCustomers(email) {
  try {
    const sql = neon(process.env.POSTGRES_URL);

    const result = await sql`
    INSERT INTO customers (email)
    VALUES (${email})
    RETURNING id`;

    return {
      success: true,
      customerId: result[0].id
    }
  } catch(error) {
    throw new Error("Failed to add customer to database.")
  }
}


export async function fetchBlogById(id: number) {
  try {

    const sql = neon(process.env.POSTGRES_URL);

    const blog = await sql`
    SELECT * FROM blogs WHERE id = ${id} LIMIT 1`;

    return blog[0] || null;

  } catch(error){
    console.error("Database Error:", error);
    throw new Error("Failed to retrieve the blog post.");
  }
}