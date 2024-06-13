import { useEffect, useState } from "react";
import { Modal, Text,View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { appTheme } from "../../config/theme";
export default function AddMemberModal({cardId, boardId, visible, setVisible, asignedMembers, fetchMembers}) {
    
    const [members, setMembers] = useState([]);

    const fetchData = () => {
        fetchMembersBoard(boardId)
        .then(data => setMembers(data))

    }

    useEffect(fetchData, [boardId]);


    let elements = []

    members.map((member,index) => {
        let memberAlreadyAsigned = false;
        asignedMembers.forEach(asignedMember => {
            if (!memberAlreadyAsigned)
                memberAlreadyAsigned = member.id == asignedMember.id
        })

        if (memberAlreadyAsigned) {
        elements.push(
        <TouchableOpacity key={index} style={styles.button} onPress={() => {
            actionAsignedMembers(cardId, member.id, "DEL")
            .then(res => res ? fetchMembers() : null);
        }}>
            <View>
                <Text style={styles.text}>{member.fullName}</Text>
                <Text style={styles.subtitle}>@{member.username}</Text>
            </View>
            <Text style={styles.check}>✓</Text>
        </TouchableOpacity>
        )

        } else {

            elements.push(
                <TouchableOpacity key={index} style={styles.button} onPress={() => {
                    actionAsignedMembers(cardId, member.id, "ADD")
                    .then(res => res ? fetchMembers() : null);
                }}>
                    <View>
                    <Text style={styles.text}>{member.fullName}</Text>
                    <Text style={styles.subtitle}>@{member.username}</Text>
                    </View>
                    
                </TouchableOpacity>
                )
        }
    })

    return (
        <Modal
            visible={visible}
        >
            <View
                style={styles.container}
            >
                <ScrollView>
                    {elements}

                </ScrollView>

                <TouchableOpacity
                    onPress={() => setVisible(false)}
                    style={styles.button}
                >
                    <Text style={styles.text}>Terminé</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

async function actionAsignedMembers(idCard, idMember, action) {
    let url = `https://api.trello.com/1/cards/${idCard}/idMembers`;
    let method= "";
    switch(action.toUpperCase()) {
        case "ADD":
            url += `?value=${idMember}&`;
            method= "POST";
            break;
        case "DEL":
            url += `/${idMember}?`;
            method = "DELETE";
            break;
        default:
            throw new Exception("No action defined");
    }
    url += `key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`;


    let response = await fetch(
        url,
        {
            method: method,
        }
    );
    
    if (!response.ok) {
        console.log(response.status, response);
        return false;
    }
    return true;

}



async function fetchMembersBoard(id) {
    let response = await fetch(
        `https://api.trello.com/1/boards/${id}/memberships?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
        {
            method: 'GET'
        }
    );

    if (!response.ok) {
        console.log(response.status, response);
        return;
    }

    let members = await response.json();
    let call = [];
    members.forEach(member => {
        call.push((async () => {
            let response = await fetch(
              `https://api.trello.com/1/members/${member.idMember}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
              {
                method:'GET'
              }
            );
            if (!response.ok) return;
            let data = await response.json();
            return data;
        })());
    });

    return await Promise.all(call);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
    },
    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: appTheme.secondary,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 5,
    },
    check: {
        color: "lightgreen",
        fontWeight: "bold",
        alignSelf: "center"
    },
    text: {
        color : "white"
    },
    subtitle: {
        color: "white",
        opacity: 0.80
    }
})