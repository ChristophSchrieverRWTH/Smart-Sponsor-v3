import './nav.css'
const NavComp = ({ active, onClick, user }) => {
  let message;
  if(active==='bank'){
    message = "Welcome to the Bank"
  } else if(active==='sponsor'){
    message = "Welcome to Smart Sponsor"
  } else if (active==='verify'){
    message = "Welcome to Verification"
  } else if (active==='tutorial'){
    message = "Welcome to the Tutorial"
  } else {
    message = ""
  }

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
        <h1 className="text-center mt-4">{message}</h1>
        <h4 className="text-center mt-4">Logged in as: {user}</h4>
    </>
  )
}

export default NavComp
