
import { useEffect, useState } from 'react'
import { useTransactionStep as useTransactionStep } from './hooks/useFirstTransaction'
import { useSecondTransaction } from './hooks/useSecondTransaction'

export function Transactions() {

  const {simulateQuery, writeMutation, receiptQuery, runTx} = useTransactionStep({approve: true})
  const {simulateQuery2, writeMutation2, receiptQuery2, runTx2} = useSecondTransaction()

  const tx1Hash = receiptQuery.data?.transactionHash
  const tx2Hash = receiptQuery2.data?.transactionHash


  return (
  <>
  <h1>Wagmi hooks demo</h1>

    <div>
      <button onClick={runTx}>Run first transaction</button>
      <div>Simulation1: {simulateQuery.status}</div>
      <div>Write1: {writeMutation.status}</div>
      <div>Receipt1: {receiptQuery.status}</div>
      { tx1Hash && <div> Hash1: {tx1Hash}</div>}
    </div>


    <div>------------</div>
    <div>------------</div>

    <div>
    <button onClick={runTx2}>Run second transaction</button>
    <div>Simulation2: {simulateQuery2.status}</div>
    <div>Write2: {writeMutation2.status}</div>
    <div>Receipt2: {receiptQuery2.status}</div>
    { tx2Hash && <div> Hash2: {tx2Hash}</div>}
  </div>

   </>
  )
}
