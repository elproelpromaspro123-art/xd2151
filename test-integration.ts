#!/usr/bin/env node
/**
 * Script de testing para validar la integración de sistemas
 * Uso: npx ts-node test-integration.ts
 */

import fetch from "node-fetch";

const API_URL = process.env.API_URL || "http://localhost:5000";
const TEST_USER_ID = "test-user-" + Math.random().toString(36).substring(7);
const TEST_EMAIL = `test-${TEST_USER_ID}@example.com`;

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  response?: unknown;
}

const results: TestResult[] = [];

function log(message: string, type: "info" | "success" | "error" = "info") {
  const prefix = {
    info: "ℹ️ ",
    success: "✅",
    error: "❌",
  }[type];
  console.log(`${prefix} ${message}`);
}

async function test(name: string, fn: () => Promise<void>) {
  try {
    log(`Testing: ${name}`, "info");
    await fn();
    results.push({ name, passed: true });
    log(`PASSED: ${name}`, "success");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMessage });
    log(`FAILED: ${name} - ${errorMessage}`, "error");
  }
}

/**
 * Test 1: Webhook Discord Logging
 */
test("Discord Webhook - Registrar chat", async () => {
  const response = await fetch(`${API_URL}/api/chat/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: TEST_USER_ID,
      userEmail: TEST_EMAIL,
      conversationId: "conv-test-" + Date.now(),
      chatName: "Test Chat - " + new Date().toLocaleString(),
      userMessage: "This is a test message from the integration test script",
      botResponse:
        "This is a test response. If you see this in Discord, the webhook is working!",
      model: "gemini-2.5-flash",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${await response.text()}`
    );
  }

  const data = (await response.json()) as { success: boolean };
  if (!data.success) {
    throw new Error("Webhook response indicated failure");
  }
});

/**
 * Test 2: Rate Limit Check
 */
test("Rate Limit - Validar requisición", async () => {
  const response = await fetch(`${API_URL}/api/rate-limit/check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ modelKey: "gemini-2.5-flash" }),
  });

  const data = (await response.json()) as unknown;

  // La primera petición debería ser permitida o tener info de rate limit
  if (response.status !== 200 && response.status !== 429) {
    throw new Error(`Unexpected status code: ${response.status}`);
  }

  log(`  Rate limit status: ${JSON.stringify(data)}`, "info");
});

/**
 * Test 3: Message Reset Info
 */
test("Message Reset - Obtener información", async () => {
  const response = await fetch(
    `${API_URL}/api/user/message-reset-info?userId=${TEST_USER_ID}`
  );

  if (!response.ok) {
    // Es normal que falle si el usuario no existe
    if (response.status === 404) {
      log("  Usuario no encontrado (esperado para usuario de test)", "info");
      return;
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    remainingDays?: number;
    remainingHours?: number;
  };
  log(
    `  Reinicio en: ${data.remainingDays}d ${data.remainingHours}h`,
    "info"
  );
});

/**
 * Test 4: Referral Stats
 */
test("Referral System - Obtener estadísticas", async () => {
  const response = await fetch(
    `${API_URL}/api/user/referral-stats?userId=${TEST_USER_ID}`
  );

  if (!response.ok) {
    // Es normal que falle si el usuario no existe
    if (response.status === 404) {
      log("  Usuario no encontrado (esperado para usuario de test)", "info");
      return;
    }
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as {
    successfulReferrals?: number;
    referralsNeeded?: number;
  };
  log(
    `  Referrals: ${data.successfulReferrals}/${data.referralsNeeded}`,
    "info"
  );
});

/**
 * Test 5: SSE Connection
 */
test("SSE - Conectar a actualizaciones", async () => {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("SSE connection timeout"));
    }, 5000);

    try {
      const eventSource = new EventSource(
        `${API_URL}/api/realtime?userId=${TEST_USER_ID}`
      );

      eventSource.onopen = () => {
        clearTimeout(timeout);
        log("  SSE connection established", "info");
        eventSource.close();
        resolve();
      };

      eventSource.onerror = () => {
        clearTimeout(timeout);
        reject(new Error("SSE connection failed"));
      };
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
});

/**
 * Ejecutar todos los tests
 */
async function runAllTests() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 Integration Test Suite");
  console.log("=".repeat(60) + "\n");

  log(`API URL: ${API_URL}`, "info");
  log(`Test User ID: ${TEST_USER_ID}`, "info");
  log(`Test Email: ${TEST_EMAIL}\n`, "info");

  // Esperar a que los tests terminen
  const allTests = [
    test("Discord Webhook - Registrar chat", async () => {
      const response = await fetch(`${API_URL}/api/chat/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: TEST_USER_ID,
          userEmail: TEST_EMAIL,
          conversationId: "conv-test-" + Date.now(),
          chatName: "Test Chat - " + new Date().toLocaleString(),
          userMessage:
            "This is a test message from the integration test script",
          botResponse:
            "This is a test response. If you see this in Discord, the webhook is working!",
          model: "gemini-2.5-flash",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${await response.text()}`
        );
      }

      const data = (await response.json()) as { success: boolean };
      if (!data.success) {
        throw new Error("Webhook response indicated failure");
      }
    }),
    test("Rate Limit - Validar requisición", async () => {
      const response = await fetch(`${API_URL}/api/rate-limit/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelKey: "gemini-2.5-flash" }),
      });

      const data = (await response.json()) as unknown;

      if (response.status !== 200 && response.status !== 429) {
        throw new Error(`Unexpected status code: ${response.status}`);
      }

      log(`  Rate limit status: ${JSON.stringify(data)}`, "info");
    }),
    test("Message Reset - Obtener información", async () => {
      const response = await fetch(
        `${API_URL}/api/user/message-reset-info?userId=${TEST_USER_ID}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          log(
            "  Usuario no encontrado (esperado para usuario de test)",
            "info"
          );
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        remainingDays?: number;
        remainingHours?: number;
      };
      log(
        `  Reinicio en: ${data.remainingDays}d ${data.remainingHours}h`,
        "info"
      );
    }),
    test("Referral System - Obtener estadísticas", async () => {
      const response = await fetch(
        `${API_URL}/api/user/referral-stats?userId=${TEST_USER_ID}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          log(
            "  Usuario no encontrado (esperado para usuario de test)",
            "info"
          );
          return;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        successfulReferrals?: number;
        referralsNeeded?: number;
      };
      log(
        `  Referrals: ${data.successfulReferrals}/${data.referralsNeeded}`,
        "info"
      );
    }),
    test("SSE - Conectar a actualizaciones", async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("SSE connection timeout"));
        }, 5000);

        try {
          const eventSource = new EventSource(
            `${API_URL}/api/realtime?userId=${TEST_USER_ID}`
          );

          eventSource.onopen = () => {
            clearTimeout(timeout);
            log("  SSE connection established", "info");
            eventSource.close();
            resolve();
          };

          eventSource.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("SSE connection failed"));
          };
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      });
    }),
  ];

  await Promise.all(allTests);

  // Resumen
  console.log("\n" + "=".repeat(60));
  console.log("📊 Test Summary");
  console.log("=".repeat(60) + "\n");

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  results.forEach((result) => {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${status}: ${result.name}`);
    if (result.error) {
      console.log(`       Error: ${result.error}`);
    }
  });

  console.log(
    `\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}\n`
  );

  if (failed === 0) {
    log("All tests passed! 🎉", "success");
    process.exit(0);
  } else {
    log(`${failed} test(s) failed`, "error");
    process.exit(1);
  }
}

// Iniciar tests
runAllTests().catch((error) => {
  log(String(error), "error");
  process.exit(1);
});
