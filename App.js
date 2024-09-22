import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, TextInput, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';


export default function App() {

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221,
  })

  const apikey = "66ed31c1c9fd4490011665mzge94039";

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('No permission to get location')
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    setRegion({
      ...region,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  useEffect(() => { getLocation() }, []);

  const handleAddress = () => {
    fetch(`https://geocode.maps.co/search?q=${keyword}&api_key=${apikey}`)
      .then(response => {
        if (!response.ok)
          throw new Error("Error in fetch:" + response.statusText);

        return response.json()
      })
      .then(data => setRegion({
        ...region,
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      }))
      .catch(err => console.error(err));

  }
  //console.log(region);


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude
          }}
          title='Haaga-Helia'
        />
      </MapView>
      <TextInput
        style={styles.text}
        value={keyword}
        onChangeText={text => setKeyword(text)}
      />
      <View style={styles.button}>
        <Button title='SHOW' onPress={handleAddress} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    width: "100%",
    marginBottom: 10

  },
  map: {
    width: '100%', height: '100%'
  },
  button: {
    width: "100%",
    marginBottom: 150
  }
});
