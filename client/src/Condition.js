import { ImCross } from 'react-icons/im';

const Condition = ({ cond, handler}) => {

    const handleFunction = (e) => {
        e.preventDefault();
        handler(cond);
    }

    return (
        <div>
            <p style={{ color: 'green' }}><em className="pr-2">{cond}</em><ImCross color={'red'} cursor={'pointer'} onClick={handleFunction} /></p>
        </div>
    )
}

export default Condition
