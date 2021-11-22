import os
import time
from dotenv import load_dotenv

from pymongo import MongoClient

if __name__ == '__main__':
  load_dotenv()
  mongo_url = os.environ['DB_URL']
  client = MongoClient(mongo_url)

  db = client[os.environ['DB_NAME']]

  while(True):
    db.names.insert_one({ "lorem": "ipsum" })
    time.sleep(5)