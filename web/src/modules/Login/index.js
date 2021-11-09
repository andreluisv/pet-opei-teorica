import './Login.css';
import request from 'axios';
import Logo from '../../assets/logos/opei.svg';
import { useState, useEffect } from 'react';
import { mask as maskCpf, validate as validateCpf, sanitize as sanitizeCpf } from '../../lib/utils/cpf';
import { mask as maskRa, validate as validateRa, sanitize as sanitizeRa } from '../../lib/utils/ra';
import CircleLoader from '../CircleLoader/index';
import { useHistory } from 'react-router-dom';

const Login = ({backendUrl}) => {
  const history = useHistory();

  const [cpf, setCPF] = useState('');
  const [ra, setRA] = useState('');
  const [errorText, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [validCpf, setValidCpf] = useState(false);
  const [validRa, setValidRa] = useState(false);

  const handleCpfInputChange = (event) => {
    const newCpf = maskCpf(event.target.value);
    setCPF(newCpf);
    setValidCpf(validateCpf(sanitizeCpf(newCpf)));
  }

  const handleRaInputChange = (event) => {
    const newRa = maskRa(event.target.value);
    setRA(newRa);
    setValidRa(validateRa(sanitizeRa(newRa)));
  }

  const calculateTimeLeft = (start) => {
    const time = Math.max(((new Date(start)).getTime()) - ((new Date()).getTime()), 0);

    let timeleft = {
      hours: Math.floor((time / (1000 * 60 * 60))),
      minutes: Math.floor((time / 1000 / 60) % 60),
      seconds: Math.floor((time / 1000) % 60)
    };

    return `${timeleft.hours}h${timeleft.minutes}m`;
  }

  const checkCompleteExamDetails = (data) => {
    return data &&
      data.name !== undefined &&
      data.modalidade !== undefined &&
      data.prova !== undefined &&
      data.prova.durationInMinutes !== undefined &&
      data.prova.startDate !== undefined &&
      data.prova.name !== undefined &&
      data.prova.questions !== undefined &&
      data.status !== 0;
  }

  const returnAnswers = (data) => {
    const answers = [...Array(data.length)];
    data.forEach( (e, i) => {
      answers[i] = e.answer;
    });
    return answers;
  }

  useEffect(() => {
    // const local = JSON.parse(localStorage.getItem('opei-teorica'));
    // if (local && local.ok) {
    //   history.push('/exam');
    // }
  }, [])

  const handleSubmit = async (bypass) => {
    if (bypass==undefined && (!validCpf || !validRa)) return;
    setLoading(true);
    var cleanRA = sanitizeRa(ra), cleanCPF = sanitizeCpf(cpf);
    const ano = new Date().getFullYear();
    var error = '', goToExam = false;
    if (bypass==1){
      cleanRA = "0"; cleanCPF = "00000000000";
    }else if (bypass==2){
      cleanRA = "1"; cleanCPF = "11111111111";
    }
    try {
      // const req = await request.get(`${backendUrl}/user?ra=${cleanRA}&cpf=${cleanCPF}`);
      const req = await request.post(`${backendUrl}/user/login`, {
        ra: cleanRA,
        cpf: cleanCPF,
        ano: ano,
      });
      const data = req.data;
      if (req.status !== 200) {
        error = 'Problema na requisição, tente novamente.';
      } else if (data.error) {
        error = data.error === 'exam_notfound' ? 'Erro ao localizar a prova.' : 'Combinação de CPF/RA incorreta, tente novamente.';
        if (data.prova) {
          let exType = data.modalidade === 'medio' ? 'médio' : 'fundamental';
          if (data.status === 2 || data.prova.error === 'post_exam') error = 'Olimpiada finalizada.';
          else if (data.status === 0 || data.prova.error === 'pre_exam') error = `Sua prova de nível ${exType} ainda não começou. Tente novamente em: ${calculateTimeLeft(data.prova.startDate)}`;
          else error = 'Erro inesperado';
        }
      } else {
        const resultCheck = checkCompleteExamDetails(data);

        if (resultCheck) {
          localStorage.setItem('opei-teorica', JSON.stringify({
            ok: true,
            nome: data.name,
            modalidade: data.modalidade,
            duration: data.prova.durationInMinutes,
            date: data.prova.startDate,
            prova: data.prova.name,
            questions: data.prova.questions,
            choices: data.status === 2 ? JSON.parse(data.choices) : Array.from({ length: data.prova.questions.length }, () => -1),
            answers: data.status === 2 ? returnAnswers(data.prova.questions) : [],
            ra: cleanRA,
            status: data.status,
            cpf: btoa(cleanCPF),
            ano: ano
          }));
          goToExam = true;
        } else {
          error = 'Problema com a prova, contate nossa direção.';
        }

      }
    } catch (e) {
      console.log(e);
      error = 'Erro de conexão, tente novamente.'
    }
    setError(error);
    setLoading(false);
    if (goToExam) {
      history.push('/exam');
    } else {
      localStorage.setItem('opei-teorica', JSON.stringify({ ok: false }));
    }
  }

  return (<>
    <div className="box-container">
      <div className="logos">
        <img src={Logo} alt="opei-logo" />
        <p>Prova Teórica</p>
      </div>

      <div className="form">
        <p>RA</p>
        <span>O número do RA está disponível no e-mail de confirmação de inscrição.</span>
        <input
          className={ra ? (validRa ? 'valid' : 'notvalid') : ''}
          onChange={handleRaInputChange}
          value={ra}
          type="text"
          placeholder=""
          name="ra"
        />
        <p>CPF</p>
        <input
          className={cpf ? (validCpf ? 'valid' : 'notvalid') : ''}
          onChange={handleCpfInputChange}
          value={cpf}
          type="text"
          placeholder=""
          name="cpf"
        />
        {errorText ? <p className="error-dialog">{errorText}</p> : null}
      </div>
      <button onClick={handleSubmit} style={validCpf && validRa ? null : { background: 'grey', cursor: 'unset', transform: 'scale(1)' }} className="login-btn">Entrar</button>
      <div>
        <button onClick={()=>{
          handleSubmit(1);
        }} className="login-btn">Gabarito Fundamental</button>
        <button onClick={()=>{
          handleSubmit(2);
        }} className="login-btn">Gabarito Medio</button>
      </div>
      <div style={{ display: (loading ? 'flex' : 'none') }} className="blocker">
        <CircleLoader />
      </div>
    </div>
  </>);
}

export default Login;
