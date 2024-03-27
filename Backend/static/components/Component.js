export default class BaseComponent {
  constructor(state,parentElement = null) {
    this.state = state;
    this.parentElement = parentElement ?  parentElement : null;
    this.html = null;
  }
    render() {
    if(this.html === null)
      throw new Error('Component Should have an html');
    this.parentElement.innerHTML = this.html;
    }
}