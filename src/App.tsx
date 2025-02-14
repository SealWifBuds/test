import { Connected } from './components/Connected'
import { Text } from './components/Text'

import "./App.css"


export function App() {
  return (
    <div className={"container"}>
       <div className={"main"}>
        <h1 className={"title"}>
          <a href="https://sealwifbuds.com">Seal Wif Buds</a> - NFT Minting dApp
        </h1>
        <p><img src="/logo.png" alt="Logo" style={{ width: '200px', height: '200px' }} /></p>
        <br/>
        <Text/>
            <Connected/>
      </div>
    </div>
  )
}

export default App
