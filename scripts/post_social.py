# post_social.py

import os
import re
import json
import unicodedata
import requests
import datetime
from dotenv import load_dotenv
import config

# =============================
# LOAD ENV
# =============================
load_dotenv("secrets/facebook.env")
PAGE_ID = os.getenv("FB_PAGE_ID")
ACCESS_TOKEN = os.getenv("FB_PAGE_ACCESS_TOKEN")


# =============================
# MAIN POST FUNCTION
# =============================
def post_to_facebook(meta, index=0):

    delay = getattr(config, "FB_POST_DELAY_MINUTES", 10)

    message = generate_post(meta, meta.get("type", "book"))
    scheduled_time = schedule_time(index, delay)

    # =============================
    # CHUẨN BỊ ẢNH
    # =============================
    images = meta.get("images", [])

    # book: chỉ lấy 1 ảnh
    if meta.get("type") == "book" and images:
        images = [images[0]]

    attached_media = []

    for img in images:
        url_img = f"https://graph.facebook.com/{PAGE_ID}/photos"

        payload_img = {
            "published": False,
            "access_token": ACCESS_TOKEN
        }

        try:
            with open(img, 'rb') as f:
                files = {"source": f}
                r_img = requests.post(url_img, data=payload_img, files=files)
                res_img = r_img.json()

                if "id" in res_img:
                    attached_media.append({"media_fbid": res_img["id"]})
                else:
                    print("\t❌ FB Upload ảnh lỗi:", res_img)

        except Exception as e:
            print(f"\t❌ FB Lỗi mở ảnh {img}: {e}")

    # =============================
    # TẠO POST
    # =============================
    url_post = f"https://graph.facebook.com/{PAGE_ID}/feed"

    payload_post = {
        "message": message,
        "access_token": ACCESS_TOKEN,
        "published": False,
        "scheduled_publish_time": scheduled_time
    }

    # 🔥 QUAN TRỌNG: phải json.dumps
    if attached_media:
        payload_post["attached_media"] = json.dumps(attached_media)

    print(f"\t📅 FB Scheduled post: {datetime.datetime.fromtimestamp(scheduled_time)}")
    print(f"\t🖼 FB Images: {len(attached_media)}")

    try:
        r_post = requests.post(url_post, data=payload_post)
        res_post = r_post.json()

        print("\tPost response:", res_post)

        meta["posted_fb"] = "id" in res_post
        meta["fb_post_id"] = res_post.get("id")
        meta["scheduled_time"] = scheduled_time

    except Exception as e:
        print(f"\t❌ Lỗi đăng bài: {e}")
        meta["posted_fb"] = False

    return meta


# =============================
# SCHEDULE TIME (FIX TIMEZONE)
# =============================
def schedule_time(index=0, delay_minutes=10):
    """
    Tính thời gian đăng (UTC)
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    scheduled_dt = now + datetime.timedelta(minutes=(index + 1) * delay_minutes)
    return int(scheduled_dt.timestamp())

# =============================
# GENERATE POST CONTENT
# =============================
def generate_post(meta, type):
    title = meta.get("title") or "Tài liệu học tập"
    author = meta.get("author") or ""
    desc = meta.get("description") or ""
    view = meta.get("drive_view") or ""
    download = meta.get("drive_download") or ""
    website = getattr(config, "WEBSITE_URL", "")

    tags = meta.get("tags", [])
    tags = list(set(tags + config.FB_DEFAULT_TAGS))

    if type == "exam":
        return (
            f"📝 {title}\n\n"
            f"{desc}\n\n"
            f"📖 Xem nhanh: {view}\n"
            f"⬇️ Tải PDF: {download}\n"
            f"🌐 Tổng hợp: {website}\n\n"
            f"👉 Chúc các bạn ôn tập thật tốt và tự tin bước vào kỳ thi nhé! 💪✨\n\n"
            f"{generate_hashtags(tags)}"
        )
    else:
        return (
            f"📚 {title}\n"
            + (f"Tác giả: {author}\n\n" if author else "\n")
            + f"{desc}\n\n"
            f"📖 Xem nhanh: {view}\n"
            f"⬇️ Tải PDF: {download}\n"
            f"🌐 Tổng hợp: {website}\n\n"
            f"👉 Chúc các bạn học tập hiệu quả! 📖🌟\n\n"
            f"{generate_hashtags(tags)}"
        )

# =============================
# HASHTAG
# =============================
def normalize_tag(tag):
    tag = ''.join(
        c for c in unicodedata.normalize('NFD', tag)
        if unicodedata.category(c) != 'Mn'
    )
    tag = tag.replace('đ', 'd').replace('Đ', 'D')
    tag = re.sub(r'[^A-Za-z0-9 ]', '', tag)
    tag = ''.join(word.capitalize() for word in tag.split())
    return tag

def generate_hashtags(tags):
    return " ".join([f"#{normalize_tag(tag)}" for tag in tags])