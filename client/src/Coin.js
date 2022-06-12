import { useState } from "react"
import { GoPlus } from 'react-icons/go'
import Condition from "./Condition"

const Coin = ({ coin, onPermit, onNormal, onAttach, onCheck, isChecked }) => {
    const [permit, setPermit] = useState({ address: '', result: null })
    const [normal, setNormal] = useState({ address: '', result: null })
    const [attach, setAttach] = useState({ address: '', senderConditions: "", receiverConditions: "", senderList: [], receiverList: [], result: null })
    const [check, setCheck] = useState({ checked: false })
    let sender;
    let receiver;
    let permitHTML;
    let permitModal;
    let normalModal;
    let attachModal;
    let transactionHTML;

    const handlePermit = async (e) => {
        e.preventDefault();
        if(!permit.address){
            alert("Please enter an address")
            return;
        }
        const response = await onPermit([coin.coinID], permit.address);
        setPermit({ address: '', result: response })
    }

    // As handleattach/normal transfer the coin, there is no need to empty the state as is with permit.
    const handleNormal = async (e) => {
        if(!normal.address){
            alert("Please enter an address");
            return;
        }
        e.preventDefault();
        await onNormal([coin.coinID], normal.address);
    }

    const handleAttach = async (e) => {
        if(!attach.address){
            alert("Please enter an address");
            return;
        }
        if(attach.senderList.length === 0 && attach.receiverList.length === 0){
            alert("Please enter at least one condition or use the normal transfer");
            return;
        }
        e.preventDefault();
        await onAttach([coin.coinID], attach.address, attach.senderList, attach.receiverList);
    }

    const handleCheck = () => {
        onCheck(coin.coinID);
    }

    const addAttachSender = () => {
        let toSet = attach.senderConditions;
        let copyArray = attach.senderList;
        if (toSet === '' || copyArray.includes(toSet)) {
            setAttach({ ...attach, senderConditions: '' })
            return;
        }
        copyArray.push(toSet);
        setAttach({ ...attach, senderList: copyArray, senderConditions: '' })
    }

    const delAttachSender = (target) => {
        let newArray = [];
        attach.senderList.forEach((e) => {
            if (e !== target) {
                newArray.push(e);
            }
        })
        setAttach({ ...attach, senderList: newArray })
    }

    const addAttachReceiver = () => {
        let toSet = attach.receiverConditions;
        let copyArray = attach.receiverList;
        if (toSet === '' || copyArray.includes(toSet)) {
            setAttach({ ...attach, receiverConditions: '' })
            return;
        }
        copyArray.push(toSet);
        setAttach({ ...attach, receiverList: copyArray, receiverConditions: '' })
    }

    const delAttachReceiver = (target) => {
        let newArray = [];
        attach.receiverList.forEach((e) => {
            if (e !== target) {
                newArray.push(e);
            }
        })
        setAttach({ ...attach, receiverList: newArray })
    }

    let existingSender = attach.senderList.map((cond) => (
        <Condition key={"modal_es_" + cond} cond={cond} handler={delAttachSender} />
    ))

    let existingReceiver = attach.receiverList.map((cond) => (
        <Condition key={"modal_er_" + cond} cond={cond} handler={delAttachReceiver} />
    ))

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
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handlePermit}>Confirm</button>
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
                        <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handleNormal}>Confirm</button>
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
                    <div className="modal-body text-center">
                        <div className="form-group">
                            <label htmlFor="inputAttachAddress">Receiver Address</label>
                            <div className="input-group">
                                <input className="form-control" id="AttachAddress" aria-describedby="AttachAddressHelp" placeholder="Enter Sender Address"
                                    value={attach.address} onChange={(e) => setAttach({ ...attach, address: e.target.value })} ></input>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="inputAttachSender">Sender Conditions</label>
                            <div className="input-group">
                                <input className="form-control" id="inputAttachSender" aria-describedby="AttachSenderHelp" placeholder="Enter Sender Condition"
                                    value={attach.senderConditions} onChange={(e) => setAttach({ ...attach, senderConditions: e.target.value })} ></input>
                                <GoPlus size={'2em'} color={'green'} onClick={addAttachSender} cursor={'pointer'} />
                            </div>
                        </div>
                        {existingSender}
                        <div className="form-group">
                            <label htmlFor="inputAttachReceiver">Receiver Conditions</label>
                            <div className="input-group">
                                <input className="form-control mr-2" id="inputAttachReceiver" aria-describedby="AttachReceiverHelp" placeholder="Enter Receiver Condition"
                                    value={attach.receiverConditions} onChange={(e) => setAttach({ ...attach, receiverConditions: e.target.value })} >
                                </input>
                                <GoPlus size={'2em'} color={'green'} onClick={addAttachReceiver} cursor={'pointer'} />
                            </div>
                        </div>
                        {existingReceiver}

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={handleAttach}>Submit</button>
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
            <br />
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

    if (coin.permit === "0x0000000000000000000000000000000000000000") {
        permitHTML = (
            <div className="text-center">
                None
                <br />
                <button type="button" className="btn btn-primary mt-3" data-toggle="modal" data-target={"#" + coin.coinID + "permitModal"}>
                    Permit new Address
                </button>
            </div>
        )
    } else {
        permitHTML = (
            <div className="text-center">
                {coin.permit}
            </div>
        );
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
            <td>
                {permitModal}
                {permitHTML}
            </td>
            <td>
                <div className="form-check text-center">
                    <input className="form-check-input" type="checkbox" checked={isChecked} onChange={(e) => {
                        handleCheck();
                        setCheck({ checked: !check.checked })
                    }} />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                        Select
                    </label>
                </div>
            </td>
        </tr>
    )
}

export default Coin
