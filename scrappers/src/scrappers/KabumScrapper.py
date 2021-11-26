from scrapy import Spider, Request

from protocols.Product import Product
from protocols.MongoDB import MongoDB
from enums.categories import kabum_categories_parser 

class Scrapper(Spider):
  name = 'kabum_scrapper'
  domain = 'https://www.kabum.com.br'

  categories_url = [
    '/audio',
    '/cameras-digitais',
    '/celular-telefone/smartphones',
    '/computadores',
    '/computadores/monitores',
    '/computadores/notebooks-ultrabooks',
    '/eletroportateis',
    '/ferramentas',
    '/gamer',
    '/geek'
    '/hardware',
    '/hardware/placa-de-video-vga'
    '/hardware/processadores',
    '/perifericos',
    '/perifericos/teclado-mouse',
    '/smart-home',
    '/tv/smart-tv',
  ]

  def __init__(self, name=None, **kwargs):
    super().__init__(name=name, **kwargs)
    self.db = MongoDB()

  def start_requests(self):
    for category in self.categories_url:
      yield Request(url=f"{self.domain}{category}", callback=self.parse_category_page)    

  def parse_category_page (self, response):
    products = response.css('.productCard a::attr(href)').getall()

    for product in products:
      yield Request(url=f"{self.domain}{product}", callback=self.parse_product_page)

    current_page = int(response.css('a.page.active::text').get())
    next_page_url = str(response.request.url)

    if f"page_number={current_page}" in next_page_url:
      next_page_url = next_page_url.replace(f"page_number={current_page}", f"page_number={current_page + 1}")
    else:
      next_page_url = f"{next_page_url}?page_number={current_page + 1}"

    yield Request(url=next_page_url, callback=self.parse_category_page)


  def get_category_from_product_header (self, response):
    for i in range(2, 5):
      category = str(response.css(f"section[itemscope][itemtype]>div:first-child>a:nth-last-child({i})::text").get())
      category = category.replace(' >', '')

      if (category in kabum_categories_parser.keys()):
        return kabum_categories_parser[category].value

    return None

  def parse_product_page (self, response):
    category = self.get_category_from_product_header(response)

    if category:
      id = str(response.css('section[itemscope][itemtype] span:last-child::text').extract()[1])
      name = str(response.css('h1[itemprop="name"]::text').get())

      price = str(response.css('h4[itemprop="price"]::text').get())
      price = float(price[3:].replace('.', '').replace(',', '.'))

      product = Product(id, name, price, category, None, 'kabum')
      self.db.save_product(product=product)
