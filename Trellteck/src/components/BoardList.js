import React from "react";
import { 
  Text, 
  View, 
  TouchableOpacity, 
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { appTheme, formTheme } from "../config/theme";
import BoardModal from "./modals/BoardModal";
import WorkspaceModal from "./modals/WorkpaceModal";
import { FontAwesome5 } from '@expo/vector-icons';


function BoardList({token}) {

  // constantes
  const TRELLO_KEY = process.env.TRELLO_KEY;
  const TRELLO_TOKEN = token;

  // boards
  const [boards, setBoards] = useState([]);
  const [listShowBoard, setListShowBoard] = useState([]);

  // workspaces
  const [idWorkspaces, setIdWorkspaces] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [workspacesName, setWorkspacesName] = useState([]);
  const [mappedWorkspaces, setMappedWorkspaces] = useState({});

  const [pendingWorkspaces, setPendingWorkspaces] = useState([]);

  // modals
  const [modalBoardVisible, setModalBoardVisible] = useState(false);
  const [boardAction, setBoardAction] = useState("");
  const [item, setItem] = useState({});

  const [modalWorkspaceVisible, setModalWorkspaceVisible] = useState(false);
  const [workspaceAction, setWorkspaceAction] = useState("");
  const [itemWorkspace, setItemWorkspace] = useState({});

  const navigation = useNavigation();

  function removeBoard(id) {
    fetch(
      `https://api.trello.com/1/boards/${id}?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_TOKEN}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        }
      }
    ).then(res => {res.ok ? fetchBoards() : ""})
  }

  function fetchBoards() {
    fetch(
      `https://api.trello.com/1/members/me/boards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Itérer sur les données pour récupérer les id et les noms des boards
        const boardsData = data.map((board) => ({
          id: board.id,
          idOrganization: board.idOrganization,
          name: board.name,
          desc: board.desc ? (board.desc.length > 25 ? board.desc.substring(0, 25) + "..." : board.desc) : ""
        }));

        setBoards(boardsData);
      })
      .catch((error) =>
        console.error("Erreur lors de la récupération des boards :", error)
      );
  }

  // mapper les noms de workspaces en fonction des id
  function mapIdsToNames(ids, names) {

    // Vérification que les deux tableaux ont la même longueur
    if (ids.length === names.length)
    {
      // Utilisation de reduce() pour mapper les id avec les noms des workspaces
      const idNameMap = ids.reduce((acc, curr, index) => {
        acc[curr] = names[index];
        return acc;
      }, {});
    
      return idNameMap;
    }
  }

  async function fetchWorkspaces()
  {
    try{
      fetch(
        `https://api.trello.com/1/members/me/organizations?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => response.json())
      .then((data) => {
        // Met à jour les listes avec les id des workspaces
        const workspaceIds = data.map(workspace => workspace.id);
        setPendingWorkspaces(workspaceIds);
      })
    }
    catch(error) {
      console.error("Erreur lors de la récupération des workspaces :");
      throw error;
    }
  }
  
  async function mapWorkspaces(id = null)
  {
    // on met en place un tableau avec les id des workspaces
    let ids;

    if (pendingWorkspaces)
    {
      ids = pendingWorkspaces;
    }
    else
    {
        // on recupere un tableau avec les idOrganisation
      const tabIdWorkspace = boards.reduce((acc, board) => {
        if (!acc.includes(board.idOrganization)) {
          acc.push(board.idOrganization);
        }
        return acc;
      }, []);

      ids = tabIdWorkspace;
    }

    id !== null ? pendingWorkspaces.push(id) : null;
    setIdWorkspaces(ids);

    // on classe les boards dans un objet en fonction de leurs idOrganisation
    const objWorkspace = idWorkspaces.reduce((acc, id) => {
      acc[id] = boards.filter(board => board.idOrganization === id);
      return acc;
    }, {});

    // on met en place un objet qui repartit les boards en fonctions des idOrganisation
    setWorkspaces(objWorkspace);

    // Initialise listShowBoard avec les dropdowns ouverts par défaut
    const initialListShowBoard = idWorkspaces.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
    setListShowBoard(initialListShowBoard);
  }

  // Récupère les noms des workspaces depuis Trello
  async function fetchWorkspaceNames() {
    const promises = idWorkspaces.map(id =>
      fetch(
        `https://api.trello.com/1/organizations/${id}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
      ).then(response => response.json())
    );

    try {
      const data = await Promise.all(promises);
      const tabWorkspacesName = data.map(org => org.displayName);
      setWorkspacesName(tabWorkspacesName);
    } catch (error) {
      console.error("Erreur lors de la récupération des noms des boards :", error);
    }
  }

  useEffect(() => {
    // recuperer les boards
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    // recuperer les boards
    fetchBoards();
  }, [pendingWorkspaces]);

  useEffect(() => {
    if (boards.length > 0) {
      // recuperer les id des workspaces
      mapWorkspaces();
    }
  }, [boards, pendingWorkspaces]);

  useEffect(() => {
    // recuperer les noms des workspaces
    fetchWorkspaceNames();
  }, [idWorkspaces]);

  useEffect(() => {
    // mapper les noms en fonctions des id
    setMappedWorkspaces(mapIdsToNames(idWorkspaces, workspacesName));
  }, [idWorkspaces, workspacesName]);

  // Gère l'affichage des dropdowns des workspaces
  function handleShowBoard(id) {
    setListShowBoard(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  function updatePending(action, id, name) {
    switch (action) {
      case "add":
        mapWorkspaces(id);
        setWorkspacesName(prevValue => [...prevValue, name]);
        break;
      case "update":
        setIdWorkspaces(prevValue => prevValue.filter(prevId => prevId !== id));
        break;
      case "delete":
        setIdWorkspaces(prevValue => prevValue.filter(prevId => prevId !== id));
        setPendingWorkspaces(prevValue => prevValue.filter(prevId => prevId !== id));
        setWorkspaces(prevValue => {
          const { [id]: removedKey, ...rest } = prevValue;
          return rest;
        });
        break;
      default:
        break;
    }
  }

  return (
    <View style={styles.interface}>
      {
        Object.keys(workspaces).map((workspaceId, workspaceIndex) => (
          <View className style={styles.workspaces} key={workspaceIndex}>
            <TouchableOpacity
              className={listShowBoard[workspaceId] === false ? 'rounded-b-xl' : ''}
              style={styles.headerWorkspace}
              onPress={() => handleShowBoard(workspaceId)}
            >
              <Text style={styles.headerWorkspaceTitle}>
                {(workspacesName[workspaceIndex] ? workspacesName[workspaceIndex].substring(0, 25) : null) || workspaceId}
              </Text>
              <View
                className="flex flex-row content-center justify-center space-x-5"
              >
                <TouchableOpacity
                  onPress={() => {setWorkspaceAction("UPDATE"); setModalWorkspaceVisible(true); setItemWorkspace({id: workspaceId, name:workspacesName[workspaceIndex]})}}
                >
                  <FontAwesome5 style={{color: "white"}} name="cog" solid size={20} />
                </TouchableOpacity>

                <FontAwesome5 className="ms-3" name={listShowBoard[workspaceId] === true ? "chevron-up" : "chevron-down"} solid size={20} />
              </View>
              
            </TouchableOpacity>
            <View className={listShowBoard[workspaceId] === false ? 'hidden' : ''} style={styles.bodyWorkspace}>
              {
                workspaces[workspaceId].map((board, boardIndex) => (
                  <View style={styles.optionBoard} key={boardIndex}>
                    <TouchableOpacity
                      onPress={() => {
                        // Naviguer vers une autre page avec le boardId
                        navigation.navigate("BoardPage", { boardId: board.id });
                      }}
                      style={styles.optionLabelBtn}
                    >
                      <Text style={{color: "white"}}>{board.name}</Text>
                      {
                        board.desc ? (
                          <Text style={{color: appTheme.primary}}>{board.desc}</Text>
                        ) : null
                      }
                    </TouchableOpacity>
                    <View className="flex flex-row space-x-5">
                      <TouchableOpacity
                        onPress={() => {setBoardAction("UPDATE"); setItem(board); setModalBoardVisible(true)}}
                      >
                        <FontAwesome5 style={{color: "white"}} name="pen" solid size={15} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => removeBoard(board.id)}>
                        <FontAwesome5 style={{color: "red"}} name="trash" solid size={15} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              }
              <TouchableOpacity
                style={styles.newBoardBtn}
                onPress={
                  () => {
                    setBoardAction("CREATE");
                    setModalBoardVisible(true);
                    setItem({idOrganization: workspaceId, name:workspacesName[workspaceIndex]})
                  }
                }
              >
                <FontAwesome5 name="plus" solid size={15} style={{color: "white", textAlign: "center"}} />
              </TouchableOpacity>
            </View>
          </View>
        ))
      }

      {/* Ajouter un workspace */}
      <View className="rounded-xl" style={styles.addWorkspaceBtn}>
        <TouchableOpacity
          className="p-3"
          onPress={() => {setWorkspaceAction("CREATE"); setModalWorkspaceVisible(true)}}
        >
          <FontAwesome5 name="plus" solid size={15} style={{color: appTheme.secondary, textAlign: "center"}} />
        </TouchableOpacity>
      </View>

      <BoardModal
        visible={modalBoardVisible}
        setVisible={setModalBoardVisible}
        fetchBoards={fetchBoards}
        action={boardAction}
        item={item}
        workspaces={mappedWorkspaces}
      />

      <WorkspaceModal
        visible={modalWorkspaceVisible}
        setVisible={setModalWorkspaceVisible}
        updatePending={updatePending}
        action={workspaceAction}
        itemWorkspace={itemWorkspace}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  interface: {
    flexDirection: "column",
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    height: "100%",
  },
  workspaces: {
    backgroundColor: appTheme.primary,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerWorkspace: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: appTheme.highlight,
    padding: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    fontSize: 15,
  },
  addBorderRadius: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerWorkspaceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  bodyWorkspace: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: formTheme.buttonColor,
    borderRadius: 10,
    padding: 10,
  },
  optionBoard: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: "center",
    backgroundColor: appTheme.secondary,
    fontSize: 50,
    borderRadius: 5,
    padding: 12,
    marginVertical: 10,
  },
  newBoardBtn: {
    alignItems: "center",
    backgroundColor: appTheme.secondary,
    borderRadius: 5,
    padding: 12,
    marginTop: 10
  },
  addWorkspaceBtn: {
    backgroundColor: appTheme.highlight,
  },
  optionLabelBtn : {
    flexGrow: 1
  }
});

export default BoardList;