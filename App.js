import React from 'react';
import { Text, SafeAreaView, View, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native'; // Importa o hook de navegação

import ContactScreen from './views/contact';

function HomeScreen({ navigation }) {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView>
      <StatusBar style="light" />

      <View style={{ paddingHorizontal: 30, paddingBottom: 0, paddingTop: 15 }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#1b1b1b' }}>Serviços</Text>
      </View>

      <View
        style={{
          backgroundColor: '#1C5CA2',
          borderRadius: 15,
          padding: 20,
          margin: 30,
          marginTop: 15,
          marginBottom: 5,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#FFF' }}>Definir rota</Text>
          <Image style={{ width: 15, height: 15, marginLeft: 5 }} source={require('./assets/connection.png')} />
        </View>
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 13,
            color: '#FFF',
            marginTop: 10,
          }}
        >
          Crie uma rota e veja o tempo do percurso e possíveis trajetos para o seu destino
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Map')}
          style={{
            backgroundColor: '#FFF',
            borderRadius: 7,
            padding: 12,
            width: 105,
            alignSelf: 'flex-end',
            marginTop: 15,
          }}
        >
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#1C5CA2', textAlign: 'center' }}>
            Definir rota
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 30,
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('Contact')}
          style={{
            backgroundColor: '#1C5CA2',
            width: 105,
            height: 105,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image style={{ width: 31, height: 31, marginBottom: 10 }} source={require('./assets/contacts.png')} />
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center' }}>
            Contatos
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Tela de "Mapa"
function MapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Mapa da Rede</Text>
    </View>
  );
}

const Stack = createStackNavigator();

// Função para o botão de voltar
function CustomBackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        backgroundColor: '#FFF', // Círculo branco
        borderRadius: 40, // Forma circular
        width: 30,
        height: 30,
        marginLeft: 30,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('./assets/back-arrow.png')} // Imagem da seta (substitua pela seta que você usar)
        style={{width: 8, height: 14}}
      />
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1C5CA2',
            paddingTop: 30,
            height: 130,
          },
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Poppins_700Bold',
            fontSize: 18,
            color: '#FFF',
          },
          headerTintColor: '#FFF',
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Olá! Qual será o destino de hoje?', headerLeft: () => null }}
        />
        <Stack.Screen name="Map" component={MapScreen} options={{ title: 'Definir Rota', headerLeft: () => <CustomBackButton /> }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contatos', headerLeft: () => <CustomBackButton /> }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
