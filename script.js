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

// ==================== 初始化数据库 ====================
function initDatabase() {
    // 初始化用户
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        const defaultUsers = [
            { 
                id: 1,
                username: 'luliting', 
                password: '123456', 
                name: '卢丽婷',
                email: 'luliting0824@163.com',
                role: 'admin',
                registerDate: '2026-01-01'
            },
            { 
                id: 2,
                username: 'wangxiaoming', 
                password: '123456', 
                name: '王小明',
                email: 'wangxm@lab.com',
                role: 'user',
                registerDate: '2026-02-15'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    
    // 初始化引物数据 - 增加储存位置和备注
    if (!localStorage.getItem(STORAGE_KEYS.PRIMERS)) {
        const defaultPrimers = [
            { 
                id: 1, 
                geneName: 'GAPDH',
                species: 'Human',
                usage: 'qPCR检测GAPDH内参基因表达',
                fSeq: 'ATGGGGAAGGTGAAGGTCG',
                rSeq: 'TAAAAGCAGCCCTGGTGACC',
                source: 'PrimerBank',
                company: '生工生物',
                synthesizer: '卢丽婷',
                synthesizerId: 1,
                date: '2026-03-01',
                location: '引物盒A-01',
                notes: '浓度100μM，分装5管'
            },
            { 
                id: 2, 
                geneName: 'ACTB',
                species: 'Human',
                usage: 'qPCR检测β-actin内参基因',
                fSeq: 'CATGTACGTTGCTATCCAGGC',
                rSeq: 'CTCCTTAATGTCACGCACGAT',
                source: 'PubMed文献',
                company: '金斯瑞',
                synthesizer: '王小明',
                synthesizerId: 2,
                date: '2026-03-05',
                location: '引物盒A-02',
                notes: '浓度100μM'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PRIMERS, JSON.stringify(defaultPrimers));
    }
    
    // 初始化质粒数据 - 增加存放位置和备注
    if (!localStorage.getItem(STORAGE_KEYS.PLASMIDS)) {
        const defaultPlasmids = [
            { 
                id: 1, 
                name: 'pET-28a(+)',
                size: 5369,
                resistance: 'Kanamycin',
                feature: 'N-terminal His-Tag, T7lac promoter, 原核表达载体',
                holder: '卢丽婷',
                holderId: 1,
                date: '2026-02-15',
                addgene: '#12345',
                location: '质粒A盒-01',
                notes: '浓度500ng/μL，-20度保存'
            },
            { 
                id: 2, 
                name: 'pEGFP-N1',
                size: 4733,
                resistance: 'Kanamycin/Neomycin',
                feature: 'EGFP融合蛋白表达, 哺乳动物表达载体',
                holder: '王小明',
                holderId: 2,
                date: '2026-02-20',
                addgene: '',
                location: '质粒A盒-02',
                notes: '浓度300ng/μL'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PLASMIDS, JSON.stringify(defaultPlasmids));
    }
    
    // 初始化siRNA数据 - 增加备注
    if (!localStorage.getItem(STORAGE_KEYS.SIRNAS)) {
        const defaultSIRNAs = [
            { 
                id: 1, 
                geneName: 'GAPDH',
                sense: 'GCAAAUUCCAUGGCACCGUTT',
                antisense: 'ACGGUGCCAUGGAAUUUGCTT',
                source: 'PubMed文献',
                modification: '无修饰',
                company: '吉玛基因',
                synthesizer: '卢丽婷',
                synthesizerId: 1,
                date: '2026-02-28',
                stock: 50.5,
                notes: '分装5管，-80度保存'
            },
            { 
                id: 2, 
                geneName: 'TP53',
                sense: 'GUACCACCAUCCACUACAATT',
                antisense: 'UUGUAGUGGAUGGUGGUACTT',
                source: '自己设计',
                modification: '胆固醇修饰',
                company: '锐博生物',
                synthesizer: '王小明',
                synthesizerId: 2,
                date: '2026-03-03',
                stock: 12.0,
                notes: '避光保存'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.SIRNAS, JSON.stringify(defaultSIRNAs));
    }
    
    // 初始化抗体数据 - 储存位置示例改为A盒xx号，增加备注
    if (!localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) {
        const defaultAntibodies = [
            {
                id: 1,
                name: 'GAPDH Rabbit mAb',
                company: 'CST',
                catalog: '#5174',
                species: 'Rabbit',
                type: '一抗',
                usage: 'WB (1:1000), IF (1:200)',
                location: 'A盒-01',
                date: '2026-02-15',
                notes: '分装保存，避免反复冻融',
                uploader: '卢丽婷',
                uploaderId: 1
            },
            {
                id: 2,
                name: 'Anti-mouse IgG HRP',
                company: 'Abcam',
                catalog: 'ab205719',
                species: 'Goat',
                type: '二抗',
                usage: 'WB (1:5000)',
                location: 'A盒-02',
                date: '2026-03-01',
                notes: '避光保存',
                uploader: '王小明',
                uploaderId: 2
            }
        ];
        localStorage.setItem(STORAGE_KEYS.ANTIBODIES, JSON.stringify(defaultAntibodies));
    }
    
    // 初始化特殊试剂数据
    if (!localStorage.getItem(STORAGE_KEYS.REAGENTS)) {
        const defaultReagents = [
            {
                id: 1,
                name: 'Protease Inhibitor Cocktail',
                usage: '蛋白提取时添加，抑制蛋白酶活性',
                company: 'Roche',
                catalog: '04693159001',
                expiry: '2027-02-01',
                date: '2026-02-01',
                location: '-20度冰柜第二层',
                notes: '分装成100ul每管，避免反复冻融',
                uploader: '卢丽婷',
                uploaderId: 1
            },
            {
                id: 2,
                name: 'Lipofectamine 3000',
                usage: '细胞转染',
                company: 'Thermo Fisher',
                catalog: 'L3000015',
                expiry: '2026-12-31',
                date: '2026-03-05',
                location: '4度冰箱门',
                notes: '避光保存，不可冷冻',
                uploader: '王小明',
                uploaderId: 2
            }
        ];
        localStorage.setItem(STORAGE_KEYS.REAGENTS, JSON.stringify(defaultReagents));
    }
    
    // 设置最后更新日期
    const today = new Date().toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).replace(/\//g, '-');
    sessionStorage.setItem('lastUpdate', today);
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
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    const messageDiv = document.getElementById('loginMessage');
    
    if (user) {
        messageDiv.className = 'message success';
        messageDiv.textContent = '登录成功，正在跳转...';
        
        const userSession = {
            id: user.id,
            username: user.username,
            name: user.name || user.username,
            email: user.email,
            role: user.role
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
        messageDiv.textContent = '用户名或密码错误';
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

function updateCardCounts() {
    const primers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
    const plasmids = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLASMIDS)) || [];
    const sirnas = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIRNAS)) || [];
    const antibodies = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) || [];
    const reagents = JSON.parse(localStorage.getItem(STORAGE_KEYS.REAGENTS)) || [];
    
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

function loadPrimers(page = 1) {
    const tbody = document.getElementById('primer-tbody');
    if (!tbody) return;
    
    const primers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
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
            <td><strong>${primer.geneName}</strong></td>
            <td>${primer.species}</td>
            <td>${primer.usage}</td>
            <td class="sequence">${primer.fSeq}</td>
            <td class="sequence">${primer.rSeq}</td>
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

function handlePrimerUpload(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('请先登录');
        return false;
    }
    
    const primerData = {
        id: Date.now(),
        geneName: document.getElementById('primer-gene').value.trim(),
        species: document.getElementById('primer-species').value.trim(),
        usage: document.getElementById('primer-usage').value.trim(),
        fSeq: document.getElementById('primer-f-seq').value.trim(),
        rSeq: document.getElementById('primer-r-seq').value.trim(),
        source: document.getElementById('primer-source').value,
        company: document.getElementById('primer-company').value.trim(),
        synthesizer: user.name,
        synthesizerId: user.id,
        date: document.getElementById('primer-date').value,
        location: document.getElementById('primer-location').value.trim(),
        notes: document.getElementById('primer-notes').value.trim()
    };
    
    if (!primerData.geneName || !primerData.species || !primerData.usage || 
        !primerData.fSeq || !primerData.rSeq || !primerData.source || 
        !primerData.company || !primerData.synthesizer || !primerData.date || !primerData.location) {
        alert('请填写所有必填项（带*的字段）');
        return false;
    }
    
    const primers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
    primers.push(primerData);
    localStorage.setItem(STORAGE_KEYS.PRIMERS, JSON.stringify(primers));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('上传成功！');
    hidePrimerUploadForm();
    loadPrimers();
    
    return false;
}

function deletePrimer(id) {
    if (!confirm('确定要删除这条引物记录吗？')) return;
    
    const user = getCurrentUser();
    const primers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
    const primer = primers.find(p => p.id === id);
    
    if (!isAdmin() && primer.synthesizer !== user?.name) {
        alert('只有管理员可以删除他人的记录');
        return;
    }
    
    const newPrimers = primers.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRIMERS, JSON.stringify(newPrimers));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('删除成功');
    loadPrimers();
}

function showPrimerDetail(id) {
    const primers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
    const primer = primers.find(p => p.id === id);
    
    if (!primer) return;
    
    const detailContent = document.getElementById('primerDetailContent');
    if (!detailContent) return;
    
    detailContent.innerHTML = `
        <div class="detail-item"><span class="detail-label">基因名称：</span><span class="detail-value">${primer.geneName}</span></div>
        <div class="detail-item"><span class="detail-label">物种：</span><span class="detail-value">${primer.species}</span></div>
        <div class="detail-item"><span class="detail-label">用途：</span><span class="detail-value">${primer.usage}</span></div>
        <div class="detail-item"><span class="detail-label">F序列 (5'→3')：</span><span class="detail-value" style="font-family: monospace;">${primer.fSeq}</span></div>
        <div class="detail-item"><span class="detail-label">R序列 (5'→3')：</span><span class="detail-value" style="font-family: monospace;">${primer.rSeq}</span></div>
        <div class="detail-item"><span class="detail-label">序列来源：</span><span class="detail-value">${primer.source}</span></div>
        <div class="detail-item"><span class="detail-label">合成公司：</span><span class="detail-value">${primer.company}</span></div>
        <div class="detail-item"><span class="detail-label">合成人：</span><span class="detail-value">${primer.synthesizer}</span></div>
        <div class="detail-item"><span class="detail-label">合成时间：</span><span class="detail-value">${primer.date}</span></div>
        <div class="detail-item"><span class="detail-label">储存位置：</span><span class="detail-value">${primer.location || '-'}</span></div>
        <div class="detail-item"><span class="detail-label">备注：</span><span class="detail-value">${primer.notes || '-'}</span></div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function searchPrimerTable() {
    const searchInput = document.getElementById('search-primer');
    const filterSelect = document.getElementById('filter-primer');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect ? filterSelect.value : 'all';
    const user = getCurrentUser();
    
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
    
    if (filterValue === 'mine') {
        data = data.filter(item => item.synthesizer === user?.name);
    } else if (filterValue === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        data = data.filter(item => new Date(item.date) >= thirtyDaysAgo);
    }
    
    if (searchTerm) {
        data = data.filter(item => 
            item.geneName.toLowerCase().includes(searchTerm) ||
            item.usage.toLowerCase().includes(searchTerm) ||
            item.fSeq.toLowerCase().includes(searchTerm) ||
            item.rSeq.toLowerCase().includes(searchTerm) ||
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
            <td><strong>${item.geneName}</strong></td>
            <td>${item.species}</td>
            <td>${item.usage}</td>
            <td class="sequence">${item.fSeq}</td>
            <td class="sequence">${item.rSeq}</td>
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
}

function exportPrimerTable() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIMERS)) || [];
    
    let csv = 'ID,基因名称,物种,用途,F序列,R序列,序列来源,合成公司,合成人,合成时间,储存位置,备注\n';
    data.forEach(item => {
        csv += `${item.id},${item.geneName},${item.species},${item.usage},${item.fSeq},${item.rSeq},${item.source},${item.company},${item.synthesizer},${item.date},${item.location || ''},${item.notes || ''}\n`;
    });
    
    downloadCSV(csv, `引物台账_${new Date().toISOString().split('T')[0]}.csv`);
}

// ==================== 质粒页面函数 ====================
function initPlasmidsPage() {
    const user = checkLogin();
    if (!user) return;
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) userSpan.textContent = `👤 ${user.name}`;
    
    const lastUpdateSpan = document.getElementById('lastUpdate');
    if (lastUpdateSpan) {
        lastUpdateSpan.textContent = sessionStorage.getItem('lastUpdate') || new Date().toLocaleDateString('zh-CN');
    }
    
    loadPlasmids();
}

function loadPlasmids(page = 1) {
    const tbody = document.getElementById('plasmid-tbody');
    if (!tbody) return;
    
    const plasmids = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLASMIDS)) || [];
    const user = getCurrentUser();
    const admin = isAdmin();
    
    plasmids.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = plasmids.slice(start, end);
    
    tbody.innerHTML = '';
    
    pageData.forEach(plasmid => {
        const row = document.createElement('tr');
        row.setAttribute('onclick', `showPlasmidDetail(${plasmid.id})`);
        
        const canDelete = admin || (plasmid.holder === user?.name);
        
        row.innerHTML = `
            <td>${plasmid.id}</td>
            <td><strong>${plasmid.name}</strong></td>
            <td>${plasmid.size}</td>
            <td>${plasmid.resistance}</td>
            <td>${plasmid.feature}</td>
            <td>${plasmid.holder}</td>
            <td>${plasmid.date}</td>
            <td>${plasmid.addgene || '-'}</td>
            <td class="storage-location">${plasmid.location || '-'}</td>
            <td>${plasmid.notes || '-'}</td>
            <td>
                ${canDelete ? 
                    `<a href="#" class="action-link delete" onclick="event.stopPropagation(); deletePlasmid(${plasmid.id})">删除</a>` : 
                    '<span style="color:#999;">只读</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    generatePagination('plasmid', plasmids.length, page, pageSize);
}

function showPlasmidUploadForm() {
    const modal = document.getElementById('plasmidUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('plasmid-date');
        if (dateInput) dateInput.value = today;
    }
}

function hidePlasmidUploadForm() {
    const modal = document.getElementById('plasmidUploadModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('plasmidUploadForm');
        if (form) form.reset();
    }
}

function handlePlasmidUpload(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('请先登录');
        return false;
    }
    
    const plasmidData = {
        id: Date.now(),
        name: document.getElementById('plasmid-name').value.trim(),
        size: document.getElementById('plasmid-size').value,
        resistance: document.getElementById('plasmid-resistance').value.trim(),
        feature: document.getElementById('plasmid-feature').value.trim(),
        holder: user.name,
        holderId: user.id,
        date: document.getElementById('plasmid-date').value,
        addgene: document.getElementById('plasmid-addgene').value.trim(),
        location: document.getElementById('plasmid-location').value.trim(),
        notes: document.getElementById('plasmid-notes').value.trim()
    };
    
    if (!plasmidData.name || !plasmidData.size || !plasmidData.resistance || 
        !plasmidData.feature || !plasmidData.holder || !plasmidData.date || !plasmidData.location) {
        alert('请填写所有必填项（带*的字段）');
        return false;
    }
    
    const plasmids = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLASMIDS)) || [];
    plasmids.push(plasmidData);
    localStorage.setItem(STORAGE_KEYS.PLASMIDS, JSON.stringify(plasmids));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('上传成功！');
    hidePlasmidUploadForm();
    loadPlasmids();
    
    return false;
}

function deletePlasmid(id) {
    if (!confirm('确定要删除这条质粒记录吗？')) return;
    
    const user = getCurrentUser();
    const plasmids = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLASMIDS)) || [];
    const plasmid = plasmids.find(p => p.id === id);
    
    if (!isAdmin() && plasmid.holder !== user?.name) {
        alert('只有管理员可以删除他人的记录');
        return;
    }
    
    const newPlasmids = plasmids.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PLASMIDS, JSON.stringify(newPlasmids));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('删除成功');
    loadPlasmids();
}

