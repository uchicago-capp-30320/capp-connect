async function _GET(url: string, headers: Headers, params: object) {
    const resp = await fetch(
        `${url}${params ? "?": ""}${new URLSearchParams(params as Record<string, string>).toString()}`,
        {headers: headers}
    )

    return resp.json();
}

  async function _POST(url: string, headers: Headers, params: object) {
    const resp = await fetch(url,
      {
        method: "POST",
        headers,
        body: JSON.stringify(params),
      }
    )
    return resp.json();
  }

  async function _PUT(url: string, headers: Headers, params: object) {
    const resp = await fetch(url,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(params),
      }
    )
    return resp.json();
  }

  async function _DELETE(url: string, headers: Headers) {
    const resp = await fetch(url,
      {
        method: "DELETE",
        headers,
      }
    )
    if (resp.status === 204) {
      return { status: 204, message: "No Content" }
    }

    return resp.json()
  }

  export default async function fetchData(url: string, method: string, params: object = {}) {
    const headers = new Headers({
      "Content-Type": "application/json",
    });

    if (method === "GET") {
      return await _GET(url, headers, params);
    } else if (method === "POST") {
      return await _POST(url, headers, params);
    } else if (method === "PUT") {
      return await _PUT(url, headers, params);
    } else if (method === "DELETE") {
      return await _DELETE(url, headers);
    } else {
      throw new Error("Unsupported HTTP method");
    }
  }
