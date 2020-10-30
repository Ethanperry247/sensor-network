<script>
    const slotLength = 200;
    const slotPadding= 10;
    let dashboard = document.createElement("div");
    let slots = new Array();
    let dashboardHeight = 0;
    let dashboardWidth = 0;
    let rows = 0;
    let cols = 0;
    let currentDragOver = -1;

    const handleDragOver = (event, index) => {
        currentDragOver = index;
    };

    const handleDragEnd = (event, index) => {
        console.log("Box " + index + " dropped on " + currentDragOver);
        moveElement(index, currentDragOver);
        currentDragOver = -1;
    };

    const moveElement = (startingIndex, endingIndex) => {
        document.getElementById("slot" + endingIndex).appendChild(document.getElementById("panel"));
    };

    const handleClose = () => {
        document.getElementById("panel").remove();
    }
    
    $: {
        rows = Math.floor(dashboardHeight / (slotLength + slotPadding * 2));
        cols = Math.floor(dashboardWidth / (slotLength + slotPadding * 2));
        slots = new Array(rows * cols);
    }

</script>

<div bind:clientWidth={dashboardWidth} bind:clientHeight={dashboardHeight} class="dashboard">
    {#each slots as slot, index}
        <div id="slot{index}" 
            on:dragover={(event) => handleDragOver(event, index)} 
            class="slot" 
            style="--padding: {slotPadding}px; --length: {slotLength}px">
            {#if index === 0}
                <div id="panel" draggable="true"
                    on:dragend={(event) => handleDragEnd(event, index)} 
                    class="shadow panel">
                    <div class="title">
                        <h3>Example</h3>
                        <h3 on:click={handleClose} class="exit">&#10005;</h3>
                    </div>
                </div>
            {/if}
        </div>
    {/each}
</div>


<!-- <div draggable="true" class="clickable shadow double panel">
    <div class="title">
        <h3>Example</h3>
        <h3 class="exit">&#10005;</h3>
    </div>
</div>
<div draggable="true" class="clickable shadow empty panel">
    <div>
        <h1>+</h1>
        <h3>Add Item</h3>
    </div>
</div> -->