import { json } from '@sveltejs/kit';
import { read,write } from '../../../lib/DatabaseAccess/databaseAccess.js';

export async function GET({event}) {
    try {
        const companyDetails = await read("SELECT * FROM drinkGroup");
        return json(companyDetails);
    } catch (error) {
        console.error(error);
        // Handle the error appropriately - maybe send a 500 status code
        return new Response('Internal Server Error', { status: 500 });
    }
}

// Handler for PUT requests
export async function PUT({ request }) {
    try {
        const { id, minPrice, maxPrice } = await request.json();
        await write("UPDATE drinkGroup SET minPrice = ?, maxPrice = ? WHERE id = ?", [minPrice, maxPrice, id]);
        return new Response(JSON.stringify({ message: 'Update successful' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Database write error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

