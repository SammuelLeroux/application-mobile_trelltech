import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Modal
} from "react-native";
import { useState } from "react";

import Toast from 'react-native-toast-message';

import { formTheme, appTheme } from "../../config/theme";

function createWorkspace(displayName, updatePending, setModalWorkspaceVisible) {

    fetch(
        `https://api.trello.com/1/organizations/?displayName=${displayName}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    ).then(res => res.ok ? res.json() : null)?.then(data => {
        updatePending("add", data.id, displayName);
        setModalWorkspaceVisible(false);
    });
}

function updateWorkspace(id, newObj, updatePending, setModalWorkspaceVisible) {
    
    const queryParams = new URLSearchParams(newObj);

    fetch(
        `https://api.trello.com/1/organizations/${id}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}&${queryParams}`,
        {
            method: "PUT",
            headers: {
                Accept: "application/json",
            },
        }
    )
    .then(res => res.json())
    .then(data => {
        if (data.error)
        {
            Toast.show({
                type: 'error',
                text1: data.message,
            });
        }
        else
        {
            updatePending("update", data.id, newObj.displayName);
            setModalWorkspaceVisible(false);
        }
    })
    .catch(error => {
        console.error('Error updating workspace:', error);
    });
}

function handleDeleteWorkspace(obj, updatePending, setModalWorkspaceVisible) {
    fetch(
        `https://api.trello.com/1/organizations/${obj.id}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
            },
        }
    )
    .then(res => res.ok ? res.json() : null)
    .then(data => {
        updatePending("delete", obj.id, obj.name);
        setModalWorkspaceVisible(false);
    })
    .catch(error => {
        console.error('Error deleting workspace:', error);
    });
}

function CreateWorkspaceView({updatePending, setVisible}) {
    const [text, setText] = useState("");

    return (
        <View style={styles.interface}>

            <Text className="text-lg text-center" style={{ color: formTheme.background }}>
                Création d'un workspace
            </Text>

            <View className="mt-3">
                <TextInput
                    style={styles.input}
                    placeholderTextColor={formTheme.background}
                    defaultValue={text}
                    onChangeText={newText => setText(newText)}
                    placeholder='Entrer le nom du workspace'
                />
            </View>

            <TouchableOpacity
                className="mt-3"
                style={styles.button}
                onPress={
                    () => createWorkspace(text, updatePending, setVisible)
                }
            >
                <Text style={styles.buttonTxt}>
                    Créer
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function UpdateWorkspaceView({itemWorkspace, updatePending, setVisible}) {
    
    const [text, setText] = useState(itemWorkspace.name);

    return (
        <View style={styles.interface}>

            <Toast />

            <Text className="text-lg text-center" style={{ color: formTheme.background }}>
                Modifier le workspace
            </Text>

            <View className="flex space-y-3 mt-3">
                <TextInput
                    style={styles.input}
                    placeholderTextColor={formTheme.background}
                    defaultValue={text}
                    onChangeText={newText => setText(newText)}
                    placeholder='Renommer le workspace'
                />
            </View>

            <View className="flex space-y-3 mt-3">
                <TouchableOpacity
                    className="mt-3"
                    style={styles.button}
                    onPress={() => updateWorkspace(itemWorkspace.id, {displayName: text}, updatePending, setVisible)}
                >
                    <Text style={styles.buttonTxt}>
                        Mettre à jour
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={styles.delBtn}
                    onPress={() => handleDeleteWorkspace(itemWorkspace, updatePending, setVisible)}
                >
                    <Text style={styles.buttonTxt}>
                        Supprimer
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function WorkspaceModal({ visible, setVisible, updatePending, action, itemWorkspace }) {

    let element;

    switch(action) {
        case "CREATE":
            element = <CreateWorkspaceView updatePending={updatePending} setVisible={setVisible}/>;
            break;
        case "UPDATE":
            element = <UpdateWorkspaceView updatePending={updatePending} itemWorkspace={itemWorkspace} setVisible={setVisible} />;
            break;
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            style={{ backgroundColor: appTheme.background }}
        >
            <View style={styles.interface}>

                {element}

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => setVisible(false)}
                >
                    <Text style={styles.buttonTxt}>
                        Fermer
                    </Text>
                </TouchableOpacity>
            </View>

        </Modal>
    );
};

const styles = StyleSheet.create({
    interface: {
        flex: 1,
        backgroundColor: formTheme.border,
        paddingHorizontal: 20,
        paddingVertical: 75,
        width: "100%",
        height: "100%"
    },
    input: {
        backgroundColor: formTheme.background,
        borderColor: formTheme.border,
        color: formTheme.buttonColor,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    inputTxt: {
        color: formTheme.buttonColor,
    },
    select: {
        backgroundColor: formTheme.background,
        borderColor: formTheme.border,
        color: formTheme.sousTitre,
        borderWidth: 1,
        borderRadius: 100,
    },
    button: {
        alignItems: 'center',
        backgroundColor: formTheme.buttonColor,
        borderRadius: 10,
        padding: 10,
    },
    buttonTxt: {
        color: formTheme.background
    },
    delBtn: {
        alignItems: 'center',
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 10,
    }
});