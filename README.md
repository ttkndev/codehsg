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
https://graph.facebook.com/me/accounts?access_token=EAAV4wG2RmoIBRZA6mMy7X4Ae70W9LjJfKl54yI4cpVvsVFKcY8wyWEcOZBOSg4jd8lOqLvvgERl1trKEqONBSo7fZCaGa7hFsdjtyzCiQgriKJPHD9l8KRs7l0RJvFln8t1nv4FHfUhe6Mk3oldZAGZB3ELyfTwEot159StDdEa0ZCt3cz9BLdUQi4yM2ZBB9zIcZACxQBcq5Q9RYp3YurlZBb3bpJOTIekrMcnPmngZDZD


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
    client_id=1540142750866050&
    client_secret=8857984b3037f4851ca8de3a59bb37f2&
    fb_exchange_token=EAAV4wG2RmoIBRSqIiXezZCvopwHhqfZBcjlZBPO8MkHr2HH3ycZBNrcBVfpxEBd039MuE6XmTaCCKAX2dZCIrWZCKxlm5cfOLcoHZCuCwegn8ZAhZCcIfH6s3vMR0q3AbXWZBO3y66Um57WNVm4INRpJeadhxsP1YXvXi6ZBYlt409ZC8JkQU1gp2p42c0imi23eAlwoH2tJ2mWqXywm4fbs85pZBEyg3eprn30Oo3xwJlBTrTWG3