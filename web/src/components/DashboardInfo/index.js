import './DashboardInfo.scss'
import { DatabaseTwoTone, ShoppingTwoTone, CalendarTwoTone } from '@ant-design/icons'

import React from 'react'
import ScrollContainer from 'react-indiana-drag-scroll'

import { InfoCardComponent } from 'components/InfoCard'
import { ProductWideCard } from 'components/ProductWideCard'

export function DashboardInfoComponent ({ infoData }) {
  return (
    <div>
      <ScrollContainer vertical={false} className='scroll-container'>
        <div id='infinite-row'>
          <InfoCardComponent
            Icon={DatabaseTwoTone}
            title='Documentos Minerados'
            value={infoData.totalDocuments}
            label='desde o começo (25/11/21)'
          />

          <InfoCardComponent
            Icon={CalendarTwoTone}
            title='Minerados Hoje'
            value={infoData.totalDocumentsToday}
            label={<>Média de <b>{infoData.newDocumentsDayAvg}</b> por dia</>}
            />

          <InfoCardComponent
            Icon={ShoppingTwoTone}
            title='Produtos Cadastrados'
            value={infoData.totalProducts}
            label='desde o começo (25/11/21)'
            />

          <InfoCardComponent
            Icon={CalendarTwoTone}
            title='Cadastrados Hoje'
            value={infoData.totalProductsToday  }
            label={<>Média de <b>{infoData.newProductsDayAvg}</b> por dia</>}
            />
        </div>
      </ScrollContainer>

      <ProductWideCard product={infoData.lastProduct} />
    </div>
  )
}
