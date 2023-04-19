import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Section,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Dimensions,
  ScrollView,
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";

const VideoCallReview = () => {
  const starArray = new Array(5).fill("starOutline");
  const [rating, setRating] = useState(0);
  const [stars, setStars] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const navigation = useNavigation();
//   const calleeDetails = useSelector(state => state.webview.calleeDetails);
//   const [consultEaseUserId, setConsultEaseUserId] = useState(calleeDetails.calleeId);


  if (firstRender) {
    for (let i = 0; i < 5; i++) {
      starArray[i] = "starOutline";
    }
  } else {
    for (let i = 0; i < 5; i++) {
      if (stars >= i) starArray[i] = "star";
      else starArray[i] = "starOutline";
    }
  }

  consultEaseUserId &&
    setConsultEaseUserId(() => localStorage.getItem("consultEaseUserId"));

  function handleSubmitReview() {
    //console.log(consultEaseUserId);
    dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
    // Replace useFetch with equivalent in React Native
  }

  return (
    <View>
      <View>
        <Text></Text>
      </View>
      <View style={styles.videoCallReview}>
        <Text>
          Please take a moment to provide the call feedback, {"\n"}
          Thank You.
        </Text>
        {/* <View style={styles.reviewStars}>
          {starArray.map((value, index, array) => {
            return value === "starOutline" ? (
              <Ionicons
                key={index}
                name={starOutline}
                size={30}
                color="blue"
                onPress={() => {
                  setStars((preState) => index);
                  console.log(index + 1);
                  setRating(index + 1);
                  setFirstRender(false);
                }}
              />
            ) : (
              <Ionicons
                key={index}
                name={star}
                size={30}
                color="blue"
                onPress={() => {
                  setStars((preState) => index);
                  console.log(index + 1);
                  setRating(index + 1);
                  setFirstRender(false);
                }}
              />
            );
          })}
        </View> */}
        <Item style={styles.feedbackBox}>
          <Label floating>Enter Feedback here</Label>
          <Input placeholder="Enter text" inputMode="text" />
        </Item>
        <View style={styles.submitButtons}>
          <Button onPress={() => {}}>
            <Text>Close</Text>
          </Button>
          <Button
            onPress={() => {
              handleSubmitReview();
            }}
          >
            <Text>Done</Text>
          </Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
container: {
flex: 1,
alignItems: "center",
justifyContent: "center",
backgroundColor: "white",
},
videoCallReview: {
flex: 1,
alignItems: "center",
justifyContent: "center",
padding: 20,
},
reviewStars: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
marginVertical: 10,
},
feedbackBox: {
marginVertical: 10,
},
submitButtons: {
flexDirection: "row",
justifyContent: "space-between",
alignItems: "center",
},
});

export default VideoCallReview;