
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

       return await response.json();

    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

const getAllRequests = async () => await fetchData('api/requests/all');
const getOpenRequests = async (group) => await fetchData(`api/requests/${group?.toLowerCase()}/open`);
const getOpenRequestsByUser = async () => await fetchData('api/requests/open');
const getAllGroups = async () => await fetchData('api/groups/all');

const getUserInfo = async () => {
    await refreshToken();

    return await fetchData('api/users/me');
}

const getUserProfile = async (id) => await fetchData(`api/users/${id}/profile`);

const postRequest = async (data) => await fetchData('api/requests', 'POST', data);
const postRegister = async (data) => await fetchData('api/users/register', 'POST', data);
const postLogin = async (data) => await fetchData('api/users/login', 'POST', data);

const startRequest = async (ticketId) => await fetchData(`api/requests/${ticketId}/start`, 'PUT');
const completeRequest = async (ticketId) => await fetchData(`api/requests/${ticketId}/complete`, 'PUT');

const getInvites = async () => await fetchData('api/invites');
const addInvite = async (data) => await fetchData('api/invites', 'POST', data);
const deleteInvite = async (inviteId) => await fetchData(`api/invites/${inviteId}`, 'DELETE');

const changeUserGroup = async (userId, group) => {

    await fetchData(`api/users/${userId}/group`, 'PUT', { group: group.toUpperCase() });

    refreshToken();
};

const changePassword = async (data) => await fetchData('api/users/me/password', 'PUT', data);

const refreshToken = async () => {
    const { token } = await fetchData('api/users/me/refresh', 'GET');
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
};

const getLeaderboard = async () => await fetchData('api/leaderboard');

export {
    getAllRequests,
    getOpenRequests,
    getOpenRequestsByUser,
    getAllGroups,
    getUserInfo,
    getUserProfile,
    getLeaderboard,
    postRequest,
    postRegister,
    postLogin,
    startRequest,
    completeRequest,
    getInvites,
    addInvite,
    deleteInvite,
    changeUserGroup,
    changePassword,
    refreshToken,
};