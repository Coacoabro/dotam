import requests

BOT_TOKEN = "8073220272:AAGVRtXb7LRM0H4h3KizX5GfbfqLGDj6S1s"  # From BotFather
CHAT_ID = "529384584"  # From userinfobot

message = "Up And Running!"

url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"

payload = {
    "chat_id": CHAT_ID,
    "text": message
}

response = requests.post(url, json=payload)
if response.status_code == 200:
    print("Telegram notification sent!")
else:
    print(f"Failed to send Telegram message: {response.status_code} - {response.text}")