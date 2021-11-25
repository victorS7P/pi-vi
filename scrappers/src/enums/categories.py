from enum import Enum

class Category(Enum):
  HARDWARE            =  "hardware"
  SMARTPHONE          =  "smartphones"
  PERIFERICO          =  "perifericos"
  TECLADO_MOUSE       =  "teclado e mouse"
  COMPUTADOR          =  "computadores"
  PLACA_DE_VIDEO      =  "placas de video"
  MONITOR             =  "monitores"
  GAMER               =  "gamer"
  AUDIO               =  "audio"
  SMART_TV            =  "smart tv"
  ELETROPORTATIL      =  "eletroportateis"
  SMART_HOME          =  "smart home"
  FERRAMENTA          =  "ferramentas"
  NOTEBOOK_ULTRABOOK  =  "notebooks e ultrabooks"
  CAMERA_DIGITAL      =  "cameras digitais"
  PROCESSADOR         =  "processadores"
  ESPORTE_LAZER       =  "esporte e lazer"
  GEEK                =  "geek"

kabum_categories_parser = {}
kabum_categories_parser['Esporte e Lazer']              = Category.ESPORTE_LAZER
kabum_categories_parser['Câmeras Digitais']             = Category.CAMERA_DIGITAL
kabum_categories_parser['Smart Home']                   = Category.SMART_HOME
kabum_categories_parser['Ferramentas']                  = Category.FERRAMENTA
kabum_categories_parser['Eletroportáteis']              = Category.ELETROPORTATIL
