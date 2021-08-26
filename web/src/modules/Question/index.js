import './Question.css'

const Question = ({ index, bloco, choices, question, text }) => {

  return (
    <div>
      <h1> Questão {index + 1} </h1>
    </div>
  );
}

export default Question;
