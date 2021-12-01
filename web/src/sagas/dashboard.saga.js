import axios from 'axios'
import { all, takeLatest, put, call, delay } from 'redux-saga/effects'

import { API_URL } from 'App/App.config'
import { Types, Creators } from 'ducks/dashboard.duck'

import { db } from './db'

const getUrl = (uri) => `${API_URL}/${uri}`

export function* dashboardInfoRequest () {
  const url = getUrl('info')

  // const data = yield call(axios.get, url)
  yield delay(1000)
  const data = db.info

  yield put(
    Creators.dashboardInfoSuccess(data)
  )
}

export function* listCategories () {
  const url = getUrl('categories')

  // const data = yield call(axios.get, url)
  yield delay(1000)
  const data = { list: db.categories }

  yield put(
    Creators.listCategoriesSuccess(data.list)
  )
}

export function* listProductsRequest ({ page }) {
  const url = `${getUrl('products')}?page=${page}`

  const data = { list: [], pagesCount: 3 }
  yield delay(1000)
  // const data = yield call(axios.get, url)

  yield put(
    Creators.listProductsSuccess(data.list, page, data.pagesCount)
  )
}

export function* listProductsByCategoryRequest ({ page, category }) {
  const url = `${getUrl('products')}?page=${page}&category=${category}`

  // const data = yield call(axios.get, url)
  yield delay(1000)
  const data = { list: [], pagesCount: 3 }

  yield put(
    Creators.listProductsByCategorySuccess(data.list, page, data.pagesCount, category)
  )
}

export function* productDataRequest ({ sku }) {
  const url = `${getUrl('products')}/${sku}`

  // const data = yield call(axios.get, url)
  yield delay(1000)
  const data = { product: {} }

  yield put(
    Creators.productDataSuccess(data.product)
  )
}

export default function* () {
  yield all([
    takeLatest(Types.DASHBOARD_INFO_REQUEST, dashboardInfoRequest),
    takeLatest(Types.LIST_CATEGORIES_REQUEST, listCategories),
    takeLatest(Types.LIST_PRODUCTS_REQUEST, listProductsRequest),
    takeLatest(Types.LIST_PRODUCTS_BY_CATEGORY_REQUEST, listProductsByCategoryRequest),
    takeLatest(Types.PRODUCT_DATA_REQUEST, productDataRequest),
  ])
}
