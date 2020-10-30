<script>
    import Assemble from './Assemble.svelte';
    import Banner from './Components/Banner.svelte';
    import Control from './Control.svelte';
    import Nav from "./Components/Nav.svelte";
    import Nodes from './Nodes.svelte';
    import Dashboard from "./Dashboard.svelte";
    import Test from './Test.svelte';
    const navItems = ["IOT Dashboard", "Welcome User"];
    const sideNavItems = ["Assemble", "Control", "Test"];
    let nodes = [{
        ID: 1,
        status: "online",
    }, {
        ID: 2,
        status: "online",
    }, {
        ID: 3,
        status: "offline",
    }, {
        ID: 6,
        status: "online",
    }, {
        ID: 4,
        status: "online",
    }, {
        ID: 5,
        status: "online",
    }];
    let networkStatus;
    $: {
        const totalNodes = nodes.length;
        const offlineNodes = nodes.filter(node => node.status === "offline").length;
        networkStatus = {
            status: totalNodes === 0 ? "unhealthy" 
                : offlineNodes === 0 ? "healthy" 
                : offlineNodes / totalNodes < 1 ? "warning"
                : "unhealthy",
            name: totalNodes === 0 ? "Offline" 
                : offlineNodes === 0 ? "Online" 
                : offlineNodes / totalNodes < 1 ? "Weak"
                : "Offline",
        }
    }
</script>

<Nav networkStatus={networkStatus} sideNavItems={sideNavItems} navItems={navItems}></Nav>
<!-- <Banner title={sideNavItems[0]}></Banner>
<Dashboard></Dashboard> -->
<Banner title={sideNavItems[0]}></Banner>
<Assemble bind:nodes></Assemble>
<Banner title={sideNavItems[1]}></Banner>
<Control nodes={nodes}></Control>
<Banner title={sideNavItems[2]}></Banner>
<Test></Test>