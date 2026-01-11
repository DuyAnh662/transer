# Discord Translation Bot

A multilingual text and image translation Discord Bot.

## Features

- 🌍 Automatic text translation between multiple languages
- 🔍 Auto Detect source language
- 🖼️ OCR - Extract and translate text from images
- 💾 Save per-user language configuration

## Installation

1. Clone the project and install dependencies:
```bash
npm install
```

2. Create a Discord Bot:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new Application
   - Go to Bot → Copy Token
   - Paste it into the `.env` file

3. Invite the bot to your server:
   - OAuth2 → URL Generator
   - Select: `bot`, `applications.commands`
   - Permissions: `Send Messages`, `Read Message History`, `Attach Files`

4. Run the bot:
```bash
npm start
```

## Usage

### Set Translation Language
```
Auto > Vietnamese
English > Japanese
Japanese > Vietnamese
```

### Change Image Translation Mode
```
Mode: Text
Mode: Image
```

### Translate Text
Send any text message:
```
Hello, how are you?
```

### Translate Image
Send an image containing text (PNG/JPG/WEBP), the bot will automatically OCR and translate it.

## Supported Languages

| Name | Aliases |
|-----|---------------|
| Auto/Detect | auto |
| English | en |
| Vietnamese | vi |
| Japanese | ja |
| Korean | ko |
| Chinese | zh |
| French | fr |
| German | de |
| Spanish | es |

## License

MIT