function showPlasmidDetail(id) {
    const plasmids = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLASMIDS)) || [];
    const plasmid = plasmids.find(p => p.id === id);
    
    if (!plasmid) return;
    
    const detailContent = document.getElementById('plasmidDetailContent');
    if (!detailContent) return;
    
    detailContent.innerHTML = `
        <div class="detail-item"><span class="detail-label">质粒名称：</span><span class="detail-value">${plasmid.name}</span></div>
        <div class="detail-item"><span class="detail-label">大小：</span><span class="detail-value">${plasmid.size} bp</span></div>
        <div class="detail-item"><span class="detail-label">抗性：</span><span class="detail-value">${plasmid.resistance}</span></div>
        <div class="detail-item"><span class="detail-label">特征与用途：</span><span class="detail-value">${plasmid.feature}</span></div>
        <div class="detail-item"><span class="detail-label">持有人：</span><span class="detail-value">${plasmid.holder}</span></div>
        <div class="detail-item"><span class="detail-label">上传日期：</span><span class="detail-value">${plasmid.date}</span></div>
        <div class="detail-item"><span class="detail-label">Addgene序号：</span><span class="detail-value">${plasmid.addgene || '无'}</span></div>
        <div class="detail-item"><span class="detail-label">存放位置：</span><span class="detail-value">${plasmid.location || '-'}</span></div>
        <div class="detail-item"><span class="detail-label">备注：</span><span class="detail-value">${plasmid.notes || '-'}</span></div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function searchPlasmidTable() {
    const searchInput = document.getElementById('search-plasmid');
    const filterSelect = document.getElementById('filter-plasmid');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect ? filterSelect.value : 'all';
    const user = getCurrentUser();
    
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLASMIDS)) || [];
    
    if (filterValue === 'mine') {
        data = data.filter(item => item.holder === user?.name);
    } else if (filterValue === 'recent') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        data = data.filter(item => new Date(item.date) >= thirtyDaysAgo);
    }
    
    if (searchTerm) {
        data = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.feature.toLowerCase().includes(searchTerm) ||
            item.resistance.toLowerCase().includes(searchTerm) ||
            (item.addgene && item.addgene.toLowerCase().includes(searchTerm))
        );
    }
    
    const tbody = document.getElementById('plasmid-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    data.slice(0, 10).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.size}</td>
            <td>${item.resistance}</td>
            <td>${item.feature}</td>
            <td>${item.holder}</td>
            <td>${item.date}</td>
            <td>${item.addgene || '-'}</td>
            <td>${item.location || '-'}</td>
            <td>${item.notes || '-'}</td>
            <td>${item.holder === user?.name ? '可删除' : '只读'}</td>
        `;
        tbody.appendChild(row);
    });
}

