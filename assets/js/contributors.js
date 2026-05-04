// Tạo màu avatar nhất quán từ tên (không random mỗi lần render)
function nameToColor(name) {
    const colors = [
        '#4f46e5', '#0891b2', '#059669', '#d97706',
        '#dc2626', '#7c3aed', '#db2777', '#065f46'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// Lấy chữ cái đầu của tên (hỗ trợ tên tiếng Việt)
function getInitial(name) {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1].charAt(0).toUpperCase();
}

async function loadContributors() {
    const container = document.getElementById('contributors');
    try {
        const contributors = await fetch('data/contributors.json').then(res => res.json());

        // Sort theo số tài nguyên đóng góp giảm dần
        contributors.sort((a, b) => (b.resources || 0) - (a.resources || 0));

        container.innerHTML = '';

        contributors.forEach(user => {
            const bgColor = nameToColor(user.name);
            const initial = getInitial(user.name);

            const card = document.createElement('div');
            card.className = 'col-md-3 col-sm-6 mb-4';
            card.innerHTML = `
                <div class="text-center">
                    <div class="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                         style="width:100px; height:100px; font-size:2rem; font-weight:700;
                                background-color:${bgColor}; color:#fff; user-select:none;">
                        ${initial}
                    </div>
                    <h5 class="mb-1">${user.name}</h5>
                    <p class="text-muted small mb-0">
                        <i class="bi bi-box-seam me-1"></i>${user.resources} tài nguyên
                    </p>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Lỗi khi load contributors:', error);
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    Không thể tải danh sách thành viên đóng góp lúc này.<br>
                    Vui lòng thử lại sau.
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadContributors);
