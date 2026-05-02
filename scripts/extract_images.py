# extract_images.py

import os
import shutil
import config
from pdf2image import convert_from_path
from parse_filename import slugify


def export_images(local_pdf, type="exam", out_dir=None):
    # ===== setup =====
    if out_dir is None:
        out_dir = os.path.dirname(local_pdf)

    os.makedirs(out_dir, exist_ok=True)

    assets_dir = os.path.join(config.ASSETS_DIR, "images")
    os.makedirs(assets_dir, exist_ok=True)

    asset_paths = []

    # dùng slug để đảm bảo tên sạch
    base_name = slugify(os.path.splitext(os.path.basename(local_pdf))[0])

    # ===== EXAM =====
    if type == "exam":
        pages = convert_from_path(local_pdf, dpi=200)

        for i, page in enumerate(pages):
            img_name = f"{base_name}-page-{i+1}.jpg"
            img_path = os.path.join(out_dir, img_name)

            # lưu vào output
            page.save(img_path, "JPEG")

            # copy sang assets nếu chưa tồn tại
            dest = os.path.join(assets_dir, img_name)
            if not os.path.exists(dest):
                shutil.copy(img_path, dest)

            # path dùng cho web (luôn dùng /)
            asset_paths.append(f"assets/images/{img_name}")

    # ===== BOOK =====
    else:
        pages = convert_from_path(local_pdf, dpi=200, first_page=1, last_page=1)

        if pages:
            img_name = f"{base_name}-cover.jpg"
            img_path = os.path.join(out_dir, img_name)

            page = pages[0]
            page.save(img_path, "JPEG")

            dest = os.path.join(assets_dir, img_name)
            if not os.path.exists(dest):
                shutil.copy(img_path, dest)

            asset_paths.append(f"assets/images/{img_name}")

    return asset_paths