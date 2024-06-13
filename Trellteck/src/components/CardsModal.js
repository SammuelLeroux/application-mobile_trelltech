import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Button,
  TextInput,
} from "react-native";
import { appTheme } from "../config/theme";

function CardsModal({ id, name, desc, closeModal, refreshCards }) {
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;
  const [inputValue, setInputValue] = useState("");
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
      .then((text) => console.log(text))
      .catch((err) => console.error(err));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Change name of Card"
        value={inputValue}
        onChangeText={handleInputChange}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateCard(id, "name", inputValue)}
      >
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
      
      <Text style={styles.description}>{desc}</Text>
      <TouchableOpacity
        onPress={() => {
          deleteCard(id);
        }}
      >
        <Text style={styles.removeText}>Remove this task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  removeText: {
    color: "red",
    textDecorationLine: "underline",
  },
});

export default CardsModal;
