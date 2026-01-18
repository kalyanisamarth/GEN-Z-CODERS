from google import genai

client = genai.Client()

SYSTEM_PROMPT = """
You are a professional AI Support Assistant.

Your responsibilities:
- Help users with transaction issues
- Help with payment failures and refunds
- Guide users in discovering nearby parking
- Be polite, clear, and concise
- If location is mentioned, suggest nearby parking
"""

print("🚗 ParkSense AI Support Bot")
print("Ask about payments, transactions, or nearby parking.")
print("Type 'exit' to quit\n")

while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("Bot: Thank you for using ParkSense 🚗")
        break

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=f"{SYSTEM_PROMPT}\nUser: {user_input}\nBot:"
    )

    print("Bot:", response.text)