import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
//Importieren der Expo-Camera
import { Camera } from 'expo-camera';

export default function App() {
  // Zustände für Kamera-Berechtigung, Kamera-Referenz, aufgenommenes Bild und Kameratyp
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  // useEffect-Hook zum Anfordern der Kamera-Berechtigung beim Laden der App
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  // Funktion zum Aufnehmen eines Fotos
  const takePicture = async () => {
    if (camera) {
      const { uri } = await camera.takePictureAsync(null);
      setImage(uri);
    }
  };

  // Wenn die Kamera-Berechtigung noch nicht feststeht, wird eine Ladeanzeige angezeigt
  if (hasCameraPermission === null) {
    return <Text>Kamera Erlaubnis angefordert...</Text>;
  }
  // Wenn der Zugriff auf die Kamera verweigert wurde, wird eine Fehlermeldung angezeigt
  if (hasCameraPermission === false) {
    return <Text>Kein Zugang zur Kamera</Text>;
  }

  // Rendern der Kameraansicht, Kamera-Wechsel-Button, Aufnahme-Button und des aufgenommenen Bildes
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
        />
      </View>
      <Button
        title="Kamera Wechseln"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}
      />
      <Button title="Foto machen" onPress={() => takePicture()} />
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  }
});
