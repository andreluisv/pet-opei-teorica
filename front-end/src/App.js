import React, { useState } from "react";
import axios from 'axios';
import "./index.css";

function App() {
  const [registerSubmit, setRegisterSubmit] = useState(false);
  const [values, setValues] = useState({
    cpf: "",
    ra: "",
  });
  const [errorFlags, updateErrorFlags] = useState({
    cpfFieldEmpty: false,
    raFieldEmpty: false,
  });

  const handleCpfInputChange = (event) => {
    setValues({...values, cpf: event.target.value});
  };

  const handleRaInputChange = (event) => {
    setValues({...values, ra: event.target.value});
  };

  const handleSubmitRegisterForm = (event) => {
    event.preventDefault();
    updateErrorFlags({...errorFlags, cpfFieldEmpty:!values.cpf, raFieldEmpty:!values.ra});
    var ok = true;
    if (!values.cpf || !values.ra){
      ok = false;
    }

    if (ok){
      setRegisterSubmit(true);
    }
  };

  return (
    <div className="form-container">
      {registerSubmit ? 
      <div>
        <p>submitted</p>
      </div> 
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
  );
}

export default App;
