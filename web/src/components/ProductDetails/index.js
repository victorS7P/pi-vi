import './ProductDetails.scss'

import React from 'react'

import { PriceChartComponent } from 'components/PriceChart'

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
    name: product.name,
    data: product.chartData,
    color: '#49BEAA'
  }].concat(matches.map(p => ({
    name: p.name,
    data: p.chartData,
    color: '#90AACB'
  })))

  return (
    <div className='product-container'>
      <div className="info box">
        <div className="box-title">
          Produto
        </div>

        <span className="sku">
          {product.marketplace} / {product.sku}
        </span>

        <span className="category">
          {product.category}
        </span>

        <span className="name">
          {product.name}
        </span>
      </div>

      <div className="prices box">
        <div className="box-title">
          Histórico de Preços
        </div>

        <PriceChartComponent series={series} />
      </div>

      <div className="mtaches box">
        <div className="box-title">
          Produtos Semelhantes
        </div>

        <PriceChartComponent series={matchesSeries} />
      </div>
    </div>
  )
}
