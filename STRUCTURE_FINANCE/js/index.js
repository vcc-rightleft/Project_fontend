function logout() {
    let confirmout = confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmout) {
        window.location.href = "login.html";
    } else {
        document.getElementById("select").value = "user";
    }
}
function closeModal() {
    document.getElementById("confirmModal").style.display = "none";
    document.getElementById("select").value = "";
}
function monthChange() {
    let month = document.getElementById("month").value.trim();
    let saveMoney = JSON.parse(localStorage.getItem("saveMoney")) || [];
    let existing = saveMoney.find((item) => item.month === month);
    if (existing) {
        document.getElementById("balance").innerHTML = `${existing.money} VND`;
    } else {
        document.getElementById("money").value = "";
        document.getElementById("balance").innerHTML = "0 VND";
    }
    render();
    updateCategorySelect();
    renderhis();
}
function save_money() {
    let money = document.getElementById("money").value.trim();
    let month = document.getElementById("month").value.trim();
    let saveMoney = JSON.parse(localStorage.getItem("saveMoney")) || [];
    if (money < 0 || money === "") {
        document.getElementById("bug").innerHTML = "🚫Số tiền không hợp lệ!!!";
        return;
    }
    let existingIndex = saveMoney.findIndex((item) => item.month === month);
    if (existingIndex !== -1) {
        saveMoney[existingIndex].money = money;
        document.getElementById("bug").innerHTML = "✅ Đã cập nhật số tiền.";
    } else {
        let id = saveMoney.length > 0 ? saveMoney[saveMoney.length - 1].id + 1 : 1;
        let newsaveMoney = {
        money: money,
        month: month,
        id: id,
        };
        saveMoney.push(newsaveMoney);
        document.getElementById("bug").innerHTML =
        "✅ Đã thêm mới số tiền cho tháng này.";
    }
    document.getElementById("balance").innerHTML = `${money} VND`;
    localStorage.setItem("saveMoney", JSON.stringify(saveMoney));
    document.getElementById("money").value = "";
    renderMonthlyStats();
}
function addButton() {
    let contentMoney = document.getElementById("contentMoney").value.trim();
    let month = document.getElementById("month").value.trim();
    let name = document.getElementById("name").value.trim();
    if (contentMoney === "" || parseInt(contentMoney) < 0) {
        document.getElementById("bugContentMoney").innerHTML =
        "🚫Số tiền không hợp lệ!!!";
        return;
    }
    let saveMoney = JSON.parse(localStorage.getItem("saveMoney")) || [];
    let saveIndex = saveMoney.findIndex((item) => item.month === month);
    if (saveIndex === -1) {
        document.getElementById("bugContentMoney").innerHTML =
        "🚫 Bạn chưa đặt ngân sách cho tháng này.";
        return;
    }
    let currentMoney = parseInt(saveMoney[saveIndex].money);
    let cost = parseInt(contentMoney);
    let remaining = currentMoney - cost;
    if (remaining < 0) {
        document.getElementById("bugContentMoney").innerHTML =
        "🚫 Số tiền không đủ.";
        return;
    }
    saveMoney[saveIndex].money = remaining.toString();
    localStorage.setItem("saveMoney", JSON.stringify(saveMoney));
    document.getElementById("balance").innerHTML = `${remaining} VND`;
    let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [];
    let id =
        monthCategory.length === 0
        ? 1
        : monthCategory[monthCategory.length - 1].categories[0].id + 1;
    let newCategory = {
        id: id,
        month: month,
        categories: [{ id: id, name: name, contentMoney: contentMoney }],
        amount: currentMoney,
    };
    monthCategory.push(newCategory);
    localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
    render();
    updateCategorySelect();
    document.getElementById("bugContentMoney").innerHTML = "";
    document.getElementById("contentMoney").value = "";
    document.getElementById("name").value = "";
    }
