import BaseComponent from "./Component.js";
const currentNotifications = [];
class Notification extends BaseComponent {
    constructor(state, parentElement = null) {
        super(state, parentElement);
    }
    handleErrorHTML() {
        return `
      <div class="notification-wrapper" id="notification">
        <div class="notification-message-wrapper">
          <div>
            <img src="/static/public/error.svg" alt="" />
          </div>
          <span>${this.state.message}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" id="progress-bar"></div>
        </div>
      </div>`;
    }
    handleSuccessHTML() {
        return  `
      <div class="notification-wrapper" id="notification">
        <div class="notification-message-wrapper">
          <div>
            <img src="/static/public/success.svg" alt="" />
          </div>
          <span>${this.state.message}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" id="progress-bar"></div>
        </div>
      </div>`;
    }
    handleFriendRequestHTML()
    {
        return `
          <div class="request-notification-wrapper" id="notification">
        <div class="request-wrapper">
          <button data-type="close" class="request-close-button">X</button>
          <div>
            <div class="request-profile-image">
              <img src="https://picsum.photos/seed/picsum/200/300" alt="" />
            </div>
            <span>${this.state.message}</span>
          </div>
          <div class="request-buttons">
            <button data-type="Accept">
              <img src="/static/public/success.svg" alt="" />
              Accept
            </button>
            <button data-type="reject">
              <img src="/static/public/error.svg" alt="" /> Reject
            </button>
          </div>
        </div>
      </div>
        `
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };

        this.render();
    }
    render() {
        switch (this.state.type) {
        case 'error':
            this.html = this.handleErrorHTML();
            break;
        case 'success':
            this.html = this.handleSuccessHTML();
            break;
        case 'friendRequest':
            this.html = this.handleFriendRequestHTML();
            break;
        }
        if (this.html === null) {
            throw new Error('Notification should have an html');
        }
      let div =document.createElement('div')
        div.innerHTML = this.html;
        div.className = "show-notification";
        div.style.top = "72px";
        this.parentElement.appendChild(div);
        this.div = div;
    }
    getNotificationElement() {
        return this.div;
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
function shiftNotifications() {
    let lastTop = 72;
    let increment = 0;
    for(let current of currentNotifications)
    {
        current.style.top = `${lastTop + increment}px`;
        if(parseInt(current.style.top) > 800)
            current.remove();
        increment += 150;
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
notify.friendRequest = function (message) {
    let parentElement = document.getElementById('main');
    const notification = new Notification({ type:"friendRequest" , message:message}, parentElement);
    notification.render();
    let createdNotification = notification.getNotificationElement();
    currentNotifications.unshift(createdNotification);
    shiftNotifications();
    let closeButton = createdNotification.querySelector('button[data-type="close"]');
    let acceptButton = createdNotification.querySelector('button[data-type="accept"]');
    let rejectButton = createdNotification.querySelector('button[data-type="reject"]');
    closeButton.addEventListener('click',() => {
        createdNotification.classList.add('request-close-transition')
        setTimeout(() => {
            createdNotification.remove();
            let element = currentNotifications.find((element) => element === createdNotification);
            currentNotifications.splice(currentNotifications.indexOf(element),1);
            shiftNotifications()
        }, 1000);

    });
}
notify.gameRequest = function (message,acceptCallback,rejectCallback) {
    let parentElement = document.getElementById('main');
    const notification = new Notification({ type:"gameRequest" , message:message}, parentElement);
    let acceptButton = document.getElementById('request-accept-button');
    let rejectButton = document.getElementById('request-reject-button');
    let closeButton = document.getElementById('request-close-button');
    acceptButton.addEventListener('click',acceptCallback);
    rejectButton.addEventListener('click',rejectCallback);
    closeButton.addEventListener('click',(event) => {
    });
    notification.render();
    setTimeout(() => {
        document.getElementById('not-wrapper').remove();
    }, time * 1000);
}