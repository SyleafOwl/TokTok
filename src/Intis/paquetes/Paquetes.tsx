import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import SavingsIcon from '@mui/icons-material/Savings'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import './Paquetes.css'

type Props = { onSelect?: (amount: number) => void }

const Paquetes: React.FC<Props> = ({ onSelect }) => {
    return (
        <div className="contenedor-paquete">
            <div className="paquete-box" onClick={() => onSelect && onSelect(10)}>
                <GeneratingTokensIcon/>
                <span>10 Intis</span>
            </div>
            <div className="paquete-box" onClick={() => onSelect && onSelect(25)}>
                <CurrencyExchangeIcon/>
                <span>25 Intis</span>
            </div>
            <div className="paquete-box" onClick={() => onSelect && onSelect(50)}>
                <SavingsIcon/>
                <span>50 Intis</span>
            </div>
            <div className="paquete-box" onClick={() => onSelect && onSelect(100)}>
                <PriceChangeIcon/>
                <span>100 Intis</span>
            </div>
        </div>
    )
}

export default Paquetes