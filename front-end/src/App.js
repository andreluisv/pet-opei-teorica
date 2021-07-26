import React, { useState } from "react";
import "./index.css";

function App() {
  const [initialState, setInitialState] = useState(0);
  const [values, setValues] = useState({
    cpf: "",
    ra: "",
  });

  const handleCpfInputChange = (event) => {
    setValues({...values, cpf: event.target.value});
  }

  const handleRaInputChange = (event) => {
    setValues({...values, ra: event.target.value});
  }

  return (
    <div class="form-container">
    <form class="register-form">
      <input
        onChange={handleRaInputChange}
        value={values.ra}
        id="ra-field"
        class="form-field"
        type="text"
        placeholder="RA"
        name="firstName"
      />
      <input
        onChange={handleCpfInputChange}
        value={values.cpf}
        id="cpf-field"
        class="form-field"
        type="text"
        placeholder="CPF"
        name="lastName"
      />
      <button class="form-field" type="submit">
        Ok
      </button>
    </form>
  </div>
  );
}

export default App;
