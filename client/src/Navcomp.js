import './nav.css'

const NavComp = ({ active, onClick, user, username, changeName }) => {
  let message;
  let showUser;
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

  if(username===""){
    showUser = user;
  } else {
    showUser = username;
  }

  const handleName = async () => {
    let newName = prompt("Please select your new username.");
    await changeName(newName);
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
        <div className='text-center row'>
          <div className="col-2">
          </div>
          <div className="text-center col-6">
            <h2 className="text-center mtr-4">Logged in as: {showUser}</h2>
          </div>
          <div className="text-center col-2">
            <button type="button text-center" className="btn btn-primary" onClick={handleName}>Change Username</button>
          </div>
          <div className="col-2">
          </div>
        </div>


    </>
  )
}

export default NavComp
