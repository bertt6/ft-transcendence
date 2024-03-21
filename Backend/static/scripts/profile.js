import BaseComponent from "../components/Component.js";
import {API_URL, getCookie} from "./spa.js";

class History extends BaseComponent
{
    constructor(state,parentElement = null) {
        super(state,parentElement);
    }
}
class ProfileInfo extends BaseComponent
{
    constructor(state,parentElement = null) {
        super(state,parentElement);
    }
    handleEditHTML()
    {
        const {nickname, first_name, last_name,bio} = this.state.profile;
        return `
        <div class="profile-info-wrapper">
                <div class="profile-edit">
                    <button class="pong-button" id="edit-button">
                X
                    </button>
                </div>
        <form style="display: flex; flex-direction: column; align-items: center">
              <div class="profile-photo">
                <img
                  src="https://picsum.photos/id/237/200/300"
                  alt=""
                  class=""
                />
              </div>
              <div>
                <input class="transparent-input" value="${nickname ? nickname: "no nickname is set!"}"/>
                <input class="transparent-input"  value="${first_name ? first_name: "no first name is set"}">
              </div>
              <div>
                <textarea cols="30" rows="5"  class="transparent-input">
                ${bio ? bio : 'No bio available'}
</textarea>
                
              </div>
            </form>
        <button class="pong-button" id="save-button">save</button>
        </div>
        `
    }
    handleHTML()
    {
        const {nickname, first_name, last_name,bio} = this.state.profile;
        return `
        <div class="profile-info-wrapper">
                <div class="profile-edit">
                    <button class="pong-button" id="edit-button">
                    <img src="/static/public/edit.svg" alt="">
                    </button>
                </div>
              <div class="profile-photo">
                <img
                  src="https://picsum.photos/id/237/200/300"
                  alt=""
                  class=""
                />
              </div>
              <div>
                <h1>${nickname ? nickname: "no nickname is set!"}</h1>
                <span>${first_name ? first_name: "no first name is set"}</span>
              </div>
              <div>
                <p>
                ${bio ? bio : 'No bio available'}
                </p>
              </div>`
    }
    render() {
        this.parentElement.innerHTML = this.state.isEditing ? this.handleEditHTML() : this.handleHTML();
    }
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
        document.getElementById('edit-button').addEventListener('click', () => {
            this.setState({...this.state, isEditing: !this.state.isEditing});
        });
    }
}
async function fetchProfile()
{
    const tokens = JSON.parse(getCookie('tokens'));
    try
    {
    let response = await fetch(`${API_URL}/profile`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${tokens.access}`
        }
    });
    const data = await response.json();
    const profileParentElement = document.getElementById('profile-info');
    const profile = new ProfileInfo({profile:data,isEditing:false},profileParentElement);

    profile.render();
    const editButton = document.getElementById('edit-button');
        editButton.addEventListener('click', () => {
        profile.setState({...profile.state, isEditing: !profile.state.isEditing});
    });
    }
    catch(error)
    {
        console.error('Error:', error);
    }
}
const App = async () => {
    await fetchProfile();
}

document.addEventListener('DOMContentLoaded', App);