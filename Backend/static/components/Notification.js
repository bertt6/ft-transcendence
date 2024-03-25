import BaseComponent from "./Component.js";

class Notification extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
        this.handleHTML();
    }
    handleHTML() {
        this.html =  `
      <div class="notification-wrapper" id="notification">
        <div class="notification-message-wrapper">
          <div>
            <img src="/static/public/${this.state.type ==="error" ? "error.svg" : "success.svg"}" alt="" />
          </div>
          <span>${this.state.message}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" id="progress-bar"></div>
        </div>
      </div>`;
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.handleHTML();
        this.render();
    }
    render() {
        if (this.html === null) {
            throw new Error('Notification should have an html');
        }
        let div =     document.createElement('div')
        div.innerHTML = this.html;
        div.id = 'not-wrapper'
        this.parentElement.appendChild(div);
    }
}
function setProgressBarWithTime(time) {
  let element = document.getElementById("progress-bar");
  let width = 100;
  let intervalTime = (time * 1000) / width; // Calculate the interval time
  let id = setInterval(frame, intervalTime);
  function frame() {
    if (width <= 0) {
      clearInterval(id);
    } else {
      width--;
      element.style.width = width + "%";
    }
  }
}

export function notify(message,time=3,type) {
    let parentElement = document.getElementById('main');
    const notification = new Notification({ type:type , message:message}, parentElement);

    notification.render();
    setProgressBarWithTime(time);
    setTimeout(() => {
        document.getElementById('not-wrapper').remove();
    }, time * 1000);
}