import './BiggestFalls.scss'

import { CategoriesListComponent } from 'components/CategoriesList'
import { ProductsListComponent } from 'components/ProductsList'
import { PriceChartComponent } from 'components/PriceChart'

export function BiggestFallsComponent ({ onChangeCategory, list }) {
  console.log({ list })

  const series = list.map((p, i) => ({
    name: p.name,
    data: p.chartData,
    color: `#000000${i+5}${i+5}`
  }))

  return (
    <div className='biggest-falls'>
      <CategoriesListComponent onChange={onChangeCategory} />

      <ProductsListComponent
        list={list}
        pagination={false}
        loading={false}
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Preço Atual',
            dataIndex: 'actualPrice',
            key: 'actualPrice',
          },
          {
            title: 'Queda no Preço',
            dataIndex: 'lastPriceFall',
            key: 'lastPriceFall',
          },
          {
            title: 'Dias Mapeados',
            dataIndex: 'pricesLen',
            key: 'pricesLen',
          }
        ]}
      />
      
      <div className="biggest-falls-box">
        <PriceChartComponent series={series} />
      </div>
    </div>
  )
}
