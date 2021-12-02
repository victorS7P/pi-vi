import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'
import { isEmpty } from 'lodash'

import { Creators, Selectors } from 'ducks/dashboard.duck'
import { BiggestFallsComponent } from "components/BiggestFalls"

export function BiggestFallsScreen () {
  const dispatch = useDispatch()
  const infoData = useSelector(Selectors.info)

  const [currentCategory, setCurrentCategory] = useState('')

  useEffect(function () {
    dispatch(Creators.dashboardBiggestFallListRequest(currentCategory))
  }, [currentCategory])

  return (
    <Spin spinning={infoData.biggestFallLoading}>
      <BiggestFallsComponent
        onChangeCategory={setCurrentCategory}
        list={infoData.biggestFallList}
      />
    </Spin>
  )
}
