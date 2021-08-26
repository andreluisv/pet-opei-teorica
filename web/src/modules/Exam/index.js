import { useEffect, useState } from 'react';
import './Exam.css'

const Exam = () => {

  const [choices, setChoices] = useState([]);
  const [username, setUserName] = useState('');
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('opei-teorica'));
    if (local && local.ok) {
      console.log(local);
      setChoices(local.choices);
      setUserName(local.nome);
      setCredentials([atob(local.cpf), local.ra])
    }
  }, [])

  return (
    <div className="container">
      <h1>Olá, {username} de cpf: {credentials[0]} e ra {credentials[1]}</h1>
    </div>
  );
}

export default Exam;
