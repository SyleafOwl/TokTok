import './FollowingSec.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React, { useState } from 'react'

const MOCK_ACCOUNTS = [
  { id: 1, user: 'ac1', name: 'cuenta1' },
  { id: 2, user: 'ac2', name: 'cuenta2' },
  { id: 3, user: 'ac3', name: 'cuenta3' },
  { id: 4, user: 'ac4', name: 'cuenta4' },
  { id: 5, user: 'ac5', name: 'cuenta5' },
  { id: 6, user: 'ac6', name: 'cuenta6' },
]

const FollowingSec: React.FC = () => {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? MOCK_ACCOUNTS : MOCK_ACCOUNTS.slice(0, 3)

  return (
    <div className="contenedor-following">
      <p className="following-titulo">Cuentas que sigues</p>
      <ul className="following-accountlist limited">
        {visible.map((acc) => (
          <li key={acc.id}>
            <button className="following-item-btn">
              <div className="button-content">
                <span className="following-avatar"><AccountCircleIcon/></span>
                <div className="button-structure">
                  <div className="button-title">
                    <p>{acc.user}</p>
                  </div>
                  <p>{acc.name}</p>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
      <button className="following-more" onClick={() => setExpanded((v) => !v)}>
        {expanded ? 'Ver menos' : 'Ver más'}
      </button>
    </div>
  )
}

export default FollowingSec
