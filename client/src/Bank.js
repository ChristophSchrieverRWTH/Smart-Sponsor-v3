import Coin from "./Coin.js"
import "./Bank.css"
import MultiSelect from "./MultiSelect.js"
import Condition from "./Condition.js"
import { useState } from "react"
import { GoPlus } from 'react-icons/go'

const Bank = ({ wallet, onPermit, onNormal, onAttach, onMint, isOwnerB }) => {
  const [mint, setMint] = useState({ address: '', amount: "", senderConditions: "", receiverConditions: "", senderList: [], receiverList: [], result: null })
  const [check, setCheck] = useState({ selected: [] })
  let tablehead;
  let tablebody;
  let mintBox;

  if(mint.result !== null){
    if(mint.result){
      mintBox = (
        <div className="alert alert-success mt-3" role="alert">
          New coins successfully minted.
        </div>
      )
    } else {
      mintBox = (
        <div className="alert alert-danger mt-3" role="alert">
          No new coins have been minted.
        </div>
      )
    }
  }

  const addMintSender = () => {
    let toSet = mint.senderConditions;
    let copyArray = mint.senderList;
    if (toSet === '' || copyArray.includes(toSet)) {
      setMint({ ...mint, senderConditions: '' })
      return;
    }
    copyArray.push(toSet);
    setMint({ ...mint, senderList: copyArray, senderConditions: '' })
  }

  const delMintSender = (target) => {
    let newArray = [];
    mint.senderList.forEach((e) => {
      if (e !== target) {
        newArray.push(e);
      }
    })
    setMint({ ...mint, senderList: newArray })
  }

  const addMintReceiver = () => {
    let toSet = mint.receiverConditions;
    let copyArray = mint.receiverList;
    if (toSet === '' || copyArray.includes(toSet)) {
      setMint({ ...mint, receiverConditions: '' })
      return;
    }
    copyArray.push(toSet);
    setMint({ ...mint, receiverList: copyArray, receiverConditions: '' })
  }

  const delMintReceiver = (target) => {
    let newArray = [];
    mint.receiverList.forEach((e) => {
      if (e !== target) {
        newArray.push(e);
      }
    })
    setMint({ ...mint, receiverList: newArray })
  }

  let existingSender = mint.senderList.map((cond) => (
    <Condition key={"modal_es_" + cond} cond={cond} handler={delMintSender} />
  ))

  let existingReceiver = mint.receiverList.map((cond) => (
    <Condition key={"modal_er_" + cond} cond={cond} handler={delMintReceiver} />
  ))

  const handleMint = async (e) => {
    e.preventDefault();
    const response = await onMint(mint.address, mint.amount, mint.senderList, mint.receiverList);
    setMint({ address: '', amount: "", senderConditions: "", receiverConditions: "", senderList: [], receiverList: [], result: response })
  }

  const handleCheck = (target) => {
    let copyArray = check.selected;
    if (!copyArray.includes(target)) {
      copyArray.push(target);
      copyArray.sort((a, b) => (a - b));
      setCheck({ selected: copyArray });
    } else {
      let newArray = [];
      copyArray.forEach((checked) => {
        if (checked !== target) {
          newArray.push(checked);
        }
      })
      newArray.sort((a, b) => (a - b));
      setCheck({ selected: newArray });
    }
  }

  const clearChecked = () => {
    setCheck({ selected: [] })
  }

  if (isOwnerB) {
    return (
      <div className="text-center m-5 row">
        <div className="col-4"></div>
        <div className="card col-4">
          <div className="card-body">
            <h2 className="card-title pb-3">Mint new Coins</h2>
            <form onSubmit={handleMint}>
              <div className="form-group">
                <label htmlFor="inputMintAddress">Target Address</label>
                <input className="form-control" id="inputMintAddress" aria-describedby="MintAddressHelp" placeholder="Enter Wallet Address"
                  value={mint.address} onChange={(e) => setMint({ ...mint, address: e.target.value })} ></input>
              </div>
              <div className="form-group">
                <div className="form-outline">
                  <label className="form-label" htmlFor="typeNumber">Amount to Mint</label>
                  <input type="number" id="typeNumber" className="form-control" placeholder="Determine Amount of Coins to Mint" min = "1"
                    value={mint.amount} onChange={(e) => setMint({ ...mint, amount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputMintSender">Sender Conditions</label>
                <div className="input-group">
                  <input className="form-control" id="inputMintSender" aria-describedby="MintSenderHelp" placeholder="Enter Sender Condition"
                    value={mint.senderConditions} onChange={(e) => setMint({ ...mint, senderConditions: e.target.value })} ></input>
                  <GoPlus size={'2em'} color={'green'} onClick={addMintSender} cursor={'pointer'} />
                </div>
              </div>
              {existingSender}
              <div className="form-group">
                <label htmlFor="inputMintReceiver">Receiver Conditions</label>
                <div className="input-group">
                  <input className="form-control" id="inputMintReceiver" aria-describedby="MintReceiverHelp" placeholder="Enter Receiver Condition"
                    value={mint.receiverConditions} onChange={(e) => setMint({ ...mint, receiverConditions: e.target.value })} ></input>
                  <GoPlus size={'2em'} color={'green'} onClick={addMintReceiver} cursor={'pointer'} />
                </div>
              </div>
              {existingReceiver}
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
          {mintBox}
        </div>
      </div>
    )
  }

  if (wallet === 'empty') { // TO-DO
    return (
      <div className="page-hero d-flex align-items-center justify-content-center makemid">
        <h1>
          <em>You currently have no Coins. For more Information visit your nearest bank.</em>
        </h1>
      </div>
    )
  }

  tablebody = wallet.map((curr) => {
    if (check.selected.includes(curr.coinID)) {
      return <Coin key={"c" + curr.coinID} coin={curr} onPermit={onPermit} onNormal={onNormal} onAttach={onAttach} onCheck={handleCheck} isChecked={true} />
    } else {
      return <Coin key={"c" + curr.coinID} coin={curr} onPermit={onPermit} onNormal={onNormal} onAttach={onAttach} onCheck={handleCheck} isChecked={false} />
    }
  })

  tablehead = (
    <div className="ml-5 mr-5 mt-4">
      <div className="m-3">
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">Coin ID</th>
              <th scope="col">Sender Conditions</th>
              <th scope="col">Receiver Conditions</th>
              <th scrope="col">Transasctions</th>
              <th scope="col" className="text-center">Permitted Address</th>
              <th scope="col" className="text-center">Select for Multiselect </th>
            </tr>
          </thead>
          <tbody>
            {tablebody}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="pt-4">
      <MultiSelect onPermit={onPermit} onNormal={onNormal} onAttach={onAttach} checked={check.selected} clearChecked={clearChecked} />
      {tablehead}
    </div>
  )
}

export default Bank