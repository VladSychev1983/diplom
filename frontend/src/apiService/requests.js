import Cookies from 'js-cookie'

//registration request.
const HOST_URL = 'http://localhost:8000';

export function get_csrf_token() {
    return fetch(`${HOST_URL}/api/get-csrf/`)
}

console.log('X-CSRFToken:', Cookies.get('csrftoken'))

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

export { signUP }