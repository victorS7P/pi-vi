import { map } from 'lodash'
import { commerce } from 'faker'

import { PriceHistoryModel } from './PriceHistory.model'
import { parsePriceData } from 'utils'

export class CategoryModel {
  constructor (data = {}) {
    this.name = data.name
    this.prices = map(data.prices, p => new PriceHistoryModel(p))
  }

  static fromApi (data = {}) {
    return new CategoryModel(data)
  }

  static fake () {
    return new CategoryModel({
      name: commerce.productName(),
      prices: PriceHistoryModel.fakes(5)
    })
  }
  
  static fakes (amount = 20) {
    return Array(amount).fill(0).map(() => CategoryModel.fake())
  }

  get chartData () {
    return parsePriceData(this.prices)
  }
}
