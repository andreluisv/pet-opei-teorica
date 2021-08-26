import './Exam.css'
import { useEffect, useState } from 'react';
import Logo from '../../assets/logos/opei.svg';
import {GiHamburgerMenu} from 'react-icons/gi';

const Exam = () => {

  const [choices, setChoices] = useState([]);
  const [username, setUserName] = useState('');
  const [credentials, setCredentials] = useState([]);
  const [examname, setExamName] = useState('');

  const [showSideBar, setSideBar] = useState(true);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('opei-teorica'));
    if (local && local.ok) {
      console.log(local);
      setChoices(local.choices);
      setUserName(local.nome);
      setCredentials([atob(local.cpf), local.ra])
      setExamName(local.prova);
    }
  }, [])

  return (
    <div className="container">
      <div className="sidebar">
        <button className="menu-icon" onClick={()=>{setSideBar(!showSideBar)}}>
          <GiHamburgerMenu />
        </button>
        <img src={Logo} alt="opei-logo" />
        <div className="content" style={showSideBar ? null : {display: 'none'}}>
          <p className="title">{username}</p>
          <p className="subtitle">{examname}</p>
          <br/>
          <p className="title">Tempo restante de prova</p>
          <p className="subtitle">1:30:54</p>
          <br/>
          <p className="title">QUESTÕES</p>
        </div>
      </div>
      <div className="question">

      </div>
    </div>
  );
}

export default Exam;
