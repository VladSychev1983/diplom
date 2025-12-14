import Cookies from 'js-cookie'

//registration request.
const HOST_URL = 'http://localhost:8000';

export function get_csrf_token() {
    return fetch(`${HOST_URL}/api/get-csrf/`)
}

console.log('[Requests.js] X-CSRFToken:', Cookies.get('csrftoken'))

//user registration
const signUP = async (formData) => {
    const response = await fetch(HOST_URL + '/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(formData),
        credentials: 'include',
    });
    return response
}
//user logout
const logout =  async () => {
  const response = await fetch(`${HOST_URL}/api/logout`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': Cookies.get('csrftoken'),
      cookie: `sessionid=${Cookies.get('sessionid')}`,
    },
  });
  return response;
}
//user login
const signIN = async (formData) => {
    const response = await fetch(HOST_URL + '/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(formData),
        credentials: 'include',
    });
    return response;
}

export { signUP, logout, signIN }