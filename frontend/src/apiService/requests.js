//registration request.
const HOST_URL = 'http://localhost:8000';

const signUP = async (formData) => {
    const response = await fetch(HOST_URL + '/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': 'get it from cookie',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
    });
    return response
}

export { signUP } 