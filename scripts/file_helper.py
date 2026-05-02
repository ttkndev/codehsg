import os
import math

def get_file_info(file_path):
    """
    Tự động lấy định dạng và tính toán dung lượng file dễ đọc.
    
    Args:
        file_path (str): Đường dẫn đến file cần kiểm tra.
        
    Returns:
        tuple: (file_ext, file_size) ví dụ: ('pdf', '1.2 MB')
    """
    try:
        if not os.path.exists(file_path):
            return "unknown", "0 B"

        # 1. Lấy phần mở rộng (đuôi file)
        ext = os.path.splitext(file_path)[1].replace('.', '').lower()
        
        # 2. Lấy dung lượng file và chuyển đổi đơn vị
        size_bytes = os.path.getsize(file_path)
        if size_bytes == 0:
            return ext, "0 B"
        
        # Công thức tính đơn vị thân thiện với người dùng
        size_name = ("B", "KB", "MB", "GB", "TB")
        i = int(math.floor(math.log(size_bytes, 1024)))
        p = math.pow(1024, i)
        s = round(size_bytes / p, 2)
        
        size_str = f"{s} {size_name[i]}"
        
        return ext, size_str
    except Exception as e:
        print(f"Lỗi khi đọc file {file_path}: {e}")
        return "error", "0 B"

def get_filename_without_ext(file_path):
    """Lấy tên file không bao gồm phần đuôi mở rộng."""
    base = os.path.basename(file_path)
    return os.path.splitext(base)[0]

def is_valid_file(file_path, allowed_extensions=['pdf', 'docx', 'zip']):
    """Kiểm tra xem file có hợp lệ để xử lý không."""
    ext = os.path.splitext(file_path)[1].replace('.', '').lower()
    return ext in allowed_extensions