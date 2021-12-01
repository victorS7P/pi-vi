import './infoCard.scss'

import React from 'react'

export function InfoCardComponent ({ Icon, title, label, value }) {
  return (
    <div className="info-card">
      <div className="icon">
        <Icon twoToneColor='#49DCB1' />
      </div>

      <div className="content">
        <div className="value">
          {value}
        </div>

        <div className="title">
          {title}
        </div>

        <div className="label">
          {label}
        </div>
      </div>
    </div>
  )
}