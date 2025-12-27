// 管理页面的JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 模拟图书数据（会尝试从 localStorage 恢复）
    // 注意：这个默认数据仅在没有localStorage数据时使用，且会被loadBooksFromStorage函数替换
    let booksData = [];

    // 从localStorage加载图书数据（确保数据格式一致）
    function loadBooksFromStorage() {
        const stored = localStorage.getItem('library_books');
        if (stored) {
            try {
                booksData = JSON.parse(stored);
                // 确保数据完整性 - 补充所有必要字段（与浏览页面保持一致）
                booksData = booksData.map(book => {
                    // 修复图片URL
                    let coverUrl = book.cover || '../img/a1.jpg';
                    if (coverUrl && typeof coverUrl === 'string') {
                        coverUrl = coverUrl.replace(/\s+/g, '').trim();
                        if (coverUrl.includes('images.  .unsplash.com') || 
                            coverUrl.includes('images..unsplash.com') ||
                            (!coverUrl.startsWith('http') && !coverUrl.startsWith('../'))) {
                            coverUrl = '../img/a1.jpg';
                        }
                    }
                    
                    return {
                        id: book.id || Math.random() * 10000,
                        title: book.title || '未知书名',
                        author: book.author || '未知作者',
                        category: book.category || 'other',
                        status: book.status || 'available',
                        copies: book.copies || 1,
                        borrowed: book.borrowed || 0,
                        isbn: book.isbn || '',
                        publisher: book.publisher || '未知出版社',
                        year: book.year || new Date().getFullYear(),
                        description: book.description || (book.title ? `${book.title}是一本值得阅读的好书。` : '暂无简介'),
                        cover: coverUrl
                    };
                });
                
                // 保存修复后的数据，确保格式一致
                try {
                    localStorage.setItem('library_books', JSON.stringify(booksData));
                } catch(e) {
                    console.warn('保存修复后的数据失败', e);
                }
                
                console.log('manage-script: 加载图书数据', booksData.length, '本');
            } catch (e) {
                console.error('解析本地书籍数据失败', e);
            }
        } else {
            // 如果没有存储数据，尝试从浏览页面的数据源同步
            // 如果浏览页面已初始化，使用浏览页面的数据；否则使用最小默认数据集
            console.log('manage-script: localStorage中没有数据，检查是否需要初始化');
            
            // 最小默认数据集（与浏览页面保持一致）
            const defaultBooks = [
                {
                    id: 1,
                    title: "《Web开发指南》",
                    author: "温正东",
                    category: "technology",
                    description: "一本全面介绍现代Web开发技术的实用指南，涵盖HTML、CSS、JavaScript等核心技术。",
                    year: 2022,
                    publisher: "电子工业出版社",
                    isbn: "9787121234567",
                    status: "available",
                    copies: 5,
                    borrowed: 0,
                    cover: '../img/a3.jpg'
                },
                {
                    id: 2,
                    title: "《JavaScript高级程序设计》",
                    author: "徐传运",
                    category: "technology",
                    description: "深入讲解JavaScript核心概念和高级特性，适合有一定基础的开发者阅读。",
                    year: 2021,
                    publisher: "人民邮电出版社",
                    isbn: "9787111234567",
                    status: "borrowed",
                    copies: 3,
                    borrowed: 3,
                    cover: '../img/a2.jpg'
                },
                {
                    id: 3,
                    title: "《CSS设计艺术》",
                    author: "姜勇",
                    category: "art",
                    description: "探索CSS的创意用法，打造精美网页界面，提升用户体验。",
                    year: 2023,
                    publisher: "清华大学出版社",
                    isbn: "9787301234567",
                    status: "available",
                    copies: 4,
                    borrowed: 1,
                    cover: '../img/a4.jpg'
                }
            ];
            
            booksData = defaultBooks;
            try {
                localStorage.setItem('library_books', JSON.stringify(booksData));
                console.log('manage-script: 初始化默认数据', booksData.length, '本');
            } catch (e) {
                console.error('保存初始书籍数据失败', e);
            }
        }
    }
    
    // 强制同步函数：确保数据完全一致
    function forceSyncBooks() {
        const stored = localStorage.getItem('library_books');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // 确保所有字段完整
                booksData = parsed.map(book => {
                    let coverUrl = book.cover || '../img/a1.jpg';
                    if (coverUrl && typeof coverUrl === 'string') {
                        coverUrl = coverUrl.replace(/\s+/g, '').trim();
                        if (coverUrl.includes('images.  .unsplash.com') || 
                            coverUrl.includes('images..unsplash.com') ||
                            (!coverUrl.startsWith('http') && !coverUrl.startsWith('../'))) {
                            coverUrl = '../img/a1.jpg';
                        }
                    }
                    
                    return {
                        id: book.id || Math.random() * 10000,
                        title: book.title || '未知书名',
                        author: book.author || '未知作者',
                        category: book.category || 'other',
                        status: book.status || 'available',
                        copies: book.copies || 1,
                        borrowed: book.borrowed || 0,
                        isbn: book.isbn || '',
                        publisher: book.publisher || '未知出版社',
                        year: book.year || new Date().getFullYear(),
                        description: book.description || (book.title ? `${book.title}是一本值得阅读的好书。` : '暂无简介'),
                        cover: coverUrl
                    };
                });
                
                // 保存修复后的数据
                localStorage.setItem('library_books', JSON.stringify(booksData));
                console.log('manage-script: 强制同步完成，共', booksData.length, '本图书');
            } catch(e) {
                console.error('强制同步失败', e);
            }
        }
    }
    
    // 初始化加载
    loadBooksFromStorage();
    forceSyncBooks(); // 强制同步确保数据一致
    
    // 监听书籍数据更新事件
    window.addEventListener('booksUpdated', function() {
        console.log('manage-script: 收到booksUpdated事件');
        loadBooksFromStorage();
        forceSyncBooks();
        displayBooks();
        updateTabCounts();
    });
    
    // 监听storage事件（跨标签页同步）
    window.addEventListener('storage', function(e) {
        if (e.key === 'library_books') {
            console.log('manage-script: 收到storage事件，刷新数据');
            loadBooksFromStorage();
            displayBooks();
            updateTabCounts();
        } else if (e.key === 'borrow_records') {
            loadBorrowRecords();
            displayBorrowRecords();
            updateTabCounts();
        }
    });
    
    // 定期检查数据更新（作为备用同步机制）
    setInterval(function() {
        const stored = localStorage.getItem('library_books');
        if (stored) {
            try {
                const latestData = JSON.parse(stored);
                // 检查数据是否发生变化（数量或内容）
                const currentStr = JSON.stringify(booksData);
                const latestStr = JSON.stringify(latestData);
                if (currentStr !== latestStr) {
                    console.log('manage-script: 检测到数据变化，自动刷新');
                    loadBooksFromStorage();
                    forceSyncBooks(); // 强制同步
                    displayBooks();
                    updateTabCounts();
                }
            } catch(e) {
                // 忽略解析错误
            }
        }
    }, 1000); // 每1秒检查一次（提高同步频率）
    
    // 页面可见性变化时刷新数据（切换标签页回来时）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('manage-script: 页面变为可见，刷新数据');
            loadBooksFromStorage();
            forceSyncBooks();
            displayBooks();
            updateTabCounts();
        }
    });
    
    // 窗口获得焦点时刷新数据
    window.addEventListener('focus', function() {
        console.log('manage-script: 窗口获得焦点，刷新数据');
        loadBooksFromStorage();
        forceSyncBooks();
        displayBooks();
        updateTabCounts();
    });
    
    // 用户数据（支持localStorage持久化）
    let usersData = [
        {
            id: 1,
            name: "温正东",
            role: "admin",
            email: "wenzhengdong@example.com",
            joinDate: "2025-01-15",
            borrowedBooks: 12
        },
        {
            id: 2,
            name: "徐传运",
            role: "user",
            email: "xuchuanyun@example.com",
            joinDate: "2025-03-22",
            borrowedBooks: 8
        },
        {
            id: 3,
            name: "姜勇",
            role: "user",
            email: "jiangyong@example.com",
            joinDate: "2025-05-10",
            borrowedBooks: 5
        },
    ];
    
    // 从localStorage加载用户数据
    function loadUsersFromStorage() {
        const stored = localStorage.getItem('library_users');
        if (stored) {
            try {
                usersData = JSON.parse(stored);
            } catch (e) {
                console.error('解析本地用户数据失败', e);
            }
        } else {
            // 初始化数据到localStorage
            try {
                localStorage.setItem('library_users', JSON.stringify(usersData));
            } catch (e) {
                console.error('保存初始用户数据失败', e);
            }
        }
    }
    
    // 保存用户数据到localStorage
    function saveUsersToStorage() {
        try {
            localStorage.setItem('library_users', JSON.stringify(usersData));
        } catch (e) {
            console.error('保存用户数据失败', e);
        }
    }
    
    // 初始化加载
    loadUsersFromStorage();
    
    // 借阅记录数据
    let borrowRecords = [
        {
            id: 1001,
            userId: 2,
            userName: "徐传运",
            bookId: 2,
            bookTitle: "《JavaScript高级程序设计》",
            borrowDate: "2023-10-15",
            dueDate: "2023-11-15",
            status: "borrowed"
        },
        {
            id: 1002,
            userId: 4,
            userName: "温正东",
            bookId: 1,
            bookTitle: "《Web开发指南》",
            borrowDate: "2023-10-05",
            dueDate: "2023-11-05",
            status: "returned"
        },
        {
            id: 1003,
            userId: 5,
            userName: "姜勇",
            bookId: 3,
            bookTitle: "《CSS设计艺术》",
            borrowDate: "2023-10-10",
            dueDate: "2023-11-10",
            status: "borrowed"
        },
    ];
    
    // 从localStorage加载借阅记录
    function loadBorrowRecords() {
        const stored = localStorage.getItem('borrow_records');
        if (stored) {
            try {
                borrowRecords = JSON.parse(stored);
            } catch (e) {
                console.error('解析本地借阅记录失败', e);
            }
        } else {
            // 初始化数据到localStorage
            try {
                localStorage.setItem('borrow_records', JSON.stringify(borrowRecords));
            } catch (e) {
                console.error('保存初始借阅记录失败', e);
            }
        }
    }
    
    // 保存借阅记录到localStorage
    function saveBorrowRecords() {
        try {
            localStorage.setItem('borrow_records', JSON.stringify(borrowRecords));
        } catch (e) {
            console.error('保存借阅记录失败', e);
        }
    }
    
    // 初始化加载
    loadBorrowRecords();
    
    // DOM元素
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const bookTableBody = document.getElementById('bookTableBody');
    const userList = document.getElementById('userList');
    const borrowTableBody = document.getElementById('borrowTableBody');
    const addBookForm = document.getElementById('addBookForm');
    
    // 检查角色并根据权限禁用/隐藏管理操作
    const currentRole = sessionStorage.getItem('userRole') || 'user';
    if (currentRole !== 'admin') {
        // 显示提示条
        const tabs = document.querySelector('.management-tabs');
        if (tabs && tabs.parentNode) {
            const warn = document.createElement('div');
            warn.className = 'admin-warning';
            warn.style = 'background:#fff3cd;color:#856404;border:1px solid #ffeeba;padding:12px;border-radius:6px;margin:0 auto 16px;max-width:1200px;';
            warn.textContent = '注意：当前为普通用户，管理权限被禁用。如需管理请以管理员身份登录。';
            tabs.parentNode.insertBefore(warn, tabs);
        }

        // 禁用添加表单（如果存在）
        if (addBookForm) {
            addBookForm.querySelectorAll('input,select,textarea,button[type=submit]').forEach(el => el.disabled = true);
        }
    }

    // 延迟初始化，确保DOM完全加载
    setTimeout(() => {
        displayBooks();
        displayUsers();
        displayBorrowRecords();
        updateTabCounts();
    }, 100);

    // 诊断性日志，便于查看脚本是否正确加载
    console.log('manage-script: init', {
        tabButtons: tabBtns.length,
        tabContents: tabContents.length,
        books: booksData.length,
        users: usersData.length,
        borrowRecords: borrowRecords.length,
        currentRole: currentRole
    });

    // 更新标签上的计数徽章
    function updateTabCounts() {
        const btnBookList = document.querySelector('[data-tab="book-list"]');
        const btnUsers = document.querySelector('[data-tab="user-management"]');
        const btnBorrow = document.querySelector('[data-tab="borrow-records"]');
        if (btnBookList) {
            let badge = btnBookList.querySelector('.tab-badge');
            if (!badge) { badge = document.createElement('span'); badge.className = 'tab-badge'; btnBookList.appendChild(badge); }
            badge.textContent = booksData.length;
        }
        if (btnUsers) {
            let badge = btnUsers.querySelector('.tab-badge');
            if (!badge) { badge = document.createElement('span'); badge.className = 'tab-badge'; btnUsers.appendChild(badge); }
            badge.textContent = usersData.length;
        }
        if (btnBorrow) {
            let badge = btnBorrow.querySelector('.tab-badge');
            if (!badge) { badge = document.createElement('span'); badge.className = 'tab-badge'; btnBorrow.appendChild(badge); }
            badge.textContent = borrowRecords.length;
        }
    }

    updateTabCounts();

    // 标签页切换功能 - 增强版
    function switchTab(tabId) {
        // 更新活动按钮
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // 显示对应内容
        tabContents.forEach(content => {
            if (content.id === tabId) {
                content.classList.add('active');
                // 当切换到某个标签页时，刷新对应数据
                if (tabId === 'book-list') {
                    loadBooksFromStorage();
                    forceSyncBooks(); // 切换标签页时也强制同步
                    displayBooks();
                } else if (tabId === 'user-management') {
                    loadUsersFromStorage();
                    displayUsers();
                } else if (tabId === 'borrow-records') {
                    loadBorrowRecords();
                    displayBorrowRecords();
                }
            } else {
                content.classList.remove('active');
            }
        });
        
        // 滚动到内容顶部，提升用户体验
        const activeContent = document.getElementById(tabId);
        if (activeContent) {
            setTimeout(() => {
                activeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
    
    // 为所有标签按钮添加点击事件
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');
            if (tabId) {
                switchTab(tabId);
            }
        });
    });
    
    // 确保初始化时显示正确的标签页（添加图书）
    if (tabBtns.length > 0 && tabContents.length > 0) {
        const firstTab = tabBtns[0].getAttribute('data-tab');
        if (firstTab) {
            switchTab(firstTab);
        }
    }
    
    // 添加图书表单提交
    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('bookTitle').value;
            const author = document.getElementById('bookAuthor').value;
            const category = document.getElementById('bookCategory').value;
            const copies = parseInt(document.getElementById('bookCopies').value);
            const status = document.getElementById('bookStatus').value;
            
            if (title && author && category) {
                // 重新加载数据，确保获取最新数据
                loadBooksFromStorage();
                
                // 生成新ID（确保ID唯一）
                const newId = booksData.length > 0 ? Math.max(...booksData.map(b => (b.id || 0))) + 1 : 1;
                
                // 获取所有字段
                const isbn = document.getElementById('bookIsbn').value.trim();
                const publisher = document.getElementById('bookPublisher').value.trim();
                const year = document.getElementById('bookYear').value ? parseInt(document.getElementById('bookYear').value) : new Date().getFullYear();
                const description = document.getElementById('bookDescription').value.trim();
                
                // 确保title包含书名号（如果没有）
                let formattedTitle = title.trim();
                if (!formattedTitle.startsWith('《') && !formattedTitle.startsWith('"')) {
                    formattedTitle = `《${formattedTitle}》`;
                }
                
                // 创建完整的新图书对象（包含所有必要字段）
                const newBook = {
                    id: newId,
                    title: formattedTitle,
                    author: author.trim(),
                    category: category,
                    status: status || 'available',
                    copies: copies || 1,
                    borrowed: 0,
                    isbn: isbn || `978${String(Date.now()).slice(-10)}${Math.floor(Math.random() * 100)}`,
                    publisher: publisher || '未知出版社',
                    year: year || new Date().getFullYear(),
                    description: description || `${formattedTitle}是一本值得阅读的好书。`,
                    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
                };
                
                // 只push一次
                booksData.push(newBook);
                
                // 持久化数据（确保格式完整）
                try {
                    // 确保新书数据完整
                    if (!newBook.cover || newBook.cover.includes('images.  .unsplash.com')) {
                        newBook.cover = '../img/a1.jpg';
                    }
                    if (!newBook.description) {
                        newBook.description = `${newBook.title}是一本值得阅读的好书。`;
                    }
                    
                    localStorage.setItem('library_books', JSON.stringify(booksData));
                    console.log('manage-script: 新图书已保存', newBook);
                } catch(e) {
                    console.error('保存失败', e);
                    alert('保存失败，请检查浏览器存储权限');
                    return;
                }
                
                // 触发自定义事件，通知当前窗口的其他组件（如浏览页面的iframe）
                try {
                    window.dispatchEvent(new Event('booksUpdated'));
                } catch(e) {
                    console.error('触发更新事件失败', e);
                }
                
                // 触发storage事件，通知其他窗口/标签页（同一域名）
                try {
                    // 创建一个storage事件来触发其他标签页的更新
                    window.dispatchEvent(new StorageEvent('storage', {
                        key: 'library_books',
                        newValue: JSON.stringify(booksData),
                        oldValue: localStorage.getItem('library_books')
                    }));
                } catch(e) {
                    console.warn('无法触发storage事件', e);
                }
                
                // 更新当前页面的显示
                displayBooks();
                updateTabCounts();
                
                // 重置表单
                addBookForm.reset();
                
                // 隐藏清空按钮（如果存在）
                const clearBtn = searchInput?.parentElement?.querySelector('.search-clear-btn');
                if (clearBtn) {
                    clearBtn.style.display = 'none';
                }
                
                // 显示成功消息（包含详细信息）
                alert(`✅ 图书添加成功！\n\n书名：${formattedTitle}\n作者：${author}\n分类：${category}\n副本数：${copies}\n\n新图书已保存，可以在浏览页面搜索和查看。`);
                
                // 切换到图书列表标签页，让用户看到新添加的图书
                const bookListBtn = document.querySelector('[data-tab="book-list"]');
                if (bookListBtn) {
                    switchTab('book-list');
                }
            } else {
                alert('请填写所有必填字段！');
            }
        });
    }
    
    // 功能函数
    function displayBooks() {
        if (!bookTableBody) return;

        bookTableBody.innerHTML = '';

        if (!booksData || booksData.length === 0) {
            bookTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:#666;">暂无图书</td></tr>`;
            updateTabCounts();
            return;
        }

        booksData.forEach(book => {
            const row = document.createElement('tr');

            const statusClass = book.status === 'available' ? 'status-available' : 
                              book.status === 'borrowed' ? 'status-borrowed' : 'status-maintenance';
            const statusText = book.status === 'available' ? '可借阅' : 
                             book.status === 'borrowed' ? '已借出' : '维护中';

            row.innerHTML = `
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${getCategoryName(book.category)}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${book.copies} (已借${book.borrowed})</td>
                <td class="action-cell">
                    ${currentRole === 'admin' ? `<button class="btn btn-small btn-edit" data-id="${book.id}">编辑</button><button class="btn btn-small btn-delete" data-id="${book.id}">删除</button>` : `-`}
                </td>
            `;

            bookTableBody.appendChild(row);
        });

        // 添加事件监听器
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = parseInt(this.getAttribute('data-id'));
                editBook(bookId);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = parseInt(this.getAttribute('data-id'));
                deleteBook(bookId);
            });
        });

        updateTabCounts();
    }

    // 获取分类名称工具
    function getCategoryName(code) {
        const map = {
            'technology': '计算机技术',
            'literature': '文学小说',
            'science': '自然科学',
            'history': '历史人文',
            'art': '艺术设计',
            'education': '教育学习',
            'business': '经济管理'
        };
        return map[code] || code || '未分类';
    }

    // 编辑图书（简易表单式）
    function editBook(id) {
        const book = booksData.find(b => b.id === id);
        if (!book) return alert('未找到该图书');

        const newTitle = prompt('书名：', book.title);
        if (newTitle === null) return; // 取消
        const newAuthor = prompt('作者：', book.author);
        if (newAuthor === null) return;
        const newCopies = prompt('副本数：', book.copies);
        if (newCopies === null) return;
        const newStatus = prompt('状态（available/borrowed/maintenance）：', book.status);
        if (newStatus === null) return;

        book.title = newTitle.trim() || book.title;
        book.author = newAuthor.trim() || book.author;
        book.copies = parseInt(newCopies) || book.copies;
        book.status = ['available','borrowed','maintenance'].includes(newStatus) ? newStatus : book.status;

        // 持久化
        try {
            localStorage.setItem('library_books', JSON.stringify(booksData));
            console.log('manage-script: 图书信息已更新并保存');
        } catch(e) {
            console.error('保存失败', e);
            alert('保存失败，请检查浏览器存储权限');
            return;
        }
        
        // 触发同步事件
        window.dispatchEvent(new Event('booksUpdated'));
        window.dispatchEvent(new CustomEvent('booksDataChanged', {
            detail: { booksData: booksData }
        }));
        
        displayBooks();
        updateTabCounts();
        alert('图书信息已更新');
    }

    // 删除图书
    function deleteBook(id) {
        const book = booksData.find(b => b.id === id);
        if (!book) {
            alert('图书不存在');
            return;
        }
        
        // 检查是否有借阅记录
        const hasBorrowed = borrowRecords.some(r => r.bookId === id && r.status === 'borrowed');
        if (hasBorrowed) {
            if (!confirm(`该图书当前有借阅记录，删除后相关借阅记录也将被删除。\n确认要删除图书"${book.title}"吗？此操作不可撤销。`)) {
                return;
            }
            // 删除相关借阅记录
            borrowRecords = borrowRecords.filter(r => r.bookId !== id);
            saveBorrowRecords();
        } else {
            if (!confirm(`确认要删除图书"${book.title}"吗？此操作不可撤销。`)) {
                return;
            }
        }
        
        const idx = booksData.findIndex(b => b.id === id);
        if (idx !== -1) {
            booksData.splice(idx, 1);
        }
        
        try {
            localStorage.setItem('library_books', JSON.stringify(booksData));
            console.log('manage-script: 图书已删除并保存');
        } catch(e) {
            console.error('保存失败', e);
            alert('删除失败，请检查浏览器存储权限');
            return;
        }
        
        // 触发同步事件
        window.dispatchEvent(new Event('booksUpdated'));
        window.dispatchEvent(new CustomEvent('booksDataChanged', {
            detail: { booksData: booksData }
        }));
        
        displayBooks();
        displayBorrowRecords();
        updateTabCounts();
        alert('图书已删除');
    }

    // 渲染用户列表
    function displayUsers() {
        if (!userList) return;
        userList.innerHTML = '';

        if (!usersData || usersData.length === 0) {
            const empty = document.createElement('div');
            empty.style.padding = '20px';
            empty.style.color = '#666';
            empty.textContent = '暂无用户';
            userList.appendChild(empty);
            updateTabCounts();
            return;
        }

        usersData.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            const roleClass = user.role === 'admin' ? 'admin' : '';
            const roleText = user.role === 'admin' ? '管理员' : '普通用户';
            const initials = user.name.split('').filter(char => char.charCodeAt(0) > 255).join('') || user.name.substring(0,2).toUpperCase();

            userCard.innerHTML = `
                <div class="user-header">
                    <div class="user-avatar">${initials}</div>
                    <div>
                        <div class="user-name">${user.name}</div>
                        <span class="user-role ${roleClass}">${roleText}</span>
                    </div>
                </div>
                <p><strong>邮箱:</strong> ${user.email}</p>
                <p><strong>加入日期:</strong> ${user.joinDate}</p>
                <div class="user-stats">
                    <div class="stat-item">
                        <div class="stat-value">${user.borrowedBooks}</div>
                        <div class="stat-label">已借图书</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${user.role === 'admin' ? '∞' : '10'}</div>
                        <div class="stat-label">可借数量</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${user.role === 'admin' ? '是' : '否'}</div>
                        <div class="stat-label">管理权限</div>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                    <button class="btn btn-small btn-edit" data-user-id="${user.id}">编辑</button>
                    ${user.role !== 'admin' ? `<button class="btn btn-small btn-delete" data-user-id="${user.id}">删除</button>` : ''}
                </div>
            `;

            userList.appendChild(userCard);
        });

        // 添加事件监听器
        document.querySelectorAll('.btn-edit[data-user-id]').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-user-id'));
                editUser(userId);
            });
        });

        document.querySelectorAll('.btn-delete[data-user-id]').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-user-id'));
                deleteUser(userId);
            });
        });

        updateTabCounts();
    }

    // 编辑用户（简易方式）
    function editUser(id) {
        const user = usersData.find(u => u.id === id);
        if (!user) {
            alert('未找到该用户');
            return;
        }

        const newName = prompt('姓名：', user.name);
        if (newName === null) return;
        const newEmail = prompt('邮箱：', user.email);
        if (newEmail === null) return;
        const newRole = prompt('角色 (admin/user)：', user.role);
        if (newRole === null) return;

        user.name = newName.trim() || user.name;
        user.email = newEmail.trim() || user.email;
        user.role = (newRole.trim().toLowerCase() === 'admin') ? 'admin' : 'user';

        saveUsersToStorage();
        displayUsers();
        updateTabCounts();
        alert('用户信息已更新');
    }

    // 删除用户
    function deleteUser(id) {
        const user = usersData.find(u => u.id === id);
        if (!user) {
            alert('用户不存在');
            return;
        }
        
        // 检查是否是管理员
        if (user.role === 'admin') {
            alert('不能删除管理员用户');
            return;
        }
        
        // 检查是否有借阅记录
        const hasBorrowed = borrowRecords.some(r => r.userId === id && r.status === 'borrowed');
        if (hasBorrowed) {
            if (!confirm(`用户"${user.name}"当前有未归还的借阅记录。\n确认要删除此用户吗？删除后相关借阅记录也将被删除。`)) {
                return;
            }
            // 删除相关借阅记录
            borrowRecords = borrowRecords.filter(r => r.userId !== id);
            saveBorrowRecords();
        } else {
            if (!confirm(`确认要删除用户"${user.name}"吗？此操作不可撤销。`)) {
                return;
            }
        }
        
        const idx = usersData.findIndex(u => u.id === id);
        if (idx !== -1) {
            usersData.splice(idx, 1);
        }
        
        saveUsersToStorage();
        displayUsers();
        displayBorrowRecords();
        updateTabCounts();
        alert('用户已删除');
    }

    // 渲染借阅记录
    function displayBorrowRecords() {
        if (!borrowTableBody) return;
        borrowTableBody.innerHTML = '';

        if (!borrowRecords || borrowRecords.length === 0) {
            borrowTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;color:#666;">暂无借阅记录</td></tr>`;
            updateTabCounts();
            return;
        }

        borrowRecords.forEach(rec => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${rec.id}</td>
                <td>${rec.userName}</td>
                <td>${rec.bookTitle}</td>
                <td>${rec.borrowDate}</td>
                <td>${rec.dueDate}</td>
                <td><span class="status-badge ${rec.status === 'borrowed' ? 'status-borrowed' : 'status-available'}">${rec.status === 'borrowed' ? '借出中' : '已归还'}</span></td>
                <td class="action-cell">
                    ${rec.status === 'borrowed' ? `<button class="btn btn-small btn-primary btn-return" data-id="${rec.id}">标记归还</button>` : ''}
                    <button class="btn btn-small btn-delete" data-id="${rec.id}">删除</button>
                </td>
            `;
            borrowTableBody.appendChild(row);
        });

        // 绑定操作
        document.querySelectorAll('.btn-return').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                markReturned(id);
            });
        });

        document.querySelectorAll('#borrowTableBody .btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteBorrowRecord(id);
            });
        });

        updateTabCounts();
    }

    function markReturned(id) {
        const rec = borrowRecords.find(r => r.id === id);
        if (!rec) {
            alert('记录不存在');
            return;
        }
        
        if (rec.status === 'returned') {
            alert('该记录已经标记为已归还');
            return;
        }
        
        rec.status = 'returned';
        
        // 同步更新对应书籍的 borrowed 数和状态
        const book = booksData.find(b => b.id === rec.bookId);
        if (book) {
            if (book.borrowed > 0) {
                book.borrowed--;
            }
            // 如果所有副本都已归还，更新状态为可借阅
            if (book.borrowed < book.copies) {
                book.status = 'available';
            }
        }
        
        // 保存数据
        try {
            localStorage.setItem('library_books', JSON.stringify(booksData));
            console.log('manage-script: 图书归还状态已更新并保存');
        } catch(e) {
            console.error('保存失败', e);
        }
        saveBorrowRecords();
        
        // 触发同步事件
        window.dispatchEvent(new Event('booksUpdated'));
        window.dispatchEvent(new CustomEvent('booksDataChanged', {
            detail: { booksData: booksData }
        }));
        
        // 更新显示
        displayBorrowRecords();
        displayBooks();
        updateTabCounts();
        
        alert('已标记为归还');
    }

    function deleteBorrowRecord(id) {
        const idx = borrowRecords.findIndex(r => r.id === id);
        if (idx === -1) {
            alert('记录不存在');
            return;
        }
        
        if (!confirm('确认删除此借阅记录？此操作不可撤销。')) {
            return;
        }
        
        borrowRecords.splice(idx, 1);
        saveBorrowRecords();
        displayBorrowRecords();
        updateTabCounts();
    }
    
}); // 结束 DOMContentLoaded 事件监听器
