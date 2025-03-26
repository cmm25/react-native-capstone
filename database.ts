import * as SQLite from "expo-sqlite";

export interface MenuItem {
  id?: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

type SQLResultSetRowList<T> = {
  _array: T[];
};

type SQLResultSet<T> = {
  rows: SQLResultSetRowList<T>;
};

const db: SQLite.Database = SQLite.openDatabase("little_lemon");


const selectAllMenu = (): Promise<MenuItem[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      try {
        // Create table if it doesn't exist
        tx.executeSql(
          `
          CREATE TABLE IF NOT EXISTS menu (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              price NUMERIC NOT NULL,
              description TEXT NOT NULL,
              image TEXT NOT NULL,
              category TEXT NOT NULL
          );
          `
        );

        tx.executeSql(
          "select * from menu",
          [],
          (_, resultSet: SQLResultSet<MenuItem>) => {
            const menu = resultSet.rows._array;
            resolve(menu);
          }
        );
      } catch (error) {
        console.error("ERROR GETTING MENU", error);
        reject(error);
      }
    });
  });
};

const getDataFromApiAsync = async (): Promise<MenuItem[]> => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
    );
    const json = (await response.json()) as { menu: MenuItem[] };
    return json.menu;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertDish = (
  dishName: string,
  description: string,
  price: number,
  photoUri: string,
  category: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into menu (name,price,description,image,category) values (?,?,?,?,?)",
          [dishName, price, description, photoUri, category]
        );
      },
      (error) => {
        reject(error);
      },
      () => {
        resolve();
      }
    );
  });
};

const resetDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      db.transaction(
        (tx) => {
          tx.executeSql("DROP TABLE IF EXISTS menu");
        },
        (error) => {
          reject(error);
        },
        () => {
          resolve();
        }
      );
    } catch (error) {
      console.error("Error Resetting database", error);
      reject(error);
    }
  });
};

const checkMenuTableAndPopulateData = async (): Promise<MenuItem[]> => {
  const dbMenu = await selectAllMenu();
  if (dbMenu?.length) return dbMenu;
  const menuItemsFromApi = await getDataFromApiAsync();

  const formattedItemsFromApi = menuItemsFromApi.map((item) => ({
    ...item,
    image: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`,
  }));
  for (const item of formattedItemsFromApi) {
    await insertDish(
      item.name,
      item.description,
      item.price,
      item.image,
      item.category
    );
  }
  const menuItems = await selectAllMenu();
  return menuItems;
};

const filterMenuItems = (
  categories: string[],
  searchInput: string
): Promise<MenuItem[]> => {
  return new Promise((resolve, reject) => {
    try {
      const queryArray: string[] = [];
      if (searchInput.length) {
        queryArray.push(`LOWER(name) LIKE '%${searchInput.toLowerCase()}%'`);
      }
      if (categories.length) {
        for (const category of categories) {
          queryArray.push(`category='${category.toLowerCase()}'`);
        }
      }
      const queryString = queryArray.length
        ? "where " + queryArray.join(" AND ")
        : "";
      const finalQuery = `select * from menu ${queryString};`;
      db.transaction(
        (tx) => {
          tx.executeSql(
            finalQuery,
            [],
            (_, resultSet: SQLResultSet<MenuItem>) => {
              const menu = resultSet.rows._array;
              resolve(menu);
            }
          );
        },
        (e) => {
          console.error("ERROR FILTERING", e);
          reject(e);
        }
      );
    } catch (error) {
      console.error("Error filtering menu items", error);
      reject(error);
    }
  });
};

export {
  filterMenuItems,
  selectAllMenu,
  insertDish,
  checkMenuTableAndPopulateData,
  getDataFromApiAsync,
  resetDatabase,
};
