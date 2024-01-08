import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, collection, addDoc, updateDoc } from '@firebase/firestore';

const NewTask = ({route, navigation}) => {
  const [editing, setEditing] = useState(false);
  const [todo, setTodo] = useState('');
  const [done, setDone] = useState(false);

  // console.log(route.params);
  useEffect(() => {
    if (route.params != undefined) {
      setEditing(true);
      setTodo(route.params.item.title);
      setDone(route.params.item.done);
    }
  }, []);

  const addTodo = async() => {
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, 'todos'), {
        title: todo,
        done: false
      });
      setTodo('');
      console.log('Document written with ID: ', docRef.id);
      navigation.navigate('braindump');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const updateTodo = async() => {
    try {
      const ref = doc(FIRESTORE_DB, `todos/${route.params.item.id}`);
      updateDoc(ref, {
        title: todo,
        done: done
      });
      navigation.navigate('braindump');
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.form}>
        <TextInput 
          style={styles.input}
          placeholder="Title"
          onChangeText={(text) => setTodo(text)}
          value={todo}
        />

        {/* <Text>Due:</Text>
        <Text>at:</Text>
        <Text>Reminders</Text>
        <Text>Notes</Text> */}

        <Button onPress={editing ? updateTodo:addTodo} title='Confirm' disabled={todo === ''} color='#97C4B1' />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
		marginHorizontal: 20,
    marginVertical: 20,
	},
  form: {
		marginVertical: 50,
    marginHorizontal: 20,
		flexDirection: 'column',
		// alignItems: 'center',
	},
	input: {
		height: 85,
		padding: 10,
    fontSize: 40,
	},
});

export default NewTask;