import { useState } from "react"

const Coin = ({ coin, onPermit }) => {
    const [permit, setPermit] = useState({ address: '', result: null })
    const [normal, setNormal] = useState({ address: '', result: null })
    const [attach, setAttach] = useState({ address: '', result: null }) // TO-DO create ability to set multiple conds
    let sender;
    let receiver;
    let permitHTML;
    let permitModal;
    let normalModal;
    let attachModal;
    let transactionHTML;

    const handlePermit = async (e) => {
        e.preventDefault();
        const response = await onPermit(coin.coinID, permit.address);
        setPermit({ address: '', result: response })
    }

    permitModal = (
        <div className="modal fade" id={coin.coinID + "permitModal"} tabIndex="-1" role="dialog" aria-labelledby="permitModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="permitModalLongTitle">Permit Address to use Coin</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <input type="address" className="form-control mb-2" id="inputPermit" aria-describedby="emailHelp" placeholder="Enter Address to Permit"
                            value={permit.address} onChange={(e) => setPermit({ ...permit, address: e.target.value })}></input>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handlePermit}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    )

    normalModal = (
        <div className="modal fade" id={coin.coinID + "normalModal"} tabIndex="-2" role="dialog" aria-labelledby="normalModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="normalModalLongTitle">Transfer Coin without Attaching Conditions</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <input type="address" className="form-control mb-2" id="inputNormal" aria-describedby="emailHelp" placeholder="Enter Receiver Address"
                            value={normal.address} onChange={(e) => setNormal({ ...normal, address: e.target.value })}></input>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handlePermit}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    )

    attachModal = (
        <div className="modal fade" id={coin.coinID + "attachModal"} tabIndex="-3" role="dialog" aria-labelledby="attachModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="attachModalLongTitle">Transfer Coin and Attach Conditions</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <input type="address" className="form-control mb-2" id="inputAttach" aria-describedby="emailHelp" placeholder="Enter Receiver Address"
                            value={attach.address} onChange={(e) => setAttach({ ...attach, address: e.target.value })}></input>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handlePermit}>Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    )

    transactionHTML = (
        <div>
            <button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#" + coin.coinID + "normalModal"}>
                Normal Transfer
            </button>
            <br/>
            <button type="button" className="btn btn-primary mt-1" data-toggle="modal" data-target={"#" + coin.coinID + "attachModal"}>
                Transfer and Attach
            </button>
        </div>

    )

    if (coin.senderConditions.length === 0) {
        sender = <p>None</p>
    } else {
        sender = coin.senderConditions.map((cond) => (
            <p key={"s" + cond.coinID + cond}>{cond}</p>
        ))
    }
    if (coin.receiverConditions.length === 0) {
        receiver = <p>None</p>
    } else {
        receiver = coin.receiverConditions.map((cond) => (
            <p key={"r" + cond.coinID + cond}>{cond}</p>
        ))
    }

    if (coin.permit === "") {
        permitHTML = (
            <div>
                None
                <br />
                <button type="button" className="btn btn-primary mt-3" data-toggle="modal" data-target={"#" + coin.coinID + "permitModal"}>
                    Permit new Address
                </button>
            </div>
        )
    } else {
        permitHTML = coin.permit;
    }

    return (
        <tr>
            <th scope="row">{coin.coinID}</th>
            <td>{sender}</td>
            <td>{receiver}</td>
            <td>
                {normalModal}
                {attachModal}
                {transactionHTML}
            </td>
            <td className="text-center">
                {permitModal}
                {permitHTML}
            </td>
        </tr>
    )
}

export default Coin
