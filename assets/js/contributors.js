async function loadContributors() {
    const container = document.getElementById('contributors');
    try {
        const contributors = await fetch('data/contributors.json').then(res => res.json());

        container.innerHTML = '';

        contributors.forEach(user => {
            const card = document.createElement('div');
            card.className = 'col-md-3 col-sm-6';
            card.innerHTML = `
                <div class="text-center">
                    <div class="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                         style="width:100px; height:100px; font-size:2rem;">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <h5>${user.name}</h5>
                    <p class="text-muted">${user.resources} tài nguyên</p>
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