function exportPlasmidTable() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLASMIDS)) || [];
    
    let csv = 'ID,质粒名称,大小(bp),抗性,特征与用途,持有人,上传日期,Addgene序号,存放位置,备注\n';
    data.forEach(item => {
        csv += `${item.id},${item.name},${item.size},${item.resistance},${item.feature},${item.holder},${item.date},${item.addgene || ''},${item.location || ''},${item.notes || ''}\n`;
    });
    
    downloadCSV(csv, `质粒台账_${new Date().toISOString().split('T')[0]}.csv`);
}

// ==================== siRNA页面函数 ====================
function initSIRNAsPage() {
    const user = checkLogin();
    if (!user) return;
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) userSpan.textContent = `👤 ${user.name}`;
    
    const lastUpdateSpan = document.getElementById('lastUpdate');
    if (lastUpdateSpan) {
        lastUpdateSpan.textContent = sessionStorage.getItem('lastUpdate') || new Date().toLocaleDateString('zh-CN');
    }
    
    loadSIRNAs();
}

function loadSIRNAs(page = 1) {
    const tbody = document.getElementById('sirna-tbody');
    if (!tbody) return;
    
    const sirnas = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIRNAS)) || [];
    const user = getCurrentUser();
    const admin = isAdmin();
    
    sirnas.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = sirnas.slice(start, end);
    
    tbody.innerHTML = '';
    
    pageData.forEach(sirna => {
        const row = document.createElement('tr');
        row.setAttribute('onclick', `showSirnaDetail(${sirna.id})`);
        
        const stockClass = sirna.stock < 10 ? 'stock-low' : '';
        const canDelete = admin || (sirna.synthesizer === user?.name);
        
        row.innerHTML = `
            <td>${sirna.id}</td>
            <td><strong>${sirna.geneName}</strong></td>
            <td class="sequence">${sirna.sense}</td>
            <td class="sequence">${sirna.antisense}</td>
            <td>${sirna.source}</td>
            <td>${sirna.modification}</td>
            <td>${sirna.company}</td>
            <td>${sirna.synthesizer}</td>
            <td>${sirna.date}</td>
            <td class="${stockClass}">${sirna.stock} nmol</td>
            <td>${sirna.notes || '-'}</td>
            <td>
                ${canDelete ? 
                    `<a href="#" class="action-link delete" onclick="event.stopPropagation(); deleteSirna(${sirna.id})">删除</a>` : 
                    '<span style="color:#999;">只读</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    generatePagination('sirna', sirnas.length, page, pageSize);
}

function showSirnaUploadForm() {
    const modal = document.getElementById('sirnaUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('sirna-date');
        if (dateInput) dateInput.value = today;
    }
}

function hideSirnaUploadForm() {
    const modal = document.getElementById('sirnaUploadModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('sirnaUploadForm');
        if (form) form.reset();
    }
}

function handleSirnaUpload(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('请先登录');
        return false;
    }
    
    const modification = document.querySelector('input[name="sirna-modified"]:checked')?.value || '无修饰';
    
    const sirnaData = {
        id: Date.now(),
        geneName: document.getElementById('sirna-gene').value.trim(),
        sense: document.getElementById('sirna-sense').value.trim(),
        antisense: document.getElementById('sirna-antisense').value.trim(),
        source: document.getElementById('sirna-source').value,
        modification: modification,
        company: document.getElementById('sirna-company').value.trim(),
        synthesizer: user.name,
        synthesizerId: user.id,
        date: document.getElementById('sirna-date').value,
        stock: parseFloat(document.getElementById('sirna-stock').value) || 0,
        notes: document.getElementById('sirna-notes').value.trim()
    };
    
    if (!sirnaData.geneName || !sirnaData.sense || !sirnaData.antisense || 
        !sirnaData.source || !sirnaData.company || !sirnaData.synthesizer || 
        !sirnaData.date || !sirnaData.stock) {
        alert('请填写所有必填项（带*的字段）');
        return false;
    }
    
    const sirnas = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIRNAS)) || [];
    sirnas.push(sirnaData);
    localStorage.setItem(STORAGE_KEYS.SIRNAS, JSON.stringify(sirnas));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('上传成功！');
    hideSirnaUploadForm();
    loadSIRNAs();
    
    return false;
}

function deleteSirna(id) {
    if (!confirm('确定要删除这条siRNA记录吗？')) return;
    
    const user = getCurrentUser();
    const sirnas = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIRNAS)) || [];
    const sirna = sirnas.find(s => s.id === id);
    
    if (!isAdmin() && sirna.synthesizer !== user?.name) {
        alert('只有管理员可以删除他人的记录');
        return;
    }
    
    const newSirnas = sirnas.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SIRNAS, JSON.stringify(newSirnas));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('删除成功');
    loadSIRNAs();
}

function showSirnaDetail(id) {
    const sirnas = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIRNAS)) || [];
    const sirna = sirnas.find(s => s.id === id);
    
    if (!sirna) return;
    
    const detailContent = document.getElementById('sirnaDetailContent');
    if (!detailContent) return;
    
    detailContent.innerHTML = `
        <div class="detail-item"><span class="detail-label">基因名：</span><span class="detail-value">${sirna.geneName}</span></div>
        <div class="detail-item"><span class="detail-label">正义链：</span><span class="detail-value" style="font-family: monospace;">${sirna.sense}</span></div>
        <div class="detail-item"><span class="detail-label">反义链：</span><span class="detail-value" style="font-family: monospace;">${sirna.antisense}</span></div>
        <div class="detail-item"><span class="detail-label">序列来源：</span><span class="detail-value">${sirna.source}</span></div>
        <div class="detail-item"><span class="detail-label">修饰：</span><span class="detail-value">${sirna.modification}</span></div>
        <div class="detail-item"><span class="detail-label">合成公司：</span><span class="detail-value">${sirna.company}</span></div>
        <div class="detail-item"><span class="detail-label">合成人：</span><span class="detail-value">${sirna.synthesizer}</span></div>
        <div class="detail-item"><span class="detail-label">合成日期：</span><span class="detail-value">${sirna.date}</span></div>
        <div class="detail-item"><span class="detail-label">剩余储量：</span><span class="detail-value">${sirna.stock} nmol</span></div>
        <div class="detail-item"><span class="detail-label">备注：</span><span class="detail-value">${sirna.notes || '-'}</span></div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function searchSirnaTable() {
    const searchInput = document.getElementById('search-sirna');
    const filterSelect = document.getElementById('filter-sirna');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect ? filterSelect.value : 'all';
    const user = getCurrentUser();
    
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIRNAS)) || [];
    
    if (filterValue === 'mine') {
        data = data.filter(item => item.synthesizer === user?.name);
    } else if (filterValue === 'low-stock') {
        data = data.filter(item => item.stock < 10);
    } else if (filterValue === 'modified') {
        data = data.filter(item => item.modification !== '无修饰');
    }
    
    if (searchTerm) {
        data = data.filter(item => 
            item.geneName.toLowerCase().includes(searchTerm) ||
            item.source.toLowerCase().includes(searchTerm) ||
            item.company.toLowerCase().includes(searchTerm) ||
            item.sense.toLowerCase().includes(searchTerm)
        );
    }
    
    const tbody = document.getElementById('sirna-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    data.slice(0, 10).forEach(item => {
        const row = document.createElement('tr');
        const stockClass = item.stock < 10 ? 'stock-low' : '';
        row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.geneName}</strong></td>
            <td class="sequence">${item.sense}</td>
            <td class="sequence">${item.antisense}</td>
            <td>${item.source}</td>
            <td>${item.modification}</td>
            <td>${item.company}</td>
            <td>${item.synthesizer}</td>
            <td>${item.date}</td>
            <td class="${stockClass}">${item.stock} nmol</td>
            <td>${item.notes || '-'}</td>
            <td>${item.synthesizer === user?.name ? '可删除' : '只读'}</td>
        `;
        tbody.appendChild(row);
    });
}

function exportSirnaTable() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIRNAS)) || [];
    
    let csv = 'ID,基因名,正义链,反义链,序列来源,修饰,合成公司,合成人,合成日期,剩余储量(nmol),备注\n';
    data.forEach(item => {
        csv += `${item.id},${item.geneName},${item.sense},${item.antisense},${item.source},${item.modification},${item.company},${item.synthesizer},${item.date},${item.stock},${item.notes || ''}\n`;
    });
    
    downloadCSV(csv, `siRNA台账_${new Date().toISOString().split('T')[0]}.csv`);
}

// ==================== 抗体页面函数 ====================
function initAntibodiesPage() {
    const user = checkLogin();
    if (!user) return;
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) userSpan.textContent = `👤 ${user.name}`;
    
    const lastUpdateSpan = document.getElementById('lastUpdate');
    if (lastUpdateSpan) {
        lastUpdateSpan.textContent = sessionStorage.getItem('lastUpdate') || new Date().toLocaleDateString('zh-CN');
    }
    
    loadAntibodies();
}

function loadAntibodies(page = 1) {
    const tbody = document.getElementById('antibody-tbody');
    if (!tbody) return;
    
    const antibodies = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) || [];
    const user = getCurrentUser();
    const admin = isAdmin();
    
    antibodies.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = antibodies.slice(start, end);
    
    tbody.innerHTML = '';
    
    pageData.forEach(ab => {
        const row = document.createElement('tr');
        row.setAttribute('onclick', `showAntibodyDetail(${ab.id})`);
        
        const canDelete = admin || (ab.uploader === user?.name);
        
        row.innerHTML = `
            <td>${ab.id}</td>
            <td><strong>${ab.name}</strong></td>
            <td>${ab.company}</td>
            <td>${ab.catalog}</td>
            <td>${ab.species}</td>
            <td>${ab.type}</td>
            <td>${ab.usage}</td>
            <td class="storage-location">${ab.location}</td>
            <td>${ab.date}</td>
            <td>${ab.notes || '-'}</td>
            <td>${ab.uploader}</td>
            <td>
                ${canDelete ? 
                    `<a href="#" class="action-link delete" onclick="event.stopPropagation(); deleteAntibody(${ab.id})">删除</a>` : 
                    '<span style="color:#999;">只读</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    generatePagination('antibody', antibodies.length, page, pageSize);
}

function showAntibodyUploadForm() {
    const modal = document.getElementById('antibodyUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('antibody-date');
        if (dateInput) dateInput.value = today;
    }
}

function hideAntibodyUploadForm() {
    const modal = document.getElementById('antibodyUploadModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('antibodyUploadForm');
        if (form) form.reset();
    }
}

function handleAntibodyUpload(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('请先登录');
        return false;
    }
    
    const antibodyData = {
        id: Date.now(),
        name: document.getElementById('antibody-name').value.trim(),
        company: document.getElementById('antibody-company').value.trim(),
        catalog: document.getElementById('antibody-catalog').value.trim(),
        species: document.getElementById('antibody-species').value.trim(),
        type: document.getElementById('antibody-type').value,
        usage: document.getElementById('antibody-usage').value.trim(),
        location: document.getElementById('antibody-location').value.trim(),
        date: document.getElementById('antibody-date').value,
        notes: document.getElementById('antibody-notes').value.trim(),
        uploader: user.name,
        uploaderId: user.id
    };
    
    if (!antibodyData.name || !antibodyData.company || !antibodyData.catalog || 
        !antibodyData.species || !antibodyData.type || !antibodyData.usage || 
        !antibodyData.location || !antibodyData.date) {
        alert('请填写所有必填项（带*的字段）');
        return false;
    }
    
    const antibodies = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) || [];
    antibodies.push(antibodyData);
    localStorage.setItem(STORAGE_KEYS.ANTIBODIES, JSON.stringify(antibodies));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('上传成功！');
    hideAntibodyUploadForm();
    loadAntibodies();
    
    return false;
}

