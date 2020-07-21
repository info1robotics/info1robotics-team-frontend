import React, {useContext} from 'react';
import {AuthContext} from './contexts/AuthContext';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Uploads from './components/Uploads';
import UploadNew from './components/UploadNew';
import UploadDash from './components/UploadDash';
import AdminPanel from './components/AdminPanel';
import NotFound from './components/NotFound';
import NewUserInvite from './components/NewUserInvite';

function App() {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/home" component={Home}/>
          { 
            !isAuthenticated?
            <Switch>
              <Route exact path="/user/login" component={Login} /> 
              <Route exact path="/user/register" component={Register} />
              <Route component={NotFound} />
            </Switch> :
            <Switch>
              <Route exact path="/uploads" component={Uploads}/>
              <Route exact path="/uploads/new" component={UploadNew} />
              <Route exact path="/upload/:id" component={UploadDash} />

              { user.role === "admin" && 
                <Switch>
                  <Route exact path="/admin" component={AdminPanel} />
                  <Route exact path="/inviteUser" component={NewUserInvite} />
                  <Route component={NotFound} />
                </Switch>
              }
                <Route component={NotFound} />
            </Switch>
          }

            


        </Switch>
        
        
      </Router>
    </>
  );
}

export default App;
