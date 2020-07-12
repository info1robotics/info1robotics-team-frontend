import React, {useContext} from 'react';
import {AuthContext} from './contexts/AuthContext';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Uploads from './components/Uploads';
import UploadNew from './components/UploadNew';
import UploadDash from './components/UploadDash';

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
        <Route exact path="/uploads/new" component={UploadNew} />
        <Route exact path="/upload/:flname" component={UploadDash} />
      </Router>
    </>
  );
}

export default App;
