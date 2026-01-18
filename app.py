from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
import razorpay
app = Flask(__name__)
CORS(app)

# Start page
@app.route("/")
def start():
    return render_template("start.html")

# Login page
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # later you can add Firebase auth here
        return redirect(url_for("dashboard"))
    return render_template("login.html")

# Dashboard page
@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")
    
if __name__ == "__main__":
    app.run(debug=True)
