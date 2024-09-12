import { ConnectKitButton } from 'connectkit'
import { Web3Provider } from './abis/providers/Web3Provider'
import './App.css'
import { Transactions } from './Transactions'

function App() {

  return (
      <Web3Provider>

        <ConnectKitButton />
        <Transactions/>

      </Web3Provider>
  )
}

export default App
