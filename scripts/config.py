# scripts/config.py

# Google Drive
DRIVE_FOLDER_ID = "1nTYjqk6_GQ9a-bTok0Emu8cqwbHo4KxK"  
# ID thư mục Google Drive nơi pipeline sẽ upload/update các file PDF

# Thư mục dự án
INPUT_DIR = "input"       # Thư mục chứa file gốc (DOCX, PDF, JSON override)
OUTPUT_DIR = "output"     # Thư mục chứa kết quả xử lý (meta.json, post.txt, exams.json, books.json)
SCRIPTS_DIR = "scripts"   # Thư mục chứa các script Python
ASSETS_DIR = "assets"     # Thư mục chứa tài nguyên tĩnh (CSS, JS, hình ảnh cho website)
DATA_DIR = "data"         # Thư mục chứa data hiển thị trên website

# Cấu hình website
SITE_TITLE = "Luyện Code"  
# Tiêu đề website hiển thị trên trình duyệt
SITE_DESCRIPTION = "Sharing programming exams, books, and learning resources"  
# Mô tả ngắn gọn về website (SEO, meta description)

# Cấu hình Facebook Post
FB_PAGE_NAME = "Luyện Code"
# Tên page Facebook để gắn vào bài đăng
FB_DEFAULT_TAGS = ["exam", "book", "programming", "algorithm", "dethi", "hoclieu", "thuattoan", "laptrinh", "luyencode"]  
# Các tag mặc định khi sinh nội dung post
FB_POST_DELAY_MINUTES = 10

# Link website tổng hợp
WEBSITE_URL = "https://ttkndev.github.io/luyencode-hsg/"  
# URL chính của website
PAGE_FACEBOOK_URL = "https://www.facebook.com/luyencode.hsg"  
# URL fanpage Facebook

# Cấu hình upload Google Drive
FORCE_UPLOAD_DRIVE = False  
# False: pipeline tuân theo trạng thái uploaded_drive trong từng meta.json
# True: ép coi tất cả file như chưa upload (uploaded_drive = False),
#       nhưng nếu meta đã có file_id thì sẽ update file trên Drive,
#       nếu chưa có file_id thì upload mới.

COMMON_FIELDS = [
    "is_ready",         # (bool) True: Cho phép hiển thị lên web | False: Bản nháp/Đang xử lý
    "id",               # (str) Slug duy nhất (ví dụ: '150-bai-toan-tin'). Dùng làm ID và URL.
    "related_ids",      # (list) Danh sách ID của các tài liệu liên quan để gợi ý (Related Items)
    "type",             # (str) Phân loại chính: 'book' hoặc 'exam'
    "title",            # (str) Tiêu đề hiển thị (ví dụ: '150 Bài Toán Tin Học')
    "description",      # (str) Mô tả ngắn hoặc Mục lục (Table of Contents)
    "tags",             # (list) Mảng các từ khóa để tìm kiếm và SEO (ví dụ: ['dp', 'graph'])
    "level",            # (int) Độ khó: 1 (Dễ), 2 (Trung bình), 3 (Khó)
    "year",             # (int/str) Năm phát hành tài liệu hoặc năm tổ chức kỳ thi
    "language",         # (str) Ngôn ngữ tài liệu (vi, en...)
    "contributor",      # (str) Tên người đóng góp/upload tài liệu
    "images",           # (list) Đường dẫn ảnh: Sách (1 ảnh bìa), Đề thi (mảng nhiều ảnh trang)
    "drive_file_id",    # (str) ID file trên Google Drive sau khi upload thành công
    "drive_view",       # (str) Link xem trực tiếp trên Google Drive
    "drive_download",   # (str) Link tải trực tiếp file (uc?export=download)
    "uploaded_drive",   # (bool) Trạng thái đã đẩy lên Drive hay chưa
    "fb_post_id",       # (str) ID bài viết trên Facebook sau khi auto-post thành công
    "scheduled_time",   # (int) Timestamp dự kiến đăng bài lên Facebook
    "posted_fb",        # (bool) Trạng thái đã đăng lên Fanpage hay chưa
    "is_featured",      # (bool) True: Hiện ở mục 'Nổi bật' trên trang chủ
    "date_added",       # (str) Ngày biên tập (YYYY-MM-DD).
    "last_updated",     # (str) Ngày cập nhật cuối (YYYY-MM-DD). Dùng để lọc mục 'Mới nhất'
    "view_count",       # (int) Lượt xem tích lũy (có thể khởi tạo bằng 0)
    "download_count",   # (int) Lượt tải tích lũy (khởi tạo 0 hoặc tỉ lệ theo view_count)
    "file_ext",         # (str) Kiểu tệp: 'pdf', 'docx', 'xlsx', 'zip'...
    "file_size"        # (str) Dung lượng file (ví dụ: '1.5 MB', '450 KB')
]

BOOK_FIELDS = [
    "author",           # (str/list) Tên tác giả hoặc nhóm tác giả
    "publisher",        # (str) Nhà xuất bản hoặc nguồn phát hành tài liệu
    "category",         # (str) Danh mục chính (ví dụ: 'GiaoTrinh', 'BaiTap', 'LyThuyet')
    "subcategory",      # (list) Mảng các chủ đề chuyên sâu (ví dụ: ['Quy hoạch động', 'Toán học'])
    "pages"             # (int) Tổng số trang của file PDF
]

EXAM_FIELDS = [
    "subject",          # (str) Môn học (Tin học, Toán...)
    "organization",     # (str) Đơn vị ra đề (ví dụ: 'Chuyên Lê Hồng Phong', 'Bộ Giáo Dục')
    "grade",            # (str) Khối lớp (10, 11, 12, ĐH...)
    "problem_names",    # ["Tổng dãy số", "Đảo ngược chuỗi", "Tìm đường đi"]
    "problem_count",    # (int) Số lượng bài tập có trong đề thi
    "duration",         # (int) Thời gian làm bài (phút)
    "solution_detail",  # (str) Hướng dẫn giải ngắn gọn hoặc ghi chú về lời giải
    "testcases"         # (list) Mảng chứa testcase mẫu (ví dụ: [{'in': '...', 'out': '...'}])
]