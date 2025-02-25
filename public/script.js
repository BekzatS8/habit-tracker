const API_URL = "https://habit-tracker-s8j1.onrender.com/api";  

// 🔹 Функция загрузки привычек
async function loadHabits() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`${API_URL}/habits`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const habits = await res.json();
    const list = document.getElementById("habit-list");
    list.innerHTML = "";

    habits.forEach(habit => {
        const template = document.getElementById("habit-template").content.cloneNode(true);
        const li = template.querySelector("li");
        li.dataset.id = habit._id;
        li.querySelector(".habit-text").textContent = `${habit.name} - ${habit.description}`;
        
        // 🔹 Кнопка редактирования
        li.querySelector(".edit-btn").addEventListener("click", () => editHabit(habit));

        // 🔹 Кнопка удаления
        li.querySelector(".delete-btn").addEventListener("click", () => deleteHabit(habit._id));

        list.appendChild(li);
    });
}

// 🔹 Функция создания привычки
async function createHabit() {
    const name = document.getElementById("habit-name").value;
    const description = document.getElementById("habit-desc").value;
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/habits`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
    });

    loadHabits(); // Перезагружаем список
}

// 🔹 Функция редактирования привычки
async function editHabit(habit) {
    const newName = prompt("Введите новое название", habit.name);
    const newDesc = prompt("Введите новое описание", habit.description);
    if (!newName || !newDesc) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/habits/${habit._id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName, description: newDesc })
    });

    loadHabits();
}

// 🔹 Функция удаления привычки
async function deleteHabit(habitId) {
    if (!confirm("Вы уверены, что хотите удалить эту привычку?")) return;

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/habits/${habitId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    loadHabits();
}

// 🔹 Выход
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Загружаем привычки при загрузке страницы
if (window.location.pathname.includes("dashboard.html")) {
    loadHabits();
}
// 🔹 Функция загрузки привычек с прогрессом
async function loadHabits() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const res = await fetch(`${API_URL}/habits`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const habits = await res.json();
    const list = document.getElementById("habit-list");
    list.innerHTML = "";

    habits.forEach(habit => {
        const template = document.getElementById("habit-template").content.cloneNode(true);
        const li = template.querySelector("li");
        li.dataset.id = habit._id;
        li.querySelector(".habit-text").textContent = `${habit.name} - ${habit.description}`;

        // 🔹 Отмечаем выполнение привычки
        const checkboxes = li.querySelectorAll(".day");
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = habit.weeklyStatus[index];
            checkbox.addEventListener("change", () => updateHabitStatus(habit._id, index, checkbox.checked));
        });

        li.querySelector(".edit-btn").addEventListener("click", () => editHabit(habit));
        li.querySelector(".delete-btn").addEventListener("click", () => deleteHabit(habit._id));

        list.appendChild(li);
    });
}

// 🔹 Обновляем выполнение привычки по дням
async function updateHabitStatus(habitId, dayIndex, status) {
    const token = localStorage.getItem("token");
    
    console.log("Отправляем данные на сервер:", { habitId, dayIndex, status });

    const res = await fetch(`${API_URL}/habits/${habitId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ weeklyStatusIndex: dayIndex, status })
    });

    const data = await res.json();
    console.log("Ответ от сервера:", data);

    if (!res.ok) {
        alert("Ошибка обновления статуса привычки");
    }
}


