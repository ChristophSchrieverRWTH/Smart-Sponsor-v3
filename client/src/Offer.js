
const Offer = ({ offer, onApply }) => {

  let sender;
  let receiver;
  let applyHTML;

  const handleApply = async (e) => {
    e.preventDefault();
    const response = await onApply(offer.offerID);
  }

  if (offer.senderConditions.length === 0) {
    sender = <p>None</p>
  } else {
    sender = offer.senderConditions.map((cond) => (
      <p key={"os" + cond.offerID + cond}>{cond}</p>
    ))
  }
  if (offer.receiverConditions.length === 0) {
    receiver = <p>None</p>
  } else {
    receiver = offer.receiverConditions.map((cond) => (
      <p key={"or" + cond.offerID + cond}>{cond}</p>
    ))
  }

  applyHTML = (
    <div className="text-center">
        <button type="button" className="btn btn-primary" onClick={handleApply}>
            Apply
        </button>
    </div>
)

  return (
    <tr>
      <th scope="row">{offer.offerID}</th>
      <td>{offer.amount}</td>
      <td>{sender}</td>
      <td>{receiver}</td>
      <td>{offer.donor}</td>
      <td>{applyHTML}</td>
    </tr>
  )
}

export default Offer
