//   LOGIN PAGE TO DASHBOARD
  const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    window.location.href = "/dashboard";
  });
}

function loginUser() {
    alert("User login logic can be added later");
}

function loginAdmin() {
    fetch("http://127.0.0.1:5000/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => {
        if(res.ok){
            window.location.href = "admin.html";
        } else {
            alert("Invalid Admin Credentials");
        }
    });
}