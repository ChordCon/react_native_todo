import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState();
  const clickWork = () => {
    setWorking(true);
  };
  const clickTravel = () => {
    setWorking(false);
  };
  const onChangeText = (e) => {
    setText(e);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        {/* <TouchableOpacity> 누르면 투명해지는 이벤트가 발생함. */}
        <TouchableOpacity onPress={clickWork}>
          <Text
            // style={styles.button}에 기존스타일을 가져오면서 스타일을 추가하려면
            // {{ ...styles.button, color: working ? "white" : "#666666" }}
            // color는 working이 트루일때는 white 아니면 #666666
            style={{ ...styles.button, color: working ? "white" : "#666666" }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickTravel}>
          <Text
            style={{ ...styles.button, color: !working ? "white" : "#666666" }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          // onChangeText={onChangeText} 인풋 안에 적은 내용을 사용 할 때.
          value={text}
          onChangeText={onChangeText}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.textInput}
        ></TextInput>
      </View>
      <View>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    paddingHorizontal: 40,
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 60,
  },
  button: {
    fontSize: 40,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 30,
    borderRadius: 20,
    marginHorizontal: 20,
    fontWeight: "700",
  },
  text: {
    color: "white",
  },
});
