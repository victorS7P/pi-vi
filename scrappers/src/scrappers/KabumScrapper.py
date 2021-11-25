import re

from scrapy import Spider
from scrapy_splash import SplashRequest

from protocols.Product import Product
from protocols.MongoDB import MongoDB
from enums.categories import kabum_categories_parser 

lua_script = """
function main(splash)
  assert(splash:go(splash.args.url))
  assert(splash:wait(1.0))
  return splash:html()
end
"""

class KabumScrapper(Spider):
  db = MongoDB()

  name = 'kabum_scrapper'
  domain = 'https://www.kabum.com.br'

  start_urls = [domain]

  def start_requests(self):
    for url in self.start_urls:
      yield SplashRequest(
        url=url,
        callback=self.parse,
        endpoint='execute',
        cache_args=['lua_source'],
        args={'lua_source': lua_script}
      )

  def parse (self, response):
    print('>>>>>>>>>>>>>.', response.body)
    categories = response.css('#linksFooter .departmentLinks>a::attr(href)').getall()
    for category in categories[0:1]:
      yield SplashRequest(
        url=f"{self.domain}{category}",
        callback=self.parse_category_page,
        endpoint='execute',
        cache_args=['lua_source'],
        args={'lua_source': lua_script}
      )

  def parse_category_page (self, response):
    category = str(response.css('h1').get())
    print('>>>>>>>>>>>>>>>', category)
    # print(response.body)
    # category = kabum_categories_parser[]
    # if (category):
    #   products = response.css('.productCard a::attr(href)').getall()

    #   for product in products:
    #     yield SplashRequest(f"{self.domain}{product}", self.parse_product_page, endpoint='execute')

  def parse_product_page (self, response):
    category = str(response.css('section[itemscope][itemtype]>div:first-child>a:nth-child(2)::text').get())
    category = category.replace(' >', '')
    category = kabum_categories_parser[category]
    if category:
      id = str(response.css('section[itemscope][itemtype] span:last-child::text').extract()[1])
      name = str(response.css('h1[itemprop="name"]::text').get())

      price = str(response.css('h4[itemprop="price"]::text').get())
      price = float(price[3:].replace('.', '').replace(',', '.'))

      brand = str(response.css('section[itemscope][itemtype]').get())
      brand = re.findall(r'Marca:\s(.*)', brand)
      print(id)
      print(brand)

      # product = Product(id, name, price, category, )
