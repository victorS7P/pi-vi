from setup.build_thread import BuildThread
from scrappers.KabumScrapper import Scrapper as Kabum

if __name__ == '__main__':
  BuildThread(Kabum).run()
