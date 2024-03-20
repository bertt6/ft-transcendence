export function Spinner() {
    return (`
    <div class="lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>
    `)
}

export function renderSpinner(parentElement) {
    const spinner = document.createElement('div');
    spinner.innerHTML = Spinner();
    parentElement.appendChild(spinner);
}