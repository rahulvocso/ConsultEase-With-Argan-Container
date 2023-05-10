import useFetch from '../../hooks/useFetch';
import { useSelector, useDispatch } from 'react-redux';

const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');

const getCalleeSocket = async () => {
  const consulteaseUserProfileData = useSelector((state) =>
    state.webview.consulteaseUserProfileData ? state.webview.consulteaseUserProfileData : {},
  );
  const calleeDetails = useSelector((state) => state.webview.calleeDetails);
  const dispatch = useDispatch();
  // get callee user socket_id related data
  get(`user/getSocket?&user_id=${calleeDetails.user_id}`, {
    auth_token: consulteaseUserProfileData.auth_token,
  })
    .then((data) => {
      console.log('getSocket.js, data', data);
      if (data.status == 200) {
        //
        data.body.status === 'Online' &&
          (data.body.socket_id !== null || undefined || '') &&
          dispatch({ type: 'SET_CALLEE_SOCKET_ID', payload: data.body.socket_id }); // set callee socet id in redux state
        //
        console.log(
          '****** Successful  VideoCallerPromptScreen.js  getSocket() socket_id Get req 200 ******* data.body',
          data.body._id,
        );
      } else {
        console.log(
          '****** Unsuccessfull  VideoCallerPromptScreen.js  getSocket() socket_id Get req ******* data',
          data.body,
        );
      }
    })
    .catch((error) => {
      console.error(
        'Error occurred during API call: VideoCallerPromptScreen.js 186 getSocket.js',
        error,
      );
    });
};

export default getCalleeSocket;
