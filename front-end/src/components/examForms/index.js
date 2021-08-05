import React from "react";
import axios from 'axios';
import "./index.css";

class ExamForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      choices: new Array(this.props.questions.length).fill(-1),
      submitScreen: false,
    }
  }

  handleQuestionSelectInputChange = (event) => {
    let items = [...this.state.choices];
    items[this.state.index] = event.target.value;
    this.setState({ choices: items });
  };

  handleNextPage = (event) => {
    const nxt = Math.min(this.state.index + 1, this.state.choices.length - 1);
    this.setState({ index: nxt });
  }

  handlePrevPage = (event) => {
    const nxt = Math.max(this.state.index - 1, 0);
    this.setState({ index: nxt });
  }

  handleToggleSubmitScreen = (event) => {
    this.setState({ submitScreen: true });
  }

  handleGoToIndexButton = (event) => {
    this.setState({ index: event.target.value, submitScreen: false });
  }

  handleSubmitButton = (event) => {
    axios.post(`http://localhost:3333/user`, { ra: this.props.ra, cpf: this.props.cpf, resposta: { choices: this.state.choices } }).then(res => {
      if (res.status !== 200) {
        console.log("ops");
        return;
      }
      if (res.data.error) {
        console.log(res.data.error);
        return;
      }
      console.log(res.data);
    });
  }

  returnCheckedOrNotInput(idx) {
    if (idx === Number(this.state.choices[this.state.index])) {
      return <input
        onChange={this.handleQuestionSelectInputChange}
        value={idx}
        id="form-field"
        className="form-field"
        type="radio"
        name="choice"
        checked
      />
    }

    return <input
      onChange={this.handleQuestionSelectInputChange}
      value={idx}
      id="form-field"
      className="form-field"
      type="radio"
      name="choice"
    />
  }

  render() {
    return (!this.state.submitScreen ?
      <>
        <div>
          {this.state.choices ? this.state.choices.map((ele, i) => {
            const idx = this.state.choices[i];
            return (idx === -1 ? "x " : (String.fromCharCode(97 + Number(idx))) + " ");
          }) : null}
          <button key="reviewAnswersButtons" onClick={this.handleToggleSubmitScreen}>Review</button>
        </div>
        {this.props.questions && this.props.questions[this.state.index] ?
          <div>
            <h2>{this.props.questions[this.state.index].bloco}</h2>
            {this.props.questions[this.state.index].text ? this.props.questions[this.state.index].text.map((element, i) => {
              if (element.type === "text")
                return <p key={"text" + i}>{element.data}</p>;
              if (element.type === "image")
                return <img className="textImage" src={element.data} key={"image" + i} />;
              return null;
            }) : null}
            {this.props.questions[this.state.index].question ? this.props.questions[this.state.index].question.map((element, i) => {
              if (element.type === "text")
                return <p key={"question" + i}>{i == 0 ? (Number(this.state.index) + 1) + ") " : null}{element.data}</p>;
              if (element.type === "image")
                return <img className="textImage" src={element.data} key={"image" + i} />;
              return null;
            }) : null}
            <div>
              {this.props.questions[this.state.index].choices.map((option, idx) => {
                return <div key={this.state.index + "-" + idx}>
                  {this.returnCheckedOrNotInput(idx)} {String.fromCharCode(97 + Number(idx))}) {option}
                </div>
              })}
            </div>
          </div>
          : null
        }
        <div>
          <button key="prevPageButton" onClick={this.handlePrevPage}>Previous</button>
          <button key="nextPageButton" onClick={this.handleNextPage}>Next</button>
        </div>
      </>
      :
      <>
        <div>
          <div>
            {
              this.state.choices.map((val, i) => {
                const idx = this.state.choices[i];
                return <button className={idx === -1 ? "notAnsweredButton" : "answeredButton"} key={val + "x" + i} value={i} onClick={this.handleGoToIndexButton}>{i + 1}) {(idx === -1 ? "x " : (String.fromCharCode(97 + Number(idx))) + " ")}</button>
              })
            }
          </div>
          <button onClick={this.handleSubmitButton}>Submit</button>
        </div>
      </>
    );
  };

}

export default ExamForms;
