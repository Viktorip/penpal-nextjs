'use server'
import { z } from 'zod';
import bcrypt from 'bcrypt';
import users from '@/data/users_data';
import fsPromises from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data/users_data.json');

const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

export async function getUserById(id) {
    const user = users.data.find(item => item.email === id) || users.data.find(item => parseInt(item.id, 10) === parseInt(id, 10));
    if (user) return {...user, success: true};
    return {error: 'Failed to get user', success: false};
}

export async function createUser(email, password, fullname) {
    try {
        const jsonDataFromFile = await fsPromises.readFile(dataFilePath);
        const objectData = JSON.parse(jsonDataFromFile);
        let nextId = objectData.data.reduce((a, b) => Math.max(a, b.id), 0) || 0;

        const unixTimeInSeconds = Date.now();

        const newData = {
            id: ++nextId,
            email: email,
            password: password,
            fullname: fullname,
            created: unixTimeInSeconds
        };

        objectData.data.push(newData);

        const updatedData = JSON.stringify(objectData, null, 2);
        await fsPromises.writeFile(dataFilePath, updatedData);
        return { ...newData, success: true };

    } catch (error) {
        console.log("Server error failed to create user", error);
        return { error: error, success: false };
    }

}

export async function registerUser(credentials) {
    const parsedCredentials = z
        .object({
            email: z.string().email(),
            password: z.string().min(4).max(24),
            password2: z.string().min(4).max(24),
            fullname: z.string().min(3).max(32)
        })
        .safeParse(credentials);

    if (parsedCredentials.success) {
        const { email, password, password2, fullname } = parsedCredentials.data;

        //check if user exists already
        const userExists = await getUserById(email);
        
        if (userExists.success) {
            console.log('User already exists');
            return {error: 'User already exists', success: false};
        }

        const passwordsMatch = !!(password === password2);
        if (passwordsMatch) {
            const hashedPassword = await hashPassword(password);
            const user = await createUser(email, hashedPassword, fullname);

            return user;
        }
        console.log('Passwords didnt match');
        return {error: 'Passwords didnt match', success: false};

    }

    console.log('Invalid credentials');
    return {error: 'Invalid credentials', success: false};
}