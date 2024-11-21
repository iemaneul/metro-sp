import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold, Poppins_500Medium } from '@expo-google-fonts/poppins';

export default function ContactScreen() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Poppins_500Medium,
  });

  if (!fontsLoaded) {
    return null; // Ou um carregando, se necessário
  }

  const items = [
    { text: "Ligar para o metrô:", phone: "0800 770 7722", note: "Funciona todos os dias das 5h às 0h." },
    { text: "Ligar para Via Quatro", phone: "0800 770 7100", note: "Funciona todos os dias das 5h às 0h." },
    { text: "Ligar para Via Mobilidade", phone: "0800 770 7106", note: "Funciona de segunda à sexta das 6h30 às 22h. Sábado e Domingo, das 8h às 18h." },
    { text: "SMS Segurança", phone: "(011) 97333-2252", note: "" },
  ];

  const icons = [
    { source: require('../assets/www.png'), link: 'https://www.metro.sp.gov.br/' },
    { source: require('../assets/facebook.png'), link: 'https://www.facebook.com/metrosp/' },
    { source: require('../assets/x.png'), link: 'https://x.com/metrosp_oficial' },
    { source: require('../assets/youtube.png'), link: 'https://www.youtube.com/@MetrospOficial' },
    { source: require('../assets/instagram.png'), link: 'https://www.instagram.com/metrospoficial/' },
  ];

  const callPhoneNumber = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View style={{ paddingHorizontal: 30, paddingBottom: 0, paddingTop: 25 }}>
      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: '#1b1b1b', textAlign: 'center' }}>
        Telefones úteis
      </Text>

      <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 16, color: '#1b1b1b', paddingTop: 25 }}>
        Central de informações
      </Text>

      {items.map((item, index) => (
        <View key={index} style={styles.listItemContainer}>
          <Text style={styles.listItem}>{item.text}</Text>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => callPhoneNumber(item.phone)} // Chama a função ao clicar
          >
            <Text style={styles.callButtonText}>{item.phone}</Text>
          </TouchableOpacity>

          <Text style={styles.listNote}>{item.note}</Text>
        </View>
      ))}

      <View style={styles.iconContainer}>
        {icons.map((icon, index) => (
          <TouchableOpacity key={index} onPress={() => openLink(icon.link)} style={styles.iconWrapper}>
            <Image source={icon.source} style={styles.iconImage} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 25,
    paddingHorizontal: 30,
  },
  listItem: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
    color: '#1b1b1b',
  },
  listNote: {
    color: '#5A5A5A',
    fontSize: 12,
    marginTop: 10,
  },
  callButton: {
    backgroundColor: '#1C5CA2',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    width: '100%',
  },
  callButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 15
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#1C5CA2',
    padding: 20,
    borderRadius: 10,
  },
  iconImage: {
    width: 25,
    height: 25,
  },
});
