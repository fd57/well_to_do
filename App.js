import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
// import Constants from 'expo-constants';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Braindump from './app/screens/Braindump';
import NewTask from './app/screens/NewTask';
import TaskDetail from './app/screens/TaskDetail';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // an asynchronous function whihc is instantly called
    // allows us to use await within the useEffect
    (async () => {
      let token;
      // check, is this a device or a simulator
      if (Device.isDevice) {
        // see if we have already been granted permission to access notifications
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          // ask for permission once
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        // if we have permission, ask for the token
        token = (await Notifications.getExpoPushTokenAsync()).data;
      }else{
        alert('You are running this app on a simulator, you must use a real device to use push notifications');
      }

      // make modifications to android
      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (token != undefined) {
        console.log(`Our token is ${token}`);
      }else{
        console.log(`We are unable to get the token`);
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='braindump'>
        <Stack.Screen name="braindump" options={{headerShown:false}} component={Braindump} />
        <Stack.Screen name="new task" options={{headerShown:false}} component={NewTask} />
        <Stack.Screen name="task detail" options={{headerShown:false}} component={TaskDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}