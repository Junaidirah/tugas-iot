// Test API Connection
// Run this in browser console to test API endpoints

const API_BASE_URL = "https://kalibarasi-biru-langit.vercel.app";

async function testAPI() {
  console.log("Testing API endpoints...\n");

  // Test 1: Current Status
  try {
    const url1 = `${API_BASE_URL}/api/v1/aqms/sensors/current`;
    console.log("1. Testing:", url1);
    const response1 = await fetch(url1);
    console.log("   Status:", response1.status);
    if (response1.ok) {
      const data1 = await response1.json();
      console.log("   Data:", data1);
    } else {
      console.log("   Error:", response1.statusText);
    }
  } catch (error) {
    console.error("   Failed:", error);
  }

  console.log("\n");

  // Test 2: Latest
  try {
    const url2 = `${API_BASE_URL}/api/v1/aqms/latest`;
    console.log("2. Testing:", url2);
    const response2 = await fetch(url2);
    console.log("   Status:", response2.status);
    if (response2.ok) {
      const data2 = await response2.json();
      console.log("   Data:", data2);
    } else {
      console.log("   Error:", response2.statusText);
    }
  } catch (error) {
    console.error("   Failed:", error);
  }

  console.log("\n");

  // Test 3: History
  try {
    const url3 = `${API_BASE_URL}/api/v1/aqms/history?limit=5`;
    console.log("3. Testing:", url3);
    const response3 = await fetch(url3);
    console.log("   Status:", response3.status);
    if (response3.ok) {
      const data3 = await response3.json();
      console.log("   Data:", data3);
    } else {
      console.log("   Error:", response3.statusText);
    }
  } catch (error) {
    console.error("   Failed:", error);
  }

  console.log("\nAPI Test Complete!");
}

// Run the test
testAPI();
