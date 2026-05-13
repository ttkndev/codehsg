document.addEventListener("DOMContentLoaded", () => {
  fetch("data/contributors.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("contributors-list");

      // Sắp xếp giảm dần theo số tài nguyên
      data.sort((a, b) => b.resources - a.resources);

      data.forEach(contributor => {
        const bioText = contributor.bio ? contributor.bio : "Chưa có mô tả";

        const avatar = contributor.avatar 
          ? `<img src="${contributor.avatar}" alt="${contributor.name}" class="rounded-circle border mb-2 d-block mx-auto" width="80" height="80">`
          : `<div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2 mx-auto" style="width:80px;height:80px;font-size:2rem;">
               <i class="bi bi-person"></i>
             </div>`;

        const block = `
          <div class="col-12 col-md-4 mb-4 text-center">
            ${avatar}
            <h5 class="fw-bold mb-1">${contributor.name}</h5>
            <p class="text-muted mb-1"><i class="bi bi-gift"></i> ${contributor.resources} tài nguyên</p>
            <p class="small text-muted">${bioText}</p>
          </div>
        `;
        container.insertAdjacentHTML("beforeend", block);
      });
    })
    .catch(err => console.error("Lỗi load contributors:", err));
});
