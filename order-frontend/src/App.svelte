<script>
    import { Router, Link, Route } from "svelte-routing";

    import drink from "./Drink.svelte"; // Import your Drink component
    import Home from "./Home.svelte"; // Import a Home component if you have one
    import Order from "./Order.svelte";
    import Profit from "./Profit.svelte";

    export let url = "";
</script>

<Router {url}>
    <nav>
        <Link to="/">Home</Link>
        <Link to="/drinks">Drinks</Link>
        <Link to="/order">Order</Link>
        <Link to="/profit">Profit</Link>
    </nav>
    <div>
        <Route path="/drinks" component={drink} />
        <Route path="/"><Home /></Route>
        <Route path="/order" component={Order} />
        <Route path="/profit" component={Profit} />
    </div>
</Router>
