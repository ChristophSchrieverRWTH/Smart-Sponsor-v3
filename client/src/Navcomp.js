import './nav.css'
const NavComp = ({ active, onClick, user }) => {
  return (
    <>
        <nav className="navbar navbar-expand-lg navbar-light rounded" >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <a href="#/" className="nav-link" onClick={() => onClick('bank')}>Banking</a>
              </li>
              <li className="nav-item">
                <a href="#/" className="nav-link" onClick={() => onClick('verify')}>Verification</a>
              </li>
              <li className="nav-item">
                <a href="#/" className="nav-link" onClick={() => onClick('sponsor')}>Smart Sponsor</a>
              </li>
              <li>
                <a href="#/" className="nav-link" onClick={() => onClick('tutorial')}>Tutorial</a>
              </li>
            </ul>
        </nav>
        <h3 className="text-center mt-4">Logged in as: {user}</h3>
    </>
  )
}

export default NavComp
