import Offer from "./Offer.js"
import Condition from "./Condition.js"
import SponsorCoin from "./SponsorCoin.js"
import { useState } from "react"
import { GoPlus } from 'react-icons/go'

const Sponsor = ({ offers, onCreate, onApply, wallet }) => {
  const [create, setCreate] = useState({ selectedCoin: '', senderConditions: "", receiverConditions: "", result: null, coins: [], senderList: [], receiverList: [] })
  let createBox;
  let table;

  if (offers === 'empty') { // TO-DO
    
    table= (<div className="page-hero d-flex align-items-center justify-content-center mt-5">
        <h1>
          <em>There are currently no offers.</em>
        </h1>
      </div>
    )
  } else {
    let tablebody = offers.map((off) => (
      <Offer key={"o_" + off.offerID} offer={off} onApply={onApply} />
    ))

    table = (
      <div className="ml-5 mr-5 mt-4">
        <div className="m-3">
          <table className="table ">
            <thead>
              <tr>
                <th scope="col">Offer ID</th>
                <th scrope="col">Donated Coins</th>
                <th scope="col">Sender Conditions</th>
                <th scope="col">Receiver Conditions</th>
                <th scope="col">Donor</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {tablebody}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (wallet !== "empty" && create.selectedCoin === '') {
    setCreate({ ...create, selectedCoin: wallet[0].coinID })
  }

  const addCreateCoin = () => {
    let toSet = parseInt(create.selectedCoin);
    let copyArray = create.coins;
    if (copyArray.includes(toSet)) {
      alert("You already have selected that Coin for donation.")
      return;
    }
    copyArray.push(toSet);
    copyArray.sort((a, b) => (a - b));
    setCreate({ ...create, coins: copyArray })
  }

  const delCreateCoin = (target) => {
    console.log(target)
    target = parseInt(target);
    let newArray = [];
    create.coins.forEach((e) => {
      if (e !== target) {
        newArray.push(e);
      }
    })
    newArray.sort((a, b) => (a - b));
    setCreate({ ...create, coins: newArray })
  }

  const addCreateSender = () => {
    let toSet = create.senderConditions;
    let copyArray = create.senderList;
    if (toSet === '' || copyArray.includes(toSet)) {
      setCreate({ ...create, senderConditions: '' })
      return;
    }
    copyArray.push(toSet);
    setCreate({ ...create, senderList: copyArray, senderConditions: '' })
  }

  const delCreateSender = (target) => {
    let newArray = [];
    create.senderList.forEach((e) => {
      if (e !== target) {
        newArray.push(e);
      }
    })
    setCreate({ ...create, senderList: newArray })
  }

  const addCreateReceiver = () => {
    let toSet = create.receiverConditions;
    let copyArray = create.receiverList;
    if (toSet === '' || copyArray.includes(toSet)) {
      setCreate({ ...create, receiverConditions: '' })
      return;
    }
    copyArray.push(toSet);
    setCreate({ ...create, receiverList: copyArray, receiverConditions: '' })
  }

  const delCreateReceiver = (target) => {
    let newArray = [];
    create.receiverList.forEach((e) => {
      if (e !== target) {
        newArray.push(e);
      }
    })
    setCreate({ ...create, receiverList: newArray })
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (create.coins.length === 0) {
      alert("Select Coins to use");
      return;
    }
    const result = await onCreate(create.senderList, create.receiverList, create.coins);
    setCreate({ ...create, result: result });
  }

  if (create.result !== null) {
    createBox = (
      <div className="alert alert-success mt-3" role="alert">
        Donation set up successfully.
      </div>
    )
  }

  let existingSender = create.senderList.map((cond) => (
    <Condition key={"es_" + cond} cond={cond} handler={delCreateSender} />
  ))

  let existingReceiver = create.receiverList.map((cond) => (
    <Condition key={"er_" + cond} cond={cond} handler={delCreateReceiver} />
  ))

  let existingCoins = create.coins.map((coin) => (
    <SponsorCoin key={"sc_" + coin} coin={coin} handler={delCreateCoin} />
  ))

  let coinOptions

  if (wallet !== 'empty') {
    coinOptions = wallet.map((coin) => (
      <option key={"c_" + coin.coinID} value={coin.coinID}>{coin.coinID}</option>
    ))
  }

  return (
    <div>
      {table}
      <div className="text-center m-5 row">
        <div className="col-4"></div>
        <div className="card col-4">
          <div className="card-body">
            <h2 className="card-title pb-3">Create new Offer</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="inputCreateCoins">Coins</label>
                <div className="input-group">
                  <select className="form-control" id="inputCreateCoins" value={create.selectedCoin} onChange={(e) => setCreate({ ...create, selectedCoin: e.target.value })}>
                    {coinOptions}
                  </select>
                  <GoPlus size={'2em'} color={'green'} onClick={addCreateCoin} cursor={'pointer'} />
                </div>
              </div>
              {existingCoins}
              <div className="form-group">
                <label htmlFor="inputCreateSender">Sender Conditions</label>
                <div className="input-group">
                  <input className="form-control" id="inputCreateSender" aria-describedby="CreateSenderHelp" placeholder="Enter Sender Condition"
                    value={create.senderConditions} onChange={(e) => setCreate({ ...create, senderConditions: e.target.value })} ></input>
                  <GoPlus size={'2em'} color={'green'} onClick={addCreateSender} cursor={'pointer'} />
                </div>
              </div>
              {existingSender}
              <div className="form-group">
                <label htmlFor="inputCreateReceiver">Receiver Conditions</label>
                <div className="input-group">
                  <input className="form-control mr-2" id="inputCreateReceiver" aria-describedby="CreateReceiverHelp" placeholder="Enter Receiver Condition"
                    value={create.receiverConditions} onChange={(e) => setCreate({ ...create, receiverConditions: e.target.value })} >
                  </input>
                  <GoPlus size={'2em'} color={'green'} onClick={addCreateReceiver} cursor={'pointer'} />
                </div>
              </div>
              {existingReceiver}
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            {createBox}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sponsor
