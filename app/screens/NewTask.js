import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, KeyboardAvoidingView, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, collection, addDoc, updateDoc } from '@firebase/firestore';
import * as Notifications from 'expo-notifications';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';

const NewTask = ({route, navigation}) => {
  const [editing, setEditing] = useState(false);

  const [todo, setTodo] = useState('');
  const [duePeriod, setDuePeriod] = useState('No Deadline Period');
  const [dueDate, setDueDate] = useState(null);
  const [dueTime, setDueTime] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [notes, setNotes] = useState('');
  const [done, setDone] = useState(false);

  // DROPDOWN MENU FUNCTIONALITY - DUE PERIOD
  const [isDuePeriod, setIsDuePeriod] = useState(false);
  const [value, setValue] = useState('0');
  const options = [
    {label: 'No Deadline Period', value: '0'},
    {label: 'Later', value: '1'},
    {label: 'Day', value: '2'},
    {label: 'Week', value: '3'},
    {label: 'Month', value: '4'},
  ]

  // if updating, fill in fields
  useEffect(() => {
    if (route.params != undefined) {
      setEditing(true);
      setTodo(route.params.item.title);
      setDuePeriod(route.params.item.dueperiod);
      setNotes(route.params.item.notes);
      setDone(route.params.item.done);

      // set corresponding value to duePeriod
      existingValue = options.map(e => e.label).indexOf(route.params.item.dueperiod).toString();
      setValue(existingValue);
      // set isDuePeriod accordingly
      if(existingValue >= 2){
        setIsDuePeriod(true);
      } else {
        setIsDuePeriod(false);
      }

      // handle dates
      if (route.params.item.duedate != null) {
        setDueDate(route.params.item.duedate.toDate());
      } else {
        setDueDate(null);
      }
      if (route.params.item.duetime != null) {
        setDueTime(route.params.item.duetime.toDate());
      } else {
        setDueTime(null);
      }
      if (route.params.item.reminders != null) {
        setReminder(route.params.item.reminders.toDate().toUTCString());
      } else {
        setReminder(null);
      }
    }
    console.log("Due period: ", duePeriod);
    console.log("Due Value: ", value);
  }, []);

  // DATE-TIME PICKER FUNCTIONALITY
  // REMINDERS - DATE-TIME
  const [isDateTimePickerVisible, setDateTimePickerVisibility] = useState(false);
  const showDateTimePicker = () => {
    setDateTimePickerVisibility(true);
  };
  const hideDateTimePicker = () => {
    setDateTimePickerVisibility(false);
  };
  const handleDateTimeConfirm = (datetime) => {
    setReminder(datetime);
    hideDateTimePicker();
  };

  const cancelReminder = () => {
    setReminder(null);
  };

  // DUE DATE AND TIME
  // DUE DATE
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleDateConfirm = (date) => {
    setDueDate(date);
    hideDatePicker();
  };

  // DUE TIME
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const handleTimeConfirm = (time) => {
    setDueTime(time);
    hideTimePicker();
  };


  // DATABASE CRUD FUNCTIONS
  const addTodo = async() => {
    try {
      let id = '';
      if (reminder != null) {
        id = await scheduleNotification(todo, reminder);
      }
      const docRef = await addDoc(collection(FIRESTORE_DB, 'todos'), {
        title: todo,
        dueperiod: duePeriod,
        duedate: dueDate,
        duetime: dueTime,
        reminders: reminder,
        reminderIds: id,
        notes: notes,
        done: false
      });
      setTodo('');
      // set all the other stuff to blank? or unnecessary?
      // console.log('Document written with ID: ', docRef.id);
      navigation.navigate('braindump');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const updateTodo = async() => {
    try {
      const ref = doc(FIRESTORE_DB, `todos/${route.params.item.id}`);
      let id = '';
      if (reminder != null) {
        id = await scheduleNotification(todo, reminder);
      }
      updateDoc(ref, {
        title: todo,
        dueperiod: duePeriod,
        duedate: dueDate,
        duetime: dueTime,
        reminders: reminder,
        reminderIds: id,
        notes: notes,
        done: done
      });
      navigation.navigate('braindump');
    } catch (e) {
      console.error('Error updating document: ', e);
    }
  };


  // NOTIFICATION FUNCTIONS
  const scheduleNotification = async(title, time) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder",
        body: title,
      },
      trigger: time,
    });
    return id;
  };

  
  // RETURN
  return (
    <SafeAreaView>
      <KeyboardAvoidingView 
        behavior='position' 
        // does this need the brackets?
        keyboardVerticalOffset={useHeaderHeight()}
      >
        <View style={styles.form}>
          <TextInput 
            style={styles.todoInput}
            placeholder="Title"
            onChangeText={(text) => setTodo(text)}
            value={todo}
          />

          <View style={styles.dueSection}>
            <View style={styles.dueSubsection}>
              <Text style={styles.heading}>🗓️ Due:</Text>
              <View style={styles.dueRightSection}>
                <Dropdown 
                  style={styles.dropdown}
                  placeholderStyle={styles.dropdownTextStyle}
                  selectedTextStyle={styles.dropdownTextStyle}
                  data={options}
                  value={value}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  // turn this into option 0 instead of just text
                  placeholder={'No deadline'}
                  onChange={item => {
                    setDuePeriod(item.label);
                    setValue(item.value);
                    if(item.value >= 2){
                      setIsDuePeriod(true);
                    } else {
                      setIsDuePeriod(false);
                    }
                  }}
                />
                <TouchableOpacity style={!isDuePeriod && {display: 'none'}} onPress={showDatePicker}>
                  <Text style={styles.date}>{dueDate!=null ? dueDate.toDateString():'no specific date'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.dueSubsection, !isDuePeriod && {display: 'none'}]}>
              <Text style={styles.heading}>🕐 at:</Text>
              <TouchableOpacity onPress={showTimePicker}>
                <Text style={styles.date}>{dueTime!=null ? dueTime.toTimeString():'no specific time'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Picker for scheduling due date*/}
          <DateTimePickerModal 
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />  

          {/* Time Picker for scheduling due time */}
          <DateTimePickerModal 
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={hideTimePicker}
          />

          <View style={styles.reminderHeading}>
            <Text style={styles.heading}>🔔 Reminders</Text>
            <TouchableOpacity style={styles.addReminderButton} onPress={showDateTimePicker}>
              <Ionicons name="add" size={40} color="black" />
            </TouchableOpacity>
          </View>

          <View style={[styles.reminderRow, reminder==null && {display:'none'}]}>
            <Text style={styles.date}>{reminder!=null && reminder.toUTCString()}</Text>
            <Button onPress={cancelReminder} title="Delete" color="#DB4343" />
          </View>

          {/* Datetime Picker for scheduling reminders */}
          <DateTimePickerModal 
            isVisible={isDateTimePickerVisible}
            mode="datetime"
            onConfirm={handleDateTimeConfirm}
            onCancel={hideDateTimePicker}
          />

          <Text style={styles.heading}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add notes here"
            onChangeText={(text) => setNotes(text)}
            value={notes}
            multiline={true}
          />

          <Button onPress={editing ? updateTodo:addTodo} title='Confirm' disabled={todo === ''} color='#97C4B1' />
        </View>
        <StatusBar style="auto" />
      </KeyboardAvoidingView>
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
	todoInput: {
		height: 85,
		padding: 10,
    fontSize: 40,
	},
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  dueSection: {
  },
  dropdown: {
    height: 50,
    minWidth: '70%',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  dueSubsection: {
    flexDirection: 'row',
    alignItems: 'top',
    justifyContent: 'space-between',
  },
  dueRightSection: {
    flexDirection: 'column',
    // flex: 0.9,
    alignItems: 'flex-end',
  },
  dropdownTextStyle: {
    fontSize: 16,
  },
  date: {
    padding: 10,
    fontSize: 25,
    flexShrink: 1,
  },
  reminderHeading: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addReminderButton: {
    padding: 10,
    marginLeft: 'auto',
  },
  reminderRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  notesInput: {
    padding: 10,
    fontSize: 25,
  },
});

export default NewTask;