import { useState } from "react"
import { BsAlarm } from 'react-icons/bs'

const Verify = ({ onAdd, onCheck, onTime, isOwnerV }) => {
  const [check, setCheck] = useState({ address: '', condition: '', result: null })
  const [add, setAdd] = useState({ address: '', condition: '', result: '', timer: ''})
  const [time, setTime] = useState({ result: null })
  let checkBox;
  let addBox;
  let timeBox;


  const handleAdd = async (e) => {
    e.preventDefault();
    if (!add.address) {
      alert("Please enter an Address");
      return;
    }
    if (!add.condition) {
      alert("Please enter Conditions");
      return;
    }
    if (!add.timer) {
      alert("Please specify a date of expiry");
      return;
    }
    const response = await onAdd(add.address, add.condition, add.timer);
    setAdd({ address: '', condition: '', result: response, timer: ''});
  }

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!check.address) {
      alert("Please enter an address");
      return;
    }
    if (!check.condition) {
      alert("Please enter conditions");
      return;
    }
    const response = await onCheck(check.address, check.condition);
    setCheck({ address: '', condition: '', result: response });
  }

  const handleTime = async (e) => {
    e.preventDefault();
    const response = await onTime();
    setTime({ result: response });
  }


  if (add.result !== '') {
    if (add.result === false) {
      addBox = (
        <div className="alert alert-danger mt-3" role="alert">
          No Certificate has been added.
        </div>
      )
    } else {
      addBox = (
        <div className="alert alert-success mt-3" role="alert">
          New Certificate successfully added. Transaction Hash: {add.result}
        </div>)
    }
  }

  if (check.result !== null) {
    if (check.result) {
      checkBox = (
        <div className="alert alert-success mt-3" role="alert">
          Conditions are fullfilled.
        </div>)
    } else {
      checkBox = (
        <div className="alert alert-danger mt-3" role="alert">
          Conditions are not fullfilled!
        </div>
      )
    }
  }

  if (time.result !== null) {
    timeBox = (
      <div className="row">
        <div className="col-4"></div>
        <div className="alert alert-success col-4 mt-3" role="alert">
          Expiries have been updated successfully at {time.result}.
        </div>
      </div>
    )
  }

  let addCard = (
    <div className="card col-md-5 ml-5">
      <div className="card-body">
        <h5 className="card-title pb-3">Add New Certificate</h5>
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label htmlFor="inputAddAddress">Target Address</label>
            <input className="form-control" id="inputAddAddress" aria-describedby="addAddressHelp" placeholder="Enter Wallet Address"
              value={add.address} onChange={(e) => setAdd({ ...add, address: e.target.value })} ></input>
          </div>
          <div className="form-group">
            <label htmlFor="inputAddCondition">Condition</label>
            <input className="form-control" id="inputAddCondition" placeholder="Enter Conditions to Verify"
              value={add.condition} onChange={(e) => setAdd({ ...add, condition: e.target.value })}></input>
          </div>
          <div className="form-group">
            <label htmlFor="inputAddTimer">Expiry Date</label>
            <input className="form-control" id="inputAddCondition" placeholder="Enter Conditions to Verify" type="date"
              value={add.timer} onChange={(e) => setAdd({ ...add, timer: e.target.value })}></input>
          </div>          
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        {addBox}
      </div>
    </div>
  )

  let checkCard = (
    <div className="card-body">
      <h5 className="card-title pb-3">Check for Certificate</h5>
      <form onSubmit={handleCheck}>
        <div className="form-group">
          <label htmlFor="inputCheckAddress">Target Address</label>
          <input className="form-control" id="inputCheckAddress" aria-describedby="checkAddressHelp" placeholder="Enter Wallet Address"
            value={check.address} onChange={(e) => setCheck({ ...check, address: e.target.value })} ></input>
        </div>
        <div className="form-group">
          <label htmlFor="inputCheckCondition">Condition</label>
          <input className="form-control" id="inputCheckCondition" placeholder="Enter Conditions to Check"
            value={check.condition} onChange={(e) => setCheck({ ...check, condition: e.target.value })}></input>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {checkBox}
    </div>
  )

  let timeButton = (
    <div className="col text-center pt-4">
      <button type="button" className="btn btn-warning btn-lg" onClick={handleTime}>
        <BsAlarm />
        <br />
        Update expiration dates
      </button>
      {timeBox}
    </div>
  )

  if (isOwnerV) {
    return (
      <div>
        <div className="text-center m-5 row justify-content-between">
          {addCard}
          <div className="card col-md-5 mr-5">
            {checkCard}
          </div>
        </div>
        {timeButton}
      </div>
    )
  } else {
    return (
      <>
        <div className="text-center m-5 row">
          <div className="col-4"></div>
          <div className="col-4">
            {checkCard}
          </div>
        </div>
      </>
    )

  }
}

export default Verify
