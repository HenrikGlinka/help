
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

        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

       return await response.json();

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

const getAllRequests = async () => await fetchData('api/requests/all');
const getOpenRequests = async (group) => await fetchData(`api/requests/${group.toLowerCase()}/open`);
const getOpenRequestsByUser = async () => await fetchData('api/requests/open');
const getAllGroups = async () => await fetchData('api/groups/all');
const getUserInfo = async () => await fetchData('api/users/me');

const postRequest = async (data) => await fetchData('api/requests', 'POST', data);
const postRegister = async (data) => await fetchData('api/users/register', 'POST', data);
const postLogin = async (data) => await fetchData('api/users/login', 'POST', data);

const startRequest = async (id) => await fetchData(`api/requests/${id}/start`, 'PUT');
const completeRequest = async (id) => await fetchData(`api/requests/${id}/complete`, 'PUT');

export {
    getAllRequests,
    getOpenRequests,
    getOpenRequestsByUser,
    getAllGroups,
    getUserInfo,
    postRequest,
    postRegister,
    postLogin,
    startRequest,
    completeRequest
};