import config
import random
from datetime import datetime

def create_skeleton(item_type: str):
    data = {}
    current_time = datetime.now().strftime("%Y-%m-%d")

    # 1. Khởi tạo COMMON_FIELDS với các giá trị mặc định "thông minh"
    for field in config.COMMON_FIELDS:
        if field == "type":
            data[field] = item_type
        elif field == "contributor":
            data[field] = "admin"        
        elif field == "date_added":
            data[field] = current_time
        elif field == "last_updated":
            data[field] = current_time
        elif field == "language":
            data[field] = "vi"        # Mặc định luôn là tiếng Việt
        elif field in ["tags", "images", "related_ids"]:
            data[field] = []
        elif field in ["is_ready", "uploaded_drive", "posted_fb", "is_featured"]:
            data[field] = False
        elif field == "level":
            data[field] = 1           # Mức độ mặc định: Cơ bản
        elif field == "view_count":
            # Tạo độ uy tín ban đầu (ví dụ: 50 - 500)
            data[field] = random.randint(50, 500)
        elif field == "download_count":
            # Tỉ lệ tải xuống hợp lý so với lượt xem
            views = data.get("view_count", 100)
            data[field] = int(views * random.uniform(0.2, 0.4))
        else:
            data[field] = None

    # 2. Khởi tạo trường riêng cho BOOK_FIELDS
    if item_type == "book":
        for field in config.BOOK_FIELDS:
            if field == "subcategory":
                data[field] = []
            else:
                data[field] = None

    # 3. Khởi tạo trường riêng cho EXAM_FIELDS
    elif item_type == "exam":
        for field in config.EXAM_FIELDS:
            if field in ["testcases", "problem_names"]:
                data[field] = []      # Chuẩn bị sẵn mảng rỗng cho testcase lồng mảng
            else:
                data[field] = None

    return data

def clean_data(data):
    """
    Giữ lại các trường cốt lõi kể cả khi rỗng để tránh lỗi giao diện.
    """
    MUST_KEEP = {
        "id", "title", "type", "images", "tags", 
        "is_ready", "is_featured", "view_count", "download_count",
        "file_ext", "file_size", "language"
    }

    return {
        k: v for k, v in data.items()
        if v is not None or k in MUST_KEEP
    }