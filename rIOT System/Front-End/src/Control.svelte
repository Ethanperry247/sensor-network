<script>
    import { reportOnlineNodes } from './Components/control.js';
    import Button from './Components/Button.svelte';
    import ListType from './Components/ListType.svelte';
    export let nodes;
    $: nodes.sort((node, compare) => node.ID - compare.ID);
</script>


<section>
    {#each nodes as node}
        <ListType node={node}></ListType>
    {/each}
    <Button button={{
        name: "Refresh",
        func: () => {
            nodes.forEach((node, index) => {
                nodes[index].status = "Checking...";
            });
            reportOnlineNodes().then(onlineNodes => {
                nodes.forEach((node, index) => {    
                    if (onlineNodes.includes(node.ID)) {
                        nodes[index].status = "online"
                    } else {
                        nodes[index].status = "offline"
                    }
                });
            });
        }
    }}></Button>

    <!-- <div class="control-item-container">
        {#each nodes as node}
            <div class="shadow control-item">
                <div class="control-banner">
                    <h3>Node {node.id}</h3>
                    <div class="{node.status} shadow status-circle"></div>
                </div>
                <div class="control-panel">
                    <button class="shadow">Restart</button>
                    <button class="shadow">Test</button>
                    <button class="shadow">Delete</button>
                    <div class="input">
                        <input>
                        <button class="shadow">Send</button>
                    </div>
                </div>
            </div>
        {/each}
    </div> -->
</section>

<style>
    .control-item-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 10px;
    }

    .control-item {
        /* height: 100px; */
        width: 200px;
        border: solid var(--color-primary);
        margin: 10px;
        position: relative;
    }

    .control-item > .control-banner {
        padding: 0 10px;
        margin: 0;
        background-color: var(--color-primary);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .control-item > .control-banner > h3 {
        color: var(--color-font-2);
        font-weight: 200;
    }

    .control-item > .control-banner > .status-circle {
        height: 30px;
        width: 30px;
        border: solid black 1px;
        border-radius: 50%;
    }

    .status-circle.online {
        background-color: lightgreen;
    }

    .status-circle.offline {
        background-color: lightcoral;
    }

    .control-item > .control-panel {
        /* height: 60%; */
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .control-item > .control-panel button {
        border: none;
        background-color: var(--color-primary);
        color: var(--color-font-2);
        margin: 5px;
    }

    .control-item > .control-panel button:hover {
        cursor: pointer;
    }

    .control-item > .control-panel button:focus {
        background-color: var(--color-secondary);
    }

    .control-item > .control-panel > .input {
        display: flex;
        width: 100%;
    }

    .control-item > .control-panel > .input > input {
        margin: 5px;
        width: 80%;
    }
</style>