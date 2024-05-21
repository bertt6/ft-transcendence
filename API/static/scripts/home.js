import {notify} from "../components/Notification.js";

async function handleRouting()
{

}
async function App()
{

    console.log("App started")
    await handleRouting();
}

App().catch((error) => {
    console.error(error)
});

