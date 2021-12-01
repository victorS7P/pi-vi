import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Creators, Selectors } from 'ducks/dashboard.duck'
import { Spin } from 'antd'

export function ProductDetailsScreen () {
  const dispatch = useDispatch()
  const { sku } = useParams()

  const selectedProduct = useSelector(Selectors.selectedProduct)
  const selectedProductLoading = useSelector(Selectors.selectedProductLoading)

  useEffect(function () {
    dispatch(Creators.productDataRequest(sku))
  }, [])

  return (
    <Spin spinning={selectedProductLoading}>
      <div>
        #{selectedProduct.sku}
      </div>
    </Spin>
  )
}
