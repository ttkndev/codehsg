import config
import random
from datetime import datetime
from utils import slugify

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

def create_solution_detail(problem_names):
    return {
        "verified": False,
        "last_updated": None,
        "problems": [
            {
                "problem_id": slugify(name),
                "problem_name": name,

                # Metadata
                "difficulty": None,
                "tags": [],

                # Solution stats
                "has_solution": False,
                "solution_count": 0,

                # Community solutions
                "solutions": [],

                # Testcases
                "testcases": [],

                # Editorial
                "editorial": None
            }
            for name in problem_names
        ]
    }

def refresh_problem_schema(meta):

    solution_detail = meta.get("solution_detail")

    if not solution_detail:
        return False

    changed = False

    for problem in solution_detail.get("problems", []):

        # Refresh problem_id
        expected_id = slugify(
            problem.get("problem_name")
        )

        if problem.get("problem_id") != expected_id:
            problem["problem_id"] = expected_id
            changed = True

        # Ensure fields
        defaults = {
            "difficulty": None,
            "tags": [],

            "has_solution": False,
            "solution_count": 0,

            "solutions": [],
            "testcases": []
        }

        for key, value in defaults.items():

            if key not in problem:
                problem[key] = value
                changed = True

        # Refresh derived stats
        solution_count = len(problem.get("solutions", []))

        if problem.get("solution_count") != solution_count:
            problem["solution_count"] = solution_count
            changed = True

        has_solution = solution_count > 0

        if problem.get("has_solution") != has_solution:
            problem["has_solution"] = has_solution
            changed = True

    return changed