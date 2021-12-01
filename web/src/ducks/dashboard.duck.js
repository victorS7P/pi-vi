import { ProductModel } from 'Models/Products.model'
import { createActions, createReducer } from 'reduxsauce'

/* Types */
export const { Types, Creators } = createActions({
  dashboardInfoRequest: [],
  dashboardInfoSuccess: ['info'],

  listCategoriesRequest: [],
  listCategoriesSuccess: ['list'],

  listProductsRequest: ['page'],
  listProductsSuccess: ['list', 'page', 'totalPages'],

  listProductsByCategoryRequest: ['page', 'category'],
  listProductsByCategorySuccess: ['list', 'page', 'totalPages', 'category'],

  productDataRequest: ['sku'],
  productDataSuccess: ['product']
}, {
  prefix: 'DASHBOARD_'
})

/* Initial State */
export const INITIAL_STATE = {
  info: {
    loaded: false,
    loading: false,
    totalDocuments: 0, 
    totalDocumentsToday: 0,
    newDocumentsDayAvg: 0,
    totalProducts: 0,
    totalProductsToday: 0,
    newProductsDayAvg: 0,
    lastProduct: new ProductModel()
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
    product: new ProductModel()
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
  selectedProductLoading: state => state.dashboard.selectedProduct.loading
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

  productDataSuccess: (state, { product }) => ({
    ...state,
    selectedProduct: {
      ...state.selectedProduct,
      product,
      loading: false,
    }
  })
}

/* Reducer */
export default createReducer(INITIAL_STATE, {
  [Types.DASHBOARD_INFO_REQUEST]: Actions.dashboardInfoRequest,
  [Types.DASHBOARD_INFO_SUCCESS]: Actions.dashboardInfoSuccess,

  [Types.LIST_CATEGORIES_REQUEST]: Actions.listCategoriesRequest,
  [Types.LIST_CATEGORIES_SUCCESS]: Actions.listCategoriesSuccess,

  [Types.LIST_PRODUCTS_REQUEST]: Actions.listProductsRequest,
  [Types.LIST_PRODUCTS_SUCCESS]: Actions.listProductsSuccess,

  [Types.LIST_PRODUCTS_BY_CATEGORY_REQUEST]: Actions.listProductsByCategoryRequest,
  [Types.LIST_PRODUCTS_BY_CATEGORY_SUCCESS]: Actions.listProductsByCategorySuccess,

  [Types.PRODUCT_DATA_REQUEST]: Actions.productDataRequest,
  [Types.PRODUCT_DATA_SUCCESS]: Actions.productDataSuccess
})