import React from "react";
import "./index.css";

class ExamForms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      choices: new Array(this.props.questions.length).fill(-1)
    }
  }

  handleQuestionSelectInputChange = (event) => {
    let items = [...this.state.choices];
    items[this.state.index] = event.target.value;
    this.setState({ choices: items });
  };

  handleNextPage = (event) => {
    this.setState({ index: this.state.index + 1 });
  }

  handlePrevPage = (event) => {
    this.setState({ index: this.state.index - 1 });
  }

  returnCheckedOrNotInput(idx) {
    if (idx === this.state.choices[this.state.index]) {
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
    return (
      <>
        <div>
          {this.state.choices ? this.state.choices.map((ele, i) => {
            return this.state.choices[i] + " ";
          }) : null}
        </div>
        <p>
          {this.props.questions[this.state.index].text}
        </p>
        <p>
          {this.props.questions[this.state.index].question}
        </p>
        <div>
          {this.props.questions[this.state.index].choices.map((option, idx) => {
            return <div key={this.state.index + "-" + idx}>
              {this.returnCheckedOrNotInput(idx)} {option}
            </div>
          })}
        </div>
        <div>
          {this.state.index > 0 ? <button onClick={this.handlePrevPage}>Previous</button> : null}
          {this.state.index + 1 < this.state.choices.length ? <button onClick={this.handleNextPage}>Next</button> : null}
        </div>
      </>
    );
  };

}

export default ExamForms;
