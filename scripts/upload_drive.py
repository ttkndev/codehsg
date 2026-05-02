# upload_drive.py

import os
import config
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive


# =============================
# INIT GOOGLE DRIVE
# =============================
def init_drive():
    """
    Khởi tạo Google Drive với cơ chế:
    - Load token đã lưu
    - Refresh nếu hết hạn
    - Login nếu chưa có
    """

    gauth = GoogleAuth(settings_file="secrets/settings.yaml")

    # load token
    gauth.LoadCredentialsFile("secrets/google_token.json")

    if gauth.credentials is None:
        print("🔐 First-time login required...")
        gauth.LocalWebserverAuth()

    elif gauth.access_token_expired:
        print("🔄 Refreshing expired token...")
        gauth.Refresh()

    else:
        print("✅ Using saved credentials")
        gauth.Authorize()

    # lưu lại token
    gauth.SaveCredentialsFile("secrets/google_token.json")

    return GoogleDrive(gauth)


# =============================
# UPLOAD / UPDATE FILE
# =============================
def upload_or_update_file(drive, local_path, meta):
    """
    Upload hoặc update file lên Google Drive

    Args:
        drive: GoogleDrive instance
        local_path: đường dẫn file local
        meta: metadata (có thể chứa file_id)

    Returns:
        dict: file_id, drive_view, drive_download
    """

    filename = os.path.basename(local_path)
    file_id = meta.get("file_id")

    try:
        # =====================
        # UPDATE FILE
        # =====================
        if file_id:
            print(f"\t🔄 Updating: {filename}")

            file_drive = drive.CreateFile({
                'id': file_id,
                'parents': [{'id': config.DRIVE_FOLDER_ID}]
            })

        # =====================
        # UPLOAD NEW FILE
        # =====================
        else:
            print(f"\t⬆ Uploading: {filename}")

            file_drive = drive.CreateFile({
                'title': filename,
                'parents': [{'id': config.DRIVE_FOLDER_ID}]
            })

        # upload nội dung
        file_drive.SetContentFile(local_path)
        file_drive.Upload()

        # =====================
        # SET PUBLIC PERMISSION
        # =====================
        if not file_id:
            file_id = file_drive['id']

            file_drive.InsertPermission({
                'type': 'anyone',
                'value': 'anyone',
                'role': 'reader'
            })

        # =====================
        # RETURN LINKS
        # =====================
        return {
            "drive_file_id": file_id,
            "drive_view": f"https://drive.google.com/file/d/{file_id}/view",
            "drive_download": f"https://drive.google.com/uc?id={file_id}&export=download"
        }

    except Exception as e:
        print(f"\t❌ Upload failed: {filename}")
        print(f"\tError: {e}")
        return None