import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { formTheme, appTheme } from "../../config/theme";
import AddMemberModal from "./AddMemberModal";

async function fetchMembersAsigned(id) {
  let response = await fetch(
    `https://api.trello.com/1/cards/${id}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    console.log(response.status, response);
    return;
  }

  let card = await response.json();
  let members = card.idMembers;
  let call = [];
  members.forEach((member) => {
    call.push(
      (async () => {
        let response = await fetch(
          `https://api.trello.com/1/members/${member}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) return;
        let data = await response.json();
        return data;
      })()
    );
  });

  return await Promise.all(call);
}

async function fetchMembersData(members) {
  let call = [];
  members?.forEach((member) => {
    call.push(
      (async () => {
        let response = await fetch(
          `https://api.trello.com/1/members/${member}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
          {
            method: "GET",
          }
        );
        if (!response.ok) return;
        let data = await response.json();
        return data;
      })()
    );
  });
  return await Promise.all(call);
}

async function fetchList(id) {
  let response = await fetch(
    `https://api.trello.com/1/boards/${id}/lists?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
  );

  if (!response.ok) {
    console.log(response.status, response);
    return;
  }

  return await response.json();
}

async function changeCardList(idCard, idList) {
  let response = await fetch(
    `https://api.trello.com/1/cards/${idCard}?idList=${idList}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    console.log(response.status, response);
    return;
  }
}

function CardsModal({
  card,
  closeModal,
  refreshCards,
  boardId,
  listId,
  refreshList,
}) {
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedValue, setSelectedCard] = useState(listId);
  const [lists, setLists] = useState([]);

  const fetchData = () => {
    fetchMembersAsigned(card.id).then((data) => setMembers(data));

    fetchList(boardId).then((data) => {
      let datalist = [];
      data.map((value, index) => {
        datalist.push({ id: value.id, name: value.name });
      });
      setLists(datalist);
    });
  };
  useEffect(fetchData, [card]);

  // Fonction pour gérer les changements de texte dans le TextInput
  const handleInputChange = (text) => {
    setInputValue(text); // Met à jour l'état avec la nouvelle valeur saisie par l'utilisateur
  };

  async function deleteCard(id) {
    try {
      const response = await fetch(
        `https://api.trello.com/1/cards/${id}/?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
        {
          method: "DELETE",
        }
      );
      console.log(`Response: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.log(text);
      refreshCards(); // Mettre à jour les cartes après la suppression
      closeModal(); // Fermez le modal après avoir supprimé la carte
    } catch (err) {
      console.error(err);
    }
  }

  function updateCard(id, nameParam, value) {
    fetch(
      `https://api.trello.com/1/cards/${id}/?${nameParam}=${value}&key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        return response.text();
      })
      .then((text) => {
        refreshCards();
        closeModal();
      })
      .catch((err) => console.error(err));
  }

  let membersFront = [];

  members.map((member, index) => {
    membersFront.push(
      <Text style={styles.listMembers} key={index}>
        {member.fullName}
      </Text>
    );
  });

  let picker = [];
  lists.map((list, index) => {
    picker.push(<Picker.Item key={index} value={list.id} label={list.name} />);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{card.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Change name of Card"
        value={inputValue}
        onChangeText={handleInputChange}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateCard(card.id, "name", inputValue)}
      >
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>

      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => {
          setSelectedCard(itemValue);
          changeCardList(card.id, itemValue).then(refreshList);
        }}
      >
        {picker}
      </Picker>
      {membersFront}
      <AddMemberModal
        cardId={card.id}
        boardId={boardId}
        visible={visible}
        setVisible={setVisible}
        asignedMembers={members}
        fetchMembers={fetchData}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Membres</Text>
      </TouchableOpacity>

      <Text style={styles.description}>{card.desc}</Text>

      <TouchableOpacity
        style={styles.buttondelete}
        onPress={() => {
          deleteCard(card.id);
        }}
      >
        <Text style={styles.buttonText}>Supprimer cette tâches</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        title="Fermer"
        onPress={closeModal}
      >
        <Text style={styles.buttonText}>Fermer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: formTheme.border,
    borderColor: formTheme.background,
    marginBottom: 10,
    paddingVertical: 250,
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: formTheme.background,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    paddingHorizontal: 100,
    paddingVertical: 10,
  },
  button: {
    backgroundColor: formTheme.background,
    borderColor: formTheme.background,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: formTheme.sousTitre,
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "center",
  },
  removeText: {
    color: "red",
    textDecorationLine: "underline",
    textAlign: "center",
  },
  menuNember: {
    backgroundColor: appTheme.background,
    margin: 2,
    padding: 2,
    borderRadius: 50,
    textAlign: "center",
    paddingTop: 25,
  },
  listMembers: {
    textAlign: "center",
    borderColor: formTheme.background,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#daf0ee",
  },
  buttondelete: {
    backgroundColor: "red",
    borderColor: formTheme.background,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
});

export default CardsModal;
