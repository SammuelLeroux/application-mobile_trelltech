import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import Toast from 'react-native-toast-message';

import { Entypo } from '@expo/vector-icons';

import { getItem, clearItem } from '../config/functions';
import { appTheme } from "../config/theme";

import BoardList from "../components/BoardList";

function MainPage() {
  
  const navigation = useNavigation();

  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getItem('clientToken');
        const tokenValue = typeof accessToken !== 'object' ? accessToken : process.env.TRELLO_TOKEN;
        setToken(tokenValue);

        if (tokenValue === null) {
          Toast.show({ type: 'error', text1: "Vous n'etes pas connecté !" })
          
          const timeout = setTimeout(() => {
            navigation.goBack();
          }, 5000);

          return () => clearTimeout(timeout);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, []);

  function handleDeconnexion() {
    // effacer l'acces token
    clearItem("clientAccessToken");

    // recharger la page
    navigation.navigate('Login');
  }

  const styles = StyleSheet.create({
    interface: {
      flex: 1,
      backgroundColor: token ? "#FFFFFF" : appTheme.background,
      height: 100,
    },
    headerTitle:{
      backgroundColor: appTheme.secondary,
      paddingVertical: 10,
      paddingHorizontal: 10,
    }
  });

  return (
    <SafeAreaView style={styles.interface}>
      <Toast />
      <View className="flex flex-row items-center justify-between" style={styles.headerTitle}>
          <Text style={appTheme.title}>
            TRELLTECH
          </Text>
          <TouchableOpacity onPress={handleDeconnexion}>
            <Entypo style={{color: "red"}} name="log-out" size={24} />
          </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.page}>
          {
            token !== null ?
              <BoardList token={token}/> : null
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default MainPage;