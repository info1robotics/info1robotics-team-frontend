import React, {useContext} from 'react';
import {AuthContext} from './contexts/AuthContext';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Uploads from './components/Uploads';

function App() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Navbar />
        <Route exact path="/" component={Home}/>
        <Route exact path="/user/login" component={Login} /> 
        <Route exact path="/user/register" component={Register} />
        <Route exact path="/uploads" component={Uploads}/>
      </Router>
    </>
  );
}

export default App;
