'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { neon } from "@neondatabase/serverless";

const artFormSchema = z.object({
    id: z.string(),
    image: z.string({
        invalid_type_error: 'Please add an image.'
    }),
    price: z.coerce
        .number()
        .gt(0, {message: 'Please enter an amount greater than $0.'}),
    type: z.enum(['new', 'old'], {
        invalid_type_error: 'Please select an art status.'
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

const CreateArt = artFormSchema.omit({id: true, date: true})
const UpdateArt  = artFormSchema.omit({id: true, date: true})
const DeleteArt = artFormSchema.omit({id: true, date: true})

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

const loginFormSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string()
})

export type LoginState = {
    username: string;
    password: string;
}

const HandleLogin = loginFormSchema.omit({id: true});

export async function handleLogin(prevState, formData: FormData) {
    const validatedFields = HandleLogin.safeParse({
        username: formData.get("username"),
        password: formData.get("password")
    })

    if (!validatedFields.success) {
        return { ...prevState, message: "Invalid input data", success: false, status: 400 };
      }
    
    const {username, password} = validatedFields.data;

    if (!process.env.POSTGRES_URL) {
        const errorMessage = "Missing environmental variable."
        console.error(errorMessage)
        throw new Error(errorMessage);
    }

    const sql = neon(process.env.POSTGRES_URL);

    try {
        const user = await fetchUserById(username);

        if (!user) {
            return {...prevState, message: "User not found", success: false, status: 404}
        }
        
        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return { ...prevState, message: "Invalid password", success: false, status: 401 };
        }
        
        // Return a success message after login
        return { ...prevState, message: "Login successful", success: true, status: 200 };

    } catch(error) {
        console.error("Database error:", error);
        throw new Error("Failed to login.")
    }
}

const signupFormSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string()
})

const HandleSignup = signupFormSchema.omit({id: true})

async function fetchUserById(username:string) {
   
    try {
        if (!process.env.POSTGRES_URL) {
            const errorMessage = "Missing environmental variable."
            console.error(errorMessage)
            throw new Error(errorMessage);
        }

        const sql = neon(process.env.POSTGRES_URL);
        const result = await sql`
        SELECT * FROM users WHERE username = ${username}
        `;
        return result.length > 0 ? result[0] : null;
    
    } catch(error) {
        console.error("Database error:", error);
        return { message: "Failed to fetch user.", status: 500 };
    }
}

export async function handleSignup(formData: FormData) {
    const validatedFields = HandleSignup.safeParse({
        username: formData.get("username"),
        password: formData.get("password")
    })

    if (!validatedFields.success) {
        return {message: "Invalid input data.", status: 400}
    }
    
    const {username, password} = validatedFields.data;
    

    if (!process.env.POSTGRES_URL) {
        const errorMessage = "Missing environmental variable."
        console.error(errorMessage)
        throw new Error(errorMessage);
    }

    const sql = neon(process.env.POSTGRES_URL);

    const user = await fetchUserById(username);

    if (user) {
        return {message:"User already exists!", status: 400}
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await sql`
        INSERT INTO users (username, password)
        VALUES (${username}, ${hashedPassword})
        returning id
        `

        return { message: "User created!", status: 200 };
        
    } catch(error) {
        console.error("Database error:", error);
        return { message: "Failed to signup.", status: 500 };
    }
}
