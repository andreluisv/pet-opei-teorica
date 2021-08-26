import './Login.css';
import request from 'axios';
import Logo from '../../assets/logos/opei.svg';
import { useState } from 'react';
import { mask as maskCpf, validate as validateCpf, sanitize as sanitizeCpf } from '../../lib/utils/cpf';
import { mask as maskRa, validate as validateRa, sanitize as sanitizeRa } from '../../lib/utils/ra';
import CircleLoader from '../CircleLoader/index';
import { useHistory } from 'react-router-dom';

const Login = () => {
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

  const handleSubmit = async () => {
    if (!validCpf || !validRa) return;
    setLoading(true);
    const cleanRA = sanitizeRa(ra), cleanCPF = sanitizeCpf(cpf);
    var error = '', goToExam = false;
    try {
      const req = await request.get(`http://localhost:3333/user?ra=${cleanRA}&cpf=${cleanCPF}`);
      const data = req.data;
      if (req.status !== 200) {
        error = 'Problema na requisição, tente novamente.';
      } else if (data.error) {
        error = 'Combinação de CPF/RA incorreta, tente novamente.';
      } else {
        if (data.prova && data.prova.error) {
          if (data.prova.error === 'post_exam') error = 'Olimpiada finalizada.';
          else if (data.prova.error === 'pre_exam') error = `Olimpiada ainda não começou, tente novamente em: ${calculateTimeLeft(data.prova.startDate)}`;
          else error = 'Erro inesperado';
        } else {
          localStorage.setItem('opei-teorica', JSON.stringify({
            ok: data.status === 1,
            nome: data.name,
            modalidade: data.modalidade,
            duration: data.prova.durationInMinutes,
            date: data.prova.startDate,
            prova: data.prova.name,
            questions: data.prova.questions,
            choices: Array.from({ length: data.prova.questions.length }, () => -1),
            ra: cleanRA,
            cpf: btoa(cleanCPF),
          }));
          goToExam = true;
        }
      }
    } catch (e) {
      error = 'Erro de conexão, tente novamente.'
    }
    setError(error);
    setLoading(false);
    if (goToExam) {
      history.push('/exam');
    }
  }

  return (<>
    <div className="blocker" style={!loading ? { display: 'none' } : null}>
      <div style={{ opacity: '100%' }}>
        <CircleLoader />
      </div>
    </div>
    <div className="box-container">
      <div className="logos">
        <img src={Logo} alt="opei-logo" />
        <p>Prova Teórica</p>
      </div>

      <div className="form">
        <p>RA</p>
        <span>O número do RA está disponível no e-mail de confirmação de inscrição.</span>
        <br />
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
      </div>
      {errorText ? <p className="error-dialog">{errorText}</p> : null}
      <button onClick={handleSubmit} style={validCpf && validRa ? null : { background: 'grey', cursor: 'unset', transform: 'scale(1)' }} className="login-btn">Entrar</button>
    </div>
  </>);
}

export default Login;
