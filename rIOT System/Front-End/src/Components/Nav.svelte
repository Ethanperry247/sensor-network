<script>
    import Pill from './Pill.svelte';
    export let navItems;
    export let sideNavItems;
    export let networkStatus;
    let openSideMenu = false;

    const toggleSideMenu = () => {
        openSideMenu = !openSideMenu;
        openSideMenu ? document.documentElement.style.setProperty("--sidebar-width", "var(--sidebar)")
        : document.documentElement.style.setProperty("--sidebar-width", "0");
    };

    const scrollToSection = (section) => {
        document.getElementById(section) && document.getElementById(section).scrollIntoView();
    };
</script>

<div class="shortcuts">
    <ul>
        <li on:click={toggleSideMenu} class="clickable">&#9776;</li>
        {#each sideNavItems as item}
            <li on:click={() => scrollToSection(item)} class="clickable">{item[0]}</li>
        {/each}
    </ul>
</div>

<div class="sidebar">
    <ul>
        <li on:click={toggleSideMenu} class="clickable">&#9776;</li>
        {#each sideNavItems as item}
            <li on:click={() => scrollToSection(item)} class="clickable">{item}</li>
        {/each}
    </ul>
</div>

<div class="nav">
    <ul>
        <li on:click={toggleSideMenu} class="clickable">&#9776;</li>
        <Pill pillInfo={networkStatus}></Pill>
        {#each navItems as item}
            <li class="clickable">{item}</li>
        {/each}  
    </ul>
</div>

<style>
    .shortcuts {
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        overflow-x: hidden;
        background-color: var(--color-primary);
        width: 40px;
    }

    /* Sidebar Styles */
    .sidebar {
        height: 100%;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        overflow-x: hidden;
        background-color: var(--color-primary);
        width: var(--sidebar-width);
        transition: var(--transition-duration);
    }

    .sidebar ul, .shortcuts ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .sidebar li {
        color: var(--color-font-2);
        padding: 10px 40px 10px 10px;
        transition: var(--transition-duration);
    }

    .shortcuts li {
        padding: 10px;
        color: var(--color-font-2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-duration);
    }

    .sidebar li:first-child, .shortcuts li:first-child {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .sidebar li:hover, .shortcuts li:hover {
        background-color: var(--color-hover);
        transition: var(--transition-duration);
    }

    /* Nav Styles */
    .nav {
        background-color: var(--color-primary);
        position: sticky;
        top: 0;
        z-index: 999;
    }

    .nav>ul {
        display: flex;
        align-items: center;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .nav li {
        padding: 10px;
        color: var(--color-font-2);
        transition: var(--transition-duration);
    }

    .nav li:first-child {
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
    }

    .nav ul :last-child {
        margin-left: auto;
    }

    .nav li:hover {
        background-color: var(--color-hover);
        transition: var(--transition-duration);
    }
</style>