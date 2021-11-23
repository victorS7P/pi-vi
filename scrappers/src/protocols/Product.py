from datetime import datetime

class Product():
  def __init__ (self, id, name, price, category, brand):
    self.id = id
    self.name = name
    self.price = price
    self.category = category
    self.brand = brand

  def mongo_build (self):
    cratedAt = datetime.now()

    return {
      "_id": self.id,
      "createdAt": {
        "year": cratedAt.strftime("%Y"),
        "month": cratedAt.strftime("%m"),
        "day": cratedAt.strftime("%d")
      },
      "name": self.name,
      "price": self.price,
      "category": self.category,
      "brand": self.brand,
    }
  