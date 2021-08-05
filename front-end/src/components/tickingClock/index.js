import React from "react";
import "./index.css";

const calculateTimeLeft = (start, duration) => {
  const time = Math.max((start + duration) - (new Date()).getTime(), 0);

  let timeleft = {};

  timeleft = {
    hours: Math.floor((time / (1000 * 60 * 60))),
    minutes: Math.floor((time / 1000 / 60) % 60),
    seconds: Math.floor((time / 1000) % 60)
  };

  return timeleft;
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: calculateTimeLeft((new Date(this.props.startDate)).getTime(), this.props.durationInMinutes * 60 * 1000)
    }
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    this.setState({
      timeLeft: calculateTimeLeft((new Date(this.props.startDate)).getTime(), this.props.durationInMinutes * 60 * 1000)
    });
  }

  render() {
    return (
      <div className="clockConstraint">
        <div className="display">
          <span>{("0" + (this.state.timeLeft.hours||0)).slice(-2)}:</span>
          <span>{("0" + (this.state.timeLeft.minutes||0)).slice(-2)}:</span>
          <span>{("0" + (this.state.timeLeft.seconds||0)).slice(-2)}</span>
        </div>
      </div>
    );
  };

}

export default Clock;
