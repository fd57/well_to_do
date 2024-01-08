import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, FlatList, StyleSheet, Text, TouchableOpacity, View, Button, TextInput } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from '@firebase/firestore';
import { Ionicons, Entypo } from '@expo/vector-icons';

const Braindump = ({navigation}) => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const todoRef = collection(FIRESTORE_DB, 'todos');

    const subscriber = onSnapshot(todoRef, {
      next: (snapshot) => {
        const todos = [];
        snapshot.docs.forEach((doc) => {
          todos.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setTodos(todos);
      }
    });
    return () => subscriber();
  })

  const renderTodo = ({item}) => {
    const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

    const toggleDone = async() => {
      updateDoc(ref, {done: !item.done});
    };

    return (
      <View style={styles.todoContainer}>
        <TouchableOpacity onPress={toggleDone} style={styles.todo}>
          {item.done && <Ionicons name="md-checkmark-circle" size={20} color="green" />}
          {!item.done && <Entypo name="circle" size={20} color="#97C4B1" />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('task detail', {item:item})}>
          <Text style={styles.todoText}>{item.title}</Text>
        </TouchableOpacity>
        {/* <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} /> */}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>BRAINDUMP</Text>
      {/* <Button onPress={() => navigation.navigate('details')} title="Open Details" /> */}
      {todos.length > 0 && (
        <View>
          <FlatList
            data={todos}
            renderItem={renderTodo}
            keyExtractor={(todo) => todo.id}
            // removeClippedSubviews={true}
          />
        </View>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('new task')} title="+" style={styles.addTaskButton}>
        <Ionicons name="add" size={50} color="black" />
      </TouchableOpacity>
      {/* <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" /> */}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
	container: {
    flex: 1,
		marginHorizontal: 20,
    marginVertical: 50,
	},
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    // font
    padding: 5,
  },
  todoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		marginVertical: 4
	},
	todo: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	todoText: {
		flex: 1,
		paddingHorizontal: 4,
    fontSize: 20,
	},
  addTaskButton: {
    backgroundColor: '#97C4B1',
    borderRadius: 50,
    padding: 10,
    marginTop: 'auto',
    marginLeft: 'auto',
  },
});

export default Braindump;