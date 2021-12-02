import './ProductDetails.scss'

import React from 'react'

import { PriceChartComponent } from 'components/PriceChart'
import { ProductsListComponent } from 'components/ProductsList'
import { TitledBoxComponent } from 'components/TitledBox'

export function ProductDetailsComponent ({ product, category, matches }) {
  const series = [
    {
      name: 'Preço do Produto',
      data: product.chartData,
      color: '#49BEAA'
    }, {
      name: 'Preço Médio da Categoria',
      data: category.chartData,
      color: '#5A479A'
    }
  ]

  const matchesSeries = [{
    name: `${product.name}`,
    data: product.chartData,
    color: '#49BEAA'
  }].concat(matches.map((p, i) => ({
    name: p.name,
    data: p.chartData,
    color: `#5A479A${i+5}${i+5}`
  })))

  return (
    <div className='product-container'>
      <TitledBoxComponent
        className='info'
        title='Produto'
      >
        <span className="sku">
          {product.marketplace} / {product.sku}
        </span>

        <span className="category">
          {product.category}
        </span>

        <span className="name">
          {product.name}
        </span>
      </TitledBoxComponent>

      <TitledBoxComponent title='Histórico de Preços'>
        <PriceChartComponent series={series} />
      </TitledBoxComponent>

      <TitledBoxComponent title='Produtos Semelhantes'>
        <ProductsListComponent list={matches} loading={false} />
        <PriceChartComponent series={matchesSeries} />
      </TitledBoxComponent>
    </div>
  )
}
