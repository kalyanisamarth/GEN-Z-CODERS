from google import genai

client = genai.Client(
    api_key="AIzaSyBBpSXitM1yYMtwU3b-lJdbK2RJyxXrjsQ"
)

print("🤖 Gemini Chatbot Ready")
print("Type 'exit' to quit\n")

while True:
    user_input = input("You: ")

    if user_input.lower() == "exit":
        print("Bot: 👋 Goodbye!")
        break

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=user_input
    )

    print("Bot:", response.text)