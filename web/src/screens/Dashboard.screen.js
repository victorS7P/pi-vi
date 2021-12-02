import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Spin } from 'antd'

import { Creators, Selectors } from 'ducks/dashboard.duck'
import { DashboardInfoComponent } from "components/DashboardInfo"

export function DashboardScreen () {
  const dispatch = useDispatch()
  const infoData = useSelector(Selectors.info)

  useEffect(function () {
    dispatch(Creators.dashboardInfoRequest())
  }, [dispatch])

  return (
    <Spin spinning={infoData.loading}>
      <DashboardInfoComponent infoData={infoData} />
    </Spin>
  )
}
