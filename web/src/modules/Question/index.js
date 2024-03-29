import './Question.css'
import { AiFillCheckCircle } from 'react-icons/ai';

const Question = ({ index, bloco, choices, question, text, answer, cAnswer, status, changeChoice, changeQuestion, length }) => {

  const renderText = () => {
    return text.map((obj, i) => {
      if (obj.type === 'text')
        return <p key={'text-' + i}>{obj.data}</p>
      else if (obj.type === 'image')
        return <img alt="question" key={'img-' + i} src={obj.data}></img>
      return null;
    })
  }

  const renderQuestion = () => {
    return question.map((obj, i) => {
      if (obj.type === 'text')
        return <p key={'text-' + i} style={{ fontWeight: '500' }}>{obj.data}</p>
      else if (obj.type === 'image')
        return <img alt="answer" key={'img-' + i} src={obj.data}></img>
      return null;
    })
  }

  const renderChoices = () => {
    return choices.map((obj, i) => {
      return <div key={'choice' + i} className="choice-button" 
      style={{
        ...(status !== 2 ? i === cAnswer ? { background: '#E7EFFF' } : null : null),
        ...(status === 2 ? (i === cAnswer ? { background: '#3fed74' } : (i === answer && i !== cAnswer ? {background: '#ff5f5f'} : null)) : null)
      }} 
      onClick={ status !== 2 ? () => { changeChoice(i) } : null}>
        <div className="choice-button-info">
          <p>{String.fromCharCode(97 + Number(i))}. </p>
          <span>{obj}</span>
        </div>
        <div className="choice-verified-icon" 
        style={status !== 2 ? (i === answer ? null : { opacity: '0%' }) : (i === cAnswer ? null : { opacity: '0%' })}>
          <AiFillCheckCircle />
        </div>
      </div>
    })
  }

  return (
    <div className="question-selected-container">
      <p className="question-index-title"> Questão {index + 1} </p>
      <p className="question-bloco-title"> {bloco} </p>
      {renderText()}
      {renderQuestion()}
      {renderChoices()}
      <div className="question-footer-buttons">
        <p style={index > 0 ? {visibility: "visible"} : {visibility: "hidden"}} onClick={() => { changeQuestion(-1) }}>{'<'} Ir para a questão anterior ({index})</p>
        <p style={index < length-1 ? {visibility: "visible"} : {visibility: "hidden"}} onClick={() => { changeQuestion(1) }}>Ir para a próxima questão ({index + 2}) {'>'}</p>
      </div>
    </div>
  );
}

export default Question;
