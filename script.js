// ==================== API 配置 ====================
// const API_BASE = 'https://huang-lab-storage-system.vercel.app/api';

// ==================== 全局变量和配置 ====================
const STORAGE_KEYS = {
    USERS: 'lab_users',
    PRIMERS: 'lab_primers',
    PLASMIDS: 'lab_plasmids',
    SIRNAS: 'lab_sirnas',
    ANTIBODIES: 'lab_antibodies',
    REAGENTS: 'lab_reagents',
    CURRENT_USER: 'current_user'
};

// ==================== 初始化数据库（只初始化一次）====================
async function initDatabase() {
    // 检查是否已经初始化过
    const initialized = localStorage.getItem('db_initialized');
    if (initialized) return;
    
    try {
        // 调用API初始化数据库表
        const response = await fetch(`${API_BASE}/setup`);
        if (response.ok) {
            localStorage.setItem('db_initialized', 'true');
            console.log('数据库初始化成功');
        }
    } catch (error) {
        console.error('数据库初始化失败:', error);
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initDatabase();
    
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'homepage.html') {
        initHomepage();
    } else if (filename === 'primers.html') {
        initPrimersPage();
    } else if (filename === 'plasmids.html') {
        initPlasmidsPage();
    } else if (filename === 'sirnas.html') {
        initSIRNAsPage();
    } else if (filename === 'antibodies.html') {
        initAntibodiesPage();
    } else if (filename === 'reagents.html') {
        initReagentsPage();
    } else if (filename === 'profile.html') {
        initProfilePage();
    } else if (filename === 'admin-users.html') {
        initAdminUsersPage();
    }
});

// ==================== 登录功能 ====================
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        const messageDiv = document.getElementById('loginMessage');
        
        if (data.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = '登录成功，正在跳转...';
            
            const userSession = {
                id: data.user.id,
                username: data.user.username,
                name: data.user.name,
                email: data.user.email,
                role: data.user.role
            };
            
            if (remember) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userSession));
            } else {
                sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userSession));
            }
            
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 1000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || '用户名或密码错误';
        }
    } catch (error) {
        const messageDiv = document.getElementById('loginMessage');
        messageDiv.className = 'message error';
        messageDiv.textContent = '网络错误，请稍后重试';
    }
    
    return false;
}

// ==================== 注册功能 ====================
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value.trim();
    const name = document.getElementById('reg-name').value.trim() || username;
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    const messageDiv = document.getElementById('registerMessage');
    
    if (password !== confirm) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '两次输入的密码不一致';
        return false;
    }
    
    if (password.length < 6) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '密码长度至少6位';
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    
    if (users.some(u => u.username === username)) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '用户名已存在';
        return false;
    }
    
    const newUser = {
        id: users.length + 1,
        username: username,
        password: password,
        name: name,
        email: email,
        role: 'user',
        registerDate: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    messageDiv.className = 'message success';
    messageDiv.textContent = '注册成功！3秒后跳转到登录页面...';
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
    
    return false;
}

// ==================== 获取当前用户 ====================
function getCurrentUser() {
    let user = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (!user) {
        user = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    }
    return user;
}

// ==================== 检查是否为管理员(luliting) ====================
function isAdmin() {
    const user = getCurrentUser();
    return user && user.username === 'luliting';
}

// ==================== 检查登录状态 ====================
function checkLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// ==================== 退出功能 ====================
function handleLogout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sessionStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    window.location.href = 'index.html';
}

// ==================== 主页初始化 ====================
function initHomepage() {
    const user = checkLogin();
    if (!user) return;
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) {
        userSpan.textContent = `👤 ${user.name}`;
    }
    
    const lastUpdateSpan = document.getElementById('lastUpdate');
    if (lastUpdateSpan) {
        const savedDate = sessionStorage.getItem('lastUpdate');
        lastUpdateSpan.textContent = savedDate || new Date().toLocaleDateString('zh-CN');
    }
    
    updateCardCounts();
    displayUserList();
}

