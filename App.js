import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState();
  const [date, setDate] = useState();
  const [newText, setNewText] = useState();
  const [newDate, setNewDate] = useState();
  const [toDos, setToDos] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editKey, setEditKey] = useState();
  const clickWork = () => {
    setWorking(true);
    saveBtn(!working);
  };
  const clickTravel = () => {
    setWorking(false);
    saveBtn(!working);
  };
  const onChangeText = (e) => {
    setText(e);
  };
  const onChangeDate = (e) => {
    setDate(e);
  };
  const onChangeNewText = (e) => {
    setNewText(e);
  };
  const onChangeNewDate = (e) => {
    setNewDate(e);
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
      const newToDos = {
        ...toDos,
        [Date.now()]: { text, date, work: working, done: false },
      };
      setToDos(newToDos);
      await saveToDos(newToDos);
    }
    setText("");
    setDate("");
  };
  const saveBtn = (save) => {
    try {
      const s = JSON.stringify(save);
      AsyncStorage.setItem("@toDosBtn", s);
    } catch (e) {
      console.log("버튼 위치 세이브 에러" + e);
    }
  };

  const loadBtn = async () => {
    try {
      const s = await AsyncStorage.getItem("@toDosBtn");
      //JSON.parse() 스트링을 자바스크립트 오브젝트로 만들어준다.
      setWorking(JSON.parse(s));
    } catch (e) {
      console.log("로드 에러" + e);
    }
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

  const doneToDo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].done = true;
    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  const editToDo = () => {
    const nToDos = toDos;

    nToDos[editKey].date = newDate;
    nToDos[editKey].text = newText;

    setToDos(nToDos);
    saveToDos(nToDos);

    setNewText("");
    setNewDate("");
  };

  useEffect(() => {
    if (toDos !== null) {
      loadToDos();
      loadBtn();
    }
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

      {/* 수정용 모달 */}
      <View style={styles.modalCenteredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => {
            setEditModalVisible(!editModalVisible);
          }}
        >
          <View style={styles.modalCenteredView}>
            <View style={styles.modalView}>
              <View style={styles.inputs}>
                <TextInput
                  // onChangeText={onChangeText} 인풋 안에 적은 내용을 사용 할 때.

                  multiline={true}
                  value={newDate}
                  onChangeText={onChangeNewDate}
                  placeholder="Due date"
                  style={styles.textInput}
                ></TextInput>
                <TextInput
                  // onChangeText={onChangeText} 인풋 안에 적은 내용을 사용 할 때.

                  multiline={true}
                  value={newText}
                  onChangeText={onChangeNewText}
                  placeholder={working ? "Add a To Do" : "Place name"}
                  style={styles.textInput}
                ></TextInput>
              </View>
              <View style={styles.btns}>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonClose]}
                  onPress={() => {
                    editToDo();
                    setEditModalVisible(!editModalVisible);
                  }}
                >
                  <Text style={styles.modalInsideTextStyle}>Add</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonClose]}
                  onPress={() => setEditModalVisible(!editModalVisible)}
                >
                  <Text style={styles.modalInsideTextStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {/* 수정용 모달 */}
      {/* 입력용 모달 */}
      <View style={styles.modalCenteredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalCenteredView}>
            <View style={styles.modalView}>
              <View style={styles.inputs}>
                <TextInput
                  // onChangeText={onChangeText} 인풋 안에 적은 내용을 사용 할 때.
                  multiline={true}
                  value={date}
                  onChangeText={onChangeDate}
                  placeholder="Due date"
                  style={styles.textInput}
                ></TextInput>
                <TextInput
                  // onChangeText={onChangeText} 인풋 안에 적은 내용을 사용 할 때.
                  multiline={true}
                  value={text}
                  onChangeText={onChangeText}
                  placeholder={working ? "Add a To Do" : "Place name"}
                  style={styles.textInput}
                ></TextInput>
              </View>
              <View style={styles.btns}>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonClose]}
                  onPress={() => (addToDo(), setModalVisible(!modalVisible))}
                >
                  <Text style={styles.modalInsideTextStyle}>Add</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.modalButtonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.modalInsideTextStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <Pressable
          style={{
            ...styles.modalButtonOpen,
            backgroundColor: working ? "#2F405B" : "#21422E",
          }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.modalTextStyle}>Add list</Text>
        </Pressable>
      </View>

      {/* 입력용 모달 */}

      {/* toDos 리스트를 로딩할때 로딩표시가 뜨게 만듬 */}
      {toDos === null ? null : (
        <ScrollView>
          {/* toDos의 속성 이름을 가저와서 배열로 반환 했고 그 이름들을 map함수를 써서 
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
                <View style={styles.textBox}>
                  <Text style={styles.text}>{toDos[key].date}</Text>
                  <Text style={styles.text}>{toDos[key].text}</Text>
                </View>
                <View style={styles.btns}>
                  <TouchableOpacity
                    style={{ marginHorizontal: 8 }}
                    onPress={() => {
                      doneToDo(key);
                    }}
                  >
                    <Ionicons
                      style={{
                        ...styles.icons,
                        color: toDos[key].done === true ? "#10E100" : "white",
                      }}
                      name="checkmark-done-circle-sharp"
                      size={24}
                    />
                  </TouchableOpacity>
                  {toDos[key].done === false ? (
                    <TouchableOpacity
                      style={{ marginHorizontal: 8 }}
                      onPress={() => {
                        setEditModalVisible(!editModalVisible);
                        setEditKey(key);
                      }}
                    >
                      <AntDesign name="edit" size={24} color="white" />
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={{ marginHorizontal: 8 }}
                    onPress={() => {
                      deleteToDo(key);
                    }}
                  >
                    <AntDesign name="delete" size={24} color="white" />
                  </TouchableOpacity>
                </View>
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
    flexShrink: 1,
    backgroundColor: "white",
    borderRadius: 20,
    width: 200,
    paddingVertical: 5,
    fontWeight: "700",
    fontSize: 17,
  },
  inputs: {
    marginVertical: 10,
    paddingHorizontal: 5,
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
  textBox: {
    width: 170,
  },
  text: {
    marginVertical: 3,
    paddingHorizontal: 10,
    fontSize: 17,
    fontWeight: "700",
    color: "white",
  },
  btns: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  modalCenteredView: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginTop: 200,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButton: {
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 7,
    elevation: 2,
  },
  modalButtonOpen: {
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  modalButtonClose: {
    backgroundColor: "#2196F3",
  },
  modalTextStyle: {
    paddingHorizontal: 115,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalInsideTextStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
  },
});
