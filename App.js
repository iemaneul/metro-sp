import { Text, SafeAreaView, View, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';

export default function App() {
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

      <View style={{backgroundColor: '#1C5CA2', paddingTop: 90, paddingBottom: 30, paddingHorizontal: 30, marginTop: -60, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 18, color: '#FFF', textAlign: 'center' }}>
          Olá! Qual será o destino de hoje?
        </Text>
        <Image style={{width: 15, height: 20}} source={require('./assets/news.png')} />
      </View>

      <View style={{paddingHorizontal: 30, paddingBottom: 0, paddingTop: 15}}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#1b1b1b'}}>
          Serviços
        </Text>
      </View>

      <View style={{backgroundColor: '#1C5CA2', borderRadius: 15, padding: 20, margin: 30, marginTop: 15, marginBottom: 5}}> 
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#FFF'}}>
            Definir rota
          </Text>
          <Image style={{width: 15, height: 15, marginLeft: 5}} source={require('./assets/connection.png')} />
        </View>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#FFF', marginTop: 10}}>
          Crie uma rota e veja o tempo do percurso e possíveis trajetos para o seu destino
        </Text>
        <TouchableOpacity
          // onPress={() => router.push('/home')}
          style={{backgroundColor: '#FFF', borderRadius: 7, padding: 12, width: 105, alignSelf: 'flex-end', marginTop: 15}}>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#1C5CA2', textAlign: 'center' }}>
            Definir rota
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{backgroundColor: '#1C5CA2', borderRadius: 15, padding: 20, margin: 30, marginTop: 10, marginBottom: 5}}> 
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#FFF'}}>
            Mapa da rede
          </Text>
          <Image style={{width: 15, height: 15, marginLeft: 5}} source={require('./assets/map.png')} />
        </View>
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#FFF', marginTop: 10}}>
          Veja o mapa da rede de São Paulo, com suas estações e conexões
        </Text>
        <TouchableOpacity
          // onPress={() => router.push('/home')}
          style={{backgroundColor: '#FFF', borderRadius: 7, padding: 12, width: 105, alignSelf: 'flex-end', marginTop: 15}}>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#1C5CA2', textAlign: 'center' }}>
            Ver mapa
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 30, marginTop: 15 }}>
        <TouchableOpacity style={{backgroundColor: '#1C5CA2', width: 105, height: 105, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 31, height: 31, marginBottom: 10}} source={require('./assets/www.png')} />
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center' }}>
            Site oficial
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{backgroundColor: '#1C5CA2', width: 105, height: 105, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 31, height: 31, marginBottom: 10}} source={require('./assets/lines.png')} />
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center' }}>
            Linhas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor: '#1C5CA2', width: 105, height: 105, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 44, height: 31, marginBottom: 10}} source={require('./assets/connect.png')} />
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center'}}>
            Conecta
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 30, marginTop: 10 }}>
        <TouchableOpacity style={{backgroundColor: '#1C5CA2', width: 105, height: 105, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 31, height: 31, marginBottom: 10}} source={require('./assets/infos.png')} />
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center' }}>
            Infos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{backgroundColor: '#1C5CA2', width: 105, height: 105, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 31, height: 31, marginBottom: 10}} source={require('./assets/contacts.png')} />
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center' }}>
            Contatos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{backgroundColor: '#1C5CA2', width: 105, height: 105, borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{width: 44, height: 31, marginBottom: 10}} source={require('./assets/status.png')} />
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#FFF', textAlign: 'center'}}>
            Status
          </Text>
        </TouchableOpacity>
      </View>
    
    </SafeAreaView>
  );
}
