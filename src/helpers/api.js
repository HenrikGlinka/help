
const BASE_URL = 'http://localhost:3000/';

async function fetchData(endpoint, body = null) {

    const token = localStorage.getItem('token') || '';

    const url = new URL(endpoint, BASE_URL);

    const options = {
        method: body ? 'POST' : 'GET',
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

const postRequest = async (data) => await fetchData('api/requests', data);

export {
    getAllRequests,
    getOpenRequests,
    getOpenRequestsByUser,
    postRequest
};