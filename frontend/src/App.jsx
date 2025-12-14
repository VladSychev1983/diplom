import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Registration/RegisterForm';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import UserProfileHeader from './components/AuthUserHeader/UserProfileHeader';
import UserFilePage from './components/AuthenticatedUsers/UserFilePage';
import ProtectedUserRoutes from './components/Routes/AutentificatedRouters';
import { useSelector } from "react-redux";
import './App.css'

function App() {

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userData = useSelector((state) => state.user?.userData);
  const sessionid = useSelector((state) => state.user?.sessionId);
  const [sendRequest, setSendRequest] = useState(false)

  const handlerLogout = () => {
    //e.preventDefault();
    console.log('[App.jsx] sendRequest before set:', sendRequest)
    setSendRequest(true)
    console.log('clicked logout.')
    console.log('[App.jsx] sendRequest before set:', sendRequest)
  }

  let isAdmin = null;
  if (userData) {
    isAdmin = userData['is_superuser'];
  }
  console.log("[App.jsx] SESSION ID IN REDUX:", sessionid);
  return (
    <React.Fragment>
      <Router>
      <nav>
        <ul className='nav'>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {!isAuthenticated && <Link to="/register">Register</Link>}
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
          {isAuthenticated && (<Link to="/files">Files</Link>)}
          </li>
          {isAdmin && (<li><Link to="/files">AdminArea</Link></li>)}
  
          <li>
            {isAuthenticated && (<Link to="/logout" onClick={handlerLogout}>logout</Link>)}
          </li>
        </ul>
      </nav>
 <UserProfileHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      {/* Protected User Routes */}
        <Route element={< ProtectedUserRoutes />}>
        <Route path="/files"element={<UserFilePage />} />
        <Route path="/logout" element={<Logout sendRequest={sendRequest} setSendRequest={setSendRequest} />} />
        </Route>
        {/* Protected Admin Routes */}
      </Routes>
    </Router>

    </React.Fragment>
  );
}

export default App
