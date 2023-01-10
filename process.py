import json
import requests
import random
import time
import tweepy

# Loading configuration
with open('config.json', 'r') as f:
    config = json.load(f)

# Initializing variables
page_increment = 1
dupe_array = []

# Twitter API Credentials 
consumer_key = config["consumer_key"]
consumer_secret = config["consumer_secret"]
access_token = config["access_token"]
access_token_secret = config["access_token_secret"]

# Connecting to the API using the credentials
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)

# Main function that retrieves and tweets a random release
def go():
    try:
        # Retrieving a random release from the collection
        response = requests.get(f'http://api.discogs.com/users/vinylmemory/collection?page={page_increment}&per_page=1000', headers={'user-agent': 'vinylmemory/0.1'})
        if response.status_code != 200:
            raise ValueError("Unexpected status code returned by API")
        collection = response.json()
        records = collection['releases']
        random_record = None
        while random_record is None or random_record['collection_id'] in dupe_array:
            try:
                random_record = random.choice(records)
            except IndexError:
                # if we've cycled through all pages, reset the page_increment 
                # and dupe_array
                page_increment = 1
                dupe_array.clear()
                response = requests.get(f'http://api.discogs.com/users/vinylmemory/collection?page={page_increment}&per_page=1000', headers={'user-agent': 'vinylmemory/0.1'})
                if response.status_code != 200:
                    raise ValueError("Unexpected status code returned by API")
                collection = response.json()
                records = collection['releases']
                
        release_response
