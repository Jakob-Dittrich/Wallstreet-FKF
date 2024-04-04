<script>
    import io from "socket.io-client";
    import { onDestroy, onMount } from "svelte";

    const backendUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;

    let socket;
    let profitOrLoss = 0;

    onMount(async () => {
        getProfitOrLoss();
        
        socket = io(backendUrl);

        socket.on("connect", () => {
            console.log("Connected to socket.io server");
        });

        socket.on("start_time", () => {
            getProfitOrLoss();
        });
    });

    onDestroy(() => {
        console.log("onDestroy called");
        socket.close();
    });

    async function getProfitOrLoss() {
        try {
            const response = await fetch(backendUrl + "/api/profitOrLoss");
            if (response.ok) {
                const data = await response.json();
                console.log("profit=" + data);
                profitOrLoss = data;
            } else {
                console.error("Failed to fetch profit or loss");
            }
        } catch (error) {
            console.error("Error fetching profit or loss:", error);
        }
    }
</script>

<div class="header-container">
    <h1>Börsen FKF!</h1>
    <div class="profit-loss-display {profitOrLoss >= 0 ? 'profit' : 'loss'}">
        Profit/Loss: {profitOrLoss.toFixed(2)}€
    </div>
</div>

<style>
    .profit-loss-display {
        font-weight: bold;
        margin-right: 10px;
    }

    .profit-loss-display.profit {
        color: green;
    }

    .profit-loss-display.loss {
        color: red;
    }
</style>
