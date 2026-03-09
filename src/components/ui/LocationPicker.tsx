import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Colors, Shadows, BorderRadius, Spacing } from "../../constants/colors";
import { FadeInView } from "../FadeInView";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: {
    state: string;
    city: string;
    subCity: string;
    ward: string;
  }) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  const [step, setStep] = useState(1); // 1: City, 2: Sub-city, 3: Ward (State is locked to UP)
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSubCity, setSelectedSubCity] = useState("");

  // All 75 districts of Uttar Pradesh
  const locations = {
    Agra: {
      Tajganj: ["Ward 1"],
      Sikandra: ["Ward 2"],
      "Kamla Nagar": ["Ward 3"],
    },
    Aligarh: { "Civil Lines": ["Ward 1"], Quarsi: ["Ward 2"] },
    Prayagraj: {
      "Civil Lines": ["Ward 1"],
      Katra: ["Ward 2"],
      "George Town": ["Ward 3"],
    },
    "Ambedkar Nagar": { Akbarpur: ["Ward 1"], Tanda: ["Ward 2"] },
    Amethi: { Gauriganj: ["Ward 1"], Musafirkhana: ["Ward 2"] },
    Amroha: { "Amroha City": ["Ward 1"], Hasanpur: ["Ward 2"] },
    Auraiya: { "Auraiya City": ["Ward 1"], Bidhuna: ["Ward 2"] },
    Azamgarh: { "Azamgarh City": ["Ward 1"], Nizamabad: ["Ward 2"] },
    Baghpat: { "Baghpat City": ["Ward 1"], Baraut: ["Ward 2"] },
    Bahraich: { "Bahraich City": ["Ward 1"], Nanpara: ["Ward 2"] },
    Ballia: { "Ballia City": ["Ward 1"], Rasra: ["Ward 2"] },
    Balrampur: { "Balrampur City": ["Ward 1"], Tulsipur: ["Ward 2"] },
    Banda: { "Banda City": ["Ward 1"], Atarra: ["Ward 2"] },
    Barabanki: { "Barabanki City": ["Ward 1"], Ramnagar: ["Ward 2"] },
    Bareilly: {
      "Civil Lines": ["Ward 1"],
      "Subhash Nagar": ["Ward 2"],
      "Pilibhit Road": ["Ward 3"],
    },
    Basti: { "Basti City": ["Ward 1"], Harraiya: ["Ward 2"] },
    Bhadohi: { "Bhadohi City": ["Ward 1"], Gyanpur: ["Ward 2"] },
    Bijnor: { "Bijnor City": ["Ward 1"], Najibabad: ["Ward 2"] },
    Budaun: { "Budaun City": ["Ward 1"], Bisauli: ["Ward 2"] },
    Bulandshahr: { "Bulandshahr City": ["Ward 1"], Khurja: ["Ward 2"] },
    Chandauli: { "Chandauli City": ["Ward 1"], Mughalsarai: ["Ward 2"] },
    Chitrakoot: { "Chitrakoot City": ["Ward 1"], Karvi: ["Ward 2"] },
    Deoria: { "Deoria City": ["Ward 1"], Barhaj: ["Ward 2"] },
    Etah: { "Etah City": ["Ward 1"], Kasganj: ["Ward 2"] },
    Etawah: { "Etawah City": ["Ward 1"], Chakarnagar: ["Ward 2"] },
    Ayodhya: { "Ayodhya City": ["Ward 1"], "Ram Katha Park": ["Ward 2"] },
    Farrukhabad: { "Farrukhabad City": ["Ward 1"], Fatehgarh: ["Ward 2"] },
    Fatehpur: { "Fatehpur City": ["Ward 1"], Bindki: ["Ward 2"] },
    Firozabad: { "Firozabad City": ["Ward 1"], Shikohabad: ["Ward 2"] },
    "Gautam Buddha Nagar": {
      Noida: ["Sector 18", "Sector 62", "Sector 137"],
      "Greater Noida": ["Alpha", "Beta"],
    },
    Ghaziabad: {
      Indirapuram: ["Ward 1"],
      Vaishali: ["Ward 2"],
      "Raj Nagar": ["Ward 3"],
    },
    Ghazipur: { "Ghazipur City": ["Ward 1"], Mohammadabad: ["Ward 2"] },
    Gonda: { "Gonda City": ["Ward 1"], Colonelganj: ["Ward 2"] },
    Gorakhpur: {
      "Gorakhpur City": ["Ward 1"],
      Golghar: ["Ward 2"],
      "Railway Colony": ["Ward 3"],
    },
    Hamirpur: { "Hamirpur City": ["Ward 1"], Rath: ["Ward 2"] },
    Hapur: { "Hapur City": ["Ward 1"], "Garh Road": ["Ward 2"] },
    Hardoi: { "Hardoi City": ["Ward 1"], Shahabad: ["Ward 2"] },
    Hathras: { "Hathras City": ["Ward 1"], Sadabad: ["Ward 2"] },
    Jalaun: { Orai: ["Ward 1"], Kalpi: ["Ward 2"] },
    Jaunpur: { "Jaunpur City": ["Ward 1"], Mariahu: ["Ward 2"] },
    Jhansi: {
      "Jhansi City": ["Ward 1"],
      "Sipri Bazar": ["Ward 2"],
      "Civil Lines": ["Ward 3"],
    },
    Kannauj: { "Kannauj City": ["Ward 1"], Tirwa: ["Ward 2"] },
    "Kanpur Dehat": { Akbarpur: ["Ward 1"], Rasulabad: ["Ward 2"] },
    "Kanpur Nagar": {
      "Civil Lines": ["Ward 1"],
      Kalyanpur: ["Ward 2"],
      "Kidwai Nagar": ["Ward 3"],
    },
    Kasganj: { "Kasganj City": ["Ward 1"], Patiyali: ["Ward 2"] },
    Kaushambi: { Manjhanpur: ["Ward 1"], Sirathu: ["Ward 2"] },
    Kushinagar: { Padrauna: ["Ward 1"], Kasia: ["Ward 2"] },
    "Lakhimpur Kheri": {
      Lakhimpur: ["Ward 1"],
      "Gola Gokaran Nath": ["Ward 2"],
    },
    Lalitpur: { "Lalitpur City": ["Ward 1"], Talbehat: ["Ward 2"] },
    Lucknow: {
      "Gomti Nagar": ["Ward 1", "Ward 2"],
      "Indira Nagar": ["Ward 3"],
      Hazratganj: ["Ward 4"],
      Aliganj: ["Ward 5"],
    },
    Maharajganj: { "Maharajganj City": ["Ward 1"], Nautanwa: ["Ward 2"] },
    Mahoba: { "Mahoba City": ["Ward 1"], Kulpahar: ["Ward 2"] },
    Mainpuri: { "Mainpuri City": ["Ward 1"], Bhongaon: ["Ward 2"] },
    Mathura: {
      "Mathura City": ["Ward 1"],
      Vrindavan: ["Ward 2"],
      Govardhan: ["Ward 3"],
    },
    Mau: { "Mau City": ["Ward 1"], Ghosi: ["Ward 2"] },
    Meerut: {
      "Shastri Nagar": ["Ward 1"],
      Brahmpuri: ["Ward 2"],
      "Civil Lines": ["Ward 3"],
    },
    Mirzapur: { "Mirzapur City": ["Ward 1"], Vindhyachal: ["Ward 2"] },
    Moradabad: {
      "Moradabad City": ["Ward 1"],
      Majhola: ["Ward 2"],
      "Civil Lines": ["Ward 3"],
    },
    Muzaffarnagar: { "Muzaffarnagar City": ["Ward 1"], Khatauli: ["Ward 2"] },
    Pilibhit: { "Pilibhit City": ["Ward 1"], Puranpur: ["Ward 2"] },
    Pratapgarh: { "Pratapgarh City": ["Ward 1"], Kunda: ["Ward 2"] },
    Raebareli: { "Raebareli City": ["Ward 1"], Lalganj: ["Ward 2"] },
    Rampur: { "Rampur City": ["Ward 1"], Bilaspur: ["Ward 2"] },
    Saharanpur: {
      "Saharanpur City": ["Ward 1"],
      Deoband: ["Ward 2"],
      Nakur: ["Ward 3"],
    },
    Sambhal: { "Sambhal City": ["Ward 1"], Chandausi: ["Ward 2"] },
    "Sant Kabir Nagar": { Khalilabad: ["Ward 1"], Mehdawal: ["Ward 2"] },
    Shahjahanpur: { "Shahjahanpur City": ["Ward 1"], Tilhar: ["Ward 2"] },
    Shamli: { "Shamli City": ["Ward 1"], Kairana: ["Ward 2"] },
    Shravasti: { Bhinga: ["Ward 1"], Ikauna: ["Ward 2"] },
    Siddharthnagar: { Naugarh: ["Ward 1"], Bansi: ["Ward 2"] },
    Sitapur: { "Sitapur City": ["Ward 1"], Biswan: ["Ward 2"] },
    Sonbhadra: { Robertsganj: ["Ward 1"], Duddhi: ["Ward 2"] },
    Sultanpur: { "Sultanpur City": ["Ward 1"], Kadipur: ["Ward 2"] },
    Unnao: { "Unnao City": ["Ward 1"], Safipur: ["Ward 2"] },
    Varanasi: { Sigra: ["Ward 1"], Lanka: ["Ward 2"], Bhelupur: ["Ward 3"] },
  };

  const handleSelect = (item: string) => {
    if (step === 1) {
      setSelectedCity(item);
      setStep(2);
    } else if (step === 2) {
      setSelectedSubCity(item);
      setStep(3);
    } else if (step === 3) {
      onSelect({
        state: "Uttar Pradesh",
        city: selectedCity,
        subCity: selectedSubCity,
        ward: item,
      });
      onClose();
      // Reset after a delay
      setTimeout(() => setStep(1), 500);
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1:
        return "Select City in UP";
      case 2:
        return `Sub-city in ${selectedCity}`;
      case 3:
        return `Select Ward in ${selectedSubCity}`;
      default:
        return "Select Location";
    }
  };

  const getData = () => {
    if (step === 1) return Object.keys(locations);
    if (step === 2) return Object.keys((locations as any)[selectedCity] || {});
    if (step === 3)
      return (locations as any)[selectedCity][selectedSubCity] || [];
    return [];
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <Pressable style={styles.flex} onPress={onClose} />
        <FadeInView style={styles.modalContent}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>{getTitle()}</Text>
            {step > 1 && (
              <Pressable onPress={() => setStep(step - 1)}>
                <Text style={styles.backButton}>← Back</Text>
              </Pressable>
            )}
          </View>

          <FlatList
            data={getData()}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                style={styles.listItem}
              >
                <Text style={styles.itemText}>{item}</Text>
                <Text style={styles.itemArrow}>›</Text>
              </Pressable>
            )}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.empty}>No locations found</Text>
            }
          />
        </FadeInView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    height: SCREEN_HEIGHT * 0.7,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  backButton: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  itemArrow: {
    fontSize: 22,
    color: Colors.textMuted,
  },
  empty: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.textMuted,
    fontSize: 15,
  },
});

export default LocationPicker;
