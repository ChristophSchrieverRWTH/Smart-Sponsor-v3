import Condition from "./Condition"
import { useState } from "react"
import { GoPlus } from 'react-icons/go'

const MultiSelect = ({ onPermit, onNormal, onAttach, checked, clearChecked }) => {

    const [permit, setPermit] = useState({ address: '', result: null })
    const [normal, setNormal] = useState({ address: '', result: null })
    const [attach, setAttach] = useState({ address: '', senderConditions: "", receiverConditions: "", senderList: [], receiverList: [], result: null })
    let existingSender;
    let existingReceiver;

    const handlePermit = async (e) => {
        e.preventDefault();
        const response = await onPermit(checked, permit.address);
        setPermit({ address: '', result: response })
        clearChecked();
    }

    const handleNormal = async (e) => {
        e.preventDefault();
        await onNormal(checked, normal.address);
        clearChecked();
    }

    const handleAttach = async (e) => {
        e.preventDefault();
        await onAttach(checked, attach.address, attach.senderList, attach.receiverList);
        clearChecked();
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

    existingSender = attach.senderList.map((cond) => (
        <Condition key={"modal_es_" + cond} cond={cond} handler={delAttachSender} />
    ))

    existingReceiver = attach.receiverList.map((cond) => (
        <Condition key={"modal_er_" + cond} cond={cond} handler={delAttachReceiver} />
    ))

    let permitModal = (
        <div className="modal fade" id={"MultiPermitModal"} tabIndex="-1" role="dialog" aria-labelledby="MultiPermitModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="MultiPermitModalLongTitle">Permit Address to use Coin</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <input type="address" className="form-control mb-2" id="inputMultiPermit" aria-describedby="emailHelp" placeholder="Enter Address to Permit"
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

    let normalModal = (
        <div className="modal fade" id={"MultiNormalModal"} tabIndex="-2" role="dialog" aria-labelledby="MultiNormalModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="MultiNormalModalLongTitle">Transfer Coin without Attaching Conditions</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body">
                        <input type="address" className="form-control mb-2" id="inputMultiNormal" aria-describedby="emailHelp" placeholder="Enter Receiver Address"
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

    let attachModal = (
        <div className="modal fade" id={"MultiAttachModal"} tabIndex="-3" role="dialog" aria-labelledby="MultiAttachModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="MultiAttachModalLongTitle">Transfer Coin and Attach Conditions</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <form onSubmit={handleAttach}>
                            <div className="form-group">
                                <label htmlFor="inputMultiAttachAddress">Receiver Address</label>
                                <div className="input-group">
                                    <input className="form-control" id="MultiAttachAddress" aria-describedby="MultiAttachAddressHelp" placeholder="Enter Sender Address"
                                        value={attach.address} onChange={(e) => setAttach({ ...attach, address: e.target.value })} ></input>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="inputMultiAttachSender">Sender Conditions</label>
                                <div className="input-group">
                                    <input className="form-control" id="inputMultiAttachSender" aria-describedby="MultiAttachSenderHelp" placeholder="Enter Sender Condition"
                                        value={attach.senderConditions} onChange={(e) => setAttach({ ...attach, senderConditions: e.target.value })} ></input>
                                    <GoPlus size={'2em'} color={'green'} onClick={addAttachSender} cursor={'pointer'} />
                                </div>
                            </div>
                            {existingSender}
                            <div className="form-group">
                                <label htmlFor="inputMultiAttachReceiver">Receiver Conditions</label>
                                <div className="input-group">
                                    <input className="form-control mr-2" id="inputMultiAttachReceiver" aria-describedby="MultiAttachReceiverHelp" placeholder="Enter Receiver Condition"
                                        value={attach.receiverConditions} onChange={(e) => setAttach({ ...attach, receiverConditions: e.target.value })} >
                                    </input>
                                    <GoPlus size={'2em'} color={'green'} onClick={addAttachReceiver} cursor={'pointer'} />
                                </div>
                            </div>
                            {existingReceiver}
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="row">
            <div className="col-2" />
            <div className="col-2">
                {permitModal}
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#MultiPermitModal"}>
                    Permit selected Coins
                </button>
            </div>
            <div className="col-1" />
            <div className="col-2">
                {normalModal}
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#MultiNormalModal"}>
                    Normal Transfer selected Coins
                </button>
            </div>
            <div className="col-1" />
            <div className="col-2">
                {attachModal}
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target={"#MultiAttachModal"}>
                    Transfer and Attach selected Coins
                </button>
            </div>
        </div>
    )
}

export default MultiSelect