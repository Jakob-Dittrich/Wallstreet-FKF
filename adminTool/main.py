import tkinter as tk
from tkinter import messagebox
from tkinter import simpledialog
from tkinter import ttk
import database_manager as db
def open_drinks_window():
    window = tk.Toplevel()
    window.title("Drinks")
    
    # Define the columns
    columns = ('id', 'name', 'price', 'oldPrice', 'newPrice', 'drinkGroupId')
    tree = ttk.Treeview(window, columns=columns, show='headings')

    # Define the column headings
    for col in columns:
        tree.heading(col, text=col.capitalize())
        tree.column(col, width=100, anchor="w")

    # Insert data into the treeview
    drinks = db.query_data("SELECT * FROM drinks")
    for drink in drinks:
        tree.insert('', 'end', values=drink)

    # Place the treeview in the window
    tree.pack(side='top', fill='both', expand=True)

app = tk.Tk()
app.title("My App")
app.geometry("800x400")

open_button = tk.Button(app, text="Open Drinks Window", command=open_drinks_window)
open_button.pack(pady=20)

app.mainloop()