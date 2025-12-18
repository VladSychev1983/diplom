import Cookies from 'js-cookie'

//registration request.
const HOST_URL = 'http://localhost:8000';

export function get_csrf_token() {
    return fetch(`${HOST_URL}/api/get-csrf/`)
}

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

//get owner files.
const getFiles =  async () => {
  const response = await fetch(`${HOST_URL}/ownerfiles`, {
    method: 'GET',
    headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
    },
    cookie: `sessionid=${Cookies.get('sessionid')}`,
    credentials: 'include',
  });
  return response;
}
//delete owner file
const deleteFile =  async (id) => {
  const response = await fetch(`${HOST_URL}/ownerfiles/${id}/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
    cookie: `sessionid=${Cookies.get('sessionid')}`,
    credentials: 'include',
  });
  return response;
}

//upload file multipart formData.
const uploadFile =  async (formData) => {
    console.log('[Request.js] formData:',formData)
    const response = await fetch(HOST_URL + '/ownerfiles/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: formData,
        cookie: `sessionid=${Cookies.get('sessionid')}`,
        credentials: 'include',
    });
    return response;
}
//download file
const downloadFile = async (fileID) => {
  console.log('[Request.js] try to download:',fileID)
  const response = await fetch(HOST_URL +`/api/download/${fileID}/`, {
    method: 'GET',
    headers: {
            'X-CSRFToken': Cookies.get('csrftoken'),
        },
    cookie: `sessionid=${Cookies.get('sessionid')}`,
    credentials: 'include',
  });
    return response;
}

export { signUP, logout, signIN }
export { getFiles, deleteFile, uploadFile, downloadFile }