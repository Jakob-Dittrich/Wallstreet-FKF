<script>
    import { onMount } from 'svelte';

    let drinks = [];

    onMount(async () => {
        // Fetch drinks data
        const response = await fetch('http://127.0.0.1:5173/api/drinks');
        drinks = await response.json();
    });

    async function updateDrinkPrice(drink) {
        // Update the drink price
        try {
            const response = await fetch(`http://127.0.0.1:5173/api/drinks`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: drink.price, newPrice: drink.newPrice , id: drink.id })
            });

            if (!response.ok) {
                console.error('Failed to update the drink price:', response.statusText);
                return;
            }

            console.log('Price updated successfully');
        } catch (error) {
            console.error('Error updating drink price:', error);
        }
    }
</script>

<!-- Drinks Table -->
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>New Price</th>
            <th>Min Group Price</th>
            <th>Max Group Price</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each drinks as drink}
            <tr>
                <td>{drink.id}</td>
                <td>{drink.name}</td>
                <td>
                    <input type="number" bind:value={drink.price} step="0.5">
                </td>
                <td>
                    <input type="number" bind:value={drink.newPrice} step="0.5">
                </td>
                <td>{drink.minPrice}</td>
                <td>{drink.maxPrice}</td>
                <td>
                    <button on:click={() => updateDrinkPrice(drink)}>Update</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
