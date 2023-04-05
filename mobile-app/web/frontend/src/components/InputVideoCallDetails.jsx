import React, {useState, useRef} from 'react';

import {
  IonButton,
  IonCardSubtitle,
  IonInput,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
} from '@ionic/react';
import Header from './Header';
import CallCategorySelection from './CallCategorySelection';
import './VideoCall.css';

const InputVideoCallDetails = () => {
  const room = useRef();
  const callCategoryName = useRef('');

  let profile = JSON.parse(localStorage.getItem('currentProfileInView'));

  const calleeDetails = profile && {
    name: profile.fname
      ? `${profile.fname + ' ' + (profile.lname ? `${profile.lname}` : '')}`
      : 'name unavailable',
    photo: profile.photo,
    callCategory: callCategoryName.current,
  };

  let roomname = '';

  function handleVideoCallProcess() {
    roomname = room.current.value;
    if (roomname === '' || callCategoryName.current === '') {
      alert('Enter room name/call category');
    } else {
      console.log('ConsultEase videocall room join emit event generated from InputVideoCallDetails Component(webview endpoint)');
      window.ReactNativeWebView.postMessage(
        `${JSON.stringify({
          ...calleeDetails,
          callCategory: callCategoryName.current,
        })}`,
      );
    }
    console.log('in handleVideocallProcess()');
  }
  return (
    <div id="lobby">
      <Header type="videoCall" handleRight={''} title="Video Call" />
      <div className="videoCallRoomDetails">
        <IonItem className="roomInput">
          <IonCardSubtitle className="text">Video Call Room :</IonCardSubtitle>
          <IonInput
            ref={room}
            id="room"
            type="text"
            //value={roomInputValue}
            placeholder=" enter room name"></IonInput>
        </IonItem>
        {/* <CallCategorySelection
          callCategoryName={callCategoryName}
          //setCallCategoryName={setCallCategoryName}
        /> */}
        <div className="callCategory">
          <IonCardSubtitle color={callCategoryName && 'primary'}>
            Please select call category:
          </IonCardSubtitle>

          <IonRadioGroup
            value={callCategoryName}
            onIonChange={e => (callCategoryName.current = e.target.value)}
            //onIonChange={(e) => setCallCategoryName(e.target.value)}
            allowEmptySelection={true}>
            {profile.profile.categories.map((category, index) => (
              <IonItem key={`${category.name}${index}`}>
                <IonLabel>{category.name}</IonLabel>
                <IonRadio
                  slot="end"
                  value={category.name}
                  disabled={false}></IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </div>
        <IonButton
          //ref={button}
          id="button"
          onClick={() => {
            if (room.current.value !== '') {
              handleVideoCallProcess();
            }
            console.log('Selected call category:', callCategoryName.current);
            //console.log("Oops! you forgot to select call category");
          }}>
          Submit
        </IonButton>
      </div>
    </div>
  );
};

export default InputVideoCallDetails;
