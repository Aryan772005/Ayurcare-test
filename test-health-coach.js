import fetch from 'node-fetch';

async function testHealthCoach() {
  const payload = {
    age: "25",
    gender: "Male",
    height: "175",
    weight: "70",
    goal: "Muscle Gain",
    activityLevel: "Medium",
    foodPreference: "Veg",
    bpm: "72",
    caloriesToday: "1200",
    skinType: "Combination",
    hairCondition: "Normal"
  };

  console.log("Testing Health Coach API at http://localhost:3000/api/health-coach...");

  try {
    const response = await fetch("http://localhost:3000/api/health-coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });
    
    const text = await response.text();
    console.log("Status:", response.status);
    try {
      const json = JSON.parse(text);
      console.log("Response JSON:", JSON.stringify(json, null, 2));
    } catch (e) {
      console.log("Response Text (not JSON):", text.substring(0, 200));
    }
  } catch (e) {
    console.error("Fetch error:", e.message);
  }
}

testHealthCoach();
