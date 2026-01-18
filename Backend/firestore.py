import firebase_admin
from firebase_admin import credentials, firestore

# Firebase initialize (sirf 1 baar)
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_key.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()


# 🔹 1. Verify user (login)
def verify_user(email, password):
    users = db.collection("users").where("email", "==", email).limit(1).get()
    for user in users:
        data = user.to_dict()
        if data.get("password") == password:
            return data
    return None
# 2️⃣ BOOK SLOT  🔥🔥 (YAHI ADD KARNA HAI)
def book_slot(user_id, location, date, time, slot):
    doc = db.collection("bookings").document()
    doc.set({
        "user_id": user_id,
        "location": location,
        "date": date,
        "time": time,
        "slot": slot,
        "status": "pending"
    })
    return doc.id


# 🔹 2. Get pending bookings
def get_pending_bookings(user_id):
    bookings = db.collection("bookings") \
        .where("user_id", "==", user_id) \
        .where("status", "==", "pending") \
        .get()

    return [b.to_dict() for b in bookings]
# 🔹 3. Update booking status
def update_booking_status(booking_id, status):
    db.collection("bookings").document(booking_id).update({
        "status": status
    })


# 🔹 4. Get booking status (optional but useful)
def get_booking_status(booking_id):
    doc = db.collection("bookings").document(booking_id).get()
    if doc.exists:
        return doc.to_dict().get("status")
    return None
# 5. Get full booking details
def get_booking(booking_id):
    doc = db.collection("bookings").document(booking_id).get()
    if doc.exists:
        data = doc.to_dict()
        data["id"] = booking_id
        return data
    return None