async function updateCardCounts() {
    try {
        const [primers, plasmids, sirnas, antibodies, reagents] = await Promise.all([
            fetch(`${API_BASE}/primers`).then(res => res.json()),
            fetch(`${API_BASE}/plasmids`).then(res => res.json()),
            fetch(`${API_BASE}/sirnas`).then(res => res.json()),
            fetch(`${API_BASE}/antibodies`).then(res => res.json()),
            fetch(`${API_BASE}/reagents`).then(res => res.json())
        ]);
        
        const primerCount = document.getElementById('primer-count');
        const plasmidCount = document.getElementById('plasmid-count');
        const sirnaCount = document.getElementById('sirna-count');
        const antibodyCount = document.getElementById('antibody-count');
        const reagentCount = document.getElementById('reagent-count');
        
        if (primerCount) primerCount.textContent = `📊 总数: ${primers.length}`;
        if (plasmidCount) plasmidCount.textContent = `📊 总数: ${plasmids.length}`;
        if (sirnaCount) sirnaCount.textContent = `📊 总数: ${sirnas.length}`;
        if (antibodyCount) antibodyCount.textContent = `📊 总数: ${antibodies.length}`;
        if (reagentCount) reagentCount.textContent = `📊 总数: ${reagents.length}`;
    } catch (error) {
        console.error('更新计数失败:', error);
    }
}

// ==================== 显示用户名单 ====================
function displayUserList() {
    let userListContainer = document.getElementById('user-list-container');
    
    if (!userListContainer) {
        const mainElement = document.querySelector('.homepage-main');
        if (!mainElement) return;
        
        userListContainer = document.createElement('div');
        userListContainer.id = 'user-list-container';
        userListContainer.className = 'user-list-section';
        userListContainer.innerHTML = `
            <h3>👥 系统用户名单</h3>
            <div id="user-list-content"></div>
        `;
        mainElement.appendChild(userListContainer);
        
        const style = document.createElement('style');
        style.textContent = `
            .user-list-section {
                background: white;
                border-radius: 16px;
                padding: 1.5rem;
                margin-top: 2rem;
                box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            }
            .user-list-section h3 {
                color: #1e3a5f;
                margin-bottom: 1rem;
                font-size: 1.2rem;
                font-weight: 600;
            }
            .user-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 0.8rem;
            }
            .user-card {
                background: #f8fafd;
                border-radius: 10px;
                padding: 0.8rem;
                border: 1px solid #e2e8f0;
                transition: all 0.2s;
            }
            .user-card:hover {
                background: #edf2f7;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .user-name {
                font-weight: 600;
                color: #2b5a8c;
                font-size: 0.95rem;
            }
            .user-username {
                color: #4a5f73;
                font-size: 0.8rem;
                margin-top: 0.2rem;
            }
            .user-email {
                color: #4a5f73;
                font-size: 0.75rem;
                font-family: monospace;
                margin-top: 0.2rem;
                word-break: break-all;
            }
            .user-role {
                display: inline-block;
                margin-top: 0.4rem;
                padding: 0.15rem 0.6rem;
                background: #e2e8f0;
                border-radius: 16px;
                font-size: 0.7rem;
                color: #2d3748;
            }
            .user-role.admin {
                background: #2b5a8c;
                color: white;
            }
            .user-role.user {
                background: #e2e8f0;
                color: #2d3748;
            }
        `;
        document.head.appendChild(style);
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const contentDiv = document.getElementById('user-list-content');
    if (!contentDiv) return;
    
    let html = '<div class="user-grid">';
    users.forEach(user => {
        html += `
            <div class="user-card">
                <div class="user-name">${user.name}</div>
                <div class="user-username">@${user.username}</div>
                <div class="user-email">${user.email}</div>
                <span class="user-role ${user.role}">${user.role === 'admin' ? '管理员' : '普通用户'}</span>
            </div>
        `;
    });
    html += '</div>';
    
    contentDiv.innerHTML = html;
}

// ==================== 引物页面函数 ====================
function initPrimersPage() {
    const user = checkLogin();
    if (!user) return;
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) {
        userSpan.textContent = `👤 ${user.name}`;
    }
    
    const lastUpdateSpan = document.getElementById('lastUpdate');
    if (lastUpdateSpan) {
        const savedDate = sessionStorage.getItem('lastUpdate');
        lastUpdateSpan.textContent = savedDate || new Date().toLocaleDateString('zh-CN');
    }
    
    loadPrimers();
}

