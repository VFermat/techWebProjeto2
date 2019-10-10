import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from '../Screens/LoginScreen';
import CreateAccountScreen from '../Screens/CreateAccountScreen';


const AppNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    CreateAccount: CreateAccountScreen,
  },
  {
    initialRouteName: 'Login',
  });

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
