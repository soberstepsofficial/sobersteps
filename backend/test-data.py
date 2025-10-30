import requests
from datetime import date, timedelta
import json

BASE_URL = "http://localhost:8000"

def print_response(response, description):
    print(f"\n=== {description} ===")
    print(f"Status: {response.status_code}")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)

# Test 1: User Registration and Authentication
print("\n=== Starting User Tests ===")

# Register a new user
response = requests.post(
    f"{BASE_URL}/register",
    json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpass123",
        "full_name": "Test User"
    }
)
print_response(response, "User Registration")

# Login to get token
response = requests.post(
    f"{BASE_URL}/token",
    data={"username": "testuser", "password": "testpass123"}
)
print_response(response, "User Login")
token = response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get user profile
response = requests.get(f"{BASE_URL}/users/me", headers=headers)
print_response(response, "Get User Profile")

# Test 2: Sobriety Journey
print("\n=== Starting Sobriety Journey Tests ===")

# Start sobriety journey
start_date = date.today() - timedelta(days=30)  # Started 30 days ago
response = requests.post(
    f"{BASE_URL}/sobriety/start",
    headers=headers,
    json={"start_date": start_date.isoformat()}
)
print_response(response, "Start Sobriety Journey")

# Add some daily check-ins
for days_ago in [0, 1, 2, 3, 5, 7]:  # Some regular days and gaps
    check_date = date.today() - timedelta(days=days_ago)
    response = requests.post(
        f"{BASE_URL}/sobriety/check-in",
        headers=headers,
        json={
            "check_in_date": check_date.isoformat(),
            "stayed_sober": True if days_ago != 5 else False,  # Simulate one relapse
            "mood": "GOOD" if days_ago != 5 else "STRUGGLING",
            "activities": "Exercise, meditation",
            "triggers": "None today" if days_ago != 5 else "Social pressure",
            "notes": "Feeling strong" if days_ago != 5 else "Had a setback",
            "gratitude": "Grateful for support"
        }
    )
    print_response(response, f"Daily Check-in for {check_date}")

# Report a relapse (for the day we marked as not sober)
response = requests.post(
    f"{BASE_URL}/sobriety/relapse",
    headers=headers,
    json={
        "relapse_date": (date.today() - timedelta(days=5)).isoformat(),
        "trigger": "Social pressure at event",
        "what_happened": "Gave in to peer pressure",
        "lesson_learned": "Need to prepare better for social situations",
        "reached_out_for_help": True
    }
)
print_response(response, "Report Relapse")

# Get sobriety stats
response = requests.get(f"{BASE_URL}/sobriety/stats", headers=headers)
print_response(response, "Get Sobriety Stats")

# Get graph data
response = requests.get(f"{BASE_URL}/sobriety/graph?days=30", headers=headers)
print_response(response, "Get Graph Data")

# Get milestones
response = requests.get(f"{BASE_URL}/sobriety/milestones", headers=headers)
print_response(response, "Get Milestones")

print("\nTest cases completed!")