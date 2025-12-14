import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Registration/RegisterForm';
import Login from './components/Login';
import UserProfileHeader from './components/AuthUserHeader/UserProfileHeader';
import UserFilePage from './components/AuthenticatedUsers/UserFilePage';

import './App.css'

function App() {
  return (
    <React.Fragment>
      <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
 <UserProfileHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/files"element={<UserFilePage />}></Route>
      </Routes>
    </Router>

    </React.Fragment>
  );
}

export default App
