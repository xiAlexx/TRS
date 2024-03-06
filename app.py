# app.py

from flask import Flask, render_template, request

app = Flask(__name__)

# Sample reservation data (replace with your database logic)
reservations = [
    {"table_id": 1, "date": "2024-03-10", "time": "14:00", "guests": 4},
    # Add more reservation entries
]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/reservations", methods=["GET"])
def get_reservations():
    # Return reservation data as JSON
    return {"reservations": reservations}

if __name__ == "__main__":
    app.run(debug=True)
