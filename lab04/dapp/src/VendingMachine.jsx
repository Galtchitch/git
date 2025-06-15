import { useState, useEffect } from "react";
import { ethers } from "ethers";
const vmContractAddress = "0x5e16FB1784abd2a33ca84D259AcE9e1cAE55416c";
const abi = [
    "function symbol() view returns (string)",
    "function getVendingMachineBalance() view returns (uint)",
    "function balanceOf(address addr) view returns (uint)",
    "function purchase(uint amount) payable returns ()"
];
function VendingMachine({ provider }) {
    const [address, setAddress] = useState("");
    const [symbol, setSymbol] = useState("");
    const [cupsInMachine, setCupsInMachine] = useState(0);
    const [purchaseCups, setPurchaseCups] = useState("");
    const [accountCups, setAccountCups] = useState(0);
    useEffect(() => {
        async function updateVendingMachineState(contract) {
            const symbol = await contract.symbol();
            setSymbol(symbol);
            console.log(symbol);
            const cupsInMachine = await contract.getVendingMachineBalance();
            setCupsInMachine(cupsInMachine.toString());
            console.log(cupsInMachine);
        }
        const contract = new ethers.Contract(vmContractAddress, abi, provider);
        updateVendingMachineState(contract);
    }, [symbol, cupsInMachine]);
    return (
        <>
            <div className="container">
                <h1>Vending Machine</h1>
                <div className="balance">TOTAL: {cupsInMachine} {symbol} </div>
            </div>
        </>
    );
}
export default VendingMachine;