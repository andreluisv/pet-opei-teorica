import './App.css'
import Logo from '../../assets/logos/bg-logo.svg'
import Login from '../Login/index'
import Exam from '../Exam/index'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <button style={{position: 'absolute'}} onClick={()=>{localStorage.setItem('opei-teorica', JSON.stringify({ ok: false }));}}>Logout temp</button> */}
      <Router>
        <Switch>
          <Route path='/exam'>
            <Exam />
          </Route>
          <Route path='/'>
            <main className="login">
              <Login />
            </main>
          </Route>
        </Switch>

      </Router>
      <img src={Logo} className="svgicon" alt="bg-icon" />
    </div>
  );
}

export default App;
