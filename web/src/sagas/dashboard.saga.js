import axios from 'axios'
import { all, takeLatest, put, call, delay, select, take } from 'redux-saga/effects'
import { isEmpty, map } from 'lodash'

import { API_URL } from 'App/App.config'
import { Types, Creators, Selectors } from 'ducks/dashboard.duck'

import { CategoryModel } from 'Models/Category.model'
import { ProductModel } from 'Models/Products.model'

import { db } from './db'

const getUrl = (uri) => `${API_URL}/${uri}`

export function* dashboardInfoRequest () {
  const url = getUrl('info')
  const { data } = yield call(axios.get, url)

  yield put(
    Creators.dashboardInfoSuccess(data, ProductModel.fromApi(data.lastDocument))
  )
}

export function * dashboardBiggestFallListRequest ({ category }) {
  let url = getUrl('products/sale')
  if (category) { url += `?category=${category}` }

  // const data = yield call(axios.get, url)
  yield delay(1000)
  const data = { list: db.biggestFallList }

  yield put(
    Creators.dashboardBiggestFallListSuccess(data.list)
  )
}

export function* listCategories () {
  const url = getUrl('categories')

  const { data } = yield call(axios.get, url)
  const list = map(data, c => CategoryModel.fromApi({ name: c.category, count: c.products }))

  yield put(
    Creators.listCategoriesSuccess(list)
  )
}

export function* listCategoriesPriceHistoryRequest () {
  const url = getUrl('categories?category=')

  let categories = yield select(Selectors.categoriesList)
  if (isEmpty(categories)) {
    yield put(Creators.listCategoriesRequest())
    yield take(Types.LIST_CATEGORIES_SUCCESS)
  }

  categories = yield select(Selectors.categoriesList)

  const list = []
  for (const category of categories) {
    // const data = yield call(axios.get, `${url}category`)
    yield delay(100)

    const data = db.categoryPrice(category)
    const categoryData = CategoryModel.fromApi({ ...category, prices: data.prices })

    list.push(categoryData)
  }

  yield put(
    Creators.listCategoriesPriceHistorySuccess(list)
  )
}

export function* listProductsRequest ({ page }) {
  const url = `${getUrl('products_page')}?page=${page}`

  const { data } = yield call(axios.get, url)
  const products = map(data.products, ProductModel.fromApi)

  yield put(
    Creators.listProductsSuccess(products, page, data.lastPage)
  )
}

export function* listProductsByCategoryRequest ({ page, category }) {
  const url = `${getUrl('products_category_page')}?page=${page}&category=${category}`

  const { data } = yield call(axios.get, url)
  const products = map(data.products, ProductModel.fromApi)

  yield put(
    Creators.listProductsByCategorySuccess(products, page, data.lastPage, category)
  )
}

export function* productDataRequest ({ sku }) {
  const url = `${getUrl('product')}?sku=${sku}`

  const { data } = yield call(axios.get, url)
  const product = ProductModel.fromApi(data)

  const categoryDataUrl = `${getUrl('categories')}/${product.category}`
  
  // data.categoryPrices = yield call(axios.get, categoryDataUrl)
  yield delay(1000)
  const category = CategoryModel.fromApi({ name: product.category, prices: db.product.categoryPrices })

  const matchUrl = `${getUrl('products')}/match?name=${product.name}`
  const { data: matches } = yield call(axios.get, matchUrl)

  yield put(
    Creators.productDataSuccess(product, category, map(matches, ProductModel.fromApi))
  )
}

export default function* () {
  yield all([
    takeLatest(Types.DASHBOARD_INFO_REQUEST, dashboardInfoRequest),
    takeLatest(Types.DASHBOARD_BIGGEST_FALL_LIST_REQUEST, dashboardBiggestFallListRequest),
    takeLatest(Types.LIST_CATEGORIES_REQUEST, listCategories),
    takeLatest(Types.LIST_CATEGORIES_PRICE_HISTORY_REQUEST, listCategoriesPriceHistoryRequest),
    takeLatest(Types.LIST_PRODUCTS_REQUEST, listProductsRequest),
    takeLatest(Types.LIST_PRODUCTS_BY_CATEGORY_REQUEST, listProductsByCategoryRequest),
    takeLatest(Types.PRODUCT_DATA_REQUEST, productDataRequest),
  ])
}
