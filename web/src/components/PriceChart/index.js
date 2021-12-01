import './PriceChart.scss'

import React from 'react'
import { LineChart, XAxis, YAxis, Legend, Line } from 'recharts'

export function PriceChartComponent ({ width, height, priceHistory }) {
  const data = [
    {
      price: 200,
      date: '20/11/2021'
    },
    {
      price: 210,
      date: '21/11/2021'
    },
    {
      price: 220,
      date: '22/11/2021'
    }
  ]

  return (
    <div className="container">
      <LineChart
        width={width}
        height={height}
        data={data}
      >
        <XAxis dataKey="date"/>
        <YAxis/>
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </div>
  )
}
