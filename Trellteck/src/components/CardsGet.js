import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import { appTheme, formTheme } from "../config/theme";
import CardsModal from "./modals/CardsModal";

function CardsGets({ list, boardId, refreshList }) {
  const [cards, setCards] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedCard, setSelectedCard] = useState(null);
  
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  useEffect(refreshCards, [list]);

  function refreshCards() {

    if (!list.id) {
      return; // Si l'ID est indéfini, ne rien faire
    }

    fetch(
      `https://api.trello.com/1/lists/${list.id}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => {
        const cardsData = data.map((card) => ({
          id: card.id,
          name: card.name,
          desc: card.desc,
          members: card.idMembers
        }));
        setCards(cardsData);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des cartes :", error)
      );
  }

  function addCard() {

    
    fetch(
      `https://api.trello.com/1/cards?idList=${list.id}&name=${a}&key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
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
  }

  return (
    <View>
      {cards.map((card, index) => (
        <View
          key={index}
          style={styles.card}
        >
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true); // Open the modal when pressed
              setSelectedCard(card); // Set selected card
            }}
          >
            <Text style={styles.cardText}>{card.name}</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Modal
        visible={modalVisible} // Set the visibility of the modal
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <CardsModal
            card={selectedCard}
            closeModal={() => {
              setModalVisible(false); // Close the modal when pressed
            }}
            refreshCards={refreshCards}
            boardId={boardId}
            listId = {list.id}
            refreshList={refreshList}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: appTheme.secondary,
    opacity: 0.80,
    marginVertical: 4,
    marginHorizontal: 10,
    padding: 2,
    borderRadius: 5,
  },
  cardText: {
    padding: 10,
    color: "#fff"
  },
  hidden: {
    display: "none",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionCoBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: formTheme.buttonColor,
    borderRadius: 5,
    padding: 12,
    marginTop: 10,
  },
  closeBtn: {
    borderRadius: 5,
    padding: 12,
    marginTop: 10,
  },
});

export default CardsGets;
