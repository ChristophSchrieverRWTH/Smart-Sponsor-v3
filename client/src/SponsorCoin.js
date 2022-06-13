
const SponsorCoin = ({coin, handler}) => {

    const handleFunction = (e) => {
        e.preventDefault();
        handler(coin);
    }

    return (
        <div>
            <p style={{ color: 'green', display: 'inline' }}><em>{coin}</em></p>
            <button className="btn btn-danger btn-sm ml-2 mb-1" type="button" onClick={handleFunction} cursor={'pointer'}>
                Remove
            </button>
        </div>
    )
}

export default SponsorCoin
