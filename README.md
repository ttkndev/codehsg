# CodeHSG

Website tĩnh tổng hợp **sách** và **đề thi Tin học HSG** dựa trên 2 nguồn dữ liệu JSON:
- `data/books.json`
- `data/exams.json`

## Cấu trúc trang
- `index.html`: Trang chủ, thống kê nhanh số lượng tài liệu.
- `book.html`: Danh sách sách, tìm kiếm theo tên/tác giả/danh mục.
- `exam.html`: Danh sách đề thi, tìm kiếm theo đơn vị/năm học/cấp học.

## Cấu trúc dữ liệu
### 1) Book
Quy tắc đặt tên file gợi ý:
`Book_category_author_title_pages.pdf`

### 2) Exam
Quy tắc đặt tên file gợi ý:
`Exam_subject_title_grade_unit_year.pdf`

## Chạy local
Bạn có thể mở trực tiếp các file HTML bằng Live Server hoặc chạy nhanh:

```bash
python -m http.server 8000
```

Sau đó truy cập `http://localhost:8000`.

## SEO cơ bản
Repo đã bổ sung:
- `robots.txt`
- `sitemap.xml`

> Lưu ý: hãy thay `https://example.com` trong `sitemap.xml` bằng domain thật khi deploy.
