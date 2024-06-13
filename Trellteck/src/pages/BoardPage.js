import React from "react";
import {
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import GetList from "../components/GetList";
import { appTheme } from "../config/theme";

function BoardPage() {
  const route = useRoute();
  const { boardId } = route.params;
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = process.env.TRELLO_TOKEN;

  
  return (
    <ScrollView horizontal={true} style={styles.boards}>
      <GetList id={boardId}  />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boards: {},
  list: {
    backgroundColor: appTheme.secondary,
    borderRadius: 10,
    margin: 10,
    padding: 2,
    width: 400,
    height: 50,
    flexDirection: "row", // Pour aligner les éléments horizontalement
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BoardPage;