function render() {
    let month = document.getElementById("month").value.trim();
    let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [];
    let filtered = monthCategory.filter((item) => item.month === month);
    let str = "";
    for (let i = 0; i < filtered.length; i++) {
        str += `<p class="list-item">
                ${filtered[i].categories[0].name} - Giới hạn: ${filtered[i].categories[0].contentMoney} VND
                <span>
                    <button class="button_edit" onclick="button_edit(${filtered[i].categories[0].id})">Sửa</button>
                    <button onclick="button_delete(${filtered[i].categories[0].id})" class="button_delete">Xóa</button>
                </span>
            </p>`;
    }

    document.getElementById("list").innerHTML = str;
    }
    let currentEditId = null;
    function button_edit(id) {
    currentEditId = id;
    document.getElementById("editForm").style.display = "block";
    document.getElementById("bugContentMoney").innerHTML = "";
    }
function submitEdit() {
    let name = document.getElementById("editName").value.trim();
    let money = parseInt(document.getElementById("editMoney").value.trim());
    let month = document.getElementById("month").value.trim();
    let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [];
    let index = monthCategory.findIndex(
        (item) => item.categories[0].id === currentEditId && item.month === month
    );
    if (index === -1) {
        document.getElementById("bugContentMoney").innerHTML =
        "Không tìm thấy mục cần sửa!!!";
        return;
    }
    if (!name) {
        alert("Tên không hợp lệ.");
        return;
    }
    if (isNaN(money) || money < 0) {
        alert("Số tiền không hợp lệ.");
        return;
    }
    let oldMoney = parseInt(monthCategory[index].categories[0].contentMoney);
    let delta = money - oldMoney;
    let saveMoney = JSON.parse(localStorage.getItem("saveMoney")) || [];
    let saveIndex = saveMoney.findIndex((item) => item.month === month);
    if (saveIndex === -1) {
        document.getElementById("bugContentMoney").innerHTML =
        "Không tìm thấy số dư của tháng này.";
        return;
    }
    let currentMoney = parseInt(saveMoney[saveIndex].money);
    let updatedMoney = currentMoney - delta;
    if (updatedMoney < 0) {
        document.getElementById("bugContentMoney").innerHTML =
        "Số tiền trong ví không đủ.";
        return;
    }
    saveMoney[saveIndex].money = updatedMoney.toString();
    localStorage.setItem("saveMoney", JSON.stringify(saveMoney));
    document.getElementById("balance").innerHTML = `${updatedMoney} VND`;
    monthCategory[index].categories[0].name = name;
    monthCategory[index].categories[0].contentMoney = money.toString();
    localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
    document.getElementById("bugContentMoney").innerHTML =
        "✅ Đã cập nhật danh mục.";
    document.getElementById("editForm").style.display = "none";
    document.getElementById("editName").value = "";
    document.getElementById("editMoney").value = "";
    render();
}
function cancelEdit() {
    document.getElementById("editForm").style.display = "none";
    document.getElementById("editName").value = "";
    document.getElementById("editMoney").value = "";
    document.getElementById("bugContentMoney").innerHTML = "❌ Đã huỷ chỉnh sửa.";
    currentEditId = null;
    }
    function button_delete(id) {
    let month = document.getElementById("month").value.trim();
    let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [];
    let index = monthCategory.findIndex(
        (item) => item.categories[0].id === id && item.month === month
    );
    if (index === -1) {
        document.getElementById("bugContentMoney").innerHTML =
        "Không tìm thấy mục cần xóa!!!";
        return;
    }
    let confirmDelete = confirm("Bạn có chắc chắn muốn xóa mục này không?");
    if (!confirmDelete) {
        document.getElementById("bugContentMoney").innerHTML =
        "Đã hủy xóa mục này.";
        return;
    }
    let deletedAmount = parseInt(monthCategory[index].categories[0].contentMoney);
    let saveMoney = JSON.parse(localStorage.getItem("saveMoney")) || [];
    let saveIndex = saveMoney.findIndex((item) => item.month === month);
    if (saveIndex !== -1) {
        let currentBalance = parseInt(saveMoney[saveIndex].money);
        let updatedBalance = currentBalance + deletedAmount;
        saveMoney[saveIndex].money = updatedBalance.toString();
        localStorage.setItem("saveMoney", JSON.stringify(saveMoney));
        document.getElementById("balance").innerHTML = `${updatedBalance} VND`;
    }
    monthCategory.splice(index, 1);
    localStorage.setItem("monthCategory", JSON.stringify(monthCategory));
    render();
    updateCategorySelect();
}
function add_money() {
    let addMoney = document.getElementById("addMoney").value.trim();
    let addBugget = document.getElementById("addBugget").value.trim();
    let addcontent = document.getElementById("addcontent").value.trim();
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let month = document.getElementById("month").value.trim();
    let id = 0;
    if (addBugget == "" || addMoney == "" || addcontent == "") {
        let bug = document.getElementById("bughis");
        bug.innerHTML = "🚫Thông tin không được bỏ trống!!!";
        bug.style.color = "red";
        return;
    }
    if (addMoney < 0) {
        let bug = document.getElementById("bughis");
        bug.innerHTML = "🚫Số tiền không hợp lệ";
        bug.style.color = "red";
        return;
    }
    if (transactions.length == 0) {
        id = 1;
    } else {
        id = transactions[transactions.length - 1].id + 1;
    }
    let newtransactions = {
        id: id,
        contentMoney: addBugget,
        money: addMoney,
        notes: addcontent,
        month: month,
    };
    transactions.push(newtransactions);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    document.getElementById("bughis").innerHTML = "";
    document.getElementById("addMoney").value = "";
    document.getElementById("addBugget").value = "";
    document.getElementById("addcontent").value = "";
    renderhis();
    renderMonthlyStats();
    loadSavedStats();
}
function renderhis(sortBy = "default", searchText = "") {
    let month = document.getElementById("month").value.trim();
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [];
    transactions = transactions.filter((item) => item.month === month);
    let categoryLimits = {};
    monthCategory.forEach((item) => {
        if (item.month === month && item.categories[0]) {
        let name = item.categories[0].name;
        categoryLimits[name] = parseInt(item.categories[0].contentMoney);
        }
    });
    let categorySpent = {};
    transactions.forEach((item) => {
        if (!categorySpent[item.contentMoney]) {
        categorySpent[item.contentMoney] = 0;
        }
        categorySpent[item.contentMoney] += parseInt(item.money);
    });
    if (searchText !== "") {
        transactions = transactions.filter(
        (item) =>
            item.notes.toLowerCase().includes(searchText.toLowerCase()) ||
            item.contentMoney.toLowerCase().includes(searchText.toLowerCase())
        );
    }
    if (sortBy === "asc") {
        transactions.sort((a, b) => parseInt(a.money) - parseInt(b.money));
    } else if (sortBy === "desc") {
        transactions.sort((a, b) => parseInt(b.money) - parseInt(a.money));
    }
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTransactions = transactions.slice(startIndex, endIndex);
    let str = "";
    for (let i = 0; i < currentTransactions.length; i++) {
        let t = currentTransactions[i];
        str += `<p class="list">
                ${t.contentMoney} - ${t.notes}: ${t.money} VND 
                <button class="button_his" onclick="deleteTransaction(${t.id})">Xóa</button>
            </p><br>`;
    }
    document.getElementById("list_his").innerHTML = str;
    let warnings = [];
    for (let name in categoryLimits) {
        if (categorySpent[name] && categorySpent[name] > categoryLimits[name]) {
        warnings.push(
            `⚠️ Danh mục "${name}" đã vượt giới hạn: ${categorySpent[name]} / ${categoryLimits[name]} VND`
        );
        }
    }
    document.getElementById("catalogue").innerHTML =
        warnings.length > 0
        ? warnings.map((w) => `<p style="color:red">${w}</p>`).join("")
        : "";
    let paginationStr = "";
    if (totalPages > 1) {
        paginationStr += `<button onclick="changePage(${currentPage - 1})" ${
        currentPage === 1 ? "disabled" : ""
        }>Previous</button>`;
        for (let i = 1; i <= totalPages; i++) {
        paginationStr += `<button onclick="changePage(${i})" class="${
            i === currentPage ? "active-page" : ""
        }">${i}</button>`;
        }
        paginationStr += `<button onclick="changePage(${currentPage + 1})" ${
        currentPage === totalPages ? "disabled" : ""
        }>Next</button>`;
    }
    document.getElementById("paginationControls").innerHTML = paginationStr;
    }
    let currentSearchText = "";
