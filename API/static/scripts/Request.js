import {getCookie} from "./spa.js";

const responses = new Map()

export async function request(url, options = {}) {

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    }
    const access_token = getCookie('access_token');
    if (access_token) {
        defaultOptions.headers['Authorization'] = `Bearer ${access_token}`;
    }
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    if (mergedOptions.headers['Content-Type'] === '') {
        delete mergedOptions.headers['Content-Type'];
    }
    const fullUrl = `/api/v1/${url}`
    if (options.method === 'GET' && responses.has(fullUrl)) {
        return responses.get(fullUrl)
    }
    try {
        const response = await fetch(fullUrl, mergedOptions)
        const data = await response.json()
        if (response.method === 'GET' && response.ok)
            responses.set(fullUrl, data)
        data.ok = response.ok
        return data
    } catch (e) {
        console.error(e);
    }
}