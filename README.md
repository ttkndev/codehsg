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

## Ghi chú
Lấy Page token từ User token:
GET https://graph.facebook.com/v25.0/me/accounts?
    access_token={long-lived-user-token}

https://graph.facebook.com/v25.0/me/accounts?
    access_token=EAFZC8s35rU7ABReVHGnR28ZAbUvmCCFsh69HZB7pvni5katm90egcQM2fF5CEAQZBaXviUdhI2QqARpMav8ewq5QnPmZCn1DYNqRuZCAof0sojpoEhlL9xvHyHBgBRz3UN0pXPS3RlZBdKgBHSQlbsey9kzZBmWcztEpUbZCBhlaZCoqSA07XZCGEXYr5GXZC8Yf4yzBUdDaT2Q9VxQi7LSDendXVzGTb6uwSY3QX2IPdW41wPXLnJEKRAhStPIURyFYiwxtRWX3L4SBXqgbg4MDqZA0jrNUHNAZDZD

Đổi sang long‑lived User token:
https://graph.facebook.com/v25.0/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id={app-id}&
    client_secret={app-secret}&
    fb_exchange_token={short-lived-user-token}

https://graph.facebook.com/v25.0/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id=27017970637820848&
    client_secret=7e6c3823540cbd8a0058639a9c4406a2&
    fb_exchange_token=EAFZC8s35rU7ABRTmtzk0YY6QIrUhAbd2r3lKlAD6W5LKP8bmRZBAEr8kObydI5PkqhHh8ZBvzF18klO2mUg8SHZCZCZA1CyKmcOtICdytXiN2XTw8xH9kYkxc6T4rT7ZC28cj4NvGZAFhH3r89LTZCxM3oiz89jAnIiYLmcGSi3RD9nrs8yYVPI32k3ZAzACiIY7Rd4q0B2nlEraVQudSSygqD7OAHaFwLWnOI9EJMNyvQVArS