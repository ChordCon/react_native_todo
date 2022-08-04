import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState();
  const [toDos, setToDos] = useState({});
  const clickWork = () => {
    setWorking(true);
  };
  const clickTravel = () => {
    setWorking(false);
  };
  const onChangeText = (e) => {
    setText(e);
  };
  const addToDo = async () => {
    if (text === "") {
      alert("아무것도 입력하지 않았습니다.");
    } else {
      //리액트에서는 절대 스테이트를 직접 수정할수 없다.
      //따라서 setState를 사용한다.
      // Object.assign은 Object를 다른 Object와 합쳐준다.
      // {}은 새로운 Object가 되고 뒤에 많은 소스를 넣을 수있는데
      // toDos는 기존에 있던 toDos이고
      //{[Date.now()]: { text, work: working }, 는 추가될  Object인데
      // 기존의 Object인 toDos의 구조를 따라작성한 것.
      //[Date.now()]의 위치는 키가되고 [Date.now()]는 현재시간을 id로 사용하기 위해서 쓴것.

      // const newToDos = Object.assign({}, toDos, {
      //   [Date.now()]: { text, work: working },
      // });

      //ES6 추가된 방법
      //const newToDos = {} : 새로운 Object를만들고
      //...toDos : 이전 Object를 가진 새로운 Object를 만들고
      //[Date.now()]: { text, work: working } : 새로운 Object를 추가
      const newToDos = { ...toDos, [Date.now()]: { text, work: working } };
      setToDos(newToDos);
      await saveToDos(newToDos);
    }
    setText("");
  };

  const saveToDos = async (toSave) => {
    try {
      //JSON.stringify() 오브젝트를 스트링으로 바꿔준다
      //AsyncStorage에 뭔가 저장하려면 스트링형식이여야 해서 JSON.stringify()사용
      const s = JSON.stringify(toSave);
      await AsyncStorage.setItem("@toDos", s);
    } catch (e) {
      console.log("세이브 에러" + e);
    }
  };

  // AsyncStorage에서 로드
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem("@toDos");
      //JSON.parse() 스트링을 자바스크립트 오브젝트로 만들어준다.
      setToDos(JSON.parse(s));
    } catch (e) {
      console.log("로드 에러" + e);
    }
  };

  const deleteToDo = (key) => {
    //삭제 하기 전에 alert으로 물어보고 삭제 예를 누르면 삭제 진행 아니요를 누르면 알럿창만 꺼짐
    Alert.alert("리스트를 삭제합니다.", "삭제 하시겠습니까?", [
      {
        text: "네",
        onPress: async () => {
          //삭제 하기 위헤서 저장하는 것을 다시반복 기존의 toDos값을 가지고 새로운 오브젝트를 만들고
          //delete newToDos[key] 새로운 오브젝트에서 해당 key인 것을 지우고
          //해당 key를 삭제한 새로운 오브젝트를 setToDos를 통해 toDos에 전달해서 ui업데이트
          //await saveToDos(newToDos);를 실행해서 AsyncStorage도 업데이트
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
      { text: "아니요" },
    ]);
  };

  useEffect(() => {
    loadToDos();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        {/* <TouchableOpacity> 누르면 투명해지는 이벤트가 발생함. */}
        <TouchableOpacity onPress={clickWork}>
          <Text
            // style={styles.button}에 기존스타일을 가져오면서 스타일을 추가하려면
            // {{ ...styles.button, color: working ? "white" : "#666666" }}
            // color는 working이 트루일때는 white 아니면 #666666
            style={{ ...styles.button, color: working ? "#C0D9FF" : "#666666" }}
          >
            Work <AntDesign name="left" size={24} />
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickTravel}>
          <Text
            style={{
              ...styles.button,
              color: !working ? "#CBFFE0" : "#666666",
            }}
          >
            <AntDesign name="right" size={24} /> Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          // onChangeText={onChangeText} 인풋 안에 적은 내용을 사용 할 때.
          value={text}
          onChangeText={onChangeText}
          //onSubmitEditing={addToDo} 유저가 완료버튼을 누를때 발생하는 이벤트
          onSubmitEditing={addToDo}
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.textInput}
        ></TextInput>
      </View>

      {/* toDos 리스트를 로딩할때 로딩표시가 뜨게 만듬 */}
      {toDos.length === 0 ? (
        <View style={styles.nowWeather}>
          <ActivityIndicator color={"white"} size={"large"} />
        </View>
      ) : (
        <ScrollView>
          {/* Object.keys() 메소드는 주어진 객체의 속성 이름들을 일반적인 반복문과 동일한 순서로 순회되는 열거할 수 있는 배열로 반환합니다.
  const object1 = {
  a: 'somestring',
  b: 42,
  c: false
};
console.log(Object.keys(object1));
// expected output: Array ["a", "b", "c"]

toDos의 속성 이름을 가저와서 배열로 반환 했고 그 이름들을 map함수를 써서 
각각의 key에 {toDos[key].text}를 실행.
  */}
          {Object.keys(toDos).map((key) =>
            // toDos[key].work === working ? work에서 작성된 리스트는 working를 true로 가지고
            // work를 눌렀을때 working은 true이므로 work를 눌렀을때는 work에서 작성된 리스트만 뜨고 반대의 경우 반대만뜸
            toDos[key].work === working ? (
              <View
                style={{
                  ...styles.textWorkList,
                  backgroundColor: working ? "#2F405B" : "#21422E",
                }}
                key={key}
              >
                <Text style={styles.text}>{toDos[key].text}</Text>
                <TouchableOpacity
                  onPress={() => {
                    deleteToDo(key);
                  }}
                >
                  <Ionicons
                    style={styles.icons}
                    name="checkmark-done-circle-sharp"
                    size={24}
                    color="#00D415"
                  />
                </TouchableOpacity>
              </View>
            ) : null
          )}
        </ScrollView>
      )}
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
    justifyContent: "center",
    fontSize: 40,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 30,
    borderRadius: 20,
    marginHorizontal: 20,
    fontWeight: "700",
  },
  textWorkList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
  },
  text: {
    fontSize: 17,
    fontWeight: "700",
    color: "white",
  },
});
