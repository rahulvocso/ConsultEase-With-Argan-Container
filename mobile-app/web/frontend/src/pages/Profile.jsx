import {
  IonItem,
  IonButton,
  IonLabel,
  IonCardSubtitle,
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonChip,
  useIonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import './Profile.css';
import {Header} from '../components/Header';
import Reviews from '../components/Reviews';
import Schedule from '../components/Schedule';
import React, {useEffect, useRef, useState} from 'react';
import useFetch from '../hooks/useFetch';
import {timeOutline, starOutline, call, videocam, arrowDownCircleOutline} from 'ionicons/icons';
import {
  useRouteMatch,
  useParams,
  useLocation,
  useHistory,
} from 'react-router-dom';
import Avatar from 'react-avatar';
import {formatCallRate} from '../utils/utils';
import MenuModal from '../components/MenuModal';
import {VacationMode} from '../components/VacationMode';

const Profile = React.memo(
  () => {
    const pageRef = useRef();
    const auth_token = localStorage.getItem('auth_token');
    const {get, loading} = useFetch(
      'https://callingserver.onrender.com/api/v1/',
    ); //('http://localhost:5151/api/v1/');
    const [profile, setProfile] = useState({});
    const [segment, setSegment] = useState('Reviews');

    const params = useParams();
    const match = useRouteMatch();
    const location = useLocation();
    const [isProfileLive, setIsProfileLive] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const history = useHistory();
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [videoCallButtonToast] = useIonToast();

    // fetch profile
    const getData = () => {
      let id = params.id ? params.id : '';
      get('user/' + id, {auth_token: auth_token}).then(data => {
        setProfile({...data.body});
        localStorage.setItem('currentProfileInView', JSON.stringify(data.body));
        checkAvailability(data);

        try {
          if (data.body.profile) setIsProfileLive(data.body.profile.status);
          else setIsProfileLive(false);
        } catch (e) {
          setIsProfileLive(false);
        }
      });
      profile.profile && console.log('vacationMode', profile.profile);
    }

    // menu modal on/off
    const handleMenuModal = () => {
      setMenuModalVisible(!menuModalVisible);
    };

    // online status check
    function checkAvailability(data) {
      let dayToday = new Date().getDay();
      dayToday == 0 ? (dayToday = 6) : (dayToday = dayToday - 1);

      let time = new Date().toLocaleString('en-US', {
        hour: 'numeric',
        hour12: true,
        minute: 'numeric',
      });
      //console.log(time, typeof time);
      let timeCheckOnline = false;
      let slots;
      data.body.profile.schedule[dayToday] &&
        (slots = data.body.profile.schedule[dayToday].slots);

      if (slots !== undefined) {
        for (let i = 0; i < slots.length; i++) {
          // console.log(slots);

          let from = slots[i].from.toLowerCase().split(/[" ":]/); //["Hr","Min","AM/PM"]
          from[2] === 'pm' &&
            from[0] != '12' &&
            (from[0] = Number(from[0]) + 12); //set 24 hr format
          from[2] === 'am' && from[0] == '12' && (from[0] = 0);

          let to = slots[i].to.toLowerCase().split(/[" ":]/); //["Hr","Min","AM/PM"]
          to[2] === 'pm' && to[0] != '12' && (to[0] = Number(to[0]) + 12); //set 24 hr format

          let tempTime = time.toLowerCase().split(/[" ":]/); //["Hr","Min","AM/PM"]
          tempTime[2] === 'pm' &&
            tempTime[0] != '12' &&
            (tempTime[0] = Number(tempTime[0]) + 12); //set 24 hr format
          tempTime[2] === 'am' && tempTime[0] == '12' && (tempTime[0] = 0);
          // console.log(from, to, tempTime);
          if (
            Number(from[0]) < Number(tempTime[0]) &&
            Number(tempTime[0]) < Number(to[0])
            // &&
            // Number(from[1]) <= Number(tempTime[1]) &&
            // Number(tempTime[1]) <= Number(to[1])
          ) {
            timeCheckOnline = true;
          }
          if (
            (Number(from[0]) == Number(tempTime[0]) &&
              Number(from[1]) <= Number(tempTime[1])) ||
            (Number(tempTime[0]) == Number(to[0]) &&
              Number(tempTime[1]) <= Number(to[1]))
          ) {
            timeCheckOnline = true;
          }
        }
      }
      //below: check current time and set online status according to schedule
      (data.body.profile.alwaysAvailable && setIsOnline(true)) ||
        (!data.body.profile.vacation &&
          data.body.profile.schedule[dayToday] &&
          data.body.profile.schedule[dayToday].isAvailable &&
          setIsOnline(timeCheckOnline));
    }

    useEffect(() => {
      // rather than undefined, send blank to get current user profile.
      getData()
    }, [params, isOnline]);

    const handleSegmentChange = e => {
      setSegment(e.target.value);
    };

    function handleVideoCallButton(e) {
      isOnline
        ? history.push('/videocall')
        : videoCallButtonToast({
            message: profile.profile.vacation
              ? `User is not available`
              : `User is offline`,
            duration: 3000,
            position: 'top',
            cssClass: 'custom-toast',
            buttons: [
              {
                text: 'Dismiss',
                role: 'cancel',
              },
            ],
          });
    }

    const handlePageRefresh = (e) => {
      // Your refresh logic goes here
      setProfile({});
      setIsProfileLive(false)
      // auth_token ? page.pageNumber === 0 && getData() : history.push('/login');
      setTimeout(() => {
        e.detail.complete();
      }, 500);
      getData();
      }

    return (
      <IonPage ref={pageRef} className="profilePage">
        {profile.profile && (
          <Header
            type="profile"
            handleRight={handleMenuModal}
            title={profile.profile.handle}
            isOnline={isOnline}
          />
        )}

        <MenuModal
          modalVisible={menuModalVisible}
          profile_id_viewing={params.id}
          profile={profile}
          setModalVisible={setMenuModalVisible}
        />

        <IonRefresher
          slot="fixed"
          onIonRefresh={(e)=> handlePageRefresh(e)}
          pullFactor={0.9}
        >
          <IonRefresherContent
            pullingIcon={arrowDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            // refreshingText="Refreshing..."
          >
          </IonRefresherContent>
        </IonRefresher>

        <IonContent fullscreen className="ion-padding ion-margin">
          <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
            {/* <IonButton
              color="primary"
              shape="round"
              onclick={() => handleReactNativeCameraAccess()}>
              <IonIcon icon={videocam} />
              <IonLabel>&nbsp; VideoCall</IonLabel>
            </IonButton> */}
            <IonRow>
              <IonCol size="12">
                <div className="profile">
                  {!isProfileLive && (
                    <div className="warning">
                      Your profile is not active yet.
                      <IonButton color="primary" shape="round">
                        <IonLabel>Activate</IonLabel>
                      </IonButton>
                    </div>
                  )}

                  <div className="proDetails">
                    {profile.profile && (
                      <IonAvatar className="ProfileAvatar">
                        <Avatar
                          align="center"
                          size="80"
                          round="100px"
                          name={profile.fname}
                          src={
                            profile.profile.photo
                              ? profile.profile.photo
                              : profile.photo
                          }
                        />
                      </IonAvatar>
                    )}
                    <div className="proTitle">
                      <h3>
                        {profile.fname ? profile.fname : 'FirstName'}{' '}
                        {profile.lname ? profile.lname : 'LastName'}
                      </h3>

                      <div className="detailCount">
                        <IonIcon color="primary" icon={starOutline} />
                        {profile.stats && (
                          <span>
                            {profile.stats.rating_average} ({profile.otp} +){' '}
                          </span>
                        )}

                        <IonIcon color="primary" icon={timeOutline} />
                        {profile.stats && (
                          <span>{profile.stats.rating_average} Minutes </span>
                        )}
                      </div>
                      <br />
                      <IonCardSubtitle>
                        {profile.profile && profile.profile.title}
                      </IonCardSubtitle>
                    </div>
                  </div>
                </div>

                <div className="proTitle">
                  {profile.profile &&
                    profile.profile.categories.map((category, num) => {
                      return (
                        <IonChip key={num} outline="true">
                          {category.name}
                        </IonChip>
                      );
                    })}

                  {profile.profile && (
                    <>
                      <br />

                      <VacationMode />

                      {profile.profile.vacation ? (
                        <IonLabel color="medium"></IonLabel>
                      ) : (
                        <>
                          <IonButton
                            disabled={
                              profile.profile.vacation ? 'true' : 'false'
                            }
                            onClick={e => handleVideoCallButton(e)}
                            className="callButton"
                            color="primary"
                            shape="round">
                            <IonIcon icon={videocam} />
                            <IonLabel>
                              &nbsp;{formatCallRate(profile, 'video')}/min
                            </IonLabel>
                          </IonButton>
                          &nbsp;
                          <IonButton
                            disabled={
                              profile.profile.vacation ? 'true' : 'false'
                            }
                            className="callButton"
                            color="secondary"
                            shape="round">
                            <IonIcon icon={call} />
                            <IonLabel>
                              &nbsp;{formatCallRate(profile, 'audio')}/min
                            </IonLabel>
                          </IonButton>
                        </>
                      )}
                    </>
                  )}
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="proTitle">
                  <br />
                  <br />
                  <IonSegment
                    scrollable
                    value={segment}
                    onIonChange={e => handleSegmentChange(e)}>
                    <IonSegmentButton value="Reviews">
                      <IonLabel>Reviews</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="Schedule">
                      <IonLabel>Schedule</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="About">
                      <IonLabel>About</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>

                  {segment === 'Schedule' && (
                    <Schedule profilebody={profile.profile} />
                  )}
                  {/* {segment === 'Reviews' && <Reviews />} */}
                  {segment === 'About' && profile.profile && (
                    <IonLabel>
                      <br />
                      {profile.profile.description}
                      <br />
                      <br />
                      <a target="_blank" rel="noreferrer" href={profile.profile.website}>
                        {profile.profile.website}
                      </a>
                    </IonLabel>
                  )}
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  },
  () => true,
);

export default Profile;
