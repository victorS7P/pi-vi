from scrapper_thread import ScrapperThread
from scrappers.KabumScrapper import KabumScrapper

if __name__ == '__main__':
  ScrapperThread(KabumScrapper).run()
