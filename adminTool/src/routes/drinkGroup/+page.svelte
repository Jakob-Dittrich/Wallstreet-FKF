<script>
    import { onMount } from 'svelte';

    let drinkGroups = [];
    let selectedGroup = null;
    let minPrice = '';
    let maxPrice = '';

    onMount(async () => {
        const response = await fetch('http://127.0.0.1:5173/api/drinkGroup');
        drinkGroups = await response.json();
    });

    function handleGroupChange(event) {
        const groupId = parseInt(event.target.value);
        selectedGroup = drinkGroups.find(group => group.id === groupId);
        minPrice = selectedGroup.minPrice;
        maxPrice = selectedGroup.maxPrice;
    }

    async function updatePrices() {
    console.log('Updating prices for', selectedGroup.name, minPrice, maxPrice);

    try {
        // Make a PUT request to the server
        const response = await fetch(`http://127.0.0.1:5173/api/drinkGroup`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                minPrice: minPrice,
                maxPrice: maxPrice,
                id: selectedGroup.id
            
            })
        });

        if (!response.ok) {
            // Handle errors, e.g., show a message to the user
            console.error('Failed to update the prices:', response.statusText);
            return;
        }

        // You can process the response further if needed
        const result = await response.json();
        console.log('Update successful:', result);
    } catch (error) {
        console.error('Error updating prices:', error);
    }
}
</script>

<!-- Dropdown for selecting a drink group -->
<select on:change={handleGroupChange}>
    <option value="">Select a Drink Group</option>
    {#each drinkGroups as group}
        <option value={group.id}>{group.name}</option>
    {/each}
</select>

{#if selectedGroup}
    <!-- Form to display and modify min and max prices -->
    <form on:submit|preventDefault={updatePrices}>
        <div>
            <span><strong>ID:</strong> {selectedGroup.id}</span>
        </div>
        <div>
            <span><strong>Name:</strong> {selectedGroup.name}</span>
        </div>
        <div>
            <label for="minPrice">Min Price:</label>
            <input type="number" id="minPrice" bind:value={minPrice} step="0.5">
        </div>
        <div>
            <label for="maxPrice">Max Price:</label>
            <input type="number" id="maxPrice" bind:value={maxPrice} step="0.5">
        </div>
        <button type="submit">Update Prices</button>
    </form>
{/if}