function deleteAntibody(id) {
    if (!confirm('确定要删除这条抗体记录吗？')) return;
    
    const user = getCurrentUser();
    const antibodies = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) || [];
    const antibody = antibodies.find(a => a.id === id);
    
    if (!isAdmin() && antibody.uploader !== user?.name) {
        alert('只有管理员可以删除他人的记录');
        return;
    }
    
    const newAntibodies = antibodies.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ANTIBODIES, JSON.stringify(newAntibodies));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('删除成功');
    loadAntibodies();
}

function showAntibodyDetail(id) {
    const antibodies = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) || [];
    const ab = antibodies.find(a => a.id === id);
    
    if (!ab) return;
    
    const detailContent = document.getElementById('antibodyDetailContent');
    detailContent.innerHTML = `
        <div class="detail-item"><span class="detail-label">抗体名称：</span><span class="detail-value">${ab.name}</span></div>
        <div class="detail-item"><span class="detail-label">公司：</span><span class="detail-value">${ab.company}</span></div>
        <div class="detail-item"><span class="detail-label">货号：</span><span class="detail-value">${ab.catalog}</span></div>
        <div class="detail-item"><span class="detail-label">种属：</span><span class="detail-value">${ab.species}</span></div>
        <div class="detail-item"><span class="detail-label">类型：</span><span class="detail-value">${ab.type}</span></div>
        <div class="detail-item"><span class="detail-label">用途：</span><span class="detail-value">${ab.usage}</span></div>
        <div class="detail-item"><span class="detail-label">储存位置：</span><span class="detail-value">${ab.location}</span></div>
        <div class="detail-item"><span class="detail-label">到货日期：</span><span class="detail-value">${ab.date}</span></div>
        <div class="detail-item"><span class="detail-label">备注：</span><span class="detail-value">${ab.notes || '-'}</span></div>
        <div class="detail-item"><span class="detail-label">添加人：</span><span class="detail-value">${ab.uploader}</span></div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function searchAntibodyTable() {
    const searchInput = document.getElementById('search-antibody');
    const filterSelect = document.getElementById('filter-antibody');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const user = getCurrentUser();
    const admin = isAdmin();
    
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) || [];
    
    if (filterValue === 'mine') {
        data = data.filter(item => item.uploader === user?.name);
    } else if (filterValue === 'primary') {
        data = data.filter(item => item.type === '一抗');
    } else if (filterValue === 'secondary') {
        data = data.filter(item => item.type === '二抗');
    } else if (filterValue === 'other') {
        data = data.filter(item => item.type === '其它');
    }
    
    if (searchTerm) {
        data = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.company.toLowerCase().includes(searchTerm) ||
            item.catalog.toLowerCase().includes(searchTerm) ||
            item.usage.toLowerCase().includes(searchTerm)
        );
    }
    
    const tbody = document.getElementById('antibody-tbody');
    tbody.innerHTML = '';
    
    data.slice(0, 10).forEach(ab => {
        const row = document.createElement('tr');
        const canDelete = admin || (ab.uploader === user?.name);
        row.innerHTML = `
            <td>${ab.id}</td>
            <td><strong>${ab.name}</strong></td>
            <td>${ab.company}</td>
            <td>${ab.catalog}</td>
            <td>${ab.species}</td>
            <td>${ab.type}</td>
            <td>${ab.usage}</td>
            <td>${ab.location}</td>
            <td>${ab.date}</td>
            <td>${ab.notes || '-'}</td>
            <td>${ab.uploader}</td>
            <td>${canDelete ? '可删除' : '只读'}</td>
        `;
        tbody.appendChild(row);
    });
}

function exportAntibodyTable() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANTIBODIES)) || [];
    
    let csv = 'ID,名称,公司,货号,种属,类型,用途,储存位置,到货日期,备注,添加人\n';
    data.forEach(item => {
        csv += `${item.id},${item.name},${item.company},${item.catalog},${item.species},${item.type},${item.usage},${item.location},${item.date},${item.notes || ''},${item.uploader}\n`;
    });
    
    downloadCSV(csv, `抗体台账_${new Date().toISOString().split('T')[0]}.csv`);
}

// ==================== 特殊试剂页面函数 ====================
function initReagentsPage() {
    const user = checkLogin();
    if (!user) return;
    
    const userSpan = document.getElementById('currentUser');
    if (userSpan) userSpan.textContent = `👤 ${user.name}`;
    
    const lastUpdateSpan = document.getElementById('lastUpdate');
    if (lastUpdateSpan) {
        lastUpdateSpan.textContent = sessionStorage.getItem('lastUpdate') || new Date().toLocaleDateString('zh-CN');
    }
    
    loadReagents();
}

function loadReagents(page = 1) {
    const tbody = document.getElementById('reagent-tbody');
    if (!tbody) return;
    
    const reagents = JSON.parse(localStorage.getItem(STORAGE_KEYS.REAGENTS)) || [];
    const user = getCurrentUser();
    const admin = isAdmin();
    const today = new Date();
    
    reagents.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = reagents.slice(start, end);
    
    tbody.innerHTML = '';
    
    pageData.forEach(reagent => {
        const row = document.createElement('tr');
        row.setAttribute('onclick', `showReagentDetail(${reagent.id})`);
        
        const expiryDate = new Date(reagent.expiry);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        let expiryClass = '';
        if (daysUntilExpiry < 0) {
            expiryClass = 'expiry-expired';
        } else if (daysUntilExpiry <= 30) {
            expiryClass = 'expiry-warning';
        }
        
        const canDelete = admin || (reagent.uploader === user?.name);
        
        row.innerHTML = `
            <td>${reagent.id}</td>
            <td><strong>${reagent.name}</strong></td>
            <td>${reagent.usage}</td>
            <td>${reagent.company}</td>
            <td>${reagent.catalog}</td>
            <td class="${expiryClass}">${reagent.expiry}</td>
            <td>${reagent.date}</td>
            <td class="storage-location">${reagent.location}</td>
            <td>${reagent.notes || '-'}</td>
            <td>${reagent.uploader}</td>
            <td>
                ${canDelete ? 
                    `<a href="#" class="action-link delete" onclick="event.stopPropagation(); deleteReagent(${reagent.id})">删除</a>` : 
                    '<span style="color:#999;">只读</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
    
    generatePagination('reagent', reagents.length, page, pageSize);
}

