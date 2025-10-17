import { useState } from 'react'
import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens'
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Modal from './modal/modal'
import './Top_Header.css'

interface TopHeaderProps {
    coinCount: number
    setCoinCount: React.Dispatch<React.SetStateAction<number>>
}

const Top_Header = ({ coinCount, setCoinCount }: TopHeaderProps) => {
    const [modalOpen, setModalOpen] = useState(false)

    const handleRecharge = (amount: number) => {
        setCoinCount(prev => prev + amount)
    }

    return (
        <div className="top_container">
            <div className="top_bar">
                <div className="boton_moneda_bar">
                    <button className="boton_moneda" onClick={() => setModalOpen(true)}>
                        <div className="espacio_moneda">
                            <GeneratingTokensIcon/>
                        </div>
                    </button>
                </div>
                <div className="coin_counter" style={{marginRight: '0.5rem', display: 'flex', alignItems: 'center', fontWeight: 600, color: '#ffd700'}}>
                    <span>{coinCount}</span>
                </div>
                <div className='app_container_bar'>
                    <button className='boton_telefono'>
                        <div className='espacio_telefono'>
                            <PhoneAndroidIcon/>
                        </div>
                    </button>
                </div>
                <div className='separadora_bar'></div>
                <div className='profile_container_bar'>
                    <button className='profile'>
                        <AccountCircleIcon/>
                    </button>
                </div>
            </div>
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onRecharge={handleRecharge} />
        </div>
    )
}

export default Top_Header