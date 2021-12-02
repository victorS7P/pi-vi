import './PriceChart.scss'

import React from 'react'
import { LineChart, XAxis, YAxis, Legend, Line, ResponsiveContainer, Tooltip } from 'recharts'

import { formatCurrency, formatTimestamp } from 'utils'

export function PriceChartComponent ({ series }) {
  return (
    <div className="container">
      <ResponsiveContainer>
        <LineChart
          margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
        >
          <XAxis
            allowDuplicatedCategory={false}
            dataKey='date'
            type='number'
            tick={{ fontSize: 12 }}
            tickFormatter={formatTimestamp}
            domain={['auto', 'dataMax']}
            angle={-30}
            tickMargin={20}
          />

          <YAxis
            padding={{ top: 20, bottom: 0 }}
            tick={{ fontSize: 12 }}
            tickMargin={5}
            tickFormatter={formatCurrency}
          />

          <Tooltip
            formatter={formatCurrency}
            labelFormatter={formatTimestamp}
          />

          <Legend verticalAlign='top' />

          {series.map(s => (
            <Line
              name={s.name}
              key={s.name}
              type="linear"
              dataKey="price"
              data={s.data}
              stroke={s.color}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
