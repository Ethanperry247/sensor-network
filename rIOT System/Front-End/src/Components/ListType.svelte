<script>
    import { getPath, runNodeTest } from './control.js';
    import Pill from './Pill.svelte';
    import Button from './Button.svelte';
    import SingleInput from './SingleInput.svelte';
    import InputButton from './InputButton.svelte';
    export let node;
    let path = [];
    $: if (node.type === 'N') {
        path = [node.ID];
    } else {
        getPath(node.ID).then(computedPath => {
            path = computedPath;
        })
    }
</script>

<div class="list-item">
    <div class="section">
        <p><strong>Node {node.ID}</strong></p>
        <Pill pillInfo={{
            status: node.status === "online" ? "healthy" : "unhealthy",
            name: node.status[0].toUpperCase() + node.status.slice(1)
        }}></Pill>
    </div>
    <div class="section">
        <p>Type: {node.type === 'N' ? "Root" : node.type === 'S' ? "Sensor" : "Relay"}</p>
    </div>
    <div class="section">
        <Button button={{
            name: "Refresh",
            func: () => {}
        }}></Button>
        <Button button={{
            name: "Test",
            func: () => runNodeTest(node.ID)
        }}></Button>
        <Button button={{
            name: "Delete",
            func: () => {}
        }}></Button>
    </div>
    <div class="section">
        <SingleInput input={{
            name: "Send",
            func: value => console.log(value)
        }}></SingleInput>
    </div>
    <div class="section">
        <InputButton button={{
            name: "Send Check In Packets",
            inputs: [{
                value: "#"
            }],
            func: values => console.log(values)
        }}></InputButton>
    </div>
    <div class="section">
        Path From Root: { path.reduce((string, element, index) => string + element + (index < path.length - 1 ? "→" : ""), []) }
    </div>
</div>

<style>
    .list-item {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        border-bottom: solid 1px var(--color-grey);
        background-color: var(--color-font-2);
    }

    .list-item:hover {
        border-color: var(--color-font);
    }

    .list-item p {
        margin: 0;
        color: var(--color-font);
    }

    .list-item > .section {
        margin: 5px 0;
        padding: 0 5px;
        border-right: solid 1px var(--color-grey);
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 125px;
    }

    .list-item > .section:hover {
        border-color: var(--color-font);
    }

    .list-item > .section:last-child {
        border: none;
    }
</style>