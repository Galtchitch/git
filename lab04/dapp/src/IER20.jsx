import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ERC20Interface = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    symbol: '',
    decimals: 0,
    totalSupply: 0
  });
  const [balances, setBalances] = useState({
    user: 0,
    recipient: 0
  });
  const [allowances, setAllowances] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [spender, setSpender] = useState('');
  const [approveAmount, setApproveAmount] = useState('');

  // Контракт адрес и ABI
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  const contractABI = [
    // Полный ABI контракта ERC20
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function approve(address spender, uint256 amount)",
    "function transferFrom(address sender, address recipient, uint256 amount)"
  ];

  // Инициализация провайдера и контракта
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(web3Provider);
          
          const signer = web3Provider.getSigner();
          const userAddress = await signer.getAddress();
          setAccount(userAddress);
          
          const tokenContract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(tokenContract);
          
          // Загрузка информации о токене
          const [name, symbol, decimals, totalSupply] = await Promise.all([
            tokenContract.name(),
            tokenContract.symbol(),
            tokenContract.decimals(),
            tokenContract.totalSupply()
          ]);
          
          setTokenInfo({
            name,
            symbol,
            decimals,
            totalSupply: ethers.utils.formatUnits(totalSupply, decimals)
          });
          
          // Загрузка баланса пользователя
          const userBalance = await tokenContract.balanceOf(userAddress);
          setBalances(prev => ({
            ...prev,
            user: ethers.utils.formatUnits(userBalance, decimals)
          }));
          
        } catch (error) {
          console.error("Error initializing:", error);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };
    
    init();
  }, []);

  // Функция перевода токенов
  const handleTransfer = async () => {
    try {
      const decimals = tokenInfo.decimals;
      const amountInWei = ethers.utils.parseUnits(amount, decimals);
      
      const tx = await contract.transfer(recipient, amountInWei);
      await tx.wait();
      
      // Обновляем балансы после перевода
      const [senderBalance, recipientBalance] = await Promise.all([
        contract.balanceOf(account),
        contract.balanceOf(recipient)
      ]);
      
      setBalances({
        user: ethers.utils.formatUnits(senderBalance, decimals),
        recipient: ethers.utils.formatUnits(recipientBalance, decimals)
      });
      
      alert("Transfer successful!");
    } catch (error) {
      console.error("Transfer failed:", error);
      alert("Transfer failed: " + error.message);
    }
  };

  // Функция утверждения расходов
  const handleApprove = async () => {
    try {
      const decimals = tokenInfo.decimals;
      const amountInWei = ethers.utils.parseUnits(approveAmount, decimals);
      
      const tx = await contract.approve(spender, amountInWei);
      await tx.wait();
      
      // Проверяем новый allowance
      const newAllowance = await contract.allowance(account, spender);
      setAllowances(ethers.utils.formatUnits(newAllowance, decimals));
      
      alert("Approval successful!");
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Approval failed: " + error.message);
    }
  };

  // Функция transferFrom
  const handleTransferFrom = async () => {
    try {
      const decimals = tokenInfo.decimals;
      const amountInWei = ethers.utils.parseUnits(amount, decimals);
      
      const tx = await contract.transferFrom(account, recipient, amountInWei);
      await tx.wait();
      
      // Обновляем балансы после перевода
      const [senderBalance, recipientBalance] = await Promise.all([
        contract.balanceOf(account),
        contract.balanceOf(recipient)
      ]);
      
      setBalances({
        user: ethers.utils.formatUnits(senderBalance, decimals),
        recipient: ethers.utils.formatUnits(recipientBalance, decimals)
      });
      
      alert("TransferFrom successful!");
    } catch (error) {
      console.error("TransferFrom failed:", error);
      alert("TransferFrom failed: " + error.message);
    }
  };

  return (
    <div className="erc20-interface">
      <h1>{tokenInfo.name} ({tokenInfo.symbol}) Token Interface</h1>
      
      <div className="token-info">
        <p>Total Supply: {tokenInfo.totalSupply} {tokenInfo.symbol}</p>
        <p>Your Address: {account}</p>
        <p>Your Balance: {balances.user} {tokenInfo.symbol}</p>
      </div>
      
      <div className="transfer-section">
        <h2>Transfer Tokens</h2>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleTransfer}>Transfer</button>
      </div>
      
      <div className="approve-section">
        <h2>Approve Spender</h2>
        <input
          type="text"
          placeholder="Spender Address"
          value={spender}
          onChange={(e) => setSpender(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={approveAmount}
          onChange={(e) => setApproveAmount(e.target.value)}
        />
        <button onClick={handleApprove}>Approve</button>
        {allowances > 0 && <p>Current Allowance: {allowances} {tokenInfo.symbol}</p>}
      </div>
      
      <div className="transfer-from-section">
        <h2>Transfer From (for approved spenders)</h2>
        <input
          type="text"
          placeholder="Sender Address"
          value={account}
          readOnly
        />
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={handleTransferFrom}>Transfer From</button>
      </div>
    </div>
  );
};

export default ERC20Interface;