import re
import unicodedata

def slugify(text):
    if not text:
        return None

    text = text.replace('đ', 'd').replace('Đ', 'D')

    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('ascii')

    text = text.lower()

    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^a-z0-9\-]', '', text)
    text = re.sub(r'-+', '-', text).strip('-')

    return text