import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'

import { Creators, Selectors } from 'ducks/dashboard.duck'
import { CategoryBoxComponent } from 'components/CategoryBox'

export function CategoriesScreen () {
  const dispatch = useDispatch()

  const categoriesList = useSelector(Selectors.categoriesList)
  const categoriesLoading = useSelector(Selectors.categoriesLoading)
  const categoriesPricesLoaded = useSelector(Selectors.categoriesPricesLoaded)

  useEffect(function () {
    if (!categoriesPricesLoaded) {
      dispatch(Creators.listCategoriesPriceHistoryRequest())
    }
  }, [])

  return (
    <Spin spinning={categoriesLoading || !categoriesPricesLoaded}>
      {categoriesList.map(c => (
        <CategoryBoxComponent category={c} />
      ))}
    </Spin>
  )
}
