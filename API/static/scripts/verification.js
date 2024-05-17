import {setCookie, loadPage} from "./spa.js";
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
        await postVerificationCode(value).then(() => {
            const player = document.getElementById('player');
            player.volume = 0.1;
            player.play();
            player.onended = function () {
                player.currentTime = 0;
                player.play();
            };
        })
    }
})


async function postVerificationCode(value) {
    try {
        let response = await request(`auth/email-verification/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                verification_code: value,
            }),
        });

        setCookie('access_token', response.tokens.access, 1);
        setCookie('refresh_token', response.tokens.refresh, 30);
        loadPage('/home/')
        notify('Successfully verified', 3, 'success')
        localStorage.removeItem("timer")
    }
    catch (e) {
        console.log(e.json())
    }
}

function startTimer()
{
    let time = JSON.parse(localStorage.getItem("timer"))
    let minutes = 14;
    let seconds = 59;

    if (time) {
        minutes = time.minutes
        seconds = time.seconds
    }

    let timer = setInterval(function() {
        let timerElement = document.getElementById('timer');
        if (timerElement) {
            let time_info
            if (minutes < 10 && seconds < 10)
                time_info = `0${minutes}:0${seconds}`
            else if (minutes < 10)
                time_info = `0${minutes}:${seconds}`
            else if (seconds < 10)
                time_info = `${minutes}:0${seconds}`
            else
                time_info = `${minutes}:${seconds}`
            timerElement.innerText = time_info;
        }
        if(minutes === 0 && seconds === 0)
        {
            clearInterval(timer);
            document.getElementById('timer').innerText = '00:00';
            loadPage("/auth/login/")
        }
        if (seconds === 0) {
            minutes--;
            seconds = 59;
        }
        else
            seconds--;
        localStorage.setItem("timer", JSON.stringify({"minutes": minutes, "seconds": seconds}));
    }, 1000)
}

startTimer()

