import './Exam.css'
import { useEffect, useState } from 'react';
import Logo from '../../assets/logos/opei.svg';
import { GiHamburgerMenu } from 'react-icons/gi';
import Timer from '../Timer/index';
import QuestionButton from '../QuestionButton/index';
import CircleLoader from '../CircleLoader/index';
import Question from '../Question/index';

const Exam = () => {

  const [choices, setChoices] = useState([]);
  const [username, setUserName] = useState('');
  const [credentials, setCredentials] = useState([]);
  const [examname, setExamName] = useState('');
  const [endTime, setExamEndTime] = useState(0);
  const [questions, setQuestions] = useState([]);

  const [localStorageOk, setOk] = useState(false);
  const [showSideBar, setSideBar] = useState(true);
  const [showSubmitLoadindSpinner, setShowSubmitLoadingSpinner] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(-1);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('opei-teorica'));
    if (local && local.ok) {
      console.log(local);
      setOk(true);
      setChoices(local.choices);
      setUserName(local.nome);
      setCredentials([local.cpf, local.ra])
      setExamName(local.prova);
      setExamEndTime((new Date(local.date)).getTime() + local.duration * 60 * 1000);
      setQuestions(local.questions);
    }
  }, [])

  const updateChoicesLocalStorage = (newChoices) => {
    const obj = JSON.parse(localStorage.getItem('opei-teorica'));
    obj.choices = newChoices;
    localStorage.setItem('opei-teorica', JSON.stringify(obj));
  }

  const renderQuestionsButtons = () => {
    return choices.map((val, i) => {
      return <QuestionButton key={val + '-' + i} selected={selectedQuestion === i} index={i} choice={val} click={(idx) => { setSelectedQuestion(idx) }} />
    })
  }

  const handleSubmit = async () => {
    console.log(credentials);
    setShowSubmitLoadingSpinner(true);
    const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };
    await sleep(1500);
    setShowSubmitLoadingSpinner(false);
    await sleep(100);
    alert('Prova entregue com sucesso!')
  }

  const handleChoiceChange = (idx) => {
    const newChoices = [...choices];
    newChoices[selectedQuestion] = idx;
    updateChoicesLocalStorage(newChoices);
    setChoices(newChoices);
  }

  return (!localStorageOk ? <a href="/">Efetue login para visualizar esta página.</a> :
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
            <Timer time={endTime} />
          </div>
          <br />
          <p className="title">QUESTÕES</p>
          <div className="questions-buttons-container">
            {renderQuestionsButtons()}
          </div>
          <div className="submit-exam-button-container">
            <button className="submit-exam-button" onClick={handleSubmit}>Entregar prova</button>
            <div style={{ opacity: (showSubmitLoadindSpinner ? '100%' : '0%') }} className="submit-exam-spinner">
              <CircleLoader />
            </div>
          </div>
          <p className="submit-exam-button-subtitle">Pode entregar a prova quantas vezes quiser, será avaliada apenas a última submissão.</p>
        </div>
      </div>
      <div className="question">
        {selectedQuestion >= 0 && selectedQuestion < questions.length ?
          <Question
            index={selectedQuestion}
            bloco={questions[selectedQuestion].bloco}
            choices={questions[selectedQuestion].choices}
            question={questions[selectedQuestion].question}
            text={questions[selectedQuestion].text}
            answer={choices[selectedQuestion]}
            changeChoice={handleChoiceChange}
          />
          :
          <div>
            <h1>Regras, dicas e talz</h1>
          </div>
        }
      </div>
    </div>
  );
}

export default Exam;
