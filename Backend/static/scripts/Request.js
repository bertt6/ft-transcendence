const responses = new Map()

export async function request(url, options = {}) {
    if(options.method === 'GET' && responses.has(url)) {
        return responses.get(url)
    }
    const response = await fetch(url, options)
    let data = await response.json()
    responses.set(url, data)
    return data;
}