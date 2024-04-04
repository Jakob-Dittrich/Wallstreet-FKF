import { json } from '@sveltejs/kit';
import { read,write } from '../../../lib/DatabaseAccess/databaseAccess.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    // Fetching 'setting' from the URL query parameters
    const setting = url.searchParams.get('setting');


    try {
        const result = await read("SELECT setting_value FROM appSettings WHERE setting_key = ?", [setting]);
        return new Response(JSON.stringify(result), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Database read error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}


