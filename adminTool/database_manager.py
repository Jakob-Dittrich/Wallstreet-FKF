import sqlite3

DATABASE_NAME = "../database/wallstreet-database.db"

def create_connection():
    """Create a database connection to the SQLite database."""
    conn = None
    try:
        conn = sqlite3.connect(DATABASE_NAME)
    except sqlite3.Error as e:
        print(e)
    return conn

def create_table(create_table_sql):
    """Create a table from the create_table_sql statement."""
    try:
        conn = create_connection()
        if conn is not None:
            c = conn.cursor()
            c.execute(create_table_sql)
            conn.commit()
            conn.close()
        else:
            print("Error! Cannot create the database connection.")
    except sqlite3.Error as e:
        print(e)

def insert_data(table, data):
    """Insert data into the table."""
    try:
        conn = create_connection()
        if conn is not None:
            c = conn.cursor()
            c.execute(f"INSERT INTO {table} VALUES ({', '.join('?' * len(data))})", data)
            conn.commit()
            conn.close()
        else:
            print("Error! Cannot create the database connection.")
    except sqlite3.Error as e:
        print(e)

def query_data(query):
    """Query data from the database."""
    try:
        conn = create_connection()
        if conn is not None:
            c = conn.cursor()
            c.execute(query)
            results = c.fetchall()
            conn.close()
            return results
        else:
            print("Error! Cannot create the database connection.")
    except sqlite3.Error as e:
        print(e)
        return []

def update_drink(id, name, price, oldPrice, newPrice, drinkGroup):
    """Update a drink in the database."""
    sql = ''' UPDATE drinks
              SET name = ? ,
                  price = ? ,
                  oldPrice = ? ,
                  newPrice = ? ,
                  drinkGroupId = ?
              WHERE id = ?'''
    try:
        conn = create_connection()
        if conn is not None:
            c = conn.cursor()
            c.execute(sql, (name, price, oldPrice, newPrice, drinkGroup, id))
            conn.commit()
            conn.close()
        else:
            print("Error! Cannot create the database connection.")
    except sqlite3.Error as e:
        print(e)

