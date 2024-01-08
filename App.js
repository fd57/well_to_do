import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Braindump from './app/screens/Braindump';
import NewTask from './app/screens/NewTask';
import TaskDetail from './app/screens/TaskDetail';

const Stack = createStackNavigator();

export default function App() {
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