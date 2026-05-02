# codehsg

# Quy tắc đặt tên file:
BOOK: Book_category_author_title_pages.pdf
EXAM: Exam_subject_title_grade_unit_year.pdf

# Tạo ứng dụng trong conlose và lấy client_secrets.json
https://console.cloud.google.com/

# Cài đặt thư viện
pip install docx2pdf pdf2image python-dotenv

Đổi sang Page Access Token
Gọi API:
Mã
https://graph.facebook.com/me/accounts?access_token=USER_ACCESS_TOKEN
https://graph.facebook.com/me/accounts?access_token=EAAWJa9ThkNUBRXmhe6s94c3VLLyzas1h4UZCjZCfAPg4PJjLGgFzlwgsgoKoZAzIpHk7pYLiJBg4onGe3ZA4vd9MwERAyp9UXRVOgZAP3sirbaU56a4YerbZAhHXGuiIFsHfwA8LCDvnXL90ctROfLz5E5ebjATtyGcOXUPSthqTViZBeZAyBhzIzRJo45iVYB7HFZBxPw5AZCLs5ksvSI5Uns9KfJNkChB0X3pXJn6JjYnxRFZBA6519yPYcEKUs3II4jSA4oUqtZAiJLYzACt6yRf6wd3nIAZDZD


Tạo token dài hạn (long-lived)
Gọi:
Mã
https://graph.facebook.com/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id=APP_ID&
    client_secret=APP_SECRET&
    fb_exchange_token=SHORT_LIVED_TOKEN

https://graph.facebook.com/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id=1558471109611733&
    client_secret=b963c518b92d990f31662a4f0b8ac74d&
    fb_exchange_token=EAAWJa9ThkNUBRQBhu2egJ8XwL52K4u499clkUBR5oa7mxpITJEhVLZBEyJyDXA8ZCRWbBkgWfKn0fiR8aNDE7ESylM6HIVvqGaWWm3nc2KhaQ8SCdPd7Mn2BAheXq4jQUjBNQciwmuZByjL0dkDGMoPmJkGiRibm297to8cjJMhge26xrsk56Rr9ddfhHv8pGeP0j8or2yZCVPbu5HgYuX80YHuSlnxTq9QrkdP2ZCxy3


Subcategory : Các mục tiêu biểu: sgk, sgv, sbt, cau-truc-du-lieu, giai-thuat, hsg-tinh, hsg-quoc-gia, tin-hoc-tre, olympic-sinh-vien.

Level: Tự đánh giá từ 1 đến 5 (1: Tiểu học, 2: THCS, Level 3: THPT cơ bản / Nâng cao mức độ tỉnh., Level 4: Chuyên Tin / Sách chuyên đề nâng cao. 5: Quốc gia/Olympic).