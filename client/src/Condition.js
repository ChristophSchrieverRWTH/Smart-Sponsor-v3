
const Condition = ({ cond, handler}) => {

    const handleFunction = (e) => {
        e.preventDefault();
        handler(cond);
    }

    return (
        <div>
            <p style={{ color: 'green', display: 'inline' }}><em>{cond}</em></p>
            <button className="btn btn-danger btn-sm ml-2 mb-1" type="button" onClick={handleFunction} cursor={'pointer'}>
                Remove
            </button>
        </div>
    )
}

export default Condition
