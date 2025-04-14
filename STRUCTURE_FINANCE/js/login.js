    function myFunction() {
        let username = document.getElementById("username").value.trim();
        let password = document.getElementById("password").value;
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let errorpass = document.getElementById("errorpass");
        let erroremail = document.getElementById("erroremail");
        erroremail.innerHTML = "";
        errorpass.innerHTML = "";
        let flag = true;
        let user = users.find(
            (user) => user.username === username && user.password === password
        );
        if (user) {
            showSnackbar("Đăng nhập thành công!","#4CAF50");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            errorpass.innerHTML = "Sai tài khoản hoặc mật khẩu!";
            errorpass.style.color = "red";
            flag = false;
        }
    }
function showSnackbar(message,color) {
    let x = document.getElementById("snackbar");
    x.className = "show";
    x.innerHTML = message;
    x.style.backgroundColor = color;
}