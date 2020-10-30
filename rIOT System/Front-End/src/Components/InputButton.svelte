<script>
    export let button;
</script>


<button class="input">
    {button.name}
    {#each button.inputs as input}
        <input type="text" bind:value={input.value}>
    {/each}
    <span on:click={() => button.func(button.inputs.map(input => input.value))}>+</span>
</button>

<style>
    button {
        border: none;
        background-color: var(--color-primary);
        color: var(--color-font-2);
        margin: 5px;
    }

    .input {
        align-items: center;
        display: flex;
        justify-content: space-around;
    }

    .input > span {
        /* width: 25px; */
        /* font-size: 30px; */
        margin-left: 5px;
    }

    .input > span:hover {
        color: var(--color-secondary);
    }

    button:hover {
        cursor: pointer;
    }

    button > input {
        height: 10px;
        margin: 2.5px;
        width: 30px;
    }

    button > input:first-child {
        margin-left: 10px;
    }
</style>