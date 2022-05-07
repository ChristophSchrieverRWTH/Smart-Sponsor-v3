import Coin from "./Coin.js"
import { useState } from "react"
import "./Bank.css"

const Bank = ({ wallet, onPermit, onNormal, onAttach, onMint, isOwnerB }) => {
  const [mint, setMint] = useState({ address: '', amount: "", senderConditions: "", receiverConditions: "", result: null })
  let tablehead;
  let tablebody;

  const handleMint = async (e) => {
    e.preventDefault();
    const response = await onMint(mint.address, mint.amount, mint.senderConditions, mint.receiverConditions);
    setMint({ address: '', amount: "", senderConditions: "", receiverConditions: "", result: response })
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
                  <input type="number" id="typeNumber" className="form-control" placeholder="Determine Amount of Coins to Mint"
                    value={mint.amount} onChange={(e) => setMint({ ...mint, amount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputMintSender">Sender Conditions</label>
                <div className="input-group">
                  <input className="form-control" id="inputMintSender" aria-describedby="MintSenderHelp" placeholder="Enter Sender Condition"
                    value={mint.senderConditions} onChange={(e) => setMint({ ...mint, senderConditions: e.target.value })} ></input>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inputMintReceiver">Receiver Conditions</label>
                <div className="input-group">
                  <input className="form-control" id="inputMintReceiver" aria-describedby="MintReceiverHelp" placeholder="Enter Receiver Condition"
                    value={mint.receiverConditions} onChange={(e) => setMint({ ...mint, receiverConditions: e.target.value })} ></input>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (wallet === 'empty') { // TO-DO
    return (
      <div class="page-hero d-flex align-items-center justify-content-center makemid">
        <h1>
          <em>You currently have no Coins. For more Information visit your nearest bank.</em>
        </h1>
      </div>
    )
  }

  tablebody = wallet.map((curr) => (
    <Coin key={"c" + curr.coinID} coin={curr} onPermit={onPermit} onNormal={onNormal} onAttach={onAttach} />
  ))

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
              <th scope="col">Permitted Address</th>
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
    </div>
  )
}

export default Bank