// Загружаем привычки при загрузке страницы
if (window.location.pathname.includes("dashboard.html")) {
    loadHabits();
}
async function loadChart() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/habits`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const habits = await res.json();
    
    // 🔹 Генерируем данные для графика
    const labels = habits.map(h => h.name);
    const data = habits.map(h => h.weeklyStatus.filter(Boolean).length);

    // 🔹 Создаем график
    const ctx = document.getElementById("habitChart").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Дни выполнения",
                data,
                backgroundColor: "rgba(75, 192, 192, 0.6)"
            }]
        }
    });
}

// 🔹 Загружаем график после загрузки страницы
if (window.location.pathname.includes("dashboard.html")) {
    loadChart();
}
// 🔹 Функция входа пользователя
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        alert("Введите email и пароль!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("role", data.role); // ✅ Сохраняем роль

            console.log("Роль сохранена:", data.role); // Для отладки

            alert("Вход выполнен успешно!");
            window.location.href = "dashboard.html"; // Перенаправление в кабинет
        } else {
            alert(data.message || "Ошибка входа");
        }
    } catch (error) {
        console.error("Ошибка при входе:", error);
        alert("Ошибка соединения с сервером");
    }
}
// 🔹 Регистрация пользователя
async function register() {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    if (!username || !email || !password) {
        alert("Все поля обязательны!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Регистрация успешна! Теперь войдите в аккаунт.");
            window.location.href = "index.html";
        } else {
            alert(data.message || "Ошибка регистрации");
        }
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        alert("Ошибка соединения с сервером");
    }
}
// 🔹 Функция загрузки пользователей для админа
async function loadUsers() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (role !== "admin") {
        alert("У вас нет доступа!");
        window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch(`${API_URL}/admin/users`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Ошибка при загрузке пользователей");

        const users = await res.json();
        const userList = document.getElementById("user-list");
        userList.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user._id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <select onchange="updateUserRole('${user._id}', this.value)">
                        <option value="user" ${user.role === "user" ? "selected" : ""}>User</option>
                        <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteUser('${user._id}')">Удалить</button>
                </td>
            `;
            userList.appendChild(row);
        });

    } catch (error) {
        console.error("Ошибка загрузки пользователей:", error);
    }
}

// 🔹 Функция обновления роли пользователя
async function updateUserRole(userId, newRole) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ role: newRole })
        });

        if (!res.ok) throw new Error("Ошибка при обновлении роли пользователя");

        alert("Роль пользователя обновлена!");
    } catch (error) {
        console.error("Ошибка обновления роли:", error);
    }
}

// 🔹 Функция удаления пользователя
async function deleteUser(userId) {
    const token = localStorage.getItem("token");

    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return;

    try {
        const res = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Ошибка при удалении пользователя");

        alert("Пользователь удален!");
        loadUsers();
    } catch (error) {
        console.error("Ошибка удаления пользователя:", error);
    }
}

// 🔹 Загружаем пользователей при открытии admin.html
if (window.location.pathname.includes("admin.html")) {
    loadUsers();
}
// 🔹 Проверяем роль пользователя при загрузке страницы
function checkUserRole() {
    setTimeout(() => {
        const role = localStorage.getItem("role");

        console.log("Роль пользователя:", role); // Для отладки

        if (role === "admin") {
            document.getElementById("admin-btn").style.display = "block"; // Показываем кнопку "Админ панель"
        }
    }, 500); // Небольшая задержка, чтобы `localStorage` успел загрузиться
}

// 🔹 Функция перехода в админ-панель
function goToAdminPanel() {
    window.location.href = "admin.html";
}

// 🔹 Загружаем роль пользователя при входе на `dashboard.html`
if (window.location.pathname.includes("dashboard.html")) {
    checkUserRole();
}
// 🔹 Функция обновления профиля пользователя
async function updateProfile() {
    const token = localStorage.getItem("token");
    const newUsername = document.getElementById("new-username").value;
    const newEmail = document.getElementById("new-email").value;

    if (!newUsername && !newEmail) {
        alert("Введите новое имя или email!");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/auth/profile`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username: newUsername, email: newEmail })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Профиль успешно обновлен!");
            localStorage.setItem("user", data.user.username);
            localStorage.setItem("email", data.user.email);
        } else {
            alert(data.message || "Ошибка обновления профиля");
        }
    } catch (error) {
        console.error("Ошибка обновления профиля:", error);
        alert("Ошибка соединения с сервером");
    }
}
