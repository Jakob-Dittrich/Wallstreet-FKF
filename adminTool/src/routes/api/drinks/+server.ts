import { json } from '@sveltejs/kit';
import { read, write } from '../../../lib/DatabaseAccess/databaseAccess.js';

export async function GET({ event }) {
    try {
        const companyDetails = await read(`SELECT 
		d.id, 
		d.name, 
		d.price, 
		d.newPrice, 
		dg.minPrice, 
		dg.maxPrice
	FROM 
		drinks d
		JOIN drinkGroup dg ON d.drinkGroupId = dg.id;
	`);
        return json(companyDetails);
    } catch (error) {
        console.error(error);
        // Handle the error appropriately - maybe send a 500 status code
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function PUT({ request }) {
    const { price, newPrice, id } = await request.json();

    try {
        // Perform your SQL update query here using the write function
        await write("UPDATE drinks SET price = ?, newPrice = ? WHERE id = ?", [price, newPrice, id]);

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


