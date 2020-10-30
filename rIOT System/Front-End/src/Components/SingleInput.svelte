<script>
    import Button from './Button.svelte';
    export let input;
    let value;
</script>

<div class="input">
    <input bind:value={value}>
    <Button button={{
        name: input.name,
        func: () => input.func(value)
    }}></Button>
</div>

<style>


.input {
        display: flex;
        width: 100%;
    }

    .input > input {
        margin: 5px;
        width: 80%;
    }
</style>