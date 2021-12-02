import { createActions, createReducer } from 'reduxsauce'

import { ProductModel } from 'Models/Products.model'
import { CategoryModel } from 'Models/Category.model'

/* Types */
export const { Types, Creators } = createActions({
  dashboardInfoRequest: [],
  dashboardInfoSuccess: ['info'],

  dashboardBiggestFallListRequest: ['category'],
  dashboardBiggestFallListSuccess: ['list'],

  listCategoriesRequest: [],
  listCategoriesSuccess: ['list'],

  listProductsRequest: ['page'],
  listProductsSuccess: ['list', 'page', 'totalPages'],

  listProductsByCategoryRequest: ['page', 'category'],
  listProductsByCategorySuccess: ['list', 'page', 'totalPages', 'category'],

  productDataRequest: ['sku'],
  productDataSuccess: ['product', 'category', 'matches']
}, {
  prefix: 'DASHBOARD_'
})

/* Initial State */
export const INITIAL_STATE = {
  info: {
    loading: false,

    totalDocuments: 0, 
    totalDocumentsToday: 0,
    newDocumentsDayAvg: 0,
    totalProducts: 0,
    totalProductsToday: 0,
    newProductsDayAvg: 0,

    lastProduct: new ProductModel(),

    biggestFallList: [],
    biggestFallLoading: false
  },

  categories: {
    list: [],
    loading: false
  },
  
  products: {
    list: [],
    prices: [],
    loading: false,
    currentCategory: undefined,
    currentPage: 1,
    totalPages: 1,
  },

  selectedProduct: {
    loading: false,
    product: new ProductModel(),
    category: new CategoryModel(),
    matches: []
  }
}

/* Selectors */
export const Selectors = {
  info: state => state.dashboard.info,

  categoriesList: state => state.dashboard.categories.list,
  categoriesLoading: state => state.dashboard.categories.loading,

  productsList: state => state.dashboard.products.list,
  productsLoading: state => state.dashboard.products.loading,
  productsCurrentCategory: state => state.dashboard.products.currentCategory,
  productsCurrentPage: state => state.dashboard.products.currentPage,
  productsTotalPages: state => state.dashboard.products.totalPages,
  
  selectedProduct: state => state.dashboard.selectedProduct.product,
  selectedProductLoading: state => state.dashboard.selectedProduct.loading,
  selectedProductCategory: state => state.dashboard.selectedProduct.category,
  selectedProductMatches: state => state.dashboard.selectedProduct.matches,
}

/* Action Creators */
export const Actions = {
  dashboardInfoRequest: state => ({
    ...state,
    info: {
      ...state.info,
      loading: true
    }
  }),

  dashboardInfoSuccess: (state, { info }) => ({
    ...state,
    info: {
      ...state.info,
      loaded: true,
      loading: false,
      ...info
    },
  }),

  dashboardBiggestFallListRequest: state => ({
    ...state,
    info: {
      ...state.info,
      biggestFallLoading: true
    }
  }),
  
  dashboardBiggestFallListSuccess: (state, { list }) => ({
    ...state,
    info: {
      ...state.info,
      biggestFallList: list,
      biggestFallLoading: false
    }
  }),

  listCategoriesRequest: state => ({
    ...state,
    categories: {
      ...state.categories,
      loading: true
    }
  }),

  listCategoriesSuccess: (state, { list }) => ({
    ...state,
    categories: {
      ...state.categories,
      loading: false,
      list
    }
  }),

  listProductsRequest: (state) => ({
    ...state,
    products: {
      ...state.products,
      loading: true
    }
  }),

  listProductsSuccess: (state, { list, page, totalPages }) => ({
    ...state,
    products: {
      ...state.products,
      list,
      totalPages,
      loading: false,
      currentPage: page,
      currentCategory: undefined
    }
  }),

  listProductsByCategoryRequest: (state) => ({
    ...state,
    products: {
      ...state.products,
      loading: true
    }
  }),

  listProductsByCategorySuccess: (state, { list, page, totalPages, category }) => ({
    ...state,
    products: {
      ...state.products,
      list,
      totalPages,
      loading: false,
      currentPage: page,
      currentCategory: category
    }
  }),

  productDataRequest: (state) => ({
    ...state,
    selectedProduct: {
      ...state.selectedProduct,
      loading: true
    }
  }),

  productDataSuccess: (state, { product, category, matches }) => ({
    ...state,
    selectedProduct: {
      ...state.selectedProduct,
      product,
      category,
      matches,
      loading: false,
    }
  })
}

/* Reducer */
export default createReducer(INITIAL_STATE, {
  [Types.DASHBOARD_INFO_REQUEST]: Actions.dashboardInfoRequest,
  [Types.DASHBOARD_INFO_SUCCESS]: Actions.dashboardInfoSuccess,

  [Types.DASHBOARD_BIGGEST_FALL_LIST_REQUEST]: Actions.dashboardBiggestFallListRequest,
  [Types.DASHBOARD_BIGGEST_FALL_LIST_SUCCESS]: Actions.dashboardBiggestFallListSuccess,

  [Types.LIST_CATEGORIES_REQUEST]: Actions.listCategoriesRequest,
  [Types.LIST_CATEGORIES_SUCCESS]: Actions.listCategoriesSuccess,

  [Types.LIST_PRODUCTS_REQUEST]: Actions.listProductsRequest,
  [Types.LIST_PRODUCTS_SUCCESS]: Actions.listProductsSuccess,

  [Types.LIST_PRODUCTS_BY_CATEGORY_REQUEST]: Actions.listProductsByCategoryRequest,
  [Types.LIST_PRODUCTS_BY_CATEGORY_SUCCESS]: Actions.listProductsByCategorySuccess,

  [Types.PRODUCT_DATA_REQUEST]: Actions.productDataRequest,
  [Types.PRODUCT_DATA_SUCCESS]: Actions.productDataSuccess
})
