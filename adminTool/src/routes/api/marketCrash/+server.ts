import { json } from '@sveltejs/kit';
import { read,write } from '../../../lib/DatabaseAccess/databaseAccess.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
    // Parsing the request query parameter to get the value of 'activateCrash'
    const activateCrash = url.searchParams.get('activateCrash');

    try {
        // If 'activateCrash' is true, update drinks and set appSetting to 1
        if (activateCrash === 'true') {
            // Fetch all drinks from the API
            const response = await fetch('http://127.0.0.1:5173/api/drinks');
            const drinks = await response.json();

            // Set appSetting to 1
            await write("UPDATE appSettings SET setting_value = 0 WHERE setting_key = 'updatePrices'");

            // Iterate through each drink and update its price
            for (const drink of drinks) {
                // Calculate the new price (minimum price + 1)
                const newPrice = drink.minPrice + 1;

                // Update the drink's price in the database
                await write("UPDATE drinks SET price = ?, newPrice = ? WHERE id = ?", [newPrice, newPrice-0.5, drink.id]);
            }


            return new Response('Prices updated successfully', { status: 200 });
        } else if (activateCrash === 'false') {
            // Set appSetting to 0
            await write("UPDATE appSettings SET setting_value = 1 WHERE setting_key = 'updatePrices'");
            
            return new Response('Market crash deactivated', { status: 200 });
        } else {
            return new Response('Invalid value for activateCrash', { status: 400 });
        }
    } catch (error) {
        console.error('Error updating prices:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
