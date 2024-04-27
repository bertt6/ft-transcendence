import {loadError} from "./spa.js";

async function handleRouting()
{

}
async function App()
{
    await handleRouting();
}

App().catch((error) => {
    console.error(error)
});

