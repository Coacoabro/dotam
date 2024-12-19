import requests

# Function to send a Telegram message
def send_telegram_message(bot_token, chat_id, message):
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        print("Telegram notification sent!")
    else:
        print(f"Failed to send Telegram message: {response.status_code} - {response.text}")

BOT_TOKEN = "8073220272:AAGVRtXb7LRM0H4h3KizX5GfbfqLGDj6S1s"  # From BotFather
CHAT_ID = "529384584"  # From userinfobot

try:
    # Replace this block with your actual code
    print("Running the script...")
    raise RuntimeError("Simulated error for testing Telegram bot.")

except Exception as e:
    # Send a Telegram notification when an error occurs
    error_message = f"An error occurred in your script:\n\n{str(e)}"
    send_telegram_message(BOT_TOKEN, CHAT_ID, error_message)
