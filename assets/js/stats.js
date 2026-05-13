function animateCount(element, target) {
  let current = 0;
  const step = Math.ceil(target / 100); // tốc độ tăng
  element.classList.add("running");

  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(interval);
      element.classList.remove("running");
    }
    element.textContent = current;
  }, 20); // mỗi 20ms tăng một lần
}

document.addEventListener("DOMContentLoaded", () => {
  Promise.all([
    fetch("data/exams.json").then(res => res.json()),
    fetch("data/books.json").then(res => res.json())
  ])
  .then(([exams, books]) => {
    const examCount = exams.length;
    const bookCount = books.length;
    const totalViews = exams.reduce((sum, e) => sum + (e.view_count || 0), 0)
                      + books.reduce((sum, b) => sum + (b.view_count || 0), 0);
    const totalDownloads = exams.reduce((sum, e) => sum + (e.download_count || 0), 0)
                          + books.reduce((sum, b) => sum + (b.download_count || 0), 0);

    animateCount(document.getElementById("stat-exams"), examCount);
    animateCount(document.getElementById("stat-books"), bookCount);
    animateCount(document.getElementById("stat-views"), totalViews);
    animateCount(document.getElementById("stat-downloads"), totalDownloads);
  })
  .catch(err => console.error("Lỗi load thống kê:", err));
});
