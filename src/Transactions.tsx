/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useTransactionStep as useTransactionStep } from './hooks/useFirstTransaction'

export function Transactions() {

  const [txNumber, setTxNumber] = useState(1)

  return (
  <>
  <h1>Wagmi hooks demo</h1>

    { txNumber === 1 && <FirstStep setTxNumber={setTxNumber} /> }

    <div>------------</div>
    <div>------------</div>

    { txNumber === 2 &&  <SecondStep setTxNumber={setTxNumber} /> }

   </>
  )
}

function FirstStep({setTxNumber}: {setTxNumber: (n: number) => void}) {
  const {simulateQuery, writeMutation, receiptQuery, runTx} = useTransactionStep({approve: true})
  const tx1Hash = receiptQuery.data?.transactionHash

  useEffect(() => {
    if (tx1Hash) {
      console.log('First step is completed', {tx1Hash})
      setTxNumber(2)
    }
  }, [tx1Hash])

  return (
  <div>
    <button onClick={runTx}>Run first transaction</button>
    <div>Simulation1: {simulateQuery.status}</div>
    <div>Write1: {writeMutation.status}</div>
    <div>Receipt1: {receiptQuery.status}</div>
    { tx1Hash && <div> Hash1: {tx1Hash}</div>}
  </div>)
}


function SecondStep({setTxNumber}: {setTxNumber: (n: number) => void}) {
  const {simulateQuery, writeMutation, receiptQuery, runTx} = useTransactionStep({approve: false})
  const tx2Hash = receiptQuery.data?.transactionHash

  const executionHash = writeMutation.data
  // This would be printed if we get a tx hash from the previous transaction mutation
  if (executionHash) console.log('writeMutationHash in Second step:', {executionHash})

  useEffect(() => {
    if (tx2Hash) {
      console.log('Second step is completed', {tx2Hash})
      setTxNumber(1)
    }
  }, [tx2Hash])

  return (
  <div>
    <button onClick={runTx}>Run second transaction</button>
    <div>Simulation2: {simulateQuery.status}</div>
    <div>Write2: {writeMutation.status}</div>
    <div>Receipt2: {receiptQuery.status}</div>
    { tx2Hash && <div> Hash2: {tx2Hash}</div>}
  </div>)
}


// function SecondTx({setTxNumber}: {setTxNumber: (n: number) => void}) {
//   const {simulateQuery2, writeMutation2, receiptQuery2, runTx2} = useSecondTransaction()
//   const tx2Hash = receiptQuery2.data?.transactionHash

//   useEffect(() => {
//     if (tx2Hash){
//       console.log({tx2Hash})
//       setTxNumber(2)
//     }
//     setTxNumber(1)
//   }, [tx2Hash])

//   return (
//   <div>
//     <button onClick={runTx2}>Run second transaction</button>
//     <div>Simulation2: {simulateQuery2.status}</div>
//     <div>Write2: {writeMutation2.status}</div>
//     <div>Receipt2: {receiptQuery2.status}</div>
//     { tx2Hash && <div> Hash: {tx2Hash}</div>}
//   </div>)
// }