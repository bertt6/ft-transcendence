async function login(event)
{
    event.preventDefault();
    console.log('login');
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(username, password);
    return false;
}