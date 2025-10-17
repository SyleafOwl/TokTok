import React from 'react'
import './AnimacionGift.css'

export type GiftToast = {
  id: string
  emoji: string
  name: string
  cost: number
  from?: string
}

type Props = {
  toasts: GiftToast[]
  position?: 'top-left' | 'top-center'
}

const AnimacionGift: React.FC<Props> = ({ toasts, position = 'top-left' }) => {
  return (
    <div className={`gift-overlay-container ${position === 'top-center' ? 'gift-pos-top-center' : ''}`}>
      {toasts.map(t => (
        <div key={t.id} className="gift-overlay-item" role="status" aria-live="polite">
          <div className="gift-emoji" aria-hidden>{t.emoji}</div>
          <div className="gift-texts">
            <div className="gift-title">{t.from ? `@${t.from}` : 'Un espectador'} envió {t.name}</div>
            <div className="gift-sub">¡Gracias por el apoyo!</div>
          </div>
          <div className="gift-coins">{t.cost}💰</div>
        </div>
      ))}
    </div>
  )
}

export default AnimacionGift
