import Offer from "./Offer.js"

const Sponsor = ({offers, onCreate, onApply}) => {

 /* let tablebody = offers.map((off) => (
    <Offer key={"c" + off.coinID} offer={off} onApply={onApply}/>
  ))*/
  let tablebody = <p1>body</p1>

  let tablehead = (
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
      <h2>Sponsor online</h2>
    </div>
  )
}

export default Sponsor
