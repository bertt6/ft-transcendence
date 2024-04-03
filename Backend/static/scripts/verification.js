import {API_URL, getCookie, setCookie} from "./spa.js";
import {request} from "./Request.js";

let inputs = document.querySelectorAll('.row input[type="number"]');
document.getElementById('singleDigitInput1').addEventListener('paste', function() {
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
            nextInput.value = 1
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
        if (response.ok) {
            setCookie('tokens', response.tokens)
        }
    }
    catch (e) {
        console.log(e.json())
    }
}

async function login(value) {
    try {
        return await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: '',
                password: '',
            })
        })
    }
    catch (e) {
        console.log(e)
    }
}