function showReagentUploadForm() {
    const modal = document.getElementById('reagentUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('reagent-date').value = today;
        
        const oneYearLater = new Date();
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        document.getElementById('reagent-expiry').value = oneYearLater.toISOString().split('T')[0];
    }
}

function hideReagentUploadForm() {
    const modal = document.getElementById('reagentUploadModal');
    if (modal) {
        modal.style.display = 'none';
        const form = document.getElementById('reagentUploadForm');
        if (form) form.reset();
    }
}

function handleReagentUpload(event) {
    event.preventDefault();
    
    const user = getCurrentUser();
    if (!user) {
        alert('请先登录');
        return false;
    }
    
    const reagentData = {
        id: Date.now(),
        name: document.getElementById('reagent-name').value.trim(),
        usage: document.getElementById('reagent-usage').value.trim(),
        company: document.getElementById('reagent-company').value.trim(),
        catalog: document.getElementById('reagent-catalog').value.trim(),
        expiry: document.getElementById('reagent-expiry').value,
        date: document.getElementById('reagent-date').value,
        location: document.getElementById('reagent-location').value.trim(),
        notes: document.getElementById('reagent-notes').value.trim(),
        uploader: user.name,
        uploaderId: user.id
    };
    
    if (!reagentData.name || !reagentData.usage || !reagentData.company || 
        !reagentData.catalog || !reagentData.expiry || !reagentData.date || !reagentData.location) {
        alert('请填写所有必填项（带*的字段）');
        return false;
    }
    
    const reagents = JSON.parse(localStorage.getItem(STORAGE_KEYS.REAGENTS)) || [];
    reagents.push(reagentData);
    localStorage.setItem(STORAGE_KEYS.REAGENTS, JSON.stringify(reagents));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('上传成功！');
    hideReagentUploadForm();
    loadReagents();
    
    return false;
}

