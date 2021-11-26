import os

from dotenv import load_dotenv
from pymongo import MongoClient

from protocols.Product import Product

class MongoDB():
  def __init__ (self):
    load_dotenv()
    mongo_url = os.environ['DB_URL']

    print(mongo_url)
    self.client = MongoClient(mongo_url)
    self.db = self.client[os.environ['DB_NAME']]
    
    self.products_collection = self.db.products

  def save_product (self, product: Product):
    self.products_collection.insert_one(product.mongo_build())

  