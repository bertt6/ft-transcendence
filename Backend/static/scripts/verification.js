let inputs = document.querySelectorAll('.row input[type="number"]');
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

document.getElementById("verify").addEventListener("click", function() {
    let value = '';
    inputs.forEach(function(input) {
        value += input.value
    });
    if (value.length != 6) {
        alert('Wrong code format!')
    }
    console.log(value)
})