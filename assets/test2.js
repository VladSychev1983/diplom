document.getElementById('regForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы
    // alert('login form')
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const loginData = {
        username: username,
        password: password
    };

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', { // Replace with your actual login endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' // Optional: indicate desired response format
            },
            body: JSON.stringify(loginData),
            credentials: 'include' // Include cookies if necessary
        });

        if (!response.ok) {
            // Handle HTTP errors (e.g., 401 Unauthorized)
            const errorData = await response.json();
            alert(`Login failed: ${errorData.message || 'Unknown error'}`);
            return;
        }

        const result = await response.json();

        if (result.success) { // Assuming your API returns a 'success' flag
            alert('Login successful!');
            //window.location.href = '/dashboard'; // Redirect to dashboard
        } else {
            alert(`Login failed: ${result.message || 'Invalid credentials'}`);
        }

    } catch (error) {
        console.error('Network or other error:', error);
        alert('An error occurred during login. Please try again.');
    }
})