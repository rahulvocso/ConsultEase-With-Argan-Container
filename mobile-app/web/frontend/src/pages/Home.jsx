import {
  IonSearchbar,
  IonLabel,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItem,
  useIonViewWillLeave,
} from '@ionic/react';
import {personOutline, walletOutline} from 'ionicons/icons';
import {useStoreState} from 'pullstate';
import {TalkStore} from '../store';
import {getTalks} from '../store/Selectors';
import './Home.css';

import {Header} from '../components/Header';
import HomeSearchResults from '../components/HomeSearchResults';
import {ProCard} from '../components/ProCard';
import {ProCardImportant} from '../components/ProCardImportant';
import React, {useEffect, useRef, useState} from 'react';
import useFetch from '../hooks/useFetch';
import {Link, useHistory} from 'react-router';

const Home = React.memo( () => {
    const pageRef = useRef();
    const auth_token = localStorage.getItem('auth_token');
    const {get, loading} = useFetch(
      'https://callingserver.onrender.com/api/v1/',
    );
    const [profiles, setProfiles] = useState([]);
    const [page, setPage] = useState({pageNumber: 0});
    const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
    const history = useHistory();

    const [consultEaseUserId, setConsultEaseUserId] = useState('');

    const getData = () => {
      get(
        `user/list?pageNumber=${
          parseInt(page.pageNumber) + 1
        }&sort=stats.rating_average&sort_type=1&`,
        {auth_token: auth_token},
      ).then(data => {
        console.log('hello');
        console.log(data.status);
        console.log(data);
        console.log('auth_token', auth_token);
        if (data.status != 200 || auth_token == '') {
          history.push('/login');
        }

        //commentd 30 dec, to be uncommented after login component works properly
        // and directs to home page
        //else
        setProfiles([...profiles, ...data.body.data]);
        setPage({
          pageNumber: data.body.pageNumber,
          pageCount: data.body.pageCount,
          recordCount: data.body.recordCount,
        });
      });

      //get user profile data in order to get wallet data using user_id later on

      // (localStorage.getItem("consultEaseUserId") === (null || undefined) ||
      //   localStorage.getItem("consultEaseUserId").length == 0) &&
      get('user/' + '', {auth_token: auth_token}).then(data => {
        setConsultEaseUserId(data.body._id);
        localStorage.setItem('consultEaseUserId', data.body._id);
        console.log('User data... ');
        console.log(data.body, data.body.profile, data.body._id);
      });
    };

    const loadData = ev => {
      auth_token ? getData() : history.push('/login');
      ev.target.complete();
      if (page.pageNumber === page.pageCount) {
        setInfiniteDisabled(true);
      }
    };

    useIonViewWillEnter(ev => {
      //getData();
    });

    useEffect(() => {
      auth_token ? getData() : history.push('/login');
    }, []);

    return (
      <IonPage ref={pageRef}>
        {auth_token && <Header type="home" />}
        <IonContent fullscreen>
          <IonSearchbar
            showClearButton="focus"
            animated
            placeholder="Search people to talk to..."
            onClick={() => {
              history.push('/search');
              pageRef.current.display = 'none';
            }}></IonSearchbar>

          <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
            <IonRow>
              <IonCol size="12">
                <IonInfiniteScroll
                  onIonInfinite={loadData}
                  threshold="300px"
                  disabled={isInfiniteDisabled}>
                  <IonInfiniteScrollContent
                    loadingSpinner="bubbles"
                    loadingText="Loading more data..."></IonInfiniteScrollContent>
                </IonInfiniteScroll>

                {profiles.map((profile, _id) => {
                  return (
                    <ProCard
                      key={_id}
                      profile={profile}
                      //pageRef={pageRef}
                      setInfiniteDisabled={setInfiniteDisabled}
                    />
                  );
                })}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  },
  () => true,
);
export default Home;

/* {homeSearchVisible && (
                  <Link to="/search">
                    <HomeSearchResults
                    // query={query}
                    // setQuery={setQuery}
                    // profiles={profiles}
                    // pageRef={pageRef}
                    // loadData={loadData}
                    // infiniteDisabled={isInfiniteDisabled}
                    // setInfiniteDisabled={setInfiniteDisabled}
                    // handleSearchQuery={handleSearchQuery}
                    // homeSearchModalVisible={homeSearchModalVisible}
                    // setHomeSearchModalVisible={setHomeSearchModalVisible}
                    />
                  </Link>
                )} */
