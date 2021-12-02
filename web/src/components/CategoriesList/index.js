import './categoriesList.scss'

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import { Creators, Selectors } from 'ducks/dashboard.duck'

import { Select } from 'antd'
const { Option } = Select

export function CategoriesListComponent ({ onChange }) {
  const dispatch = useDispatch()

  const categoriesList = useSelector(Selectors.categoriesList)
  const categoriesLoading = useSelector(Selectors.categoriesLoading)

  useEffect(function () {
    if (isEmpty(categoriesList)) {
      dispatch(Creators.listCategoriesRequest())
    }
  }, [dispatch, categoriesList])

  return (
    <Select
      style={{ width: 350 }}
      onChange={onChange}
      loading={categoriesLoading}
      placeholder='Selecione uma categoria'
      allowClear={true}
      disabled={categoriesLoading}
    >
      {categoriesList.map(c => (
        <Option value={c.name} key={c.name}>
          {c.name}
        </Option>
      ))}
    </Select>
  )
}
