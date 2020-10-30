<script>
        import Button from './Components/Button.svelte';
        import { runNetworkTest } from './Components/control.js'; 
        import InputButton from './Components/InputButton.svelte';
        import ControlBar from './Components/ControlBar.svelte';
</script>

<section>
        <div class="ui-container">
                <Button button={{
                        name: "Sensors, Relays, and Base Stations",
                        func: runNetworkTest
                    }}></Button>
                <InputButton button={{
                        name: "Change Packet Size/Iterations",
                        inputs: [{
                        value: "Packet Size"
                        }, {
                        value: "Iterations"
                        }],
                        func: (values) => {},
                }}></InputButton>
                <InputButton button={{
                        name: "Run Test on Individual Node",
                        inputs: [{
                        value: "ID"
                        }],
                        func: (values) => {},
                }}></InputButton>
                <InputButton button={{
                        name: "Run Multiple Tests",
                        inputs: [{
                                value: "#"
                        }],
                        func: (values) => {},
                }}></InputButton>
        </div>
</section>
        
<style>
    .ui-container {
        padding: 15px;
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
    }
</style>