import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
  StatusBar,
} from "react-native";
import { useState, useEffect } from "react";
import { appTheme } from "../config/theme";
import CardsGet from "./CardsGet";
import AddCardModal from "./modals/AddCardModal";
import UpdateModal from "./modals/ListModal";

function GetList({ id }) {
  const [ListData, setListData] = useState([]);
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [boardId, setBoardId] = useState("");

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (text) => {
    setInputValue(text); // Met à jour l'état avec la nouvelle valeur saisie par l'utilisateur
  };

  useEffect(refreshList, []);

  function addList(name) {
    fetch(
      `https://api.trello.com/1/lists?name=${name}&idBoard=${id}&key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
      {
        method: "POST",
      }
    )
      .then((response) => {
        if (response.ok) refreshList();
        return response.text();
      })
      .then((text) => console.log(text))
      .catch((err) => console.error(err));
  }

  function refreshList() {
    fetch(
      `https://api.trello.com/1/boards/${id}/lists?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Itérer sur les données pour récupérer les id et les noms des boards
        const listData = data.map((list) => ({
          id: list.id,
          name: list.name,
        }));
        setListData(listData);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des boards :", error)
      );
  }

  let elements = [];
  ListData.map((data, index) => {
    elements.push(
      <View key={index} style={styles.list}>
        <Text
          style={styles.listTitle}
          onPress={() => {
            setBoardId(data.id);
            setModalUpdateVisible(true);
          }}
        >
          {data.name}
        </Text>
        <ScrollView style={styles.cardContainer}>
          <CardsGet list={data} boardId={id} refreshList={refreshList} />
        </ScrollView>
        <TouchableOpacity
          style={styles.add}
          onPress={() => {
            setBoardId(data.id);
            setModalVisible(true);
          }}
        >
          <Text style={{color: "#ffff"}}>+</Text>
        </TouchableOpacity>
      </View>
    );
  });
  elements.push(
    <AddCardModal
      key={elements.length + 1}
      idList={boardId}
      visible={modalVisible}
      setVisible={setModalVisible}
      refreshList={refreshList}
    />
  );

  elements.push(
    <UpdateModal
      key={elements.length + 1}
      idList={boardId}
      visible={modalUpdateVisible}
      setVisible={setModalUpdateVisible}
      refreshList={refreshList}
    />
  );

  elements.push(
    <TextInput
      key={elements.length + 1}
      style={styles.addListButton}
      placeholder="Ajouter une liste"
      value={inputValue}
      onChangeText={handleInputChange}
      onSubmitEditing={() => {
        addList(inputValue);
        setInputValue("");
      }}
    />
  );

  return elements;
}
const styles = StyleSheet.create({
  list: {
    backgroundColor: appTheme.primary,
    borderRadius: 5,
    margin: 10,
    padding: 2,
    width: 360,
  },
  listTitle: {
    backgroundColor: appTheme.highlight,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    padding: 10,
    margin: 0,
    marginBottom: 5,
    width: "100%",
    borderTopStartRadius: 30,
  },
  delete: {
    backgroundColor: appTheme.secondary,
    color: appTheme.title.color,
    textAlign: "center",
    textTransform: "uppercase",
    margin: 10,
    borderTopRightRadius: 30,
  },
  addListButton: {
    backgroundColor: "#9db5b2",
    borderRadius: 10,
    margin: 10,
    padding: 2,
    width: 400,
    height: 50,
    flexDirection: "row", // Pour aligner les éléments horizontalement
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    flexDirection: "row",
    backgroundColor: appTheme.secondary,
    width: "98%",
    borderRadius: 5,
    justifyContent: "center",
    padding: 5,
    marginVertical: 5,
    alignSelf: "center",
  }
});

export default GetList;
