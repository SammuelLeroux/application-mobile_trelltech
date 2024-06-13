import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState } from "react";
import { formTheme, appTheme } from "../../config/theme";

function updateList(name, idList, refreshList, setModalVisible) {
  fetch(
    `https://api.trello.com/1/lists/${idList}?name=${name}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    {
      method: "PUT",
    }
  )
    .then((response) => {
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
  setModalVisible(false);
  refreshList();
}

function removeList(id, refreshList, setModalVisible) {
  fetch(
    `https://api.trello.com/1/lists/${id}/closed?value=true&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    {
      method: "PUT",
    }
  )
    .then((response) => {
      if (response.ok) refreshList();
      return response.text();
    })
    .then((text) => {
      console.log(text);
    })
    .catch((err) => console.error(err));

  setModalVisible(false);
  refreshList();
}

function CreateListView({ idList, setVisible, refreshList }) {
  const [text, setText] = useState("");
  return (
    <View style={styles.interface}>
      <Text style={styles.title}>Modifier nom de la liste</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholderTextColor={formTheme.background}
          defaultValue={text}
          onChangeText={(newText) => setText(newText)}
          placeholder="renommer la liste"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => updateList(text, idList, refreshList, setVisible)}
      >
        <Text style={styles.text}>Renommer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSupp}
        onPress={() => removeList(idList, refreshList, setVisible)}
      >
        <Text style={styles.text}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function UpdateModal({
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
        <CreateListView
          idList={idList}
          setVisible={setVisible}
          refreshList={refreshList}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setVisible(false)}
        >
          <Text style={styles.text}>Fermer</Text>
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
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 100,
    paddingVertical: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: formTheme.background,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  text: {
    color: formTheme.sousTitre,
  },
  buttonSupp: {
    alignItems: "center",
    backgroundColor: "#ef233c",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  title: {
    color: formTheme.background,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
});
