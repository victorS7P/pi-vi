from enum import Enum

class Category(Enum):
  AUDIO               =  "audio"
  CAMERA_DIGITAL      =  "cameras digitais"
  COMPUTADOR          =  "computadores"
  ELETROPORTATIL      =  "eletroportateis"
  ESPORTE_LAZER       =  "esporte e lazer"
  FERRAMENTA          =  "ferramentas"
  GAME                =  "games"
  GEEK                =  "geek"
  HARDWARE            =  "hardware"
  MONITOR             =  "monitores"
  NOTEBOOK_ULTRABOOK  =  "notebooks e ultrabooks"
  PERIFERICO          =  "perifericos"
  PLACA_DE_VIDEO      =  "placas de video"
  PROCESSADOR         =  "processadores"
  SMART_HOME          =  "smart home"
  SMART_TV            =  "smart tv"
  SMARTPHONE          =  "smartphones"
  TECLADO_MOUSE       =  "teclado e mouse"

kabum_categories_parser = {}
kabum_categories_parser['Áudio']                        = Category.AUDIO
kabum_categories_parser['Câmeras Digitais']             = Category.CAMERA_DIGITAL
kabum_categories_parser['Celular & Telefone']           = Category.SMARTPHONE
kabum_categories_parser['Computadores']                 = Category.COMPUTADOR
kabum_categories_parser['Eletroportáteis']              = Category.ELETROPORTATIL
kabum_categories_parser['Esporte e Lazer']              = Category.ESPORTE_LAZER
kabum_categories_parser['Ferramentas']                  = Category.FERRAMENTA
kabum_categories_parser['Games']                        = Category.GAME
kabum_categories_parser['Geek']                         = Category.GEEK
kabum_categories_parser['Hardware']                     = Category.HARDWARE
kabum_categories_parser['Monitores']                    = Category.MONITOR
kabum_categories_parser['Notebook/Macbook']             = Category.NOTEBOOK_ULTRABOOK
kabum_categories_parser['Periféricos']                  = Category.PERIFERICO
kabum_categories_parser['Placa de vídeo (VGA)']         = Category.PLACA_DE_VIDEO
kabum_categories_parser['Processadores']                = Category.PROCESSADOR
kabum_categories_parser['Smart Home']                   = Category.SMART_HOME
kabum_categories_parser['Smart TV']                     = Category.SMART_TV
kabum_categories_parser['Smartphones']                  = Category.SMARTPHONE
kabum_categories_parser['Teclado & Mouse']              = Category.TECLADO_MOUSE
kabum_categories_parser['TV']                           = Category.SMART_TV

