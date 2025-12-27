// 浏览页面的JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 注意：默认数据已移除，完全依赖localStorage
    // 如果没有localStorage数据，会在loadBooksFromStorage中初始化最小数据集
    let booksData = [];
    
    // 分页设置
    let currentPage = 1;
    const booksPerPage = 6;
    let filteredBooks = [...booksData];
    
    // 数据同步：从 localStorage 加载/初始化
    function loadBooksFromStorage() {
        const stored = localStorage.getItem('library_books');
        if (stored) {
            try { 
                booksData = JSON.parse(stored);
                // 确保数据完整性：为每本书添加必要的默认字段
                booksData = booksData.map(book => {
                    // 修复错误的图片URL（去掉空格等）
                    let coverUrl = book.cover || '../img/a3.avif';
                    if (coverUrl && typeof coverUrl === 'string') {
                        coverUrl = coverUrl.replace(/\s+/g, '').trim();
                        if (coverUrl.includes('images.  .unsplash.com') || 
                            coverUrl.includes('images..unsplash.com') ||
                            (!coverUrl.startsWith('http') && !coverUrl.startsWith('../'))) {
                            coverUrl = '../img/a3.avif';
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
            } catch (e) { 
                console.error('解析本地书籍数据失败', e);
                booksData = [];
            }
        } else {
            // 如果没有localStorage数据，使用与管理页面相同的最小默认数据集
            console.log('browse-script: localStorage中没有数据，初始化默认数据');
            const defaultBooks = [
                {
                    id: 1,
                    title: "《Web开发指南》",
                    author: "张明",
                    category: "technology",
                    description: "一本全面介绍现代Web开发技术的实用指南，涵盖HTML、CSS、JavaScript等核心技术。",
                    year: 2025,
                    publisher: "电子工业出版社",
                    isbn: "9787121234567",
                    status: "available",
                    copies: 5,
                    borrowed: 0,
                    cover: '../img/a3.avif'
                },
                {
                    id: 2,
                    title: "《JavaScript高级程序设计》",
                    author: "李华",
                    category: "technology",
                    description: "深入讲解JavaScript核心概念和高级特性，适合有一定基础的开发者阅读。",
                    year: 2025,
                    publisher: "人民邮电出版社",
                    isbn: "9787111234567",
                    status: "borrowed",
                    copies: 3,
                    borrowed: 3,
                    cover: '../img/a2.avif'
                },
                {
                    id: 3,
                    title: "《CSS设计艺术》",
                    author: "王芳",
                    category: "art",
                    description: "探索CSS的创意用法，打造精美网页界面，提升用户体验。",
                    year: 2025,
                    publisher: "清华大学出版社",
                    isbn: "9787301234567",
                    status: "available",
                    copies: 4,
                    borrowed: 1,
                    cover: '../img/a4.avif'
                }
            ];
            
            booksData = defaultBooks;
            
            try { 
                localStorage.setItem('library_books', JSON.stringify(booksData)); 
                console.log('browse-script: 初始化默认数据到localStorage', booksData.length, '本');
            } catch (e) { 
                console.error('保存初始数据失败', e); 
            }
        }
        
        // 保存修复后的数据到localStorage（确保数据始终是最新且格式正确）
        // 注意：这个保存操作在每次loadBooksFromStorage时都会执行，确保数据格式一致

        // 注意：不再自动添加demo books，完全依赖localStorage中的数据
        // 这样确保管理页面和浏览页面使用相同的数据源

        // 更新筛选后的图书列表（如果DOM元素已加载，保持当前筛选条件；否则显示所有）
        let searchTerm = '';
        let category = '';
        let status = '';
        
        // 安全获取DOM元素的值
        try {
            if (typeof searchInput !== 'undefined' && searchInput) {
                searchTerm = searchInput.value ? searchInput.value.toLowerCase().trim() : '';
            }
            if (typeof categoryFilter !== 'undefined' && categoryFilter) {
                category = categoryFilter.value || '';
            }
            if (typeof statusFilter !== 'undefined' && statusFilter) {
                status = statusFilter.value || '';
            }
        } catch(e) {
            // DOM元素可能还未加载，使用空值
        }
        
        // 如果有筛选条件，应用筛选；否则显示所有图书
        if (category || status || searchTerm) {
            filteredBooks = booksData.filter(book => {
                let match = true;
                if (category && book.category !== category) match = false;
                if (status && book.status !== status) match = false;
                if (match && searchTerm) {
                    const matchSearch = (book.title && book.title.toLowerCase().includes(searchTerm)) || 
                                       (book.author && book.author.toLowerCase().includes(searchTerm)) ||
                                       (book.description && book.description.toLowerCase().includes(searchTerm)) ||
                                       (book.publisher && book.publisher.toLowerCase().includes(searchTerm)) ||
                                       (book.isbn && book.isbn.includes(searchTerm));
                    if (!matchSearch) match = false;
                }
                return match;
            });
        } else {
            // 没有筛选条件，显示所有图书
            filteredBooks = [...booksData];
        }
        
        console.log('browse-script: loaded books', booksData.length, 'filtered:', filteredBooks.length);
    }

    // 强制同步函数：确保数据完全一致
    function forceSyncBooks() {
        const stored = localStorage.getItem('library_books');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // 确保所有字段完整
                booksData = parsed.map(book => {
                    let coverUrl = book.cover || '../img/a3.avif';
                    if (coverUrl && typeof coverUrl === 'string') {
                        coverUrl = coverUrl.replace(/\s+/g, '').trim();
                        if (coverUrl.includes('images.  .unsplash.com') || 
                            coverUrl.includes('images..unsplash.com') ||
                            (!coverUrl.startsWith('http') && !coverUrl.startsWith('../'))) {
                            coverUrl = '../img/a3.avif';
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
                // 额外：根据书名修正作者与封面（用于修复已有storage中不一致的示例数据）
                const fixes = {
                    '《Web开发指南》': { author: '张明', cover: '../img/a3.avif' },
                    '《JavaScript高级程序设计》': { author: '李华', cover: '../img/a2.avif' },
                    '《CSS设计艺术》': { author: '王芳', cover: '../img/a4.avif' }
                };
                booksData = booksData.map(b => {
                    if (b && b.title && fixes[b.title]) {
                        return Object.assign({}, b, { author: fixes[b.title].author, cover: fixes[b.title].cover });
                    }
                    return b;
                });
                localStorage.setItem('library_books', JSON.stringify(booksData));
                console.log('browse-script: 强制同步完成，共', booksData.length, '本图书');
            } catch(e) {
                console.error('强制同步失败', e);
            }
        }
    }
    
    // 在当前窗口内或其它窗口有更新时刷新显示
    window.addEventListener('booksUpdated', function() {
        console.log('browse-script: 收到booksUpdated事件，刷新数据');
        loadBooksFromStorage();
        forceSyncBooks(); // 强制同步
        currentPage = 1;
        displayBooks();
        updatePagination();
        
        // 如果当前有搜索条件，重新应用筛选
        if (searchInput && searchInput.value.trim()) {
            applyAllFilters();
        }
    });
    
    // 监听自定义数据变化事件
    window.addEventListener('booksDataChanged', function(e) {
        console.log('browse-script: 收到booksDataChanged事件，刷新数据');
        if (e.detail && e.detail.booksData) {
            // 直接使用新的数据
            booksData = e.detail.booksData;
            loadBooksFromStorage();
            currentPage = 1;
            displayBooks();
            updatePagination();
        }
    });

    // 监听storage事件（跨标签页同步）
    window.addEventListener('storage', function(e) {
        if (e.key === 'library_books') {
            console.log('browse-script: 收到storage事件，刷新数据');
            loadBooksFromStorage();
            currentPage = 1;
            displayBooks();
            updatePagination();
            
            // 如果当前有搜索条件，重新应用筛选
            if (searchInput && searchInput.value.trim()) {
                applyAllFilters();
            }
        }
    });
    
    // 定期检查数据更新（作为备用机制，确保数据同步）
    setInterval(function() {
        const stored = localStorage.getItem('library_books');
        if (stored) {
            try {
                const latestData = JSON.parse(stored);
                // 如果数据数量或内容发生变化，刷新显示
                const currentStr = JSON.stringify(booksData);
                const latestStr = JSON.stringify(latestData);
                const hasChanged = latestData.length !== booksData.length || currentStr !== latestStr;
                
                if (hasChanged) {
                    console.log('browse-script: 检测到数据变化，自动刷新');
                    loadBooksFromStorage();
                    forceSyncBooks(); // 强制同步
                    currentPage = 1;
                    displayBooks();
                    updatePagination();
                    
                    // 如果当前有搜索条件，重新应用筛选
                    if (searchInput && searchInput.value.trim()) {
                        applyAllFilters();
                    }
                }
            } catch(e) {
                // 忽略解析错误
            }
        }
    }, 1000); // 每1秒检查一次（提高同步频率）
    
    // 页面可见性变化时刷新数据（切换标签页回来时）
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log('browse-script: 页面变为可见，刷新数据');
            loadBooksFromStorage();
            forceSyncBooks();
            currentPage = 1;
            displayBooks();
            updatePagination();
        }
    });
    
    // 窗口获得焦点时刷新数据
    window.addEventListener('focus', function() {
        console.log('browse-script: 窗口获得焦点，刷新数据');
        loadBooksFromStorage();
        forceSyncBooks();
        currentPage = 1;
        displayBooks();
        updatePagination();
    });

    // DOM元素 - 先定义所有DOM元素
    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortBy = document.getElementById('sortBy');
    const resetFilters = document.getElementById('resetFilters');
    const bookCount = document.getElementById('bookCount');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const bookModal = document.getElementById('bookModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close-modal');
    
    // 检查必要的DOM元素是否存在
    if (!booksGrid || !bookCount) {
        console.error('浏览页面: 必要的DOM元素未找到，请检查HTML结构');
        return;
    }
    
    // 借阅记录（本地存储同步）
    let borrowRecords = [];
    function loadBorrowRecords() {
        try { borrowRecords = JSON.parse(localStorage.getItem('borrow_records') || '[]'); } catch(e) { borrowRecords = []; }
    }
    function saveBorrowRecords() {
        try { localStorage.setItem('borrow_records', JSON.stringify(borrowRecords)); } catch(e) { console.error(e); }
    }
    function displayBorrowRecords() {
        // 如果页面中有借阅记录表格则渲染，否则保持静默（兼容管理页与浏览页）
        const borrowTable = document.getElementById && document.getElementById('borrowTableBody');
        if (!borrowTable) return;
        borrowTable.innerHTML = '';
        borrowRecords.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${r.id}</td><td>${r.userName || '匿名'}</td><td>${r.bookTitle}</td><td>${r.borrowDate}</td><td>${r.status}</td>`;
            borrowTable.appendChild(tr);
        });
    }
    loadBorrowRecords();
    displayBorrowRecords();
    
    // 搜索框焦点和清空功能增强
    if (searchInput) {
        // 添加清空按钮（当有内容时显示）
        const searchBox = searchInput.parentElement;
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'search-clear-btn';
        clearBtn.innerHTML = '<i class="fas fa-times"></i>';
        clearBtn.style.cssText = 'position:absolute;right:110px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.9);border:none;border-radius:50%;width:24px;height:24px;color:#999;cursor:pointer;padding:0;display:none;z-index:10;font-size:12px;line-height:24px;text-align:center;transition:all 0.2s;';
        
        // 悬停效果
        clearBtn.addEventListener('mouseenter', function() {
            this.style.background = '#f0f0f0';
            this.style.color = '#666';
        });
        clearBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255,255,255,0.9)';
            this.style.color = '#999';
        });
        clearBtn.title = '清空搜索';
        
        searchBox.style.position = 'relative';
        searchBox.appendChild(clearBtn);
        
        // 显示/隐藏清空按钮
        function toggleClearBtn() {
            if (searchInput.value.trim()) {
                clearBtn.style.display = 'block';
            } else {
                clearBtn.style.display = 'none';
            }
        }
        
        // 清空按钮点击事件
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            toggleClearBtn();
            applyAllFilters(); // 重新应用筛选（可能还有其他筛选条件）
        });
        
        // 输入时显示/隐藏清空按钮
        searchInput.addEventListener('input', toggleClearBtn);
        
        // 页面加载时检查
        toggleClearBtn();
    }
    
    // 统一的筛选、搜索和排序函数 - 同时应用所有条件
    function applyAllFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const category = categoryFilter.value;
        const status = statusFilter.value;
        const sortOption = sortBy.value;
        
        // 从原始数据开始筛选
        filteredBooks = booksData.filter(book => {
            let match = true;
            
            // 分类筛选
            if (category && book.category !== category) {
                match = false;
            }
            
            // 状态筛选
            if (status && book.status !== status) {
                match = false;
            }
            
            // 搜索关键词筛选（如果有关键词）
            if (match && searchTerm) {
                const matchSearch = (book.title && book.title.toLowerCase().includes(searchTerm)) || 
                                   (book.author && book.author.toLowerCase().includes(searchTerm)) ||
                                   (book.description && book.description.toLowerCase().includes(searchTerm)) ||
                                   (book.publisher && book.publisher.toLowerCase().includes(searchTerm)) ||
                                   (book.isbn && book.isbn.includes(searchTerm));
                if (!matchSearch) {
                    match = false;
                }
            }
            
            return match;
        });
        
        // 排序
        if (sortOption) {
            filteredBooks.sort((a, b) => {
                switch(sortOption) {
                    case 'title':
                        return (a.title || '').localeCompare(b.title || '', 'zh-CN');
                    case 'author':
                        return (a.author || '').localeCompare(b.author || '', 'zh-CN');
                    case 'year':
                        return (a.year || 0) - (b.year || 0);
                    case 'year-desc':
                        return (b.year || 0) - (a.year || 0);
                    default:
                        return 0;
                }
            });
        }
        
        // 如果筛选后无结果，显示提示
        if (filteredBooks.length === 0 && (searchTerm || category || status)) {
            // 延迟显示提示，避免频繁弹窗
            if (!window._hasShownNoResults) {
                setTimeout(() => {
                    alert('没有找到符合条件的图书，请尝试其他搜索条件。');
                    window._hasShownNoResults = true;
                    setTimeout(() => { window._hasShownNoResults = false; }, 1000);
                }, 300);
            }
        }
        
        // 重置到第一页并更新显示
        currentPage = 1;
        displayBooks();
        updatePagination();
    }
    
    // 搜索功能
    searchBtn.addEventListener('click', function() {
        if (!searchBtn.disabled) {
            const orig = searchBtn.innerHTML;
            searchBtn.disabled = true;
            searchBtn.classList.add('loading');
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 搜索中...';
            
            setTimeout(() => {
                applyAllFilters();
                searchBtn.disabled = false;
                searchBtn.classList.remove('loading');
                searchBtn.innerHTML = orig;
            }, 200);
        }
    });
    
    // 搜索框回车键支持
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !searchBtn.disabled) {
            e.preventDefault();
            searchBtn.click();
        }
    });
    
    // 筛选功能 - 分类下拉框改变时自动应用
    categoryFilter.addEventListener('change', function() {
        applyAllFilters();
    });
    
    // 筛选功能 - 状态下拉框改变时自动应用
    statusFilter.addEventListener('change', function() {
        applyAllFilters();
    });
    
    // 排序功能 - 排序下拉框改变时自动应用
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            applyAllFilters();
        });
    }
    
    // 重置筛选按钮 - 清空所有条件并显示所有图书
    resetFilters.addEventListener('click', function() {
        if (!resetFilters.disabled) {
            const orig = resetFilters.innerHTML;
            resetFilters.disabled = true;
            resetFilters.classList.add('loading');
            resetFilters.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 重置中...';
            
            setTimeout(() => {
                // 清空所有筛选条件
                searchInput.value = '';
                categoryFilter.value = '';
                statusFilter.value = '';
                if (sortBy) sortBy.value = '';
                
                // 重置为所有图书
                filteredBooks = [...booksData];
                currentPage = 1;
                
                // 更新显示
                displayBooks();
                updatePagination();
                
                // 恢复按钮状态
                resetFilters.disabled = false;
                resetFilters.classList.remove('loading');
                resetFilters.innerHTML = orig;
                
                // 将焦点返回到搜索框，方便用户继续操作
                searchInput.focus();
            }, 200);
        }
    });
    
    // 分页功能 - 上一页按钮
    prevPage.addEventListener('click', function() {
        const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
        if (currentPage > 1 && !prevPage.disabled) {
            const orig = prevPage.innerHTML;
            prevPage.disabled = true;
            nextPage.disabled = true; // 防止快速点击
            prevPage.classList.add('loading');
            prevPage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
            
            setTimeout(() => {
                currentPage--;
                displayBooks();
                updatePagination();
                prevPage.disabled = false;
                nextPage.disabled = false;
                prevPage.classList.remove('loading');
                prevPage.innerHTML = orig;
                
                // 滚动到图书列表顶部，提升用户体验
                booksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        }
    });
    
    // 分页功能 - 下一页按钮
    nextPage.addEventListener('click', function() {
        const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
        if (currentPage < totalPages && !nextPage.disabled) {
            const orig = nextPage.innerHTML;
            prevPage.disabled = true; // 防止快速点击
            nextPage.disabled = true;
            nextPage.classList.add('loading');
            nextPage.innerHTML = '加载中... <i class="fas fa-spinner fa-spin"></i>';
            
            setTimeout(() => {
                currentPage++;
                displayBooks();
                updatePagination();
                prevPage.disabled = false;
                nextPage.disabled = false;
                nextPage.classList.remove('loading');
                nextPage.innerHTML = orig;
                
                // 滚动到图书列表顶部，提升用户体验
                booksGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        }
    });
    
    // 模态框功能
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            bookModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === bookModal) {
            bookModal.style.display = 'none';
        }
    });
    
    // 注意：applyAllFilters 函数已在上面定义，这里不再需要 performSearch 和 applyFilters
    
    function displayBooks() {
        if (!booksGrid || !bookCount) {
            console.warn('浏览页面: DOM元素未准备好，跳过显示');
            return;
        }

        booksGrid.innerHTML = '';

        // 总数显示
        if (bookCount) {
            bookCount.textContent = `(${filteredBooks.length}本)`;
        }

        if (!filteredBooks || filteredBooks.length === 0) {
            const searchTerm = (searchInput && searchInput.value) ? searchInput.value.trim() : '';
            const category = (categoryFilter && categoryFilter.value) ? categoryFilter.value : '';
            const status = (statusFilter && statusFilter.value) ? statusFilter.value : '';
            
            let message = '暂无图书';
            if (searchTerm || category || status) {
                message = '没有找到符合条件的图书';
                if (searchTerm) {
                    message += `<br><small style="color:#999;">搜索关键词: "${searchTerm}"</small>`;
                }
                if (category) {
                    const categoryNames = {
                        'technology': '计算机技术',
                        'literature': '文学小说',
                        'science': '自然科学',
                        'history': '历史人文',
                        'art': '艺术设计'
                    };
                    message += `<br><small style="color:#999;">分类: ${categoryNames[category] || category}</small>`;
                }
                if (status) {
                    message += `<br><small style="color:#999;">状态: ${status === 'available' ? '可借阅' : '已借出'}</small>`;
                }
            }
            
            booksGrid.innerHTML = `<div class="no-results" style="padding:40px 20px;text-align:center;color:#666;line-height:1.8;">
                <i class="fas fa-book-open" style="font-size:48px;color:#ccc;margin-bottom:15px;display:block;"></i>
                <p style="font-size:18px;margin-bottom:10px;">${message}</p>
                <button class="btn btn-outline btn-small" onclick="document.getElementById('resetFilters').click();" style="margin-top:15px;">
                    <i class="fas fa-redo"></i> 重置筛选条件
                </button>
            </div>`;
            return;
        }

        const start = (currentPage - 1) * booksPerPage;
        const pageBooks = filteredBooks.slice(start, start + booksPerPage);

        pageBooks.forEach(book => {
            const card = document.createElement('div');
            card.className = 'book-card';

            // 获取分类名称
            const categoryNames = {
                'technology': '计算机技术',
                'literature': '文学小说',
                'science': '自然科学',
                'history': '历史人文',
                'art': '艺术设计',
                'education': '教育学习',
                'business': '经济管理'
            };
            const categoryName = categoryNames[book.category] || book.category || '未分类';
            
            // 计算可用副本数
            const borrowedCount = book.borrowed || 0;
            const availableCount = (book.copies || 0) - borrowedCount;
            
            card.innerHTML = `
                <div class="book-cover">
                    <img src="${book.cover || '../img/a3.avif'}" alt="${book.title}" onerror="this.onerror=null; this.src='../img/a3.avif';">
                    ${book.status === 'available' ? '<div class="book-badge available-badge"><i class="fas fa-check-circle"></i> 可借</div>' : '<div class="book-badge borrowed-badge"><i class="fas fa-times-circle"></i> 已借</div>'}
                </div>
                <div class="book-info">
                    <div class="book-category-tag">${categoryName}</div>
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-author"><i class="fas fa-user"></i> ${book.author}</p>
                    <p class="book-desc">${(book.description || '').substring(0, 60)}${(book.description || '').length > 60 ? '...' : ''}</p>
                    <div class="book-meta">
                        ${book.year ? `<span class="book-year"><i class="fas fa-calendar"></i> ${book.year}</span>` : ''}
                        ${book.copies ? `<span class="book-copies"><i class="fas fa-copy"></i> ${availableCount}/${book.copies} 可借</span>` : ''}
                    </div>
                    <div class="book-status ${book.status === 'available' ? 'available' : 'borrowed'}">
                        ${book.status === 'available' ? '<i class="fas fa-check"></i> 可借阅' : '<i class="fas fa-times"></i> 已借出'}
                    </div>
                </div>
            `;

            // 点击封面或标题打开详情模态框（添加鼠标悬停效果）
            const coverImg = card.querySelector('.book-cover img');
            const titleEl = card.querySelector('.book-title');
            
            if (coverImg) {
                coverImg.style.cursor = 'pointer';
                coverImg.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.transition = 'transform 0.3s ease';
                });
                coverImg.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
                coverImg.addEventListener('click', () => openBookModal(book.id));
            }
            
            if (titleEl) {
                titleEl.style.cursor = 'pointer';
                titleEl.style.color = '#4a6fa5';
                titleEl.addEventListener('mouseenter', function() {
                    this.style.textDecoration = 'underline';
                });
                titleEl.addEventListener('mouseleave', function() {
                    this.style.textDecoration = 'none';
                });
                titleEl.addEventListener('click', () => openBookModal(book.id));
            }

            booksGrid.appendChild(card);
        });

        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.max(1, Math.ceil(filteredBooks.length / booksPerPage));
        
        // 确保当前页不超出范围
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        if (currentPage < 1) {
            currentPage = 1;
        }
        
        // 更新分页信息显示
        if (currentPageSpan) {
            currentPageSpan.textContent = currentPage;
        }
        if (totalPagesSpan) {
            totalPagesSpan.textContent = totalPages;
        }
        
        // 更新按钮状态
        if (prevPage) {
            prevPage.disabled = currentPage <= 1 || filteredBooks.length === 0;
            // 添加视觉反馈
            if (prevPage.disabled) {
                prevPage.style.opacity = '0.5';
                prevPage.style.cursor = 'not-allowed';
            } else {
                prevPage.style.opacity = '1';
                prevPage.style.cursor = 'pointer';
            }
        }
        
        if (nextPage) {
            nextPage.disabled = currentPage >= totalPages || filteredBooks.length === 0;
            // 添加视觉反馈
            if (nextPage.disabled) {
                nextPage.style.opacity = '0.5';
                nextPage.style.cursor = 'not-allowed';
            } else {
                nextPage.style.opacity = '1';
                nextPage.style.cursor = 'pointer';
            }
        }
    }

    function openBookModal(id) {
        const book = booksData.find(b => b.id === id);
        if (!book) { 
            alert('未找到该图书');
            return;
        }
        
        // 获取分类名称
        const categoryNames = {
            'technology': '计算机技术',
            'literature': '文学小说',
            'science': '自然科学',
            'history': '历史人文',
            'art': '艺术设计',
            'education': '教育学习',
            'business': '经济管理'
        };
        const categoryName = categoryNames[book.category] || book.category || '未分类';
        
        const borrowedCount = book.borrowed || 0;
        const availableCount = (book.copies || 0) - borrowedCount;
        const isAvailable = book.status === 'available' && availableCount > 0;

        modalContent.innerHTML = `
            <div style="display:flex;gap:30px;align-items:flex-start;flex-wrap:wrap;">
                <div style="flex:0 0 220px;text-align:center;">
                    <img src="${book.cover || '../img/a3.avif'}" 
                        alt="${book.title}" 
                        onerror="this.onerror=null; this.src='../img/a3.avif';"
                         style="width:220px;border-radius:8px;display:block;box-shadow:0 4px 12px rgba(0,0,0,0.1);margin-bottom:12px;">
                    <div style="margin-top:10px;">
                        <span style="display:inline-block;padding:6px 14px;background:#e9ecef;border-radius:16px;font-size:13px;font-weight:600;color:#495057;">
                            ${categoryName}
                        </span>
                    </div>
                </div>
                <div style="flex:1;min-width:300px;">
                    <h2 style="font-size:28px;margin-bottom:15px;color:#2c3e50;line-height:1.3;">${book.title}</h2>
                    <div style="display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap;">
                        <div style="flex:1;min-width:150px;">
                            <p style="margin:8px 0;color:#666;"><i class="fas fa-user" style="color:#4a6fa5;margin-right:8px;"></i><strong>作者：</strong>${book.author}</p>
                            <p style="margin:8px 0;color:#666;"><i class="fas fa-building" style="color:#4a6fa5;margin-right:8px;"></i><strong>出版社：</strong>${book.publisher || '未知'}</p>
                        </div>
                        <div style="flex:1;min-width:150px;">
                            <p style="margin:8px 0;color:#666;"><i class="fas fa-calendar" style="color:#4a6fa5;margin-right:8px;"></i><strong>年份：</strong>${book.year || '未知'}</p>
                            <p style="margin:8px 0;color:#666;"><i class="fas fa-barcode" style="color:#4a6fa5;margin-right:8px;"></i><strong>ISBN：</strong>${book.isbn || '—'}</p>
                        </div>
                    </div>
                    <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin:20px 0;">
                        <p style="margin:0;color:#495057;line-height:1.7;font-size:15px;">${book.description || '暂无简介'}</p>
                    </div>
                    <div style="display:flex;gap:15px;align-items:center;margin-top:25px;flex-wrap:wrap;">
                        <div style="flex:1;min-width:200px;">
                            <p style="margin:5px 0;color:#666;"><strong>副本总数：</strong>${book.copies || 0} 本</p>
                            <p style="margin:5px 0;color:#666;"><strong>已借出：</strong>${borrowedCount} 本</p>
                            <p style="margin:5px 0;color:${isAvailable ? '#28a745' : '#dc3545'};font-weight:600;">
                                <strong>可借数量：</strong>${availableCount} 本
                            </p>
                        </div>
                        <div style="margin-top:10px;">
                            <button class="btn btn-primary" id="borrowBtn" style="padding:12px 30px;font-size:16px;" ${!isAvailable ? 'disabled' : ''}>
                                <i class="fas fa-book-reader"></i> ${isAvailable ? '立即借阅' : '暂不可借'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const borrowBtn = modalContent.querySelector('#borrowBtn');
        if (borrowBtn) {
            borrowBtn.addEventListener('click', function() {
                const currentUser = sessionStorage.getItem('authenticatedUser');
                const currentRole = sessionStorage.getItem('userRole') || 'user';
                if (!currentUser) { alert('请先登录以借阅'); window.location.href = 'login.html'; return; }
                const borrowedCount = book.borrowed || 0;
                const availableCount = (book.copies || 0) - borrowedCount;
                
                if (book.status !== 'available' || availableCount <= 0) { 
                    alert('此书当前不可借阅，所有副本已被借出。'); 
                    return; 
                }

                // 计算应还日期（30天后）
                const borrowDate = new Date();
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + 30);
                const borrowDateStr = borrowDate.toISOString().split('T')[0];
                const dueDateStr = dueDate.toISOString().split('T')[0];

                // 更新图书信息
                book.borrowed = borrowedCount + 1;
                if (book.copies && book.borrowed >= book.copies) {
                    book.status = 'borrowed';
                }

                // 新增借阅记录
                const newId = (borrowRecords.length > 0 ? Math.max(...borrowRecords.map(r=>r.id)) + 1 : 1001);
                borrowRecords.push({ 
                    id: newId, 
                    userId: 0, 
                    userName: currentUser, 
                    userRole: currentRole, 
                    bookId: book.id, 
                    bookTitle: book.title, 
                    borrowDate: borrowDateStr, 
                    dueDate: dueDateStr, 
                    status: 'borrowed' 
                });
                saveBorrowRecords();

                // 持久化书籍，并通知其他页面
                try { 
                    localStorage.setItem('library_books', JSON.stringify(booksData)); 
                    console.log('browse-script: 借阅记录已保存，图书数据已更新');
                } catch(e){
                    console.error('保存图书数据失败', e);
                    alert('保存失败，请检查浏览器存储权限');
                    return;
                }
                
                // 触发同步事件（确保其他标签页和管理页面也能收到更新）
                try { 
                    window.dispatchEvent(new Event('booksUpdated'));
                    window.dispatchEvent(new CustomEvent('booksDataChanged', {
                        detail: { booksData: booksData }
                    }));
                } catch(e){
                    console.warn('触发更新事件失败', e);
                }

                displayBooks();
                displayBorrowRecords();
                updateTabCounts();
                
                // 显示成功提示
                alert(`借阅成功！\n\n图书：${book.title}\n借阅日期：${borrowDateStr}\n应还日期：${dueDateStr}\n\n请到"管理图书" → "借阅记录"中查看详细信息。`);
                bookModal.style.display = 'none';
            });
        }

        bookModal.style.display = 'block';
    }
    
    function displayUsers() {
        if (!userList) return;
        
        userList.innerHTML = '';
        
        usersData.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            
            const roleClass = user.role === 'admin' ? 'admin' : '';
            const roleText = user.role === 'admin' ? '管理员' : '普通用户';
            const initials = user.name.split('').filter(char => char.charCodeAt(0) > 255).join('') || 
                           user.name.substring(0, 2).toUpperCase();
            
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
    }
    
    // ========== 初始化代码 - 在所有定义完成后执行 ==========
    
    // 加载数据并显示图书
    loadBooksFromStorage();
    forceSyncBooks(); // 强制同步确保数据一致
    displayBooks();
    updatePagination();
    
    console.log('浏览页面初始化完成，共加载', booksData.length, '本图书');
    
}); // 结束 DOMContentLoaded 事件监听器
