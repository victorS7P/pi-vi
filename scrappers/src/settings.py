LOG_LEVEL = 'ERROR'
LOG_ENABLED = False

DUPEFILTER_CLASS = 'scrapy.dupefilters.BaseDupeFilter'

REDIRECT_ENABLED = False
METAREFRESH_ENABLED = False

SPLASH_URL = 'http://0.0.0.0:8050'

DOWNLOADER_MIDDLEWARES = {
  # SPLASH
  'scrapy_splash.SplashCookiesMiddleware': 723,
  'scrapy_splash.SplashMiddleware': 725,
  'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810,
  
  # FAKE USER AGENT
  'scrapy_fake_useragent.middleware.RandomUserAgentMiddleware': 400,
  'scrapy_fake_useragent.middleware.RetryUserAgentMiddleware': 401,
}

DUPEFILTER_CLASS = 'scrapy_splash.SplashAwareDupeFilter'
HTTPCACHE_STORAGE = 'scrapy_splash.SplashAwareFSCacheStorage'

FAKEUSERAGENT_PROVIDERS = [
  'scrapy_fake_useragent.providers.FakeUserAgentProvider',
  'scrapy_fake_useragent.providers.FakerProvider',
  'scrapy_fake_useragent.providers.FixedUserAgentProvider',
]

ROBOTSTXT_OBEY = False