async function loadPrimers(page = 1) {
    const tbody = document.getElementById('primer-tbody');
    if (!tbody) return;
    
    try {
        const response = await fetch(`${API_BASE}/primers`);
        const primers = await response.json();
        
        const user = getCurrentUser();
        const admin = isAdmin();
        
        primers.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const pageSize = 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const pageData = primers.slice(start, end);
        
        tbody.innerHTML = '';
        
        pageData.forEach(primer => {
            const row = document.createElement('tr');
            row.setAttribute('onclick', `showPrimerDetail(${primer.id})`);
            
            const canDelete = admin || (primer.synthesizer === user?.name);
            
            row.innerHTML = `
                <td>${primer.id}</td>
                <td><strong>${primer.gene_name}</strong></td>
                <td>${primer.species}</td>
                <td>${primer.usage}</td>
                <td class="sequence">${primer.f_seq}</td>
                <td class="sequence">${primer.r_seq}</td>
                <td>${primer.source}</td>
                <td>${primer.company}</td>
                <td>${primer.synthesizer}</td>
                <td>${primer.date}</td>
                <td class="storage-location">${primer.location || '-'}</td>
                <td>${primer.notes || '-'}</td>
                <td>
                    ${canDelete ? 
                        `<a href="#" class="action-link delete" onclick="event.stopPropagation(); deletePrimer(${primer.id})">删除</a>` : 
                        '<span style="color:#999;">只读</span>'}
                </td>
            `;
            tbody.appendChild(row);
        });
        
        generatePagination('primer', primers.length, page, pageSize);
    } catch (error) {
        console.error('加载引物失败:', error);
        tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: red;">加载失败，请刷新重试</td></tr>';
    }
}

function showPrimerUploadForm() {
    const modal = document.getElementById('primerUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('primer-date');
        if (dateInput) dateInput.value = today;
    }
}

function hidePrimerUploadForm() {
    const modal = document.getElementById('primerUploadModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('primerUploadForm');
        if (form) form.reset();
    }
}

async function handlePrimerUpload(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('请先登录');
        return false;
    }
    
    const primerData = {
        id: Date.now(),
        gene_name: document.getElementById('primer-gene').value.trim(),
        species: document.getElementById('primer-species').value.trim(),
        usage: document.getElementById('primer-usage').value.trim(),
        f_seq: document.getElementById('primer-f-seq').value.trim(),
        r_seq: document.getElementById('primer-r-seq').value.trim(),
        source: document.getElementById('primer-source').value,
        company: document.getElementById('primer-company').value.trim(),
        synthesizer: user.name,
        synthesizer_id: user.id,
        date: document.getElementById('primer-date').value,
        location: document.getElementById('primer-location').value.trim(),
        notes: document.getElementById('primer-notes').value.trim()
    };
    
    if (!primerData.gene_name || !primerData.species || !primerData.usage || 
        !primerData.f_seq || !primerData.r_seq || !primerData.source || 
        !primerData.company || !primerData.synthesizer || !primerData.date || !primerData.location) {
        alert('请填写所有必填项（带*的字段）');
        return false;
    }
    
    try {
        const response = await fetch(`${API_BASE}/primers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(primerData)
        });
        
        if (response.ok) {
            alert('上传成功！');
            hidePrimerUploadForm();
            loadPrimers();
        } else {
            alert('上传失败，请重试');
        }
    } catch (error) {
        alert('网络错误，请稍后重试');
    }
    
    return false;
}

async function deletePrimer(id) {
    if (!confirm('确定要删除这条引物记录吗？')) return;
    
    const user = getCurrentUser();
    
    try {
        const response = await fetch(`${API_BASE}/primers?id=${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('删除成功');
            loadPrimers();
        } else {
            alert('删除失败');
        }
    } catch (error) {
        alert('网络错误，请稍后重试');
    }
}

