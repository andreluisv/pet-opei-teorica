import './Timer.css'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useEffect, useState } from 'react';

const Timer = ({ time }) => {

  const [visible, setVisible] = useState(true);
  const [clocktime, setClockTime] = useState('0:00:00');

  const tick = () => {
    const delta = Math.max(((new Date(time)).getTime()) - ((new Date()).getTime()), 0);

    let timeleft = {
      hours: Math.floor((delta / (1000 * 60 * 60))),
      minutes: Math.floor((delta / 1000 / 60) % 60),
      seconds: Math.floor((delta / 1000) % 60)
    };

    setClockTime(`${timeleft.hours}:${('0' + timeleft.minutes).slice(-2)}:${('0' + timeleft.seconds).slice(-2)}`)
  }

  setInterval(tick, 1000);

  return (
    <div className="clock-container">
      <button className="clock-visible-icon" onClick={() => { setVisible(!visible) }}>
        {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
      </button>
      <p style={{ opacity: (visible ? '100%' : '0%') }}>{clocktime}</p>
    </div>
  );
}

export default Timer;