
function tryRefreshToken()
{

}
const App = async () => {
    if(getCookie("access_token"))
    {
        await tryRefreshToken();
    }
}

document.addEventListener('DOMContentLoaded', App);