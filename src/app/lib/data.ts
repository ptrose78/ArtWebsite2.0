import { sql } from '@vercel/postgres';
import { LatestArtRaw } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';

export async function fetchArts() {
    try {

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