function searchTransaction() {
    currentSearchText = document.getElementById("searchInput").value.trim();
    renderhis(isAscending ? "asc" : "desc", currentSearchText);
    }
function changePage(page) {
    currentPage = page;
    renderhis(isAscending ? "asc" : "desc", currentSearchText);
    }
function updateCategorySelect() {
    let month = document.getElementById("month").value.trim();
    let monthCategory = JSON.parse(localStorage.getItem("monthCategory")) || [];
    let filtered = monthCategory.filter((item) => item.month === month);
    let select = document.getElementById("addBugget");
    select.innerHTML = "";
    if (filtered.length === 0) {
        select.innerHTML = `<option disabled selected>Không có danh mục</option>`;
        return;
    }
    let defaultOption = document.createElement("option");
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = "-- Chọn danh mục --";
    select.appendChild(defaultOption);
    filtered.forEach((item) => {
        if (item.categories && item.categories[0]) {
        let option = document.createElement("option");
        option.value = item.categories[0].name;
        option.textContent = item.categories[0].name;
        select.appendChild(option);
        }
    });
}
function deleteTransaction(id) {
    let confirmDelete = confirm("Bạn có chắc chắn xóa mục này không?");
    if (!confirmDelete) return;
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions = transactions.filter((item) => item.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    renderhis(isAscending ? "asc" : "desc", currentSearchText);
    }
    let isAscending = true;
function toggleSortOrder() {
    if (isAscending) {
        renderhis("asc");
        document.getElementById("sortIcon").className = "fa-solid fa-up-long";
    } else {
        renderhis("desc");
        document.getElementById("sortIcon").className = "fa-solid fa-down-long";
    }
    isAscending = !isAscending;
    renderMonthlyStats();
}
let currentPage = 1;
const itemsPerPage = 5;
function renderMonthlyStats() {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const saveMoney = JSON.parse(localStorage.getItem("saveMoney")) || [];
    const months = new Set();
    const spending = {};
    const monthlyStats = [];
    transactions.forEach((t) => {
        spending[t.month] = (spending[t.month] || 0) + parseInt(t.money);
        months.add(t.month);
    });
    saveMoney.forEach((s) => months.add(s.month));
    const tbody = document.getElementById("statsBody");
    tbody.innerHTML = "";
    [...months].sort().forEach((month) => {
        const spent = spending[month] || 0;
        const budget = parseInt(
        (saveMoney.find((s) => s.month === month) || {}).money || 0
        );
        const isExceeded = spent > budget;
        tbody.innerHTML += `
                <tr>
                    <td>${month}</td>
                    <td>${spent.toLocaleString()} VND</td>
                    <td>${budget.toLocaleString()} VND</td>
                    <td style="color: ${isExceeded ? "red" : "green"};">
                        ${isExceeded ? "❌ Vượt" : "✅ Đạt"}
                    </td>
                </tr>
            `;
        monthlyStats.push({
        month: month,
        spent: spent,
        budget: budget,
        status: isExceeded ? "Vượt" : "Đạt",
        });
    });
    localStorage.setItem("monthlyStats", JSON.stringify(monthlyStats));
    }
function loadSavedStats() {
    const stats = JSON.parse(localStorage.getItem("monthlyStats")) || [];
    const tbody = document.getElementById("statsBody");
    tbody.innerHTML = "";
    stats.forEach((stat) => {
        const isExceeded = stat.status === "✅ Đạt";
        tbody.innerHTML += `
                <tr>
                    <td>${stat.month}</td>
                    <td>${stat.spent.toLocaleString()} VND</td>
                    <td>${stat.budget.toLocaleString()} VND</td>
                    <td style="color: ${isExceeded ? "red" : "green"};">
                        ${isExceeded ? "❌ Vượt" : "✅ Đạt"}
                    </td>
                </tr>
            `;
    });
}
window.onload = function () {
    loadSavedStats();
};
