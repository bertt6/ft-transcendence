import {API_URL, getCookie, setCookie,loadPage} from "./spa.js";
import {request} from "./Request.js";

import {notify} from "../components/Notification.js";
let inputs = document.querySelectorAll('.row input[type="number"]');
document.getElementById('singleDigitInput1').addEventListener('paste', function(event) {
    let pastedData = (event.clipboardData || window.clipboardData).getData('text');
    for (let i = 0; i < Math.min(pastedData.length, inputs.length); i++) {
        inputs[i].value = pastedData[i];
    }
})

inputs.forEach(function(input, index) {
    input.addEventListener('input', function() {
        let nextInput = inputs[index + 1]
        if (nextInput && this.value.length && !nextInput.value.length) {
            nextInput.focus();
        }
        if (this.value.length > 1) {
            this.value = this.value.slice(0,1);
        }
    })
})


document.getElementById("verify").addEventListener("click", async function() {
    let value = '';
    inputs.forEach(function(input) {
        value += input.value
    });
    if (value.length !== 6) {
        alert('Wrong code format!')
    }
    else {
        await postVerificationCode(value)
        var player = document.getElementById('player');
        player.play();
    }
})


async function postVerificationCode(value) {
    try {
        let response = await request(`${API_URL}/email-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: localStorage.getItem('username'),
                verification_code: value,
            }),
        });

        setCookie('access_token', response.tokens.access, 1);
        setCookie('refresh_token', response.tokens.refresh, 1);
        loadPage('/home/')
        notify('Successfully verified', 3, 'success')
    }
    catch (e) {
        console.log(e.json())
    }
}

function startTimer()
{
    let minutes = 14;
    let seconds = 59;
    let timer = setInterval(function() {
        document.getElementById('timer').innerText = `${minutes}:${seconds}`;
        if(minutes === 0 && seconds === 0)
        {
            clearInterval(timer);
            document.getElementById('timer').innerText = '0:0';
        }
    if(seconds === 0 )
        {
            minutes--;
            seconds = 59;
        }
        else
            seconds--;

    }, 1000)
}
startTimer()

