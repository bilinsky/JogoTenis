import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CadastroPessoas from './src/cadastro';
import Jogo from './src/tennisPlay';
import {Text, Button, View, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {getQtdJogadores} from './src/database';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


import { NavigationProp } from '@react-navigation/native';

function HomeScreen({ navigation }: { navigation: NavigationProp<any> }) {
  return (
    <ImageBackground
    source={require('../../assets/images/tennis-background.jpg')}
    style={styles.backgroundImage}>

    <View style={styles.container}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Cadastro')}>
          <View style={[styles.buttonContent, {alignSelf: 'flex-start'}]}>
              <Icon name="tennis-ball" size={24} color="#4CAF50" style={styles.icon} />
              <Text style={styles.menuText}>Cadastro de Pessoas</Text>
            </View>
        </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Jogo')}>
            <View style={styles.buttonContent}>
              <Icon name="tennis" size={24} color="#4CAF50" style={styles.icon} />
              <Text style={styles.menuText}>Iniciar Jogo</Text>
            </View>
          </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'No Error Game',
          headerTitleStyle: {
            fontFamily: 'BungeeTint-Regular',
            fontSize: 33,
            color: '#66ff66',
          },
          headerStyle: {
            backgroundColor: '#008060',
          },
        }}  
      />
      <Stack.Screen name="Cadastro" component={CadastroPessoas} options={{ title: 'Cadastro de Pessoas' }} />
      <Stack.Screen name="Jogo" component={Jogo} options={{ title: 'Jogo' }} />
    </Stack.Navigator>
  );
}

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [qtdJogadores, setQtdJogadores] = useState(0);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync({
          'BungeeTint-Regular': require('../../assets/fonts/BungeeTint-Regular.ttf'),
        });
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
      setQtdJogadores(getQtdJogadores());
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Início" 
          component={HomeStack} 
          options={{
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Cadastro" 
          component={CadastroPessoas} 
          options={{
            tabBarLabel: 'Cadastro',
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-plus-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Jogo" 
          component={Jogo} 
          options={{
            tabBarLabel: 'Jogo',
            tabBarIcon: ({ color, size }) => (
              <Icon name="tennis" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  menuButton: {
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(204, 255, 255, 0.5)', // Fundo azul claro transparente
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  icon: {
    marginRight: 10,
    color: '#333',
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'BungeeTint-Regular'
  },
})
