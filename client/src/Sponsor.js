import Offer from "./Offer.js"
import { useState } from "react"

const Sponsor = ({ offers, onCreate, onApply }) => {
  const [create, setCreate] = useState({ coins: "", senderConditions: "", receiverConditions: "", result: null })
  let createBox;

  if (offers === 'empty') { // TO-DO
    return (
      <div className="page-hero d-flex align-items-center justify-content-center makemid">
        <h1>
          <em>There are currently no offers.</em>
        </h1>
      </div>
    )
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    await onCreate(create.senderConditions, create.receiverConditions, create.coins);
  }

  if (create.result !== null) {
    createBox = (
      <div className="alert alert-success mt-3" role="alert">
        Conditions are fullfilled.
      </div>
    )
  }

  let tablebody = offers.map((off) => (
    <Offer key={"o" + off.offerID} offer={off} onApply={onApply} />
  ))

  let tablehead = (
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

  return (
    <div>
      {tablehead}
      <div className="text-center m-5 row">
        <div className="col-4"></div>
        <div className="card col-4">
          <div className="card-body">
            <h2 className="card-title pb-3">Create new Offer</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label htmlFor="inputCreateCoins">Coins</label>
                <div className="input-group">
                  <input className="form-control" id="inputCreateCoins" aria-describedby="CreateCoinsHelp" placeholder="Enter Sender Condition"
                    value={create.coins} onChange={(e) => setCreate({ ...create, coins: e.target.value })} ></input>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputCreateSender">Sender Conditions</label>
                <div className="input-group">
                  <input className="form-control" id="inputCreateSender" aria-describedby="CreateSenderHelp" placeholder="Enter Sender Condition"
                    value={create.senderConditions} onChange={(e) => setCreate({ ...create, senderConditions: e.target.value })} ></input>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputCreateReceiver">Receiver Conditions</label>
                <div className="input-group">
                  <input className="form-control" id="inputCreateReceiver" aria-describedby="CreateReceiverHelp" placeholder="Enter Receiver Condition"
                    value={create.receiverConditions} onChange={(e) => setCreate({ ...create, receiverConditions: e.target.value })} ></input>
                </div>
              </div>
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
