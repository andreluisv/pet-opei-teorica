import './QuestionButton.css'

const QuestionButton = ({ index, choice, click, selected }) => {

  return (
    <div className="question-button-box" onClick={() => { click(index) }} style={selected ? { border: '2.5px solid #2756B6' } : null}>
      <p className="question-button-title">Questão {index + 1}</p>
      <div className="answer-container">
        <p className="question-button-subtitle">{choice === -1 ? 'Não Respondida' : 'Respondida'}</p>
        <div className="answer-circle">
          <span>{choice === -1 ? '' : String.fromCharCode(65 + Number(choice))}</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionButton;