<script>
    export let button;
</script>

<button on:click={button.func}>{button.name}</button>

<style>
    button {
        border: none;
        background-color: var(--color-primary);
        color: var(--color-font-2);
        margin: 5px;
    }

    button:hover {
        cursor: pointer;
    }

    button:focus {
        background-color: var(--color-secondary);
    }
</style>