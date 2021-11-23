from scrapy.crawler import CrawlerProcess


from protocols.Product import Product
from protocols.MongoDB import MongoDB

from scrappers.KabumScrapper import KabumThread

if __name__ == '__main__':
  db = MongoDB()
  # kabumScrapper = KabumScrapper(
  #   db=db
  # )

  KabumThread().run(db)
