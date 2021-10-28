import './Exam.css'
import { useEffect, useState } from 'react';
import Logo from '../../assets/logos/opei.svg';
import { GiHamburgerMenu } from 'react-icons/gi';
import Timer from '../Timer/index';
import QuestionButton from '../QuestionButton/index';
import CircleLoader from '../CircleLoader/index';
import Question from '../Question/index';
import request from 'axios';

const Exam = ({backendUrl}) => {

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
      setOk(true);
      setChoices(local.choices);
      setUserName(local.nome);
      setCredentials([local.cpf, local.ra])
      setExamName(local.prova);
      setExamEndTime((new Date(local.date)).getTime() + (local.duration * 60 * 1000));
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
    setShowSubmitLoadingSpinner(true);
    const sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };
    const req = await request.post(`${backendUrl}/user`, { cpf: atob(credentials[0]), ra: credentials[1], resposta: { choices: choices } });
    var txt = 'Erro inesperado, tente novamente!';
    if (req.status !== 200) {
      txt = 'Error, tente novamente!';
    }
    if (req.data.error) {
      txt = req.data.error;
      if (txt === 'post_exam')
        txt = 'Data limite de entrega finalizada!';
      else if (txt === 'pre_exam')
        txt = 'Prova ainda não começou!';
      else if (txt === 'exam_notfound')
        txt = 'Prova não encontrada!';
    }
    if (req.data === 'OK') {
      var dateAux = new Date();
      console.log(dateAux);
      let date = `${String(dateAux.getDate()).padStart(2,'0')}/${String(dateAux.getMonth() + 1).padStart(2, '0')}/${dateAux.getFullYear()}`;
      let hour = `${dateAux.getHours()}:${String(dateAux.getMinutes()).padStart(2, '0')}:${dateAux.getSeconds()}`;
      txt = `Prova submetida com sucesso às: ${date} de ${hour}`;
    }

    setShowSubmitLoadingSpinner(false);
    await sleep(100);
    alert(txt)
  }

  const handleChoiceChange = (idx) => {
    const newChoices = [...choices];
    newChoices[selectedQuestion] = idx;
    updateChoicesLocalStorage(newChoices);
    setChoices(newChoices);
  }

  const handleChangeQuestion = (val) => {
    var newQ = selectedQuestion + val;
    newQ = Math.min(newQ, choices.length - 1);
    newQ = Math.max(newQ, 0);
    setSelectedQuestion(newQ);
  }

  return (!localStorageOk ? <a href="/">Efetue login para visualizar esta página.</a> :
    <div className="container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <button className="menu-icon" onClick={() => { setSideBar(!showSideBar) }}>
              <GiHamburgerMenu />
            </button>
            <h2 className="menu-recomendacoes" onClick={() => {setSelectedQuestion(-1)}} >Recomendações</h2>
          </div>
        <img src={Logo} alt="opei-logo" />
        </div>

        <div className="content" style={showSideBar ? null : { display: 'none' }}>
          <p className="title">{username}</p>
          <p className="subtitle">{examname}</p>

          <p className="title-2" style={{marginTop : '2.5vh'}} >TEMPO RESTANTE DE PROVA</p>
          <div className="subtitle-2">
            <Timer time={endTime} />
          </div>

          <p className="title-2" style={{marginTop : '2.5vh'}}>QUESTÕES</p>
          <div className="questions-buttons-container">
            {renderQuestionsButtons()}
          </div>
          <div className="submit-exam-button-container">
            <button className="submit-exam-button" onClick={handleSubmit}>Entregar prova</button>
            <div style={{ display: (showSubmitLoadindSpinner ? 'flex' : 'none') }} className="submit-exam-spinner">
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
            changeQuestion={handleChangeQuestion}
            length = {questions.length}
          />
          :
          <div className="recomendations">
            <h1>Recomendações:</h1>
            <p>Esta prova é composta por 5 Blocos de Questões com 4 Questões cada, totalizando 20 Questões. Abaixo estão alguma recomendações para uma boa execução da prova:</p>
            <p>1. Lembre de anotar as suas respostas em um papel, em casos de queda de rede suas respostas podem ser perdidas ao sair e retornar para a prova.</p> 
            <p>2. Você poderá submeter quantas vezes quiser até a hora limite de entrega, momento em que a aplicação será encerrada. E fique tranquilo que apenas a última submissão será contabilizada.</p> 
            <p>3. Não envie a prova no último instante, recomendamos que reserve os últimos 15 minutos para revisar suas respostas e enviar sua versão final.</p>
            <p>4. Em qualquer dúvida ou problema, entre em contato conosco diretamente mandando um e-mail para opei@cin.ufpe.br.</p> 
            <p>Boa Prova!</p>
          </div>
        }
      </div>
    </div>
  );
}

export default Exam;
