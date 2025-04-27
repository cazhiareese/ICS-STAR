import requests
from dotenv import load_dotenv
import os
load_dotenv()
APP_ID = os.getenv('FACEBOOK_APP_ID')
APP_SECRET = os.getenv('FACEBOOK_APP_SECRET')

token_url = f"https://graph.facebook.com/oauth/access_token?client_id={APP_ID}&client_secret={APP_SECRET}&grant_type=client_credentials"
response = requests.get(token_url)
access_token = response.json()['access_token']
print("Access Token:", access_token)

page_name = "ICS.UPLB"
page_url = f"https://graph.facebook.com/{page_name}?access_token={access_token}"
response = requests.get(page_url)
print(response.json())