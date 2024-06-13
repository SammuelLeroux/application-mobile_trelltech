import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { formTheme, appTheme } from "../../config/theme";

function createBoard(name,workspace, fetchBoards, setModalBoardVisible, template = null) {

    const queryParams = new URLSearchParams(workspace);
    let url = `https://api.trello.com/1/boards/?name=${name}&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}&${queryParams}`;

    if (template !== null) {
        url += `&idBoardSource=${template}`
    }
    fetch(
        url,
        {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    ).then(res => res.ok ? res.json() : null)?.then(data => {
        fetchBoards();
        setModalBoardVisible(false);
    });
}

function updateBoard(id, newItem, fetchBoards, setModalBoardVisible) {

    const queryParams = new URLSearchParams(newItem);

    fetch(
        `https://api.trello.com/1/boards/${id}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}&${queryParams}`,
        {
            method: "PUT",
            headers: {
                Accept: "application/json",
            },
        }
    ).then(res => res.ok ? res.json() : null)?.then(data => {
        fetchBoards();
        setModalBoardVisible(false);
    });
}

function CreateBoardView({item, fetchBoards, setVisible}) {
    const [text, setText] = useState("");
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        fetch(
            `https://api.trello.com/1/batch?urls=%2F1%2Fboard%2F55107c70c088e6dc80bf2553%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F54c93f6f836da7c4865460d2%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5cffc8bc4899412c91f865e1%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5e20e06c460b391727ce7a2b%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F57e1548d041d8599c91361f5%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5d9389e457df5203e183a38e%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5c3e2fdb0fa92e43b849d838%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5a69ea0ab14b38d6743530cc%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5e110382bbcd021dda283413%3Ffields%3Did%252Cname%252Cprefs,%2F1%2Fboard%2F5dae5379616fd0851a223f73%3Ffields%3Did%252Cname%252Cprefs&key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`
        ).then(res => {
            if (!res.ok) {
                console.log(res.status, res);
                return;
            }
            return res.json();
        })
        .then(data => {setTemplates(data); });
    }, []);

    let pickerItems = [];

    templates.map((template, index) => {
        pickerItems.push(<Picker.Item key={index} value={template["200"].id} label={template["200"].name}/>)
    })

    pickerItems.push(<Picker.Item key={pickerItems.length +1} value={null} label={"aucun"}  />);

    return (
        <View style={styles.interface}>
            <Text className="text-lg text-center" style={{ color: formTheme.background }}>
                Création de board
            </Text>

            <View className="mt-3">
                <TextInput
                    style={styles.input}
                    placeholderTextColor={formTheme.sousTitre}
                    defaultValue={text}
                    onChangeText={newText => setText(newText)}
                    placeholder='Entrer le nom du board'
                />
            </View>

            <Picker
            selectedValue={selectedTemplate}
            onValueChange={(value)=> {
                setSelectedTemplate(value);
            }}
            >
                {pickerItems}
            </Picker>

            <TouchableOpacity
                className="mt-3"
                style={styles.button}
                onPress={
                    () => createBoard(text,{idOrganization: item.idOrganization}, fetchBoards, setVisible,selectedTemplate)
                }
            >
                <Text style={styles.buttonTxt}>
                    Créer
                </Text>
            </TouchableOpacity>
        </View>
    );
}

function UpdateBoardView({item, workspaces, fetchBoards, setVisible}) {
    
    const [text, setText] = useState(item.name);
    const [desc, setDesc] = useState(item.desc);

    const [selectedWorkspace, setSelectedWorkspace] = useState(item.idOrganization);

    return (
        <View style={styles.interface}>

            <Text className="text-lg text-center" style={{ color: formTheme.background }}>
                Modifier le board
            </Text>

            <View className="flex space-y-3 mt-3">
                <TextInput
                    style={styles.input}
                    placeholderTextColor={formTheme.inputTxt}
                    defaultValue={text}
                    onChangeText={newText => setText(newText)}
                    placeholder='Renommer le board'
                />

                <TextInput
                    style={styles.input}
                    placeholderTextColor={formTheme.inputTxt}
                    defaultValue={desc}
                    onChangeText={newDesc => setDesc(newDesc)}
                    placeholder={desc ? 'Modifier la description' : 'Ajouter une description'}
                />

                <Picker
                    selectedValue={selectedWorkspace}
                    style={styles.select}
                    onValueChange={(itemValue) => setSelectedWorkspace(itemValue)}
                >
                    {
                        workspaces && Object.entries(workspaces).map(([key, value]) => (
                            <Picker.Item key={key} label={value} value={key} />
                        ))
                    }
                </Picker>
            </View>

            <TouchableOpacity
                className="mt-3"
                style={styles.button}
                onPress={
                    () => updateBoard(item.id, {name: text, desc: desc, idOrganization: selectedWorkspace}, fetchBoards, setVisible)
                }
            >
                <Text style={styles.buttonTxt}>
                    Modifier
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default function BoardModal({ visible, setVisible, fetchBoards, action, item, workspaces }) {

    let element;

    switch(action) {
        case "CREATE":
            element = <CreateBoardView item={item} fetchBoards={fetchBoards} setVisible={setVisible}/>;
            break;
        case "UPDATE":
            element = <UpdateBoardView item={item} workspaces={workspaces} fetchBoards={fetchBoards} setVisible={setVisible} />;
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
        paddingVertical: 55,
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
        color: formTheme.buttonColor,
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
    }
});