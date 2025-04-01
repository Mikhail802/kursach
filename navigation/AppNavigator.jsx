
import TaskDetailScreen from '../screens/TaskDetailScreen';
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RecoverScreen from '../screens/RecoverScreen';
import BottomTabNavigator from '../components/BottomTabNavigator';
import RoomScreen from '../screens/RoomScreen';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';
import FriendsScreen from '../screens/FriendsScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import FriendRequestsScreen from '../screens/FriendRequestsScreen';




const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loadingAuth } = useContext(AuthContext);
  console.log("🔁 Rendering AppNavigator. User:", user);

  if (loadingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
          <Stack.Screen name="Room" component={RoomScreen} />
          <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
          <Stack.Screen name="AddFriend" component={AddFriendScreen} />
          
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Recover" component={RecoverScreen} />
          <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
