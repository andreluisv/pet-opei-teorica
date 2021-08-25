import './App.css'
import Logo from '../../assets/logos/bg-logo.svg'
import Login from '../Login/index'

function App() {
  return (
    <div className="App">
      <main>
        <Login />
      </main>
      <img src={Logo} className="svgicon" alter="bg-icon"/>
    </div>
  );
}

export default App;
