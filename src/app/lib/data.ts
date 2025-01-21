// app/actions.ts
"use server"; 

import { sql } from '@vercel/postgres';
import { LatestArtRaw } from '@/app/lib/definitions';
import { neon } from "@neondatabase/serverless";
import { formatCurrency } from "@/app/lib/utils";
import { revalidatePath } from 'next/cache';

export async function fetchMisc() {
  try {
    // Initialize the Neon SQL connection
    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable."
      console.error(errorMessage)
      throw new Error(errorMessage);
    }

    const sql = neon(process.env.POSTGRES_URL); 

    // Fetch data from the "arts" table
    const misc  = await sql`SELECT * FROM misc`;

    return misc;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch arts.");
  }
}

export async function fetchArts() {
  try {
    // Initialize the Neon SQL connection
    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable."
      console.error(errorMessage)
      throw new Error(errorMessage);
    }

    const sql = neon(process.env.POSTGRES_URL); 

    // Fetch data from the "arts" table
    const arts  = await sql`SELECT * FROM arts`;

    // Format the data
    // const arts = rows.map((art) => ({
    //   ...art,
    //   priceFormatted: formatCurrency(art.price), // Ensure `formatCurrency` is implemented correctly.
    // }));

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

    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable."
      console.error(errorMessage)
      throw new Error(errorMessage);
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

export async function addSubscribers(email) {
  try {
    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable."
      console.error(errorMessage)
      throw new Error(errorMessage);
    }

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


export async function fetchPostById(id: number) {
  try {
    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable."
      console.error(errorMessage)
      throw new Error(errorMessage);
    }

    const sql = neon(process.env.POSTGRES_URL);

    const post = await sql`
    SELECT * FROM posts WHERE id = ${id} LIMIT 1`;

    return post[0] || null;

  } catch(error){
    console.error("Database Error:", error);
    throw new Error("Failed to retrieve the post.");
  }
}

export async function createPost(post){
  try {
    if (!post.title) {
      throw new Error("Post title and content are required.");
    }

    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable."
      console.error(errorMessage)
      throw new Error(errorMessage);
    }

    const sql = neon(process.env.POSTGRES_URL);

    const [result] = await sql`
      INSERT INTO posts (title, content, featured, excerpt)
      VALUES (${post.title}, ${post.content}, ${post.featured}, ${post.excerpt})
      RETURNING id`

      revalidatePath("/admin/site/blog")
      return {
        success: true,
        message: "Post submitted successfully."
      }
  } catch(error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add the post.");
  }
} 

export interface Post {
  id: number;
  title: string;
  content: string;
  featured: boolean;
  excerpt: string;
  archived: boolean;
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable.";
      console.error(errorMessage);
      throw new Error(errorMessage); // Throw an error for better error handling
      return [];
    }

    // Initialize Neon connection
    const sql = neon(process.env.POSTGRES_URL);

    // Query the posts from the database
    const posts = await sql `
      SELECT * FROM posts
    `;

    // Map the raw database results to the Post interface
    const formatDataToPost = (posts: Record<string, any>[]): Post[] => {
      return posts.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        featured: item.featured ?? false,
        excerpt: item.excerpt,
        archived: item.archived ?? false,
      }));
    };

    return formatDataToPost(posts);

  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to retrieve posts."); // Ensure the error propagates
  }
}

export async function updatePost(id: number, post: { title?: string; content?: string; featured?: boolean; excerpt?: string; archived?: boolean }) {
  try {
    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable.";
      console.error(errorMessage);
      throw new Error(errorMessage); // Throw an error for better error handling
      return [];
    }

      // Construct the update query dynamically to only update provided fields
      const updates: string[] = [];
      const values: any[] = [];

      if (post.title !== undefined) {
          updates.push('title = $1');
          values.push(post.title);
      }

      if (post.content !== undefined) {
          updates.push('content = $2');
          values.push(post.content);
      }

      if (post.featured !== undefined) {
        updates.push('featured = $3');
        values.push(post.featured);
      }

      if (post.excerpt !== undefined) {
        updates.push('excerpt = $4');
        values.push(post.excerpt);
      }

      if (post.archived !== undefined) {
        updates.push('archived = $5');
        values.push(post.archived);
      }

      if (updates.length === 0) {
          return { success: true, message: "No fields to update." }; // Nothing to update
      }

      const query = `
          UPDATE posts
          SET ${updates.join(', ')}
          WHERE id = $${values.length + 1}
      `;

      values.push(id); // Add the id to the values array

      const result = await sql`${query}`;

      if (result.rowCount === 0) {
          return { success: false, message: "Post not found." }; // No rows updated, post doesn't exist
      }

      return { success: true, message: "Post updated successfully." };
  } catch (error) {
      console.error("Database error:", error);
      return { success: false, message: "Failed to update post." };
  }
}

export async function deletePost(post) {
  try {
    if (!process.env.POSTGRES_URL) {
      const errorMessage = "Missing environmental variable.";
      console.error(errorMessage);
      throw new Error(errorMessage); // Throw an error for better error handling
      return [];
    }

    const sql = neon(process.env.POSTGRES_URL);

    const result = await sql`
    DELETE FROM posts WHERE id = ${post.id}
    `
    if (result.length === 0) {
      return {
        success: false,
        message: "Post not found or already deleted.",
      };
    }

    revalidatePath("/admin/blog");

    return {
      success: true,
      message: "Post successfully deleted."
    }

  } catch(error) {
    console.error("Database error:", error);
    throw new Error("Failed to delete post.")
  }
}

interface User {
  id?: number;
  username?: string;
  password?: string; // Make password optional for cases where you don't select it
}

export async function fetchUserById(username: string) {
   
    try {
      if (!process.env.POSTGRES_URL) {
        const errorMessage = "Missing environmental variable.";
        console.error(errorMessage);
        throw new Error(errorMessage); // Throw an error for better error handling
        return [];
      }

    
        const sql = neon(process.env.POSTGRES_URL);
        const result = await sql`
        SELECT * FROM users WHERE username = ${username}
        ` as unknown as User[];
        console.log('result:', result[0])
        return result.length > 0 ? result[0] : null;
    
    } catch(error) {
        console.error("Database error:", error);
        return { message: "Failed to fetch user.", status: 500 };
    }
}