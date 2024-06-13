import { useState, useEffect } from 'react';
import { Text, SafeAreaView, View, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useNavigation } from '@react-navigation/native';

import { FontAwesome5 } from '@expo/vector-icons';

import { saveItem, clearItem } from '../config/functions';
import { appTheme, formTheme } from '../config/theme';

const TRELLO_API_KEY = process.env.TRELLO_KEY;
const REDIRECT_URL = process.env.REDIRECT_URL;
const AUTH_URL = `https://trello.com/1/authorize?expiration=never&name=Trelltek&scope=read,write&response_type=token&key=${TRELLO_API_KEY}&redirect_uri=${encodeURIComponent(REDIRECT_URL)}`;

export default function Login() {
    
    const navigation = useNavigation();

    const handleMainPagePress = () => {
        navigation.navigate('MainPage'); // Navigate to MainPage screen
    };

    const [authCode, setAuthCode] = useState(null);

    useEffect(() => {
        const handleUrlChange = (event) => {
            const url = event.url;
            if (url && url.startsWith(REDIRECT_URL)) {
                const code = url.split('#token=')[1];
                if (code)
                {
                    setAuthCode(code);

                    // sauvegarde dans un cookie
                    saveItem('clientAccessToken', code)
                }
            }
        };

        const handleLinkingEvent = (event) => {
            handleUrlChange(event);
        };

        Linking.addEventListener('url', handleLinkingEvent);

        return () => { };
    }, []);

    useEffect(() => {
        if (authCode) {
            handleMainPagePress();
        }
    }, [authCode]);
    
    const handleLogin = () => {
        Linking.openURL(AUTH_URL);
        // clearItem('clientAccessToken');
    };
    
    return (
        <SafeAreaView style={styles.interface}>

            <Text className="text-center" style={appTheme.title}>TRELLTECH</Text>
            <Text className="mt-5 pt-5 pb-3 text-center font-bold" style={{color: formTheme.button}}>Connectez-vous pour continuer</Text>

            <TouchableOpacity
                className="cursor-pointer"
                style={styles.trelloBtn}
                onPress={handleLogin}
            >
                <Text
                    className="text-center font-bold mb-1"
                    style={{color: "white"}}
                >
                    
                    Se connecter avec <FontAwesome5 name="trello" size={24} color={"#FFFFFF"} />
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="cursor-pointer mt-5"
                style= {styles.continuer}
                onPress={handleMainPagePress}
            >
                <Text className="text-center font-bold">
                    Continuer
                </Text>
            </TouchableOpacity>

            <View
                style={{
                    marginVertical: 50,
                    marginHorizontal: 10,
                    borderBottomColor: formTheme.background,
                    borderBottomWidth: 3,
                }}
            />

            <View className="mb-5">
                <Text className="text-center font-bold">Ou continuer avec : </Text>
            </View>

            <View className="flex flex-col space-y-5">
                <TouchableOpacity className="flex flex-row justify-center space-x-3" style={styles.optionCoBtn}>
                    <FontAwesome5 name="google" size={24} color={formTheme.background} />
                    <Text style={{ color: formTheme.background, textAlign: 'center', fontWeight: 'bold' }}> Google </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex flex-row justify-center space-x-3" style={styles.optionCoBtn}>
                    <FontAwesome5 name="microsoft" size={24} color={formTheme.background} />
                    <Text style={{ color: formTheme.background, textAlign: 'center', fontWeight: 'bold' }}> Microsoft </Text>
                </TouchableOpacity>

                <TouchableOpacity className="flex flex-row justify-center space-x-3" style={styles.optionCoBtn}>
                    <FontAwesome5 name="apple" size={24} color={formTheme.background} />
                    <Text style={{ color: formTheme.background, textAlign: 'center', fontWeight: 'bold' }}> Apple </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    interface: {
        backgroundColor: formTheme.border,
        paddingHorizontal: 20,
        paddingVertical: 100,
        width: '100%',
        height: '100%'
    },
    input: {
        backgroundColor: formTheme.background,
        borderColor: formTheme.border,
        color: formTheme.sousTitre,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: formTheme.buttonColor,
        borderRadius: 10,
        padding: 10,
    },
    trelloBtn: {
        alignItems: 'center',
        backgroundColor: "#0C66E4",
        color: formTheme.buttonColor,
        borderRadius: 10,
        padding: 10,
    },
    continuer: {
        alignItems: 'center',
        backgroundColor: "white",
        color: formTheme.buttonColor,
        borderRadius: 10,
        padding: 10,
    },
    optionCoBtn: {
        alignItems: 'center',
        backgroundColor: formTheme.buttonColor,
        borderRadius: 5,
        padding: 12,
    }
});