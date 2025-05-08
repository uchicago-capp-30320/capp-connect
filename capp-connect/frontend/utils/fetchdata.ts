async function _GET(url: string, headers: Headers, params: Object) {
    const resp = await fetch(
        `${url}${new URLSearchParams(params as Record<string, string>).toString()}`,
        {headers: headers}
    )

    return resp.json();
}

async function _POST(url: string, headers: Headers, params: Object) {
    const resp = await fetch(url,
        {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params)
        }
    )
    return resp.json()
}

export default async function fetchData(url: string, method: string, params: Object) {
    const headers = new Headers({
        'Content-Type': 'application/json'
    })

    if (method == "GET") {
        return await _GET(url, headers, params);
    } else if (method == "POST") {
        return await _POST(url, headers, params)
    } else {
        throw new Error("Unsupported HTTP method")
    }
}
