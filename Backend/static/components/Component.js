export default class BaseComponent {
  constructor(state,parentElement = null) {
    this.state = state;
    this.parentElement = parentElement ?  parentElement : null;
    this.html = null;
  }
    render() {
      console.log(this.html, this.parentElement)
        if(this.parentElement && this.html){
            this.parentElement.innerHTML = this.html;
        }
    }


}