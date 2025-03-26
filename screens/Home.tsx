import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "../constants/Colors";
import { filterMenuItems, selectAllMenu } from "../database";
import debounce from "../utils/debounce";
import HeroSection from "../components/Hero";

interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

interface HomeScreenProps {
  navigation: any; // Replace with the proper type if using React Navigation types
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);

  const loadMenu = async (): Promise<void> => {
    try {
      const menuItemsData: MenuItem[] = await selectAllMenu();
      setMenuItems(menuItemsData);
      // Dynamically populate filter categories from menu items.
      setFilterCategories([
        ...new Set(
          menuItemsData?.map((i: MenuItem) =>
            i.category
              ? i.category.charAt(0).toUpperCase() + i.category.slice(1)
              : ""
          )
        ),
      ]);
    } catch (err) {
      console.error(`There was an error selecting all menu items: ${err}`);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const onFilterClick = (item: string): void => {
    const indexOfItem = activeFilters.indexOf(item);
    if (indexOfItem > -1) {
      const newActiveFilters = activeFilters.filter(
        (_, index) => index !== indexOfItem
      );
      setActiveFilters(newActiveFilters);
    } else {
      setActiveFilters((prev) => [...prev, item]);
    }
  };

  const filterMenu = (): void => {
    filterMenuItems(activeFilters, searchInput).then(setMenuItems);
  };

  useEffect(() => {
    const debouncedFilterMenu = debounce(filterMenu, 500);
    debouncedFilterMenu();
  }, [searchInput]);

  useEffect(() => {
    filterMenu();
  }, [activeFilters]);

  return (
    <View style={styles.homeContainer}>
      <HeroSection setSearchInput={setSearchInput} />
      {/* FILTER SECTION */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>ORDER FOR DELIVERY!</Text>
        <ScrollView style={styles.filterScrollView} horizontal>
          {filterCategories.map((item, index) => {
            const isSelected = activeFilters.indexOf(item) > -1;
            return (
              <Pressable
                style={{
                  ...styles.filterButton,
                  backgroundColor: isSelected ? colors.GREEN : colors.GRAY,
                }}
                key={index}
                onPress={() => onFilterClick(item)}
              >
                <Text
                  style={{
                    ...styles.filterButtonText,
                    color: isSelected ? colors.GRAY : colors.GREEN,
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {/* MENU */}
      <FlatList
        data={menuItems}
        renderItem={({ item }) => (
          <View style={styles.menuItem}>
            <View style={styles.menuDetails}>
              <Text style={styles.itemTitle}>{item.name}</Text>
              <Text numberOfLines={2} style={styles.itemDescription}>
                {item.description}
              </Text>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <View style={styles.itemImageContainer}>
              <Image source={{ uri: item.image }} style={styles.menuImage} />
            </View>
          </View>
        )}
        keyExtractor={(item, index) => item.name + index.toString()}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 0.5,
              width: "90%",
              backgroundColor: "grey",
              alignSelf: "center",
            }}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: "white",
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  filtersContainer: {
    padding: 20,
    paddingRight: -20,
    borderBottomColor: colors.BLACK,
  },
  filterTitle: {
    fontWeight: "900",
  },
  filterScrollView: { marginTop: 20, display: "flex" },
  filterButton: {
    color: colors.BLACK,
    borderRadius: 10,
    marginRight: 12,
  },
  filterButtonText: {
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  menuItem: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 5,
  },
  menuDetails: { flex: 1, gap: 10 },
  itemTitle: { fontWeight: "bold" },
  itemDescription: {
    color: colors.BLACK,
    fontWeight: "500",
  },
  itemPrice: { fontWeight: "500" },
  itemImageContainer: { width: 100, height: 100, backgroundColor: "black" },
  menuImage: {
    resizeMode: "cover",
    width: 100,
    height: 100,
  },
});
