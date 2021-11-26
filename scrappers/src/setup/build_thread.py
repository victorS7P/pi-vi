import os
from threading import Thread

from scrapy.crawler import CrawlerProcess
from scrapy.settings import Settings

class BuildThread(Thread):
  def __init__(self, Scrapper):
    Thread.__init__(self)
    self.Scrapper = Scrapper

  def run (self):
    settings = Settings()

    settings_module_path = os.environ.get('SCRAPY_ENV', 'setup.settings')   
    settings.setmodule(settings_module_path, priority='project')

    process = CrawlerProcess(settings=settings)
    process.crawl(self.Scrapper)
    process.start()
