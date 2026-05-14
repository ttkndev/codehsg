import os
from file_helper import get_file_info
from utils import slugify

def parse_exam_filename(filename, full_path=None):
    name_no_ext = os.path.splitext(filename)[0]
    parts = name_no_ext.split("_")

    # Thu thập thông tin vật lý của file
    file_ext, file_size = "unknown", "0 B"
    if full_path and os.path.exists(full_path):
        file_ext, file_size = get_file_info(full_path)
    else:
        file_ext = os.path.splitext(filename)[1].replace('.', '').lower()

    # Ánh xạ các phần tử từ tên file
    subject = safe_get(parts, 1)      # Mon
    title   = safe_get(parts, 2)      # TieuDe
    grade   = safe_get(parts, 3)      # Lop10, Lop12, THCS...
    org     = safe_get(parts, 4)      # Organization
    year    = safe_get(parts, 5)      # Year

    # 3. Logic tự động gán LEVEL
    suggested_lv = 1
    g_lower = (grade or "").lower()
    t_lower = (title or "").lower()
    
    # Ưu tiên Level 4: Các kỳ thi đỉnh cao
    high_level_keywords = ["olympic", "hsgqg", "quoc-gia", "vnooi", "tst", "du-tuyen"]
    if any(k in t_lower for k in high_level_keywords):
        suggested_lv = 4
    # Level 3: THPT, Lớp 10-11-12 hoặc Chuyên Tin
    elif any(k in g_lower for k in ["thpt", "lop10", "lop11", "lop12", "chuyentin"]):
        suggested_lv = 3
    # Level 2: THCS hoặc Lớp 6-7-8-9
    elif any(k in g_lower for k in ["thcs", "lop6", "lop7", "lop8", "lop9"]):
        suggested_lv = 2
    # Level 1: Tiểu học hoặc Lớp 1-2-3-4-5
    elif any(k in g_lower for k in ["tieuhoc", "lop1", "lop2", "lop3", "lop4", "lop5"]):
        suggested_lv = 1

    return {
        "id": slugify(name_no_ext),
        "type": "exam",
        "file_ext": file_ext,
        "file_size": file_size,        
        "title": title,
        "subject": subject,
        "grade": grade,
        "level": suggested_lv, # Giá trị đã được tính toán tự động
        "organization": org,
        "year": year
    }

def parse_book_filename(filename, full_path=None):
    """
    Quy tắc tên file sách: Book_Category_Author_Title_Pages.pdf
    """
    name_no_ext = os.path.splitext(filename)[0]
    parts = name_no_ext.split("_")

    file_ext, file_size = "unknown", "0 B"
    if full_path and os.path.exists(full_path):
        file_ext, file_size = get_file_info(full_path)

    category    = safe_get(parts, 1)
    author      = safe_get(parts, 2)
    title       = safe_get(parts, 3)
    pages       = safe_get(parts, 4)

    return {
        "id": slugify(name_no_ext),
        "type": "book",
        "file_ext": file_ext,
        "file_size": file_size,
        "title": title,
        "author": author,
        "category": category,
        "pages": int(pages) if pages and pages.isdigit() else None
    }

def safe_get(parts, index):
    return parts[index] if len(parts) > index else None