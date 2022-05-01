import Coin from "./Coin.js"

const Bank = ({ wallet, onPermit }) => {

  let tablehead;
  let tablebody;


  if (wallet === 'empty') {
    return (
      <h1>Youre broke</h1>
    )
  }

  tablebody = wallet.map((curr) => (
    <Coin key={"c" + curr.coinID} coin={curr} onPermit={onPermit} />
  ))

  tablehead = (
    <table className="table">
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
  )

  return (
    <div>
      {tablehead}
    </div>
  )
}

export default Bank