import './nav.css'
const NavComp = ({ active, onClick }) => {
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
            </ul>
        </nav>
    </>
  )
}

export default NavComp
