import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Registration/RegisterForm';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import UserProfileHeader from './components/AuthUserHeader/UserProfileHeader';
import FileStorage from './components/AuthenticatedUsers/FileStorage';
import ProtectedUserRoutes from './components/Routes/AutentificatedRouters';
import AdminRoutes from './components/Routes/AdminRouters';
import { useSelector } from "react-redux";
import AdminUsersList from './components/AutehnticatedAdmins/AdminUsersList';
import './App.css'

function App() {

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const userData = useSelector((state) => state.user?.userData);
  const [sendRequest, setSendRequest] = useState(false)

  const handlerLogout = () => {
    //e.preventDefault();
    setSendRequest(true)
    console.log('clicked logout.')
  }

  let isAdmin = null;
  if (userData) {
    isAdmin = userData['is_superuser'];
  }

  return (
    <React.Fragment>
       <UserProfileHeader />
      <Router>
      <nav>
        <ul className='nav'>
          <li>
            <Link to="/">Домой</Link>
          </li>
            {!isAuthenticated && (<li><Link to="/register">Регистрация</Link></li>)}
            
            {!isAuthenticated && (<li><Link to="/login">Войти</Link></li>)}
                    
          {isAuthenticated && (<li><Link to="/files">Мои файлы</Link></li>)}
          
          {isAdmin && (<li><Link to="/admin">Администратор</Link></li>)}
  
            {isAuthenticated && (<li><Link to="/logout" onClick={handlerLogout}>Выйти</Link></li>)}
          
        </ul>
      </nav>
 {/* <UserProfileHeader /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      {/* Protected User Routes */}
        <Route element={< ProtectedUserRoutes />}>
        <Route path="/files"element={<FileStorage />} />
        <Route path="/logout" element={<Logout sendRequest={sendRequest} setSendRequest={setSendRequest} />} />
        </Route>
        {/* Protected Admin Routes */}
        <Route element={< AdminRoutes />}>
        <Route path="/admin"element={<AdminUsersList />} />
        </Route>
      </Routes>
    </Router>

    </React.Fragment>
  );
}

export default App
