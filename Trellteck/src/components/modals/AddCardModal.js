import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import { formTheme, appTheme } from "../../config/theme";

function createCard(name, idList, refreshList, setModalVisible) {
  fetch(
    `https://api.trello.com/1/cards?idList=${idList}&name=${name}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));

  refreshList();
  setModalVisible(false);
}

function CreateCardView({ idList, setVisible, refreshList }) {
  const [text, setText] = useState("");
  return (
    <View style={styles.interface}>
      <Text style={styles.title}>Créez une tâche</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholderTextColor={"black"}
          defaultValue={text}
          onChangeText={(newText) => setText(newText)}
          placeholder="Nom tâche"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (text.trim() !== "") {
            createCard(text, idList, refreshList, setVisible);
          }
        }}
      >
        <Text style={styles.text}>Créez tâche !</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AddCardModal({
  idList,
  visible,
  setVisible,
  refreshList,
}) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      style={{ backgroundColor: appTheme.background }}
    >
      <View style={styles.interface}>
        <CreateCardView
          idList={idList}
          setVisible={setVisible}
          refreshList={refreshList}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.text}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  interface: {
    backgroundColor: formTheme.border,
    paddingHorizontal: 20,
    paddingVertical: 100,
    width: "100%",
    height: "100%",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: formTheme.background,
    borderWidth: 1,
    borderRadius: 2,
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 100,
    paddingVertical: 10,
    color: "#000",
  },
  button: {
    alignItems: "center",
    backgroundColor: formTheme.background,
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: formTheme.sousTitre,
  },
  title: {
    color: formTheme.background,
    textAlign: "center",
    fontSize: 20,
    paddingBottom: 20,
  },
});
