import { apiUrl } from "./App";

// Convenience functions for CRUD

async function reqNoPayload(path, type) {
    const response = await fetch(apiUrl + path, {
        method: type,
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        }
    });
    let data = {};
    try {
        data = await response.json();
    } catch(e) {
        console.log(e);
    }
    return {code: response.status, body: data};
}

async function reqWithPayload(path, payload, type) {
    const response = await fetch(apiUrl + path, {
        method: type,
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    let data = {};
    try {
        data = await response.json();
    } catch(e) {
        console.log(e);
    }
    return {code: response.status, body: data};
}

export async function apiGet(path) {
    return reqNoPayload(path, 'GET');
}

export async function apiPost(path, payload) {
    return reqWithPayload(path, payload, 'POST');
}

// Fully replace the entity, unspecified values will be null
export async function apiPut(path, payload) {
    return reqWithPayload(path, payload, 'PUT');
}

// Partially update the entity, merging values
export async function apiPatch(path, payload) {
    return reqWithPayload(path, payload, 'PATCH');
}

// It is generally recommended that delete not have a request body
// Instead, you specify the resource to be deleted on the request path
// This function combines path and target resource together, and URI encodes the resource name
export async function apiDelete(path, resource) {
    return reqNoPayload(`${path}/${encodeURIComponent(resource)}`, 'DELETE');
}
