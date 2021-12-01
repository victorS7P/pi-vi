import { datatype } from 'faker'

export class PriceHistoryModel {
  constructor (data = {}) {
    this.price = data.price
    this.date = data.date
  }

  static fromApi (data = {}) {
    return new PriceHistoryModel(data)
  }

  static fake () {
    return new PriceHistoryModel({
      price: datatype.float(),
      date: {
        day: datatype.number(30),
        month: datatype.number(11),
        year: 2021
      }
    })
  }
  
  static fakes (amount = 10) {
    return Array(amount).fill(0).map(() => PriceHistoryModel.fake())
  }

  get normalizedDate () {
    return new Date(this.date.year, this.date.month, this.date.day)
  }

  get formatedDate () {
    return this.normalizedDate.toLocaleDateString('pt-BR').toString()
  }
}
