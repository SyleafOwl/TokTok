import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import SavingsIcon from '@mui/icons-material/Savings'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import './Paquetes.css'

type Props = {
    onSelect?: (amount: number) => void
    onCustom?: () => void
    selectedAmount?: number
    customSelected?: boolean
}

const Paquetes: React.FC<Props> = ({ onSelect, onCustom, selectedAmount, customSelected }) => {
    return (
        <div className="contenedor-paquete">
            <div className={`paquete-box ${selectedAmount === 100 ? 'selected' : ''}`} onClick={() => onSelect && onSelect(100)} aria-pressed={selectedAmount === 100}>
                <GeneratingTokensIcon/>
                <span>100 Intis</span>
            </div>
            <div className={`paquete-box ${selectedAmount === 500 ? 'selected' : ''}`} onClick={() => onSelect && onSelect(500)} aria-pressed={selectedAmount === 500}>
                <SavingsIcon/>
                <span>500 Intis</span>
            </div>
            <div className={`paquete-box ${selectedAmount === 1000 ? 'selected' : ''}`} onClick={() => onSelect && onSelect(1000)} aria-pressed={selectedAmount === 1000}>
                <CurrencyExchangeIcon/>
                <span>1000 Intis</span>
            </div>
            <div className={`paquete-box ${customSelected ? 'selected' : ''}`} onClick={() => onCustom && onCustom()} aria-pressed={!!customSelected}>
                <PriceChangeIcon/>
                <span>Personalizado</span>
            </div>
        </div>
    )
}

export default Paquetes