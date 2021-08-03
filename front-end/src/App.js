import React, { useState } from "react";
import axios from 'axios';
import Clock from './components/tickingClock/index';
import ExamForms from './components/examForms/index';
import "./index.css";

function App() {
  const [registerSubmit, setRegisterSubmit] = useState(false);
  const [startedExam, setStartedExam] = useState(false);
  const [values, setValues] = useState({
    cpf: "",
    ra: "",
  });
  const [errorFlags, updateErrorFlags] = useState({
    cpfFieldEmpty: false,
    raFieldEmpty: false,
  });
  const [examDetails, updateExamRequest] = useState({
    status: 0,
    modalidade: "",
    name: "",
  });
  const [exam, updateExam] = useState({
    name: "",
    durationInMinutes: 0,
    error: "",
    questions: [],
    startDate: "",
  });

  const handleCpfInputChange = (event) => {
    setValues({ ...values, cpf: event.target.value });
  };

  const handleRaInputChange = (event) => {
    setValues({ ...values, ra: event.target.value });
  };

  const handleStartExam = (event) => {
    setStartedExam(true);
  }

  const handleSubmitRegisterForm = (event) => {
    event.preventDefault();
    updateErrorFlags({ ...errorFlags, cpfFieldEmpty: !values.cpf, raFieldEmpty: !values.ra });
    var ok = true;
    if (!values.cpf || !values.ra) {
      ok = false;
    }

    if (!ok) return;

    setRegisterSubmit(true);

    axios.get(`http://localhost:3333/user?cpf=${values.cpf}&ra=${values.ra}`).then(res => {
      if (res.error) {
        return;
      }
      if (res.data.error) {
        updateExam({ ...exam, error: res.data.error });
        return;
      }
      updateExamRequest({
        status: res.data.status,
        modalidade: res.data.modalidade,
        name: res.data.name,
      });
      updateExam({ ...exam, ...res.data.prova });
    });
  };

  return (
    <>
      {(registerSubmit && examDetails.status === 1) ? <Clock startDate={exam.startDate} durationInMinutes={exam.durationInMinutes} /> : null}
      <div className="form-container">
        {registerSubmit ?
          <>{examDetails.status === 1 ?
            <>{startedExam ?
              <div>
                <ExamForms
                  questions={exam.questions}
                />
              </div>
              :
              <div>
                <p>{exam.name}</p>
                <p>Questions: {exam.questions.length}</p>
                <button className="form-field" onClick={handleStartExam}>
                  Iniciar
                </button>
              </div>
            }</>
            :
            <div>
              {exam.error === 'ra_notfound' ? <p>Usuário com este RA não existe.</p> : null}
              {exam.error === 'cpf_notfound' ? <p>CPF errado!</p> : null}
              {exam.error === 'post_exam' ? <p>Sua prova já acabou!</p> : null}
              {exam.error === 'pre_exam' ? <p>Sua prova ainda não começou.</p> : null}
            </div>
          }</>
          :
          <form className="register-form" onSubmit={handleSubmitRegisterForm}>
            <input
              onChange={handleRaInputChange}
              value={values.ra}
              id="ra-field"
              className="form-field"
              type="text"
              placeholder="RA"
              name="ra"
            />
            {errorFlags.raFieldEmpty ? <span>Insira seu RA</span> : null}
            <input
              onChange={handleCpfInputChange}
              value={values.cpf}
              id="cpf-field"
              className="form-field"
              type="text"
              placeholder="CPF"
              name="cpf"
            />
            {errorFlags.cpfFieldEmpty ? <span>Insira seu CPF</span> : null}
            <button className="form-field" type="submit">
              Ok
            </button>
          </form>}
      </div>
    </>
  );
}

export default App;
