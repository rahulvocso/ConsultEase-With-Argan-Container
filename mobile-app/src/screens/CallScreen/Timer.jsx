import React, { useState, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';

const Timer = ( {timerLimit, callId} ) => {
  const [timeRemaining, setTimeRemaining] = useState(timerLimit);
  const [timePassedHrMin, setTimePassedHrMin] = useState({ hr: 0, min: 0, sec: 0 });
  const [timeRemainingHrMin, setTimeRemainingHrMin] = useState({ hr: 0, min: 0, sec: 0 });

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    const totalSecondsPassed = timerLimit - timeRemaining;

    setTimePassedHrMin({
      hr: Math.floor(totalSecondsPassed / (60 * 60)),
      min: Math.floor((totalSecondsPassed - (Math.floor(totalSecondsPassed / (60 * 60)) * 60 * 60)) / 60),
      sec: totalSecondsPassed % 60
    });

    setTimeRemainingHrMin({
      hr: Math.floor(timeRemaining / (60 * 60)),
      min: Math.floor((timeRemaining - (Math.floor(timeRemaining / (60 * 60)) * 60 * 60)) / 60),
      sec: timeRemaining % 60
    });
  }, [timerLimit, timeRemaining]);


  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;   // add zero in front if value is less than 10
  }

  return (
  <>
  <Text style={styles.topProgressBarText}>
    {`${formatTime(timeRemainingHrMin.hr)}:${formatTime(timeRemainingHrMin.min)}:${formatTime(timeRemainingHrMin.sec)} remaining`}
    </Text>
  <Text style={styles.topProgressBarText}>
    {`${formatTime(timePassedHrMin.hr)}${formatTime(timePassedHrMin.min)}:${formatTime(timePassedHrMin.sec)} passed`}
    </Text>
  <Text style={styles.topProgressBarText}>#{callId}</Text>
  </>
  )
};


const styles = StyleSheet.create({
topProgressBarText: {
    paddingTop: 0,
    color: '#fff',
  },
})


export default Timer;







// import React from 'react';

// const Timer = () => {
//     const timer_limit = 36000; // set the time limit in seconds
//     let time_passed = 3595;
//     let time_remaining = timer_limit;
//     const timePassedHrMin = {hr: '', min: '', sec: ''}
//     const timeRemainingHrMin = {hr: '', min: '', sec: ''}

//     const startTimer = () => {
//     const timerInterval = setInterval(() => {
//         time_passed++;
//         time_remaining--;
//         // console.log(`Time passed: ${time_passed}s, Time remaining: ${time_remaining}s`);

//         timePassedHrMin.hr = Math.floor(time_passed/(60*60));
//         timePassedHrMin.min = Math.floor((time_passed - (timePassedHrMin.hr*60*60))/60);
//         timePassedHrMin.sec = time_passed - (timePassedHrMin.hr*3600 + timePassedHrMin.min*60);

//         timeRemainingHrMin.hr = Math.floor(time_remaining/(60*60));
//         timeRemainingHrMin.min = Math.floor((time_remaining - (timeRemainingHrMin.hr*60*60))/60);
//         timeRemainingHrMin.sec = time_remaining - (timeRemainingHrMin.hr*3600 + timeRemainingHrMin.min*60);

//         if (time_remaining <= 0) {
//         clearInterval(timerInterval);
//         console.log('Time is up!');  
//         }   console.log(`Time passed hr:${ timePassedHrMin.hr} min:${ timePassedHrMin.min} sec:${ timePassedHrMin.sec}s, Time remaining hr:${ timeRemainingHrMin.hr} min:${ timeRemainingHrMin.min} sec:${ timeRemainingHrMin.sec}s`);
//     }, 1000);

//     };

//     startTimer();

//     return (
//         {'timePassedHrMin': timePassedHrMin, 'timeRemainingHrMin':timeRemainingHrMin}
//     )

        // return (
        //     <>
        //     <Text style={styles.topProgressBarText}>{`${timeRemainingHrMin.hr}:${timeRemainingHrMin.min}:${timeRemainingHrMin.sec} remaining`}</Text>
        //     <Text style={styles.topProgressBarText}>{`${timePassedHrMin.hr}:${timePassedHrMin.min}:${timePassedHrMin.sec} passed`}</Text>
        //     <Text style={styles.topProgressBarText}>CallId</Text>
        //     </>
        //     )
// }

// export default Timer;






