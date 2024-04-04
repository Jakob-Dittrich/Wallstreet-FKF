<script>
    import { onMount } from "svelte";
    import Chart from "chart.js/auto";

    export let drinkPrices = {};
    export let drinks = [];

    let ctx;
    let chart;
    let labels = [];
    let data = [];

    onMount(() => {
        ctx = document.getElementById("myChart");
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: data,
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                animation: false,
            },
        });
    });

    $: {
        if (ctx) {
            let cycles = Object.values(drinkPrices);
            if (cycles.length) {
                labels = Object.values(drinkPrices).map(
                    (cycle) => cycle.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                );

                let cycleDrinks = Object.keys(cycles[0]).map((label) => ({
                    id: label,
                    data: cycles.map((cycle) => cycle[label]),
                }));

                data = cycleDrinks
                    .map((cycleDrink) => ({
                        label: drinks
                            .find((drink) => drink.id == cycleDrink.id)
                            ?.name.split("0.")[0],
                        data: cycleDrink.data,
                        borderWidth: 1,
                    }))
                    .filter((cycleDrink) => cycleDrink.label);

                chart.data.labels = labels;
                chart.data.datasets = data;
                chart.update();
                console.log(cycles);
            }
        }
    }
</script>

<div>
    <h2>Price Chart</h2>
    <canvas id="myChart"></canvas>
</div>
