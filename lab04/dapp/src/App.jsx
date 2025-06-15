import { ethers } from "ethers";
import './App.css';
import BalanceReader from './BalanceReader.jsx';
import BlockExplorer from "./BlockExplorer.jsx";
import VendingMachine from "./VendingMachine.jsx";
import ERC20Interface from "./IER20.jsx";

const providerUrl = "https://ethereum-sepolia-rpc.publicnode.com";
// const providerUrl = "http://77.51.210.148:48545/";
const provider = new ethers.JsonRpcProvider(providerUrl);
const network = await provider.getNetwork();

function App() {
  console.log(network);
  return (
    <>
      <ERC20Interface
        provider={provider} />
    </>
  )
}
export default App