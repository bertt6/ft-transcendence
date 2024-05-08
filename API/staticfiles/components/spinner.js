
import  BaseComponent from './Component.js';

export default class Spinner extends BaseComponent {
    constructor(state,parentElement) {
        super(state,parentElement);
        this.html = `
    <div class="lds-ring ${this.state.isVisible ? "visible": "hidden"}
        ${this.state.className ? 
        this.state.className : ""}
        ">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    </div>`;
    }

    handleHtml() {
        if(this.html === null)
        {
            throw new Error('Spinner html is not defined');
        }
        this.html = this.html.replace('visible', 'hidden');
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.handleHtml();
        this.render();
    }
}