import {request} from "./Request.js";

export function escapeHTML(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function getProfile(nickname = null) {
    if (nickname) {
        try {
            return await request(`/profile-with-nickname/${nickname}`, {method: 'GET'});
        } catch (error) {
            console.error(error)
            return null;
        }
    }
    try {
        return await request(`profile/`, {method: 'GET'});
    } catch (error) {
        console.error(error)
    }
}

export function getActiveUserNickname() {
    const nickname = localStorage.getItem('activeUserNickname');
    if (nickname === null || nickname === undefined)
        return null;
    return nickname;
}

export function parseErrorToNotify(data) {
    let message = '';
    for (const [key, value] of Object.entries(data)) {
        if (key === 'ok') continue;  // Skip 'ok' key
        if (Array.isArray(value)) {
            message += `${key}: ${value[0]}\n`;
        } else {
            message += `${key}: ${value}\n`;
        }
    }
    return message;
}
export function calculateDate(date) {
    let tweetDate = new Date(date);
    let currentDate = new Date();
    let differenceInSeconds = Math.floor((currentDate - tweetDate) / 1000);

    let minute = 60;
    let hour = minute * 60;
    let day = hour * 24;
    let week = day * 7;
    if (differenceInSeconds < minute) {
        return `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < hour) {
        return `${Math.floor(differenceInSeconds / minute)} minutes ago`;
    } else if (differenceInSeconds < day) {
        return `${Math.floor(differenceInSeconds / hour)} hours ago`;
    } else if (differenceInSeconds < week) {
        return `${Math.floor(differenceInSeconds / day)} days ago`;
    } else {
        return `${Math.floor(differenceInSeconds / week)} weeks ago`;
    }
}