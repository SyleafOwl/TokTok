import GeneratingTokensIcon from '@mui/icons-material/GeneratingTokens'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import SavingsIcon from '@mui/icons-material/Savings'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import './Paquetes.css'
const Paquetes = () => {
    return (
        <div className="contenedor-paquete">
            <div className="paquete-box">
                <GeneratingTokensIcon/>
                <span>10 monedas</span>
            </div>
            <div className="paquete-box">
                <CurrencyExchangeIcon/>
                <span>25 monedas</span>
            </div>
            <div className="paquete-box">
                <SavingsIcon/>
                <span>50 monedas</span>
            </div>
            <div className="paquete-box">
                <PriceChangeIcon/>
                <span>100 monedas</span>
            </div>
        </div>
    )
}

export default Paquetes