function showPrimerDetail(id) {
    // 暂时从localStorage获取详情，后续可以改为API调用
    const primers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
    const primer = primers.find(p => p.id === id);
    
    if (!primer) return;
    
    const detailContent = document.getElementById('primerDetailContent');
    if (!detailContent) return;
    
    detailContent.innerHTML = `
        <div class="detail-item"><span class="detail-label">基因名称：</span><span class="detail-value">${primer.gene_name}</span></div>
        <div class="detail-item"><span class="detail-label">物种：</span><span class="detail-value">${primer.species}</span></div>
        <div class="detail-item"><span class="detail-label">用途：</span><span class="detail-value">${primer.usage}</span></div>
        <div class="detail-item"><span class="detail-label">F序列 (5'→3')：</span><span class="detail-value" style="font-family: monospace;">${primer.f_seq}</span></div>
        <div class="detail-item"><span class="detail-label">R序列 (5'→3')：</span><span class="detail-value" style="font-family: monospace;">${primer.r_seq}</span></div>
        <div class="detail-item"><span class="detail-label">序列来源：</span><span class="detail-value">${primer.source}</span></div>
        <div class="detail-item"><span class="detail-label">合成公司：</span><span class="detail-value">${primer.company}</span></div>
        <div class="detail-item"><span class="detail-label">合成人：</span><span class="detail-value">${primer.synthesizer}</span></div>
        <div class="detail-item"><span class="detail-label">合成时间：</span><span class="detail-value">${primer.date}</span></div>
        <div class="detail-item"><span class="detail-label">储存位置：</span><span class="detail-value">${primer.location || '-'}</span></div>
        <div class="detail-item"><span class="detail-label">备注：</span><span class="detail-value">${primer.notes || '-'}</span></div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

async function searchPrimerTable() {
    const searchInput = document.getElementById('search-primer');
    const filterSelect = document.getElementById('filter-primer');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect ? filterSelect.value : 'all';
    const user = getCurrentUser();
    
    try {
        const response = await fetch(`${API_BASE}/primers`);
        let data = await response.json();
        
        if (filterValue === 'mine') {
            data = data.filter(item => item.synthesizer === user?.name);
        } else if (filterValue === 'recent') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            data = data.filter(item => new Date(item.date) >= thirtyDaysAgo);
        }
        
        if (searchTerm) {
            data = data.filter(item => 
                item.gene_name.toLowerCase().includes(searchTerm) ||
                item.usage.toLowerCase().includes(searchTerm) ||
                item.f_seq.toLowerCase().includes(searchTerm) ||
                item.r_seq.toLowerCase().includes(searchTerm) ||
                item.company.toLowerCase().includes(searchTerm)
            );
        }
        
        const tbody = document.getElementById('primer-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        data.slice(0, 10).forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.gene_name}</strong></td>
                <td>${item.species}</td>
                <td>${item.usage}</td>
                <td class="sequence">${item.f_seq}</td>
                <td class="sequence">${item.r_seq}</td>
                <td>${item.source}</td>
                <td>${item.company}</td>
                <td>${item.synthesizer}</td>
                <td>${item.date}</td>
                <td>${item.location || '-'}</td>
                <td>${item.notes || '-'}</td>
                <td>${item.synthesizer === user?.name ? '可删除' : '只读'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('搜索失败:', error);
    }
}

function exportPrimerTable() {
    alert('导出功能正在升级中，请稍后再试');
}

// ==================== 生成分页 ====================
function generatePagination(type, total, currentPage, pageSize) {
    const paginationDiv = document.getElementById(`${type}-pagination`);
    if (!paginationDiv) return;
    
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" 
                       onclick="load${type.charAt(0).toUpperCase() + type.slice(1)}s(${i})">${i}</button>`;
    }
    
    paginationDiv.innerHTML = html;
}

// ==================== 详情模态框通用函数 ====================
function hideDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// ==================== CSV下载通用函数 ====================
function downloadCSV(csv, filename) {
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

// ==================== 个人信息管理 ====================
function initProfilePage() {
    const user = checkLogin();
    if (!user) return;
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) {
        userSpan.textContent = `👤 ${user.name}`;
    }
    
    loadUserProfile();
}

function loadUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    const usernameInput = document.getElementById('profile-username');
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const displayName = document.getElementById('displayName');
    const userRole = document.getElementById('userRole');
    const avatar = document.getElementById('userAvatar');
    
    if (usernameInput) usernameInput.value = user.username;
    if (nameInput) nameInput.value = user.name;
    if (emailInput) emailInput.value = user.email || '';
    if (displayName) displayName.textContent = user.name;
    if (userRole) userRole.textContent = user.role === 'admin' ? '管理员' : '普通用户';
    if (avatar) avatar.textContent = user.name.charAt(0);
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) return false;
    
    const newName = document.getElementById('profile-name').value.trim();
    const newEmail = document.getElementById('profile-email').value.trim();
    
    if (!newName || !newEmail) {
        showProfileMessage('请填写完整信息', 'error');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
        showProfileMessage('用户不存在', 'error');
        return false;
    }
    
    users[userIndex].name = newName;
    users[userIndex].email = newEmail;
    
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    user.name = newName;
    user.email = newEmail;
    
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || 
                       JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER));
    if (currentUser) {
        currentUser.name = newName;
        currentUser.email = newEmail;
        if (localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
            localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
        }
    }
    
    document.getElementById('displayName').textContent = newName;
    document.getElementById('currentUser').textContent = `👤 ${newName}`;
    
    showProfileMessage('个人信息更新成功！', 'success');
    return false;
}

function showProfileMessage(msg, type) {
    const msgDiv = document.getElementById('profileMessage');
    if (msgDiv) {
        msgDiv.className = `message ${type}`;
        msgDiv.textContent = msg;
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 3000);
    }
}

function showChangePasswordModal() {
    document.getElementById('passwordModal').style.display = 'flex';
}

function hidePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('passwordForm').reset();
}

