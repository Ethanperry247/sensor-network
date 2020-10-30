<script>
    export let controlItems;
</script>

<div class="button-container">
    {#each controlItems as item}
        {#if item.type === "button"}
            <button class="shadow" on:click={item.action}>{item.title}</button>
        {:else if item.type === "input"}
            <button class="shadow input">
                {item.title}
                <input type="text" bind:value="{item.fieldOne}">
                <input type="text" bind:value="{item.fieldTwo}">
                <span on:click={() => item.action(item.fieldOne, item.fieldTwo)}>+</span>
            </button>
        {/if}
    {/each}
</div>

<style>

    .button-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .button-container > button {
        margin: 10px;
        background-color: var(--color-primary);
        color: var(--color-font-2);
        border: none;
        height: 40px;
        font-size: 20px;
        font-weight: 200;
    }

    .button-container > .input {
        align-items: center;
        display: flex;
        justify-content: space-around;
    }

    .button-container > .input > span {
        width: 25px;
        font-size: 30px;
        margin-left: 5px;
    }

    .button-container > .input > span:hover {
        color: var(--color-secondary);
    }

    .button-container > button:hover {
        cursor: pointer;
    }

    .button-container > button > input {
        height: 50%;
        width: 30px;
    }

    .button-container > button > input:first-child {
        margin-left: 10px;
    }
</style>