import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, deleteDoc } from '@firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

const TaskDetail = ({route, navigation}) => {
  const ref = doc(FIRESTORE_DB, `todos/${route.params.item.id}`);

  const deleteItem = async() => {
    deleteDoc(ref);
    navigation.navigate('braindump');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{route.params.item.title}</Text>
      <View style={styles.buttons}>
        <Button onPress={deleteItem} title="Delete" color="#DB4343" />
        <TouchableOpacity onPress={() => navigation.navigate('new task', {item:route.params.item})} style={styles.editTaskButton}>
          <Ionicons name="pencil" size={50} color="black" />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
		marginHorizontal: 20,
    marginVertical: 50,
  },
	title: {
		padding: 10,
    fontSize: 40,
	},
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  editTaskButton: {
    backgroundColor: '#97C4B1',
    borderRadius: 50,
    padding: 10,
    marginLeft: 'auto',
  },
});

export default TaskDetail;