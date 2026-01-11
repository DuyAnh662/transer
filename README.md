# Discord Translation Bot

Bot Discord dịch văn bản và ảnh đa ngôn ngữ.

## Tính năng

- 🌍 Dịch văn bản tự động giữa nhiều ngôn ngữ
- 🔍 Tự phát hiện ngôn ngữ nguồn (Auto Detect)
- 🖼️ OCR - Đọc và dịch chữ trong ảnh
- 💾 Lưu cấu hình ngôn ngữ cho từng user

## Cài đặt

1. Clone project và cài dependencies:
```bash
npm install
```

2. Tạo Discord Bot:
   - Vào [Discord Developer Portal](https://discord.com/developers/applications)
   - Tạo Application mới
   - Vào Bot → Copy Token
   - Paste vào file `.env`

3. Invite bot vào server:
   - OAuth2 → URL Generator
   - Chọn: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Read Message History`, `Attach Files`

4. Chạy bot:
```bash
npm start
```

## Cách sử dụng

### Đặt ngôn ngữ dịch
```
Auto > Vietnamese
English > Japanese
Nhật > Việt
```

### Đổi mode dịch ảnh
```
Mode: Text
Mode: Image
```

### Dịch văn bản
Gửi bất kỳ đoạn văn bản nào:
```
Hello, how are you?
```

### Dịch ảnh
Gửi ảnh có chữ (PNG/JPG/WEBP), bot sẽ tự OCR và dịch.

## Ngôn ngữ hỗ trợ

| Tên | Từ đồng nghĩa |
|-----|---------------|
| Auto/Detect | auto |
| English/Anh | en |
| Vietnamese/Việt | vi |
| Japanese/Nhật | ja |
| Korean/Hàn | ko |
| Chinese/Trung | zh |
| French/Pháp | fr |
| German/Đức | de |
| Spanish | es |

## License

MIT
