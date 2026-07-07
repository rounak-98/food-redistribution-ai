from app.auth.security import hash_password

password = "FoodBridge123"

hashed = hash_password(password)

print("Original :", password)
print("Hashed   :", hashed)