function deleteReagent(id) {
    if (!confirm('确定要删除这条试剂记录吗？')) return;
    
    const user = getCurrentUser();
    const reagents = JSON.parse(localStorage.getItem(STORAGE_KEYS.REAGENTS)) || [];
    const reagent = reagents.find(r => r.id === id);
    
    if (!isAdmin() && reagent.uploader !== user?.name) {
        alert('只有管理员可以删除他人的记录');
        return;
    }
    
    const newReagents = reagents.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REAGENTS, JSON.stringify(newReagents));
    
    sessionStorage.setItem('lastUpdate', new Date().toLocaleDateString('zh-CN'));
    
    alert('删除成功');
    loadReagents();
}

function showReagentDetail(id) {
    const reagents = JSON.parse(localStorage.getItem(STORAGE_KEYS.REAGENTS)) || [];
    const reagent = reagents.find(r => r.id === id);
    
    if (!reagent) return;
    
    const detailContent = document.getElementById('reagentDetailContent');
    detailContent.innerHTML = `
        <div class="detail-item"><span class="detail-label">试剂名称：</span><span class="detail-value">${reagent.name}</span></div>
        <div class="detail-item"><span class="detail-label">用途：</span><span class="detail-value">${reagent.usage}</span></div>
        <div class="detail-item"><span class="detail-label">公司：</span><span class="detail-value">${reagent.company}</span></div>
        <div class="detail-item"><span class="detail-label">货号：</span><span class="detail-value">${reagent.catalog}</span></div>
        <div class="detail-item"><span class="detail-label">有效期：</span><span class="detail-value">${reagent.expiry}</span></div>
        <div class="detail-item"><span class="detail-label">到货日期：</span><span class="detail-value">${reagent.date}</span></div>
        <div class="detail-item"><span class="detail-label">存储位置：</span><span class="detail-value">${reagent.location}</span></div>
        <div class="detail-item"><span class="detail-label">备注：</span><span class="detail-value">${reagent.notes || '-'}</span></div>
        <div class="detail-item"><span class="detail-label">添加人：</span><span class="detail-value">${reagent.uploader}</span></div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function searchReagentTable() {
    const searchInput = document.getElementById('search-reagent');
    const filterSelect = document.getElementById('filter-reagent');
    
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const user = getCurrentUser();
    const admin = isAdmin();
    const today = new Date();
    
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.REAGENTS)) || [];
    
    if (filterValue === 'mine') {
        data = data.filter(item => item.uploader === user?.name);
    } else if (filterValue === 'expiring') {
        data = data.filter(item => {
            const expiryDate = new Date(item.expiry);
            const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
        });
    } else if (filterValue === 'expired') {
        data = data.filter(item => new Date(item.expiry) < today);
    }
    
    if (searchTerm) {
        data = data.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.usage.toLowerCase().includes(searchTerm) ||
            item.company.toLowerCase().includes(searchTerm) ||
            item.catalog.toLowerCase().includes(searchTerm)
        );
    }
    
    const tbody = document.getElementById('reagent-tbody');
    tbody.innerHTML = '';
    
    data.slice(0, 10).forEach(reagent => {
        const row = document.createElement('tr');
        const canDelete = admin || (reagent.uploader === user?.name);
        
        const expiryDate = new Date(reagent.expiry);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        let expiryClass = '';
        if (daysUntilExpiry < 0) {
            expiryClass = 'expiry-expired';
        } else if (daysUntilExpiry <= 30) {
            expiryClass = 'expiry-warning';
        }
        
        row.innerHTML = `
            <td>${reagent.id}</td>
            <td><strong>${reagent.name}</strong></td>
            <td>${reagent.usage}</td>
            <td>${reagent.company}</td>
            <td>${reagent.catalog}</td>
            <td class="${expiryClass}">${reagent.expiry}</td>
            <td>${reagent.date}</td>
            <td>${reagent.location}</td>
            <td>${reagent.notes || '-'}</td>
            <td>${reagent.uploader}</td>
            <td>${canDelete ? '可删除' : '只读'}</td>
        `;
        tbody.appendChild(row);
    });
}

function exportReagentTable() {
    let data = JSON.parse(localStorage.getItem(STORAGE_KEYS.REAGENTS)) || [];
    
    let csv = 'ID,名称,用途,公司,货号,有效期,到货日期,存储位置,备注,添加人\n';
    data.forEach(item => {
        csv += `${item.id},${item.name},${item.usage},${item.company},${item.catalog},${item.expiry},${item.date},${item.location},${item.notes || ''},${item.uploader}\n`;
    });
    
    downloadCSV(csv, `特殊试剂台账_${new Date().toISOString().split('T')[0]}.csv`);
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