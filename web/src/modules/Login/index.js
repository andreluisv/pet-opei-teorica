import './Login.css';
import Logo from '../../assets/logos/opei.svg';
import { useState } from 'react';
import { mask as maskCpf, validate as validateCpf, sanitize as sanitizeCpf } from '../../lib/utils/cpf';
import { mask as maskRa, validate as validateRa, sanitize as sanitizeRa } from '../../lib/utils/ra';

const Login = () => {

  const [cpf, setCPF] = useState('');
  const [ra, setRA] = useState('');
  const [errorText, setError] = useState('');

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

  const handleSubmit = () => {
    if (!validCpf || !validRa) return;
    var error = '';
    setError(error)
  }

  return (
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
  );
}

export default Login;
