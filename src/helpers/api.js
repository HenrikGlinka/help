
const BASE_URL = import.meta.env.VITE_API_URL;

async function fetchData(endpoint, method = 'GET', body = null) {

    const token = localStorage.getItem('token') || '';

    const url = new URL(endpoint, BASE_URL);

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: body ? JSON.stringify(body) : null
    };

    try {
        const response = await fetch(url, options);

        switch (response.status) {
            case 200: 
            case 201: 
            return await response.json();
            case 401: window.location.href = '/login'; break;
            default: console.log(`Response status: ${response.status}`);
        }

    } catch (error) {
        throw error;
    }
}

const getAllRequests = async () => await fetchData('api/requests/all');
const getOpenRequests = async () => await fetchData('api/requests/all/open');
const getOpenRequestsByUser = async () => await fetchData('api/requests/open');

const postRequest = async (data) => await fetchData('api/requests', 'POST', data);

const startRequest = async (id) => await fetchData(`api/requests/${id}/start`, 'PUT');
const completeRequest = async (id) => await fetchData(`api/requests/${id}/complete`, 'PUT');

export {
    getAllRequests,
    getOpenRequests,
    getOpenRequestsByUser,
    postRequest,
    startRequest,
    completeRequest
};