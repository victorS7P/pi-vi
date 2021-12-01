import { datatype, random } from 'faker'

import { ProductModel } from 'Models/Products.model'

const products = ProductModel.fakes(350)
export const db = {
  products,

  info: {
    totalDocuments: datatype.number(10000),
    totalDocumentsToday: datatype.number(1000),
    newDocumentsDayAvg: datatype.number(1000),
    totalProducts: datatype.number(1000),
    totalProductsToday: datatype.number(100),
    newProductsDayAvg: datatype.number(100),
    lastProduct: random.arrayElement(products)
  },

  categories: [...new Set(products.map(p => p.category))]
}