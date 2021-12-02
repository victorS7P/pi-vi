import './ProductWideCard.scss'

import React from 'react'
import { useNavigate } from 'react-router-dom'

export function ProductWideCard ({ product }) {
  const navigate = useNavigate()

  function handleNavigateToProduct () {
    navigate(`/produtos/${product.sku}`, { replace: true })
  }

  return (
    <div
      className="product-wide-card"
      onClick={handleNavigateToProduct}
    >
      <span className='data'>
        <span className='title'>
          Último Produto Minerado
        </span>

        <span className="name">
          {product.name}
        </span>

        <span className='marketplace'>
          {product.category}
        </span>
      </span>

      <span className="prices">
        {product.lastPriceChange.from && (
          <>
            <span className="last-price">
              {product.lastPrice}
            </span>

            <div className="last-date">
              {product.lastPriceChange.from.formatedDate}
            </div>
          </>
        )}

        <span className="actual-price">
          {product.actualPrice}
        </span>
      </span>
    </div>
  )
}