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

  const backendUrl = "http://localhost:3333";

  return (
    <div className="App">
      {/* <button style={{position: 'absolute'}} onClick={()=>{localStorage.setItem('opei-teorica', JSON.stringify({ ok: false }));}}>Logout temp</button> */}
      <Router>
        <Switch>
          <Route path='/exam'>
            <Exam backendUrl={backendUrl}/>
          </Route>
          <Route path='/'>
            <main className="login">
              <Login backendUrl={backendUrl}/>
            </main>
          </Route>
        </Switch>

      </Router>
      <img src={Logo} className="svgicon" alt="bg-icon" />
    </div>
  );
}

export default App;
