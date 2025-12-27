// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击菜单项后关闭菜单
        document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
    
    // 显示欢迎通知
    const notification = document.getElementById('notification');
    const closeNotification = document.getElementById('close-notification');
    
    // 检查是否已经显示过通知
    if (notification && !sessionStorage.getItem('notificationShown')) {
        // 延迟显示通知
        setTimeout(function() {
            notification.classList.add('show');
            sessionStorage.setItem('notificationShown', 'true');
        }, 1000);
    }
    
    // 关闭通知
    if (closeNotification) {
        closeNotification.addEventListener('click', function() {
            notification.classList.remove('show');
        });
    }
    
    // 模拟热门图书数据
    const popularBooks = [
        {
            title: "《Web开发指南》",
            author: "张明",
            description: "一本全面介绍现代Web开发技术的实用指南。",
            status: "available",
            cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            title: "《JavaScript高级程序设计》",
            author: "李华",
            description: "深入讲解JavaScript核心概念和高级特性。",
            status: "borrowed",
            cover: "https://images.unsplash.com/photo-1531346688376-ab6275c4725e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        },
        {
            title: "《CSS设计艺术》",
            author: "王芳",
            description: "探索CSS的创意用法，打造精美网页界面。",
            status: "available",
            cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
        }
    ];
    
    // 动态渲染热门图书
    const booksContainer = document.querySelector('.books-container');
    if (booksContainer && window.location.pathname.includes('index.html')) {
        // 如果已经有静态内容，则跳过
        if (booksContainer.children.length === 0) {
            popularBooks.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                
                const statusClass = book.status === 'available' ? 'available' : 'borrowed';
                const statusText = book.status === 'available' ? '可借阅' : '已借出';
                
                bookCard.innerHTML = `
                    <div class="book-cover">
                        <img src="${book.cover}" alt="图书封面">
                    </div>
                    <div class="book-info">
                        <h3>${book.title}</h3>
                        <p class="book-author">作者: ${book.author}</p>
                        <p class="book-desc">${book.description}</p>
                        <div class="book-status ${statusClass}">${statusText}</div>
                    </div>
                `;
                
                booksContainer.appendChild(bookCard);
            });
        }
    }

    // 确保首页展示的三本示例书已加入到 localStorage（供浏览/管理页面使用）
    (function ensureHomepageBooks() {
        try {
            const stored = JSON.parse(localStorage.getItem('library_books') || '[]');
            const demoBooks = [
                { title: "《Web开发指南》", author: "张明", category: 'technology', description: '一本全面介绍现代Web开发技术的实用指南。', year: 2022, publisher: '电子工业出版社', isbn: '9787121234567', status: 'available', copies: 5, borrowed: 0, cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                { title: "《JavaScript高级程序设计》", author: "李华", category: 'technology', description: '深入讲解JavaScript核心概念和高级特性。', year: 2021, publisher: '人民邮电出版社', isbn: '9787111234567', status: 'borrowed', copies: 3, borrowed: 3, cover: 'https://images.unsplash.com/photo-1531346688376-ab6275c4725e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                { title: "《CSS设计艺术》", author: "王芳", category: 'art', description: '探索CSS的创意用法，打造精美网页界面。', year: 2023, publisher: '清华大学出版社', isbn: '9787301234567', status: 'available', copies: 4, borrowed: 1, cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' }
            ];

            let changed = false;
            demoBooks.forEach(demo => {
                const exists = stored.some(b => b.title === demo.title && b.author === demo.author);
                if (!exists) {
                    const newId = stored.length > 0 ? Math.max(...stored.map(b => b.id)) + 1 : 1;
                    stored.push(Object.assign({ id: newId }, demo));
                    changed = true;
                }
            });
            if (changed) {
                localStorage.setItem('library_books', JSON.stringify(stored));
                window.dispatchEvent(new Event('booksUpdated'));
                console.log('Added demo homepage books to library_books in localStorage');
            }
        } catch (e) {
            console.error('Failed to ensure demo books in localStorage', e);
        }
    })();

    // 统计数字按视图滚动时动态计数（每次进入可重复触发）
    const statElems = document.querySelectorAll('.stat-number');
    if (statElems.length > 0) {
        const animateNumber = (el, duration = 1200) => {
            const target = parseInt((el.getAttribute('data-target') || '').replace(/,/g, ''), 10) || 0;
            const suffix = el.getAttribute('data-suffix') || '';
            const start = 0;
            const startTime = performance.now();

            const step = (now) => {
                const progress = Math.min((now - startTime) / duration, 1);
                const current = Math.floor(progress * (target - start) + start);
                el.textContent = current.toLocaleString() + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target.toLocaleString() + suffix;
                }
            };

            requestAnimationFrame(step);
        };

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target;
                const suffix = el.getAttribute('data-suffix') || '';
                if (entry.isIntersecting) {
                    animateNumber(el);
                } else {
                    // 出视窗时重置为初始值，以便下次再次触发动画
                    el.textContent = suffix ? '0' + suffix : '0';
                }
            });
        }, { threshold: 0.5 });

        statElems.forEach(el => {
            // 初始化为 0
            const suffix = el.getAttribute('data-suffix') || '';
            el.textContent = suffix ? '0' + suffix : '0';
            io.observe(el);
        });
    }
    
    // 表单验证示例（用于登录页面）
    const loginForm = document.getElementById('loginForm');
    // 仅在非登录页绑定通用登录处理器，避免与登录页本身的处理逻辑冲突（例如提示/凭据不一致）
    const currentFile = window.location.pathname.split('/').pop().toLowerCase();
    if (loginForm && currentFile !== 'login.html') {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const remember = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
            
            if (!username || !password) {
                alert('请输入用户名和密码！');
                return;
            }
            
            // 简单示例认证（注意：生产环境应使用后端认证）
            const validUsers = {
                'admin': 'admin123',
                'user': 'user123'
            };
            
            if (validUsers[username] && validUsers[username] === password) {
                // 认证成功
                sessionStorage.setItem('authenticatedUser', username);
                sessionStorage.setItem('userRole', username === 'admin' ? 'admin' : 'user');

                if (remember) {
                    localStorage.setItem('rememberedUser', username);
                    localStorage.setItem('rememberedRole', sessionStorage.getItem('userRole'));
                } else {
                    localStorage.removeItem('rememberedUser');
                    localStorage.removeItem('rememberedRole');
                }

                // 登录成功后跳转到目标页面或默认管理页
                const params = new URLSearchParams(window.location.search);
                const next = params.get('next');
                if (next && next.endsWith('.html')) {
                    window.location.href = next;
                } else {
                    window.location.href = 'manage.html';
                }
            } else {
                alert('用户名或密码错误！');
            }
        });
    }

    // 处理登录/注销链接显示与注销逻辑
    const loginLi = document.getElementById('loginLi');
    const logoutLi = document.getElementById('logoutLi');
    const logoutLink = document.getElementById('logoutLink');
    const footerLoginLi = document.getElementById('footerLoginLi');
    const footerLogoutLi = document.getElementById('footerLogoutLi');
    const footerLogoutLink = document.getElementById('footerLogoutLink');

    function updateAuthLinks() {
        const authenticated = !!sessionStorage.getItem('authenticatedUser');
        if (loginLi) loginLi.style.display = authenticated ? 'none' : 'inline-block';
        if (logoutLi) logoutLi.style.display = authenticated ? 'inline-block' : 'none';
        if (footerLoginLi) footerLoginLi.style.display = authenticated ? 'none' : 'list-item';
        if (footerLogoutLi) footerLogoutLi.style.display = authenticated ? 'list-item' : 'none';
    }

    updateAuthLinks();

    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('authenticatedUser');
            sessionStorage.removeItem('userRole');
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberedRole');
            updateAuthLinks();
            window.location.href = 'login.html';
        });
    }

    if (footerLogoutLink) {
        footerLogoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            sessionStorage.removeItem('authenticatedUser');
            sessionStorage.removeItem('userRole');
            localStorage.removeItem('rememberedUser');
            localStorage.removeItem('rememberedRole');
            updateAuthLinks();
            window.location.href = 'login.html';
        });
    }

    // Fallback: 全局社交扫码登录处理器（用于在 login 页面绑定失败时仍然能响应）
    (function setupSocialLoginFallback() {
        try {
            console.log('script: initializing social login fallback handlers');

            function completeSocialLogin(platform, asRole = 'user') {
                console.log('script: completeSocialLogin', platform, asRole);
                try {
                    sessionStorage.setItem('authenticatedUser', asRole === 'admin' ? 'admin' : 'user');
                    sessionStorage.setItem('userRole', asRole === 'admin' ? 'admin' : 'user');
                } catch (e) { console.warn('script: sessionStorage set failed', e); }
                // dispatch a storage event for other windows/tabs
                window.dispatchEvent(new Event('booksUpdated'));
                // 小延迟以便 UI 更新
                setTimeout(() => { window.location.href = 'browse.html'; }, 250);
            }

            function openSocialModal(identifier) {
                const modal = document.getElementById('socialQRModal');
                const title = document.getElementById('socialModalTitle');
                const msg = document.getElementById('socialModalMsg');
                const qrImg = document.getElementById('socialQRImage');
                const status = document.getElementById('socialStatus');
                if (!modal || !title || !msg || !qrImg || !status) {
                    console.warn('script: social modal elements not found');
                    return;
                }

                const isWechat = (typeof identifier === 'string' ? identifier === 'wechat' : identifier && identifier.classList && identifier.classList.contains('wechat'));
                const platform = isWechat ? '微信' : 'QQ';

                title.textContent = platform + ' 登录';
                msg.textContent = '请使用手机' + platform + '扫描二维码进行登录（演示）。';

                // 生成一个唯一请求 ID，模拟后端会为该二维码生成一个会话
                const reqId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,8);
                qrImg.src = isWechat ? '../img/微信好友.jpg' : '../img/a5.jpg';
                qrImg.setAttribute('data-req-id', reqId);

                status.textContent = `等待扫码... (id:${reqId})`;
                modal.style.display = 'block';

                // 将请求写入 localStorage（模拟后端创建登录请求）
                try {
                    localStorage.setItem('social_login_request_' + reqId, JSON.stringify({ id: reqId, platform: platform, createdAt: Date.now(), status: 'pending' }));
                } catch (e) { console.warn('script: failed to write social request', e); }

                // 轮询检查扫描响应（在真实实现中，这里会是对后端的轮询或 WebSocket 订阅）
                const pollInterval = 1000;
                let pollCount = 0;
                const poller = setInterval(() => {
                    pollCount++;
                    try {
                        const resp = localStorage.getItem('social_login_response_' + reqId);
                        if (resp) {
                            const payload = JSON.parse(resp);
                            console.log('script: detected social login response', payload);
                            clearInterval(poller);
                            // 清理本地模拟数据
                            try { localStorage.removeItem('social_login_request_' + reqId); localStorage.removeItem('social_login_response_' + reqId); } catch (e) {}
                            // 完成登录（允许后端返回的角色）
                            completeSocialLogin(platform, payload.role || 'user');
                        } else if (pollCount > 60) {
                            // 超时 60 次 (~60s) 后放弃
                            clearInterval(poller);
                            status.textContent = '扫码超时，请重试。';
                            console.warn('script: social login poll timed out for', reqId);
                        }
                    } catch (e) {
                        console.error('script: poll error', e);
                    }
                }, pollInterval);

                // 将模拟扫描按钮改为写入响应以模拟后端回调
                const simulateBtn = document.getElementById('simulateScanBtn');
                const cancelBtn = document.getElementById('cancelScanBtn');
                if (simulateBtn) simulateBtn.onclick = function() {
                    try {
                        localStorage.setItem('social_login_response_' + reqId, JSON.stringify({ id: reqId, scannedAt: Date.now(), role: 'user' }));
                        status.textContent = '已扫码，正在处理...';
                    } catch (e) {
                        console.error('script: simulate scan failed', e);
                    }
                };
                if (cancelBtn) cancelBtn.onclick = function() { clearInterval(poller); modal.style.display = 'none'; status.textContent = ''; try { localStorage.removeItem('social_login_request_' + reqId); } catch (e) {} };
                document.querySelectorAll('.social-close').forEach(el => el.onclick = function() { clearInterval(poller); modal.style.display = 'none'; status.textContent = ''; try { localStorage.removeItem('social_login_request_' + reqId); } catch (e) {} });

                console.log('script: social modal opened for', platform, 'reqId=', reqId);
            }

            // 事件委托：捕获对 .social-btn 的点击并打开模态
            document.addEventListener('click', function(e) {
                try {
                    const btn = e.target.closest && e.target.closest('.social-btn');
                    if (btn) {
                        e.preventDefault();
                        openSocialModal(btn);
                    }
                } catch (e) { /* ignore */ }
            });

            // 暴露给控制台用于调试
            window.openSocialModal = openSocialModal;
            window.completeSocialLogin = completeSocialLogin;

        } catch (e) {
            console.error('script: failed to setup social login fallback', e);
        }
    })();

    // 管理页面功能 - 添加新书
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const bookTitle = document.getElementById('bookTitle').value;
            const bookAuthor = document.getElementById('bookAuthor').value;
            const bookCategory = document.getElementById('bookCategory').value;
            
            if (bookTitle && bookAuthor && bookCategory) {
                alert(`图书 "${bookTitle}" 已成功添加到系统！`);
                // 在实际应用中，这里应该发送数据到服务器
                // 然后清空表单或更新图书列表
                addBookForm.reset();
            } else {
                alert('请填写所有必填字段！');
            }
        });
    }
    
    // 页面切换动画
    const links = document.querySelectorAll('a[href^="http"]:not([href*="cdnjs"]):not([href*="fonts.googleapis"]), a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').includes('.html') && 
                !this.getAttribute('href').includes('#')) {
                // 如果是内部页面链接，添加转场效果
                e.preventDefault();
                
                // 添加页面淡出效果
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease';
                
                // 延迟跳转
                setTimeout(() => {
                    window.location.href = this.getAttribute('href');
                }, 300);
            }
        });
    });
    
    // 页面加载时的淡入效果
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});