function handlePasswordChange(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) return false;
    
    const currentPwd = document.getElementById('current-password').value;
    const newPwd = document.getElementById('new-password').value;
    const confirmPwd = document.getElementById('confirm-password').value;
    
    const messageDiv = document.getElementById('passwordMessage');
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userData = users.find(u => u.id === user.id);
    
    if (userData.password !== currentPwd) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '当前密码错误';
        return false;
    }
    
    if (newPwd.length < 6) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '新密码长度至少6位';
        return false;
    }
    
    if (newPwd !== confirmPwd) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '两次输入的新密码不一致';
        return false;
    }
    
    userData.password = newPwd;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    messageDiv.className = 'message success';
    messageDiv.textContent = '密码修改成功！';
    
    setTimeout(() => {
        hidePasswordModal();
    }, 1500);
    
    return false;
}

// ==================== 管理员用户管理功能 ====================
function initAdminUsersPage() {
    const user = checkLogin();
    if (!user) return;
    
    if (user.username !== 'luliting') {
        alert('只有管理员可以访问此页面');
        window.location.href = 'homepage.html';
        return;
    }
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) {
        userSpan.textContent = `👤 ${user.name}`;
    }
    
    loadUserManagementTable();
}

function loadUserManagementTable() {
    const tbody = document.getElementById('user-table-body');
    if (!tbody) return;
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    
    const totalUsers = document.getElementById('totalUsers');
    const adminCount = document.getElementById('adminCount');
    const userCount = document.getElementById('userCount');
    
    if (totalUsers) totalUsers.textContent = users.length;
    if (adminCount) adminCount.textContent = users.filter(u => u.role === 'admin').length;
    if (userCount) userCount.textContent = users.filter(u => u.role === 'user').length;
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td><strong>${user.username}</strong></td>
            <td>${user.name}</td>
            <td>${user.email || '-'}</td>
            <td><span class="badge-${user.role}">${user.role === 'admin' ? '管理员' : '普通用户'}</span></td>
            <td>${user.registerDate || '-'}</td>
            <td>
                <a class="action-link reset" onclick="showAdminResetPasswordModal(${user.id}, '${user.username}')">重置密码</a>
                ${user.username !== 'luliting' ? 
                    `<a class="action-link delete" onclick="deleteUser(${user.id})">删除</a>` : 
                    '<span style="color:#999;">不可删除</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showAdminResetPasswordModal(userId, username) {
    document.getElementById('reset-user-id').value = userId;
    document.getElementById('reset-username').value = username;
    document.getElementById('admin-new-password').value = '123456';
    document.getElementById('resetPasswordModal').style.display = 'flex';
}

function hideResetPasswordModal() {
    document.getElementById('resetPasswordModal').style.display = 'none';
}

function handleAdminResetPasswordSubmit(event) {
    event.preventDefault();
    
    const userId = parseInt(document.getElementById('reset-user-id').value);
    const newPassword = document.getElementById('admin-new-password').value;
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userIndex = users.findIndex(u => u.id === userId);
    
    const messageDiv = document.getElementById('adminResetResult');
    
    if (userIndex === -1) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '用户不存在';
        return false;
    }
    
    if (newPassword.length < 6) {
        messageDiv.className = 'message error';
        messageDiv.textContent = '密码长度至少6位';
        return false;
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    messageDiv.className = 'message success';
    messageDiv.textContent = `密码已重置为: ${newPassword}`;
    
    setTimeout(() => {
        hideResetPasswordModal();
    }, 2000);
    
    return false;
}

function deleteUser(userId) {
    if (!confirm('确定要删除此用户吗？此操作不可恢复！')) return;
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const userToDelete = users.find(u => u.id === userId);
    
    if (userToDelete.username === 'luliting') {
        alert('不能删除管理员账号');
        return;
    }
    
    const newUsers = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
    
    alert('用户删除成功');
    loadUserManagementTable();
}

function searchUsers() {
    const searchTerm = document.getElementById('search-user').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const tbody = document.getElementById('user-table-body');
    
    if (!tbody) return;
    
    const filtered = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.name.toLowerCase().includes(searchTerm) ||
        (user.email && user.email.toLowerCase().includes(searchTerm))
    );
    
    tbody.innerHTML = '';
    
    filtered.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td><strong>${user.username}</strong></td>
            <td>${user.name}</td>
            <td>${user.email || '-'}</td>
            <td><span class="badge-${user.role}">${user.role === 'admin' ? '管理员' : '普通用户'}</span></td>
            <td>${user.registerDate || '-'}</td>
            <td>
                <a class="action-link reset" onclick="showAdminResetPasswordModal(${user.id}, '${user.username}')">重置密码</a>
                ${user.username !== 'luliting' ? 
                    `<a class="action-link delete" onclick="deleteUser(${user.id})">删除</a>` : 
                    '<span style="color:#999;">不可删除</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}
