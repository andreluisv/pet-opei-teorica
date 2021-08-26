import './Exam.css'
import { useEffect, useState } from 'react';
import Logo from '../../assets/logos/opei.svg';
import { GiHamburgerMenu } from 'react-icons/gi';
import Timer from '../Timer/index';

const Exam = () => {

  const [choices, setChoices] = useState([]);
  const [username, setUserName] = useState('');
  const [credentials, setCredentials] = useState([]);
  const [examname, setExamName] = useState('');
  const [endTime, setExamEndTime] = useState(0);

  const [showSideBar, setSideBar] = useState(true);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('opei-teorica'));
    if (local && local.ok) {
      console.log(local);
      setChoices(local.choices);
      setUserName(local.nome);
      setCredentials([atob(local.cpf), local.ra])
      setExamName(local.prova);
      setExamEndTime((new Date(local.date)).getTime() + local.duration*60*1000);
    }
  }, [])

  return (
    <div className="container">
      <div className="sidebar">
        <button className="menu-icon" onClick={() => { setSideBar(!showSideBar) }}>
          <GiHamburgerMenu />
        </button>
        <img src={Logo} alt="opei-logo" />
        <div className="content" style={showSideBar ? null : { display: 'none' }}>
          <p className="title">{username}</p>
          <p className="subtitle">{examname}</p>
          <br />
          <p className="title">Tempo restante de prova</p>
          <div className="subtitle">
            <Timer time={endTime}/>
          </div>
          <br />
          <p className="title">QUESTÕES</p>
        </div>
      </div>
      <div className="question">

      </div>
    </div>
  );
}

export default Exam;
