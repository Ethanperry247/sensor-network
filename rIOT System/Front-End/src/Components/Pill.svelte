<script>
    export let pillInfo;
</script>

<div class="{pillInfo.status} pill">
    <p>{pillInfo.name}</p>
</div>

<style>
    .pill {
        background-color: white;
        border-radius: 25px;
        min-width: 50px;
        text-align: center;
    }

    .pill p {
        color: var(--color-font);
        font-size: 12px;
        margin: 0;
        padding: 1px 3px;
    }

    .pill.healthy {
        background-color: var(--color-healthy);
    }

    .pill.warning {
        background-color: var(--color-warning);
    }

    .pill.unhealthy {
        background-color: var(--color-unhealthy);
    }

    .pill.info {
        background-color: var(--color-info);
    }
</style>