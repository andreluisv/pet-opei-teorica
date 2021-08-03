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
      <>
        <h2>
          {this.state.timeLeft.hours}:{this.state.timeLeft.minutes}:{this.state.timeLeft.seconds}
        </h2>
      </>
    );
  };

}

export default Clock;
