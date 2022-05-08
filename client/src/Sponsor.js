import Offer from "./Offer.js"

const Sponsor = ({offers, onCreate, onApply}) => {

 let tablebody = offers.map((off) => (
    <Offer key={"o" + off.offerID} offer={off} onApply={onApply}/>
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
    </div>
  )
}

export default Sponsor
