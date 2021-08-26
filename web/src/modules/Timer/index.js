import './Timer.css'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useState } from 'react';

const Timer = () => {

  const [visible, setVisible] = useState(true);

  return (
    <div className="clock-container">
      <button className="clock-visible-icon" onClick={() => { setVisible(!visible) }}>
        {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
      </button>
      <p style={{ opacity: (visible ? '100%' : '0%') }}>1:30:54</p>
    </div>
  );
}

export default Timer;