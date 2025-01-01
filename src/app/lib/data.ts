import { sql } from '@vercel/postgres';
import { LatestArtRaw } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';

export async function fetchArts() {
    try {
       // Access the environment variable for the PostgreSQL URL
       const connectionString = process.env.POSTGRES_URL;

       if (!connectionString) {
        throw new Error('POSTGRES_URL is not defined.');
       }
  
        const data = await sql `SELECT * FROM arts`;
        console.log(data)

        const arts = data.rows.map((art) => ({
            ...art,
            art: formatCurrency(art.price),
          }));

        return arts;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error ('Failed to fetch arts.')
    }
}