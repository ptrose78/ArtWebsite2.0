'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    image: z.string({
        invalid_type_error: 'Please add an image.'
    }),
    price: z.coerce
        .number()
        .gt(0, {message: 'Please enter an amount greater than $0.'}),
    type: z.enum(['new', 'old'], {
        invalid_type_error: 'Please select an invoice status.'
    }),
    date: z.string()
})

export type State = {
    errors?: {
        image?: string[];
        price?: string[];
        type?: string[];
    };
    message?: string | null;
};

const CreateArt = FormSchema.omit({id: true, date: true})
const UpdateArt  = FormSchema.omit({id: true, date: true})
const DeleteArt = FormSchema.omit({id: true, date: true})

export async function createArt(prev: State, formData: FormData) {
    const validatedFields = CreateArt.safeParse({
        image: formData.get('image'),
        price: formData.get('price'),
        type: formData.get('type'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create an art item.'
        }
    }

    const {image, price, type} = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql `
        INSERT INTO arts (image, price, type)
        VALUES (${image}, ${price}, ${type})`
    } catch (error) {
        return {
            message: "Database error: Failed to create entry."
        }
    }

    revalidatePath('/art');
    redirect('/art');

}

