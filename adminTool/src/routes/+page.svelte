<script>
    import Popup from "../lib/Popup.svelte"

    let showPopup = false;


    let userInput = ""; // Variable to hold the user's input

    function greetUser() {
        name = userInput; // Update name with the user's input
    }

    async function triggerMarketCrash() {
    try {
        // Make a GET request to the backend endpoint with activateCrash=true
        const response = await fetch('http://127.0.0.1:5173/api/marketCrash?activateCrash=true');

        // Check if the request was successful (status code 200)
        if (response.ok) {
            // Log a success message
            console.log('Market crash activated successfully');
        } else {
            // Log an error message
            console.error('Failed to activate market crash:', response.statusText);
        }
    } catch (error) {
        // Log any errors that occur during the request
        console.error('Error activating market crash:', error);
    }
}

    async function restoreMarket() {
    try {
        // Make a GET request to the backend endpoint with activateCrash=true
        const response = await fetch('http://127.0.0.1:5173/api/marketCrash?activateCrash=false');

        // Check if the request was successful (status code 200)
        if (response.ok) {
            // Log a success message
            console.log('Market crash activated successfully');
        } else {
            // Log an error message
            console.error('Failed to activate market crash:', response.statusText);
        }
    } catch (error) {
        // Log any errors that occur during the request
        console.error('Error activating market crash:', error);
    }

    }

</script>

<main>
    <h1>Admin Tool for Börsen FKF!</h1>
    <input type="text" bind:value={userInput} placeholder="Enter your name" />
    <button on:click={() => showPopup = true}>Greet Me</button>
    <p>
        Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
        how to build Svelte apps.
    </p>
    <h2>BörsenCrash</h2>
    <button on:click={triggerMarketCrash}>Let the stock burn!</button>
    <button on:click={restoreMarket}>Back to normal</button>

</main>

<Popup 
    message="Hello, this is a popup!" 
    show={showPopup} 
    onClose={() => showPopup = false} 
/>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #121212; /* Dark background for the entire page */
        color: #e0e0e0; /* Light text color for contrast */
        font-family: "Courier New", Courier, monospace;
    }
    main {
        text-align: center;
        padding: 1em;
        max-width: 240px;
        margin: 0 auto;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 100;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }
    input,
    button {
        margin-top: 1em;
        padding: 0.5em;
    }

    input {
        width: 70%;
        margin-right: 5px;
    }

    button {
        width: 20%;
    }
</style>
