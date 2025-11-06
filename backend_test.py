#!/usr/bin/env python3
"""
FitLife AI Backend API Test Suite
Tests all backend endpoints systematically
"""

import requests
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://smart-workout-38.preview.emergentagent.com/api"
TIMEOUT = 30

class FitLifeAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.session.timeout = TIMEOUT
        self.jwt_token = None
        self.user_email = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"    Details: {details}")
        if not success and response_data:
            print(f"    Response: {response_data}")
        print()
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple[bool, Any]:
        """Make HTTP request and return (success, response_data)"""
        url = f"{self.base_url}{endpoint}"
        
        # Add JWT token if available
        if self.jwt_token and headers is None:
            headers = {}
        if self.jwt_token:
            headers = headers or {}
            headers["Authorization"] = f"Bearer {self.jwt_token}"
        
        try:
            if method.upper() == "GET":
                response = self.session.get(url, headers=headers)
            elif method.upper() == "POST":
                response = self.session.post(url, json=data, headers=headers)
            elif method.upper() == "PUT":
                response = self.session.put(url, json=data, headers=headers)
            elif method.upper() == "DELETE":
                response = self.session.delete(url, headers=headers)
            else:
                return False, f"Unsupported method: {method}"
            
            # Try to parse JSON response
            try:
                response_data = response.json()
            except:
                response_data = response.text
            
            return response.status_code < 400, {
                "status_code": response.status_code,
                "data": response_data
            }
            
        except requests.exceptions.RequestException as e:
            return False, f"Request failed: {str(e)}"
    
    def test_health_check(self):
        """Test health check endpoint"""
        success, response = self.make_request("GET", "/health")
        
        if success and response["status_code"] == 200:
            data = response["data"]
            if isinstance(data, dict) and "status" in data:
                self.log_test("Health Check", True, f"Status: {data.get('status')}")
            else:
                self.log_test("Health Check", False, "Invalid response format", response)
        else:
            self.log_test("Health Check", False, "Health check failed", response)
    
    def test_register(self):
        """Test user registration"""
        # Use realistic test data
        register_data = {
            "email": "maria.silva@email.com",
            "password": "MinhaSenh@123",
            "full_name": "Maria Silva Santos",
            "age": 28,
            "weight": 65.5,
            "height": 165,
            "objectives": "Perder peso e ganhar condicionamento físico",
            "dietary_restrictions": "Intolerância à lactose",
            "training_type": "academia",
            "current_activities": "Caminhada 3x por semana"
        }
        
        success, response = self.make_request("POST", "/auth/register", register_data)
        
        if success and response["status_code"] == 201:
            data = response["data"]
            if isinstance(data, dict) and "access_token" in data:
                self.jwt_token = data["access_token"]
                self.user_email = register_data["email"]
                self.log_test("User Registration", True, "User registered successfully with JWT token")
            else:
                self.log_test("User Registration", False, "No access token in response", response)
        else:
            self.log_test("User Registration", False, "Registration failed", response)
    
    def test_login(self):
        """Test user login"""
        if not self.user_email:
            self.log_test("User Login", False, "No user email available for login test")
            return
        
        login_data = {
            "email": self.user_email,
            "password": "MinhaSenh@123"
        }
        
        success, response = self.make_request("POST", "/auth/login", login_data)
        
        if success and response["status_code"] == 200:
            data = response["data"]
            if isinstance(data, dict) and "access_token" in data:
                # Update token with login token
                self.jwt_token = data["access_token"]
                self.log_test("User Login", True, "Login successful with JWT token")
            else:
                self.log_test("User Login", False, "No access token in response", response)
        else:
            self.log_test("User Login", False, "Login failed", response)
    
    def test_get_profile(self):
        """Test get user profile"""
        if not self.jwt_token:
            self.log_test("Get Profile", False, "No JWT token available")
            return
        
        success, response = self.make_request("GET", "/profile")
        
        if success and response["status_code"] == 200:
            data = response["data"]
            if isinstance(data, dict) and all(key in data for key in ["full_name", "age", "weight", "height", "bmi", "bmi_category"]):
                self.log_test("Get Profile", True, f"Profile retrieved with BMI: {data.get('bmi')} ({data.get('bmi_category')})")
            else:
                self.log_test("Get Profile", False, "Invalid profile response format", response)
        else:
            self.log_test("Get Profile", False, "Failed to get profile", response)
    
    def test_update_profile(self):
        """Test update user profile"""
        if not self.jwt_token:
            self.log_test("Update Profile", False, "No JWT token available")
            return
        
        update_data = {
            "weight": 63.0,
            "objectives": "Ganhar massa muscular e definição",
            "current_activities": "Musculação 4x por semana + cardio 2x"
        }
        
        success, response = self.make_request("PUT", "/profile", update_data)
        
        if success and response["status_code"] == 200:
            data = response["data"]
            if isinstance(data, dict) and data.get("weight") == 63.0:
                self.log_test("Update Profile", True, f"Profile updated successfully. New weight: {data.get('weight')}kg")
            else:
                self.log_test("Update Profile", False, "Profile not updated correctly", response)
        else:
            self.log_test("Update Profile", False, "Failed to update profile", response)
    
    def test_generate_workout(self):
        """Test generate workout suggestion"""
        if not self.jwt_token:
            self.log_test("Generate Workout", False, "No JWT token available")
            return
        
        success, response = self.make_request("POST", "/suggestions/workout")
        
        if success and response["status_code"] == 201:
            data = response["data"]
            if isinstance(data, dict) and all(key in data for key in ["id", "type", "content"]):
                content_length = len(data.get("content", ""))
                if data.get("type") == "workout" and content_length > 100:
                    self.log_test("Generate Workout", True, f"Workout generated successfully ({content_length} chars)")
                    return data.get("id")  # Return suggestion ID for later deletion test
                else:
                    self.log_test("Generate Workout", False, "Workout content too short or invalid type", response)
            else:
                self.log_test("Generate Workout", False, "Invalid workout response format", response)
        else:
            self.log_test("Generate Workout", False, "Failed to generate workout", response)
        
        return None
    
    def test_generate_nutrition(self):
        """Test generate nutrition suggestion"""
        if not self.jwt_token:
            self.log_test("Generate Nutrition", False, "No JWT token available")
            return
        
        success, response = self.make_request("POST", "/suggestions/nutrition")
        
        if success and response["status_code"] == 201:
            data = response["data"]
            if isinstance(data, dict) and all(key in data for key in ["id", "type", "content"]):
                content_length = len(data.get("content", ""))
                if data.get("type") == "nutrition" and content_length > 100:
                    self.log_test("Generate Nutrition", True, f"Nutrition plan generated successfully ({content_length} chars)")
                    return data.get("id")  # Return suggestion ID for later deletion test
                else:
                    self.log_test("Generate Nutrition", False, "Nutrition content too short or invalid type", response)
            else:
                self.log_test("Generate Nutrition", False, "Invalid nutrition response format", response)
        else:
            self.log_test("Generate Nutrition", False, "Failed to generate nutrition plan", response)
        
        return None
    
    def test_get_suggestions_history(self):
        """Test get suggestions history"""
        if not self.jwt_token:
            self.log_test("Get Suggestions History", False, "No JWT token available")
            return
        
        success, response = self.make_request("GET", "/suggestions/history")
        
        if success and response["status_code"] == 200:
            data = response["data"]
            if isinstance(data, dict) and "workouts" in data and "nutrition" in data:
                workout_count = len(data.get("workouts", []))
                nutrition_count = len(data.get("nutrition", []))
                self.log_test("Get Suggestions History", True, f"History retrieved: {workout_count} workouts, {nutrition_count} nutrition plans")
            else:
                self.log_test("Get Suggestions History", False, "Invalid history response format", response)
        else:
            self.log_test("Get Suggestions History", False, "Failed to get suggestions history", response)
    
    def test_delete_suggestion(self, suggestion_id: str):
        """Test delete specific suggestion"""
        if not self.jwt_token:
            self.log_test("Delete Suggestion", False, "No JWT token available")
            return
        
        if not suggestion_id:
            self.log_test("Delete Suggestion", False, "No suggestion ID available")
            return
        
        success, response = self.make_request("DELETE", f"/suggestions/{suggestion_id}")
        
        if success and response["status_code"] == 204:
            self.log_test("Delete Suggestion", True, f"Suggestion {suggestion_id} deleted successfully")
        else:
            self.log_test("Delete Suggestion", False, f"Failed to delete suggestion {suggestion_id}", response)
    
    def test_delete_account(self):
        """Test delete user account"""
        if not self.jwt_token:
            self.log_test("Delete Account", False, "No JWT token available")
            return
        
        success, response = self.make_request("DELETE", "/user")
        
        if success and response["status_code"] == 204:
            self.log_test("Delete Account", True, "Account deleted successfully")
            # Clear token since account is deleted
            self.jwt_token = None
            self.user_email = None
        else:
            self.log_test("Delete Account", False, "Failed to delete account", response)
    
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_login_data = {
            "email": "invalid@email.com",
            "password": "wrongpassword"
        }
        
        success, response = self.make_request("POST", "/auth/login", invalid_login_data)
        
        if not success and response["status_code"] == 401:
            self.log_test("Invalid Login Test", True, "Correctly rejected invalid credentials")
        else:
            self.log_test("Invalid Login Test", False, "Should have rejected invalid credentials", response)
    
    def test_unauthorized_access(self):
        """Test accessing protected endpoint without token"""
        # Temporarily clear token
        temp_token = self.jwt_token
        self.jwt_token = None
        
        success, response = self.make_request("GET", "/profile")
        
        # Restore token
        self.jwt_token = temp_token
        
        if not success and response["status_code"] in [401, 403]:
            self.log_test("Unauthorized Access Test", True, f"Correctly rejected request without token (HTTP {response['status_code']})")
        else:
            self.log_test("Unauthorized Access Test", False, "Should have rejected request without token", response)
    
    def run_all_tests(self):
        """Run all backend tests in sequence"""
        print("🚀 Starting FitLife AI Backend API Tests")
        print(f"📡 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity
        self.test_health_check()
        
        # Authentication flow
        self.test_register()
        self.test_login()
        
        # Profile management
        self.test_get_profile()
        self.test_update_profile()
        
        # AI Suggestions
        workout_id = self.test_generate_workout()
        nutrition_id = self.test_generate_nutrition()
        self.test_get_suggestions_history()
        
        # Delete suggestions (if we have IDs)
        if workout_id:
            self.test_delete_suggestion(workout_id)
        if nutrition_id:
            self.test_delete_suggestion(nutrition_id)
        
        # Security tests
        self.test_invalid_login()
        self.test_unauthorized_access()
        
        # Account deletion (should be last)
        self.test_delete_account()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)
        
        return failed_tests == 0

def main():
    """Main test execution"""
    tester = FitLifeAPITester()
    
    try:
        success = tester.run_all_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Unexpected error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()