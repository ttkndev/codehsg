import os, json, config
from collections import Counter
from generate_json import create_skeleton
from upload_drive import init_drive, upload_or_update_file
from extract_images import export_images
from docx2pdf import convert
from post_social import post_to_facebook, generate_post
from parse_filename import parse_book_filename, parse_exam_filename
from datetime import datetime

def run_pipeline():
    convert_docx()

    drive = init_drive()

    exams, books, contributors = [], [], Counter()
    num, index = 0, 0  # 👈 dùng để schedule post

    for file in list_pdf():
        num += 1
        meta = process_file(file, drive, num, index)

        if meta["type"] == "exam":
            exams.append(meta)
        else:
            books.append(meta)

        # 👇 chỉ tăng index khi thực sự ready (tránh lệch lịch)
        if meta.get("is_ready"):
            index += 1
        
        # 👈 cập nhật contributor ngay khi duyệt
        if meta.get("contributor"):
            contributors[meta["contributor"]] += 1

    build_data(exams, books, contributors)
    
def list_pdf():
    return [f for f in os.listdir(config.INPUT_DIR) if f.endswith(".pdf")]

def convert_docx():
    for f in os.listdir(config.INPUT_DIR):
        if f.endswith(".docx"):
            src = os.path.join(config.INPUT_DIR, f)
            dst = src.replace(".docx", ".pdf")

            if not os.path.exists(dst):
                convert(src, dst)
                print(f"✔ Converted {f}")

def log(msg, indent=0):
    print("   " * indent + msg)


def process_file(fname, drive, num, index):
    local_pdf = os.path.join(config.INPUT_DIR, fname)

    # 1. Parse filename (Truyền path để lấy size/ext ngay)
    if fname.startswith("Exam"):
        parsed = parse_exam_filename(fname, local_pdf)
        item_type = "exam"
    else:
        parsed = parse_book_filename(fname, local_pdf)
        item_type = "book"

    slug = parsed["id"]
    log(f"\n{num} 📦 Processing → {slug}")

    out_dir = os.path.join(config.OUTPUT_DIR, slug)
    os.makedirs(out_dir, exist_ok=True)
    meta_path = os.path.join(out_dir, "meta.json")

    # 2. Load hoặc Create Meta
    if os.path.exists(meta_path):
        with open(meta_path, encoding="utf-8") as f:
            meta = json.load(f)

        # Cập nhật thông tin file vật lý (luôn mới nhất)
        meta["file_size"] = parsed["file_size"]
        meta["file_ext"] = parsed["file_ext"]
        
        # Merge các field khác nếu trong JSON cũ chưa có
        for k, v in parsed.items():
            if k not in meta:
                meta[k] = v
        log("\t📄 Loaded & Updated physical info", 1)
    else:
        meta = create_skeleton(item_type)
        meta.update(parsed)
        log("\t🆕 Created skeleton meta", 1)

    # --- BẮT ĐẦU GIAI ĐOẠN 1: LÀM VIỆC NẶNG NHƯNG VÔ HẠI ---

    # 3. Export Images (Làm trước khi check is_ready để bạn check đề)
    if not meta.get("images") or len(meta.get("images", [])) == 0:
        log("\t🖼 Exporting images for preview...", 1)
        meta["images"] = export_images(local_pdf, item_type, out_dir)
        # Lưu ngay để giữ thông tin ảnh
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(meta, f, indent=2, ensure_ascii=False)

    # 4. Kiểm tra nút chặn Ready
    if not meta.get("is_ready"):
        log(f"\t⏸ DỪNG: Hãy check ảnh trong /{slug} và chuyển 'is_ready': true", 1)
        return meta

    # --- BẮT ĐẦU GIAI ĐOẠN 2: CHỈ CHẠY KHI ĐÃ GẬT ĐẦU (IS_READY) ---

    # 5. Upload Drive
    if not meta.get("uploaded_drive"):
        log("\t⬆ Uploading to Drive...", 1)
        meta = handle_upload(drive, meta, local_pdf)

    # 6. Generate post.txt (Làm lúc này vì đã có link Drive để chèn vào bài post)
    post_text = generate_post(meta, item_type)
    post_file = os.path.join(out_dir, "post.txt")
    with open(post_file, "w", encoding="utf-8") as f:
        f.write(post_text)
    log("\t📝 Generated post.txt", 1)

    # 7. Post Facebook
    # if meta.get("drive_view") and not meta.get("posted_fb"):
    #     log("\t📤 Posting Facebook...", 1)
    #     meta = post_to_facebook(meta, index=index)
    #     log(f"\t📘 POSTED at index {index}", 1)
    # else:
    #     log("\t⏩ Skip post (already posted or no link)", 1)

    # Cập nhật last_updated thành ngày hôm nay khi file chính thức được duyệt
    meta["last_updated"] = datetime.now().strftime("%Y-%m-%d")

    # 8. Lưu meta cuối cùng
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    # Summary
    log(f"\t💾 {slug} | DONE | ready=✔ | drive={'✔' if meta.get('drive_view') else '❌'}", 1)

    return meta

def handle_upload(drive, meta, local_pdf):
    if config.FORCE_UPLOAD_DRIVE or not meta.get("uploaded_drive"):
        links = upload_or_update_file(drive, local_pdf, meta)
        if links:
            meta.update(links)
            meta["uploaded_drive"] = True
    return meta

def build_data(exams, books, contributors):
    os.makedirs(config.DATA_DIR, exist_ok=True)

    json.dump(exams, open(f"{config.DATA_DIR}/exams.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
    json.dump(books, open(f"{config.DATA_DIR}/books.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)

    # Đếm số lượng đóng góp
    counter = Counter(contributors)
    contributors_data = [
        {"name": name, "resources": resources, "bio": None}
        for name, resources in counter.items()
    ]
    json.dump(contributors_data, open(f"{config.DATA_DIR}/contributors.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)

if __name__ == "__main__":
    run_pipeline()