import useFetch from '../../hooks/useFetch';
import { useSelector, useDispatch } from 'react-redux';

const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');

const initCall = async () => {
  const consulteaseUserProfileData = useSelector((state) =>
    state.webview.consulteaseUserProfileData ? state.webview.consulteaseUserProfileData : {},
  );
  const calleeDetails = useSelector((state) => state.webview.calleeDetails);
  const dispatch = useDispatch();
  // initialize call instance
  await post(
    'call/init',
    {
      from_user: consulteaseUserProfileData._id, //caller user_id
      to_user: calleeDetails.user_id, // callee user id,
      category: consulteaseUserProfileData.auth_token,
    },
    { auth_token: consulteaseUserProfileData.auth_token },
  )
    .then((data) => {
      console.log('postSocket.js, data', data);
      if (data.status == 200) {
        // setCallInstanceState({ ...data.body, ...callInstanceState });
        dispatch({ type: 'SET_CALL_INSTANCE_DATA', payload: data.body }),
          console.log(
            '******Successful  VideoCallerPromptScreen.js  initcall() call init POST req 200      *******',
          );
      } else {
        console.log(
          '******Unsuccessfull  VideoCallerPromptScreen.js  initcall()  call init  POST req       *******',
        );
      }
    })
    .catch((error) => {
      console.error(
        'Error occurred during API call: VideoCallerPromptScreen.js  fetchData()',
        error,
      );
    });
};

export default initCall;
