import requests
from requests_toolbelt import MultipartEncoder

url = "http://127.0.0.1:8000/owners/"  # Replace with your actual upload URL
file_path = "test.txt"   # Replace with the path to your file


try:
    with open(file_path, "rb") as f:
        files = {"file": f}  # "file" is the form field name on the server
        cookies = {
                "sessionid": "k068of08zopt5vuhrnx46vinxvjhmcm5",
                "csrftoken": "PLMpsWTZKh1t1Ttfksb8h2CJwCYjDF4J"
        }
        # custom_headers = {
        #     'X-CSRFToken': 'PLMpsWTZKh1t1Ttfksb8h2CJwCYjDF4J',
        #     'Origin': 'http://localhost:3000',
        # }
        payload = {
            'description': 'New file',
            "original_name": "test.txt",
            "owner": "1"
        }
        params = {
            "description": 'file',
            'original_name': 'test.txt'
        }
        #test muliti part form
        
        multipart_data = MultipartEncoder(
        fields={
        'description': 'New file',
        'original_name': "test.txt",
        "owner": "1",
        'file': (file_path, f, 'text/plain')
         }
        )
        
        custom_headers = {
            'Content-Type': multipart_data.content_type,
            'X-CSRFToken': 'PLMpsWTZKh1t1Ttfksb8h2CJwCYjDF4J',
            'Origin': 'http://localhost:3000',
        }
        response = requests.post(url, data=multipart_data, headers=custom_headers, cookies=cookies)
        #response = requests.post(url, data=payload, files=files, headers=custom_headers, cookies=cookies)
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