import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, deleteDoc } from '@firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { cancelScheduledNotificationAsync } from 'expo-notifications';

const TaskDetail = ({route, navigation}) => {
  const ref = doc(FIRESTORE_DB, `todos/${route.params.item.id}`);
  const [reminder, setReminder] = useState();
  const [dueDate, setDueDate] = useState();
  const [dueTime, setDueTime] = useState();

  // check for database dates and convert to readable strings 
  useEffect(() => {
    if (route.params.item.reminders != null) {
      setReminder(route.params.item.reminders.toDate().toUTCString());
    } else {
      setReminder('None');
    }
    if (route.params.item.duedate != null) {
      setDueDate(route.params.item.duedate.toDate().toDateString());
    } else {
      setDueDate('Whenever');
    }
    if (route.params.item.duetime != null) {
      setDueTime(route.params.item.duetime.toDate().toTimeString());
    } else {
      setDueTime('');
    }
  }, []);

  const deleteItem = async() => {
    cancelScheduledNotificationAsync(route.params.item.reminderIds);
    deleteDoc(ref);
    navigation.navigate('braindump');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{route.params.item.title}</Text>
      <Text style={styles.heading}>Due</Text>
      <Text style={styles.notes}>{dueDate}</Text>
      <Text style={styles.notes}>{dueTime}</Text>
      <Text style={styles.heading}>Notes</Text>
      <Text style={styles.notes}>{route.params.item.notes}</Text>
      <Text style={styles.heading}>Reminders</Text>
      <Text style={styles.notes}>{reminder}</Text>
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
  heading: {
    padding: 10,
    fontSize: 25,
    fontWeight: 'bold',
  },
  notes: {
    paddingHorizontal: 10,
    fontSize: 25,
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