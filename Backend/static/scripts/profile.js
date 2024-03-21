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
        <form style="display: flex; flex-direction: column; align-items: center" id="update-form">
              <div class="profile-photo">
                <img
                  src="https://picsum.photos/id/237/200/300"
                  alt=""
                  class=""
                />
              </div>
              <div>
                <input class="transparent-input" id="profile-nickname" value="${nickname ? nickname: "no nickname is set!"}"/>
                <input class="transparent-input" id="profile-firstname"  value="${first_name ? first_name: "no first name is set"}">
              </div>
              <div>
                <textarea id="profile-bio" cols="30" rows="5"  class="transparent-input">
                ${bio ? bio : 'No bio available'}
    </textarea>
                
              </div>
        <button class="pong-button" id="save-button" type="submit">save</button>
            </form>
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
    updateProfile = async (formData) => {
        const tokens = JSON.parse(getCookie('tokens'));
        try
        {
            let response = await fetch(`${API_URL}/profile`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${tokens.access}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            this.setState({...this.state, profile:data});
        }
        catch(error)
        {
            console.error('Error:', error);
        }
    }
    render() {
        this.parentElement.innerHTML = this.state.isEditing ? this.handleEditHTML() : this.handleHTML();
        const updateForm = document.getElementById('update-form');
        if(updateForm)
        {
            updateForm.addEventListener('submit', async (e) => {
                e.preventDefault()
                let formData = {
                    nickname: document.getElementById('profile-nickname').value,
                    bio: document.getElementById('profile-bio').value
                }
                await this.updateProfile(formData);
            });
        }
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