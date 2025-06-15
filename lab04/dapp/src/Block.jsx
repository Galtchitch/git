import React, { useState, useEffect } from 'react';

function Block({ blocknum, provider }) {
    const [open, setOpen] = useState(false);
    const [block, setBlock] = useState(null);
    const [transactionCount, setTransactionCount] = useState(0);

    function toggle() { setOpen(!open); }

    useEffect(() => {
        async function getBlockData() {
            try {
                // Получаем информацию о блоке
                const blockInfo = await provider.getBlock(blocknum);
                console.log(blockInfo);
                setBlock(blockInfo);

                // Получаем количество транзакций в блоке
                const count = await provider.getBlockTransactionCount(blocknum);
                setTransactionCount(count);
            } catch (error) {
                console.error("Error fetching block data:", error);
            }
        }

        if (!block) {
            getBlockData();
        }
    }, [blocknum, provider, block]);

    return (
        <div style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <button 
                onClick={toggle} 
                style={{
                    padding: '8px 15px',
                    background: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Block #{blocknum} {block && `(${transactionCount} txns)`}
            </button>
            
            {open && block && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9' }}>
                    <p><strong>Block hash:</strong> {block.hash}</p>
                    <p><strong>Parent hash:</strong> {block.parentHash}</p>
                    <p><strong>Transactions:</strong> {transactionCount}</p>
                    <p><strong>Miner:</strong> {block.miner}</p>
                    <p><strong>Timestamp:</strong> {new Date(block.timestamp * 1000).toLocaleString()}</p>
                    <p><strong>Gas used:</strong> {block.gasUsed.toString()}</p>
                    <p><strong>Gas limit:</strong> {block.gasLimit.toString()}</p>
                </div>
            )}
        </div>
    );
}


export default Block;