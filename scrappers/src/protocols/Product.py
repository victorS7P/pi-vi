from datetime import datetime

class Product():
  def __init__ (self, id, name, price, category, brand, marketplace):
    self.id = id
    self.name = name
    self.price = price
    self.category = category
    self.brand = brand
    self.marketplace = marketplace

  def mongo_build (self):
    cratedAt = datetime.now()

    return {
      "sku": f"{self.marketplace}_{self.id}",
      "createdAt": {
        "year": cratedAt.strftime("%Y"),
        "month": cratedAt.strftime("%m"),
        "day": cratedAt.strftime("%d")
      },
      "name": self.name,
      "price": self.price,
      "category": self.category,
      "brand": self.brand,
      "marketplace": self.marketplace
    }
  