import datetime
from scrapy import Spider
from scrapy.crawler import CrawlerProcess

from threading import Thread

from protocols.Product import Product
from protocols.MongoDB import MongoDB

from time import sleep
from datetime import datetime

class KabumScrapper(Spider):
  name = 'kabum_scrapper'
  domain = 'https://www.kabum.com.br'

  def parse (self, response):
    pass

class KabumThread(Thread):
  def __init__(self):
    Thread.__init__(self)

  def run (self, db: MongoDB):
    # process = CrawlerProcess()
    # process.crawl(KabumScrapper)
    # process.start()

    while True:
      print("okokok")
      fake = Product(datetime.now().strftime("%H-%M-%S"), "fake", "fake", "fake", "fake")
      db.save_product(fake)
      sleep(5)
