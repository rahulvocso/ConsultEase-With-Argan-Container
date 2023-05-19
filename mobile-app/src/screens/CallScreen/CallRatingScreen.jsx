import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Section,
  Button,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Dimensions,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";

import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";

import StarOutlined from '../../../android/app/src/main/assets/starOutlined.svg';
import StarSolid from '../../../android/app/src/main/assets/starSolid.svg'

const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;


const VideoCallReview = () => {
  const starArray = new Array(5).fill("starOutline");
  const [rating, setRating] = useState(0);
  const [stars, setStars] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const navigation = useNavigation();
  const calleeDetails = useSelector(state => state.webview.calleeDetails);
  const consultEaseUserId = "asdf";

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;


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

  // consultEaseUserId &&
  //   setConsultEaseUserId(() => localStorage.getItem("consultEaseUserId"));

  function handleSubmitReview() {
    //console.log(consultEaseUserId);
    //dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
    //dispatch({ tyoe: 'RESET_WEBVIEW_DERIVED_DATA'});
    // Replace useFetch with equivalent in React Native
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* <View style={styles.container}> */}
        {/* <View style={styles.topTextContainer}> */}
          <Text style={styles.topText}>
            Please take a moment to provide the call feedback, {"\n"}
          </Text>
          <Text style={styles.topText}>Thank You.</Text>
        {/* </View> */}
          <View style={styles.reviewStars}>
            {starArray.map((value, index, array) => {
              return value === "starOutline" ? 
                <TouchableOpacity
                  onPress={() => {
                    setStars((preState) => index);
                    console.log(index + 1);
                    setRating(index + 1);
                    setFirstRender(false);
                  }}
                >
                  <StarOutlined
                    width={35} 
                    height={35}
                    // fill=""
                  />
                </TouchableOpacity>
                :
                <TouchableOpacity
                  onPress={() => {
                    setStars((preState) => index);
                    console.log(index + 1);
                    setRating(index + 1);
                    setFirstRender(false);
                  }}
                >
                  <StarSolid
                    width={35} 
                    height={35}
                    // fill=""
                  />
                </TouchableOpacity>
            })}
          </View>
          <TextInput
            style={styles.input}
            blurOnSubmit={true}
            editable
            multiline
            numberOfLines={8}
            maxLength={500}
            // onChangeText={text => onChangeText(text)}
            // value={value}
            placeholder="Enter your feedback here, maximum 500 characters."
            selectTextOnFocus={true}
            scrollEnabled={true}
            textAlign="left"
            keyboardType="text"
          />
          <View style={styles.submitButtons}>
            <Button
              onPress={()=>{
                handleSubmitReview();
              }}
              title="Close"
              color="grey"
              accessibilityLabel="Close page without giving review"
            />
            <View style={styles.submitButton}>
              <Button
                onPress={()=>{
                  handleSubmitReview();
                }}
                title="Submit"
                color="#3DB271"
                accessibilityLabel="Submit the review and move to next page"
              />
            </View>
             {/* <TouchableOpacity style={styles.closeButton}>
              <Text>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton}>
              <Text>Submit</Text>
            </TouchableOpacity> */}
          </View>
        {/* </View> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  // backgroundColor: '#3DB271',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: "white",
  height: deviceHeight,
  width: deviceWidth,
  color: 'black',
  // borderWidth: 2,
  // borderColor: 'black',
},
innerContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},
topTextContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  paddingTop: 0,
  paddingBottom: 0,
  // borderWidth: 2,
  // borderColor: 'black',
},
topText: {
  // borderWidth: 2,
  // borderColor: 'black',
  // paddingBottom: 0,
  color: '#3DB271',
},
reviewStars: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 40,
},
input: {
  // height: 100,
  margin: 20,
  marginBottom: 40,
  borderWidth: 1,
  borderColor: '#3DB271',
  borderRadius: 10,
  padding: 10,
},
submitButtons: {
  flexDirection: "row",
  justifyContent: "center",
  // alignItems: "space-between",
  // borderWidth: 2,
  // borderColor: 'black',
},
closeButton: {

},
submitButton: {
  // backgroundColor: '#3DB271',
  // color: '#ffffff',
  paddingLeft: 96,
},
submitClose: {
  flexDirection: 'row',
  justifyContent: "space-around",
  alignItems: 'center',
},
});

export default VideoCallReview;