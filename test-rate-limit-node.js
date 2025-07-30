// Test script to verify rate limiting
// Run with: node test-rate-limit-node.js

const testRateLimit = async () => {
  console.log("🧪 Testing Rate Limiting (10 requests per minute)...\n");

  for (let i = 1; i <= 12; i++) {
    try {
      // Using dynamic import for fetch in Node.js
      const { default: fetch } = await import("node-fetch");

      const response = await fetch("http://localhost:3001/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Test User ${i}`,
          email: `test${i}@example.com`,
        }),
      });

      const data = await response.json();
      const remaining = response.headers.get("X-RateLimit-Remaining");
      const limit = response.headers.get("X-RateLimit-Limit");
      const resetTime = response.headers.get("X-RateLimit-Reset");

      if (response.status === 429) {
        console.log(`❌ Request ${i}: RATE LIMITED`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Message: ${data.message}`);
        console.log(
          `   Retry After: ${response.headers.get("Retry-After")} seconds`
        );
      } else if (response.ok) {
        console.log(`✅ Request ${i}: SUCCESS`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Remaining: ${remaining}/${limit}`);
      } else {
        console.log(`⚠️  Request ${i}: ERROR`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${data.error}`);
      }

      console.log(""); // Empty line for readability

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.log(`💥 Request ${i}: NETWORK ERROR`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log("🏁 Rate limiting test completed!");
  console.log("📊 Expected behavior:");
  console.log("   • First 10 requests should succeed");
  console.log("   • Requests 11-12 should be rate limited (429 status)");
};

// Execute the test
testRateLimit().catch(console.error);
