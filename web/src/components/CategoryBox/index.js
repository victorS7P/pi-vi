import './CategoryBox.scss'

import React from 'react'

import { TitledBoxComponent } from 'components/TitledBox'
import { PriceChartComponent } from 'components/PriceChart'

export function CategoryBoxComponent ({ category }) {
  return (
    <TitledBoxComponent
      title={`${category.name} (${category.count} Produtos)`}
      className="category-box-container"
    >
      <PriceChartComponent
        series={[{
          name: 'Preço Médio',
          data: category.chartData,
          color: '#49BEAA'
        }]}
      />
    </TitledBoxComponent>
  )
}
