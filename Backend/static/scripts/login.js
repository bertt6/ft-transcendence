async function login(event)
{
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(username, password);
    return false;
}

window.onhashchange = function(event) {
    console.log('hash changed' ,window.location.origin + " / "+ window.location.hash.split('#')[1]);
    location.replace(window.location.origin + "/auth/"+ window.location.hash.split('#')[1]);
}