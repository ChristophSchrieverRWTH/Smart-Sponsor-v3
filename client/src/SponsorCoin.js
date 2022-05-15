import { ImCross } from 'react-icons/im';

const SponsorCoin = ({coin, handler}) => {

    const handleFunction = (e) => {
        e.preventDefault();
        handler(coin);
    }

    return (
        <div>
            <p style={{ color: 'green' }}><em className="pr-2">{coin}</em><ImCross color={'red'} cursor={'pointer'} onClick={handleFunction} /></p>
        </div>
    )
}

export default SponsorCoin
