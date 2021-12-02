import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import { Creators, Selectors } from 'ducks/dashboard.duck'

import { CategoriesListComponent } from 'components/CategoriesList'
import { ProductsListComponent } from "components/ProductsList"

export function ProductsListScreen () {
  const dispatch = useDispatch()

  const productsList = useSelector(Selectors.productsList)
  const productsLoading = useSelector(Selectors.productsLoading)
  const currentPage = useSelector(Selectors.productsCurrentPage)
  const totalPages = useSelector(Selectors.productsTotalPages)
  const currentCategory = useSelector(Selectors.productsCurrentCategory)

  useEffect(function () {
    if (isEmpty(productsList) && !productsLoading) {
      dispatch(Creators.listProductsRequest(currentPage))
    }
  }, [])

  function handleChangePage (page) {
    if (page !== currentPage) {
      if (currentCategory) {
        dispatch(Creators.listProductsByCategoryRequest(page, currentCategory))
      } else {
        dispatch(Creators.listProductsRequest(page))
      }
    }
  }

  function handleChangeCategory (category) {
    if (category !== currentCategory) {
      if (category) {
        dispatch(Creators.listProductsByCategoryRequest(1, category))
      } else {
        dispatch(Creators.listProductsRequest(1))
      }
    }
  }

  return (
    <>
      <CategoriesListComponent
        onChange={handleChangeCategory}
      />

      <ProductsListComponent
        list={productsList}
        lastPage={totalPages}
        currentPage={currentPage}
        loading={productsLoading}
        onChangePage={handleChangePage}
        pagination={true}
      />
    </>
  )
}
