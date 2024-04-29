import BaseComponent from "./Component.js";
import {escapeHTML} from "../scripts/utils.js";

export class Popup
{
    constructor(state,child)
    {
        this.state = state;
        this.child = child;
    }
    handleHtml()
    {
        return `
        <div class="popup-wrapper" id="popup-wrapper">
          <div class="popup-data-container">
          ${this.child.html}
          </div>
        </div>
        <div class="background-overlay" id="background-overlay"></div>
        `;
    }
    render()
    {
        document.body.insertAdjacentHTML('beforeend', this.handleHtml());
        let closeArea = document.getElementById('background-overlay');
        closeArea.addEventListener('click', () => {
            document.getElementById('popup-wrapper').remove();
            document.getElementById('background-overlay').remove();
        });
    }
}