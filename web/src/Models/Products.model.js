import { map } from 'lodash'
import { lorem, commerce, company } from 'faker'

import { PriceHistoryModel } from './PriceHistory.model'

const dateCompare = ({ date }, b) => (
  new Date(b.date.year, b.date.month, b.date.day) - new Date(date.year, date.month, date.day)
)

const formatCurrency = value => (
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
)

export class ProductModel {
  constructor (data = {}) {
    this.name = data.name
    this.sku = data.sku
    this.marketplace = data.marketplace
    this.category = data.category

    this.prices = map(data.prices, p => new PriceHistoryModel(p))
  }

  static fromApi (data = {}) {
    return new ProductModel(data)
  }

  static fake () {
    return new ProductModel({
      name: commerce.productName(),
      sku: lorem.word().toUpperCase(),
      marketplace: company.companyName(),
      category: commerce.department(),
      prices: PriceHistoryModel.fakes(5)
    })
  }
  
  static fakes (amount = 20) {
    return Array(amount).fill(0).map(() => ProductModel.fake())
  }

  get priceChartData () {
    return []
    // return this.prices.map()
  }

  get lastPriceData () {
    return this.prices.sort(dateCompare)[1]
  }

  get lastPrice () {
    const price = this.prices.length > 1 ? this.lastPriceData.price : 0.0
    return formatCurrency(price)
  }

  get actualPriceData () {
    return this.prices.sort(dateCompare)[0]
  }

  get actualPrice () {
    const price = this.prices.length ? this.actualPriceData.price : 0.0
    return formatCurrency(price)
  }

  get pricesLen () {
    return this.prices.length
  }

  get lastPriceChange () {
    const lastChange = { to: this.actualPriceData }

    if (this.prices.length > 1) {
      lastChange.from = this.lastPriceData
    }

    return lastChange
  }
}
