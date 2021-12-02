import { datatype, random } from 'faker'

import { ProductModel } from 'Models/Products.model'

const products = ProductModel.fakes(350)
const categories = [...new Set(products.map(p => p.category))]

export const db = {
  products,
  categories,

  info: {
    totalDocuments: datatype.number(10000),
    totalDocumentsToday: datatype.number(1000),
    newDocumentsDayAvg: datatype.number(1000),
    totalProducts: datatype.number(1000),
    totalProductsToday: datatype.number(100),
    newProductsDayAvg: datatype.number(100),
    lastProduct: random.arrayElement(products)
  },

  list: {
    findByPage: page => products.slice((page - 1) * 15, page * 15),
    pagesCount:  Math.ceil(products.length/15)
  },

  product: {
    find: sku => products.find(p => p.sku === sku) || db.products[0],
    categoryPrices: products[10].prices,
    matches: random.arrayElements(products, 5)
  }
}
