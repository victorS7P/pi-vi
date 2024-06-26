import './ProductsList.scss'
import { Table, Pagination, Spin } from 'antd'

import React from 'react'
import { useNavigate } from 'react-router-dom'

export function ProductsListComponent ({ list, loading, currentPage, lastPage, onChangePage, pagination, columns }) {
  const navigate = useNavigate()

  return (
    <Spin spinning={loading}>
      <Table
        onRow={({ sku }) => ({
          onClick (event) {
            event.stopPropagation()
            event.preventDefault()

            navigate(`/produtos/${sku}`, { replace: true })
          }
        })}

        dataSource={list}
        pagination={false}
        rowKey='sku'
        columns={columns}
      />

      {pagination && (
        <Pagination
          pageSize={1}
          current={currentPage}
          total={lastPage}
          onChange={onChangePage}
        />
      )}
    </Spin>
  )
}

ProductsListComponent.defaultProps = {
  columns: [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Categoria',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Preço Atual',
      dataIndex: 'actualPrice',
      key: 'actualPrice',
    },
    {
      title: 'Dias Mapeados',
      dataIndex: 'pricesLen',
      key: 'pricesLen',
    }
  ]
}