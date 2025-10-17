import React from 'react'
import './modal.css'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    onRecharge: (amount: number) => void
}

const Modal = (props: ModalProps) => {
    const [amount, setAmount] = React.useState(0)
    const { isOpen, onClose, onRecharge } = props

    if (!isOpen) {
        return null
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (amount > 0) {
            onRecharge(amount)
            setAmount(0)
            onClose()
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>x</button>
                <h2>Recargar monedas</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <label htmlFor="coin-amount">Cantidad de monedas:</label>
                    <input
                        id="coin-amount"
                        type="number"
                        min={1}
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        required
                    />
                    <button type="submit" className="modal-buy">Comprar</button>
                </form>
            </div>
        </div>
    )
}

export default Modal
