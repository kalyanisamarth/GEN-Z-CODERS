from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
import razorpay
# 🔥 Firebase imports
import firebase_admin
from firebase_admin import credentials, firestore
app = Flask(__name__)
CORS(app)

# 🔥 Firebase init (using existing firebase_key.json)
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Start page
@app.route("/")
def start():
    return render_template("start.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        return redirect(url_for("dashboard"))
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)