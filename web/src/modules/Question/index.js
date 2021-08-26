import './Question.css'
import { AiFillCheckCircle } from 'react-icons/ai';

const Question = ({ index, bloco, choices, question, text, answer, changeChoice }) => {

  const renderText = () => {
    return text.map((obj, i) => {
      if (obj.type === 'text')
        return <p key={'text-' + i}>{obj.data}</p>
      else if (obj.type === 'image')
        return <img key={'img-' + i} src={obj.data}></img>
    })
  }

  const renderQuestion = () => {
    return question.map((obj, i) => {
      if (obj.type === 'text')
        return <p key={'text-' + i} style={{ fontWeight: '500' }}>{obj.data}</p>
      else if (obj.type === 'image')
        return <img key={'img-' + i} src={obj.data}></img>
    })
  }

  const renderChoices = () => {
    return choices.map((obj, i) => {
      return <div key={'choice'+i} className="choice-button" style={i === answer ? { background: '#E7EFFF' } : null} onClick={() => { changeChoice(i) }}>
        <div className="choice-button-info">
          <p>{String.fromCharCode(97 + Number(i))}. </p>
          <span>{obj}</span>
        </div>
        <div className="choice-verified-icon" style={i === answer ? null : { opacity: '0%' }}>
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
    </div>
  );
}

export default Question;
