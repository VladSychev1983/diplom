import requests

url = "http://127.0.0.1:8000/owners/"  # Replace with your actual upload URL
file_path = "test.txt"   # Replace with the path to your file

try:
    with open(file_path, "rb") as f:
        files = {"file": f}  # "file" is the form field name on the server
        cookies = {
                "sessionid": "exs37og9s7sos5hkbiawnno68lgp9fg2",
                "csrftoken": "brHGuaa6xebJnKdIOM24NkZ2F9vVZshD"
        }
        custom_headers = {
            'Content-Type': 'multipart/form-data',
            'X-CSRFToken': 'brHGuaa6xebJnKdIOM24NkZ2F9vVZshD',
            'Origin': 'http://localhost:3000',
        }
        payload = {
            'description': 'file',
            "original_name": "test.txt",
            "owner": 10
        }
        params = {
            "description": 'file',
            'original_name': 'test.txt'
        }
        
        response = requests.post(url, data=payload, files=files, headers=custom_headers, cookies=cookies)
        print(response.request.headers)
        print(response.request.body)
    if response.ok:
        print("File uploaded successfully!")
        print(response.json())  # Print the server's response
    else:
        print(f"File upload failed with status code: {response.status_code}")
        print(response.text)

except FileNotFoundError:
    print(f"Error: The file '{file_path}' was not found.")
except requests.exceptions.RequestException as e:
    print(f"An error occurred during the request: {e}")