import { map } from 'lodash'
import { commerce, company, datatype } from 'faker'

import { PriceHistoryModel } from './PriceHistory.model'
import { dateCompare, formatCurrency, parsePriceData } from 'utils'

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
      sku: datatype.uuid(),
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
    const lastChange = {
      to: this.actualPriceData,
      from: {
        ...this.actualPriceData,
        price: 0
      }
    }

    if (this.prices.length > 1) {
      lastChange.from = this.lastPriceData
    }

    return lastChange
  }

  get chartData () {
    return parsePriceData(this.prices)
  }

  get lastPriceFall () {
    const lastChange = this.lastPriceChange
    return formatCurrency(lastChange.to.price - lastChange.from.price)
  }
}
