/* -----------------------------------------------------------
           1. INITIALIZE MAP (Leaflet)
        ----------------------------------------------------------- */
        const map = L.map('live-map').setView([19.0760, 72.8777], 15); // Default to Mumbai coords

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Add parking marker
        L.marker([19.0760, 72.8777]).addTo(map)
            .bindPopup('<b>ParkSense Central</b><br>50 Slots Available')
            .openPopup();

        /* -----------------------------------------------------------
           2. GENERATE SLOTS
        ----------------------------------------------------------- */
        const grid = document.getElementById('grid');
        const slots = [
            {id: 'A-01', status: 'available'}, {id: 'A-02', status: 'occupied'},
            {id: 'A-03', status: 'available'}, {id: 'A-04', status: 'available'},
            {id: 'A-05', status: 'reserved'},  {id: 'A-06', status: 'occupied'},
            {id: 'A-07', status: 'available'}, {id: 'A-08', status: 'occupied'},
        ];

        slots.forEach(slot => {
            const div = document.createElement('div');
            div.className = `slot ${slot.status}`;
            div.innerHTML = `
                <span class="slot-id">${slot.id}</span>
                ${slot.status === 'occupied' ? '<i class="fa-solid fa-car-side" style="font-size:2rem; color: var(--danger)"></i>' : ''}
                ${slot.status === 'reserved' ? '<i class="fa-solid fa-lock" style="font-size:1.5rem; color: var(--warning)"></i>' : ''}
                ${slot.status === 'available' ? '<div style="color:var(--success); font-weight:bold;">Free</div>' : ''}
            `;
            if(slot.status === 'available') {
                div.onclick = () => openBooking(slot.id);
            }
            grid.appendChild(div);
        });

        /* -----------------------------------------------------------
           3. BOOKING LOGIC
        ----------------------------------------------------------- */
        let currentSlot = '';

        function openBooking(slotId) {
            currentSlot = slotId;
            document.getElementById('selectedSlot').innerText = slotId;
            document.getElementById('bookingModal').classList.add('active');
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }

        /* -----------------------------------------------------------
           4. RAZORPAY INTEGRATION & RECEIPT
        ----------------------------------------------------------- */
        function initiateRazorpay(e) {
            e.preventDefault();
            
            const amount = document.getElementById('durationSelect').value;
            
            var options = {
                "key": "rzp_test_Qb9FJurfVY6ULB", // YOUR API ID
                "amount": amount * 100, // Amount in paise
                "currency": "INR",
                "name": "ParkSense",
                "description": "Parking Fee for " + currentSlot,
                "image": "https://cdn-icons-png.flaticon.com/512/3063/3063823.png",
                "handler": function (response){
                    // Payment Successful
                    handleSuccess(response.razorpay_payment_id, amount);
                },
                "prefill": {
                    "name": "Guest User",
                    "email": "user@parksense.com",
                    "contact": "9999999999"
                },
                "theme": {
                    "color": "#06b6d4"
                }
            };
            
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response){
                alert("Payment Failed: " + response.error.description);
            });
            rzp1.open();
        }

         //----------After Success
            function sendDataToBackend(paymentId) {
  fetch("http://127.0.0.1:5000/save-booking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("username").value,
      mobile: document.getElementById("mobile").value,
      receipt_id: paymentId
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Backend response:", data);
  })
  .catch(err => {
    console.error("Error:", err);
  });
}


        function handleSuccess(paymentId, amount) {
            // 1. Close Booking Modal
            closeModal('bookingModal');

            // 2. Mark Slot as Reserved (Visual update only for demo)
            const slotEls = document.querySelectorAll('.slot-id');
            slotEls.forEach(el => {
                if(el.innerText === currentSlot) {
                    el.parentElement.className = 'slot reserved';
                    el.parentElement.innerHTML = `<span class="slot-id">${currentSlot}</span><i class="fa-solid fa-check" style="color:white; font-size:2rem;"></i>`;
                    el.parentElement.onclick = null;
                }
            });

           
            // 3. Generate QR Code URL using API
            // We append the Payment ID to the URL so the QR is unique
            const qrData = `ParkSense_Rcpt_${currentSlot}_${paymentId}`;
            const qrUrl = `https://qrtag.net/api/qr_4.png?url=${qrData}`;

            // 4. Populate Receipt Modal
            document.getElementById('receiptSlot').innerText = currentSlot;
            document.getElementById('receiptAmount').innerText = "₹" + amount;
            document.getElementById('receiptId').innerText = paymentId;
            document.getElementById('dynamicQR').src = qrUrl;

            // 5. Show Receipt
            document.getElementById('receiptModal').classList.add('active');
        }

        // Scroll Navbar Effect
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if(window.scrollY > 50) nav.classList.add('scrolled');
            else nav.classList.remove('scrolled');
        });


        // ------------ Chatbot -------------------
const chatToggle = document.getElementById("chatToggle");
const chatbot = document.getElementById("chatbot");

chatToggle.addEventListener("click", () => {
  chatbot.style.display =
    chatbot.style.display === "none" ? "block" : "none";
});


