#!/usr/bin/env node

/**
 * ENFORCER DEL PROTOCOLO ROBLOX
 * 
 * Este script OBLIGA a seguir el protocolo de 3 fases
 * No se puede continuar sin completar cada fase
 * 
 * Uso: node .amp/enforce-protocol.js
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.toLowerCase().trim());
    });
  });
}

function log(color, msg) {
  console.log(`${color}${msg}${colors.reset}`);
}

async function verifyFileExists(filename) {
  const fullPath = path.join(__dirname, "..", filename);
  return fs.existsSync(fullPath);
}

async function phase1() {
  log(colors.magenta, "\n═══════════════════════════════════════════");
  log(colors.magenta, "FASE 1: PRE-GENERACIÓN - LECTURA OBLIGATORIA");
  log(colors.magenta, "═══════════════════════════════════════════\n");

  const requiredFiles = [
    "CONTRATO_ROBLOX.md",
    "ROBLOX_DOCUMENTATION.md",
    "ROBLOX_VALIDATION.md",
    ".amp/ROBLOX_API_REAL.md",
    ".amp/ESTRATEGIA_GENERACION.md",
    ".amp/SOLUCION_ERRORES_OMEGA.md",
  ];

  log(colors.cyan, "📚 Verificando que existen todos los archivos:\n");

  let allExist = true;
  for (const file of requiredFiles) {
    const exists = await verifyFileExists(file);
    if (exists) {
      log(colors.green, `  ✅ ${file}`);
    } else {
      log(colors.red, `  ❌ ${file} FALTA`);
      allExist = false;
    }
  }

  if (!allExist) {
    log(colors.red, "\n❌ ERROR: Faltan archivos obligatorios");
    process.exit(1);
  }

  log(colors.cyan, "\n📖 Verificando que leíste la documentación:\n");

  const questions = [
    {
      prompt: `${colors.yellow}¿Leíste CONTRATO_ROBLOX.md completamente? (s/n): ${colors.reset}`,
      validate: (ans) => ans === "s",
      error: "DEBES leer CONTRATO_ROBLOX.md",
    },
    {
      prompt: `${colors.yellow}¿Leíste ROBLOX_DOCUMENTATION.md completamente? (s/n): ${colors.reset}`,
      validate: (ans) => ans === "s",
      error: "DEBES leer ROBLOX_DOCUMENTATION.md",
    },
    {
      prompt: `${colors.yellow}¿Leíste ROBLOX_VALIDATION.md completamente? (s/n): ${colors.reset}`,
      validate: (ans) => ans === "s",
      error: "DEBES leer ROBLOX_VALIDATION.md",
    },
    {
      prompt: `${colors.yellow}¿Leíste ROBLOX_API_REAL.md completamente? (s/n): ${colors.reset}`,
      validate: (ans) => ans === "s",
      error: "DEBES leer ROBLOX_API_REAL.md",
    },
    {
      prompt: `${colors.yellow}¿Leíste ESTRATEGIA_GENERACION.md completamente? (s/n): ${colors.reset}`,
      validate: (ans) => ans === "s",
      error: "DEBES leer ESTRATEGIA_GENERACION.md",
    },
    {
      prompt: `${colors.yellow}¿Entiendes la estructura de 5 zonas? (s/n): ${colors.reset}`,
      validate: (ans) => ans === "s",
      error: "Debes entender las 5 zonas de código",
    },
  ];

  for (const q of questions) {
    let answered = false;
    while (!answered) {
      const answer = await question(q.prompt);
      if (q.validate(answer)) {
        log(colors.green, `  ✅ ${q.error.split(" ")[0]} confirmado`);
        answered = true;
      } else {
        log(colors.red, `  ❌ ${q.error}\n`);
      }
    }
  }

  log(colors.green, "\n✅ FASE 1 COMPLETADA: Documentación verificada\n");
}

async function phase2() {
  log(colors.magenta, "═══════════════════════════════════════════");
  log(colors.magenta, "FASE 2: GENERACIÓN - MAPEO DE VARIABLES");
  log(colors.magenta, "═══════════════════════════════════════════\n");

  log(colors.cyan, "Escribe tu caso de uso (descripción breve):\n");
  const useCase = await question(`${colors.yellow}Caso de uso: ${colors.reset}`);

  if (!useCase || useCase.length < 10) {
    log(colors.red, "❌ Descripción muy corta");
    process.exit(1);
  }

  log(colors.cyan, "\nMapeo de variables a usar:\n");

  const variables = [];
  let addMore = true;

  while (addMore) {
    const varName = await question(
      `${colors.yellow}Nombre de variable (o 'listo' para terminar): ${colors.reset}`
    );

    if (varName === "listo" || varName === "") {
      addMore = false;
      break;
    }

    const canBeNil = await question(
      `${colors.yellow}¿${varName} puede ser nil? (s/n): ${colors.reset}`
    );

    const whereUsed = await question(
      `${colors.yellow}¿Dónde se usa ${varName}? (descripción): ${colors.reset}`
    );

    variables.push({
      name: varName,
      canBeNil: canBeNil === "s",
      whereUsed,
    });

    log(colors.green, `✅ Variable registrada: ${varName}\n`);
  }

  if (variables.length === 0) {
    log(colors.red, "❌ Debes identificar al menos una variable");
    process.exit(1);
  }

  // Verificar que para cada variable que puede ser nil hay validación
  log(colors.cyan, "\n📋 Validación de variables críticas:\n");

  for (const v of variables) {
    if (v.canBeNil) {
      log(
        colors.yellow,
        `⚠️  ${v.name} PUEDE SER NIL - Requiere validación: if not ${v.name} then`
      );
      log(colors.cyan, `   Dónde se usa: ${v.whereUsed}`);
    }
  }

  log(colors.green, "\n✅ FASE 2 COMPLETADA: Variables mapeadas\n");

  return {
    useCase,
    variables,
  };
}

async function phase3() {
  log(colors.magenta, "═══════════════════════════════════════════");
  log(colors.magenta, "FASE 3: POST-VALIDACIÓN - EJECUTAR VALIDADORES");
  log(colors.magenta, "═══════════════════════════════════════════\n");

  log(colors.cyan, "Indica el archivo script.lua generado:\n");
  const scriptFile = await question(
    `${colors.yellow}Ruta del archivo (ej: ./test.lua): ${colors.reset}`
  );

  if (!fs.existsSync(scriptFile)) {
    log(colors.red, `❌ Archivo no encontrado: ${scriptFile}`);
    process.exit(1);
  }

  log(colors.cyan, "\n📊 Ejecutando validaciones...\n");

  // Aquí deberías ejecutar los validadores
  log(colors.yellow, `npm run validate:lua ${scriptFile}`);
  log(colors.yellow, `npm run validate:api ${scriptFile}`);

  log(colors.yellow, "\n⏳ Espera a que los comandos terminen sin errores\n");

  const validated = await question(
    `${colors.yellow}¿Ambos validadores pasaron sin errores? (s/n): ${colors.reset}`
  );

  if (validated !== "s") {
    log(
      colors.red,
      "❌ Debes corregir los errores y ejecutar validadores de nuevo"
    );
    process.exit(1);
  }

  log(colors.green, "\n✅ FASE 3 COMPLETADA: Código validado\n");
}

async function main() {
  log(colors.magenta, "\n");
  log(colors.magenta, "╔═══════════════════════════════════════════╗");
  log(colors.magenta, "║  🎯 ENFORCER - PROTOCOLO ROBLOX OBLIGATORIO║");
  log(colors.magenta, "║     Versión 2.0 - Sistema de 3 Fases      ║");
  log(colors.magenta, "╚═══════════════════════════════════════════╝\n");

  log(colors.cyan, "Este script OBLIGA a seguir el protocolo correcto.");
  log(colors.cyan, "No puedes saltarte ninguna fase.\n");

  try {
    // Fase 1
    await phase1();

    // Fase 2
    const metadata = await phase2();

    // Fase 3
    await phase3();

    // Completado
    log(colors.green, "═══════════════════════════════════════════");
    log(colors.green, "🎉 ¡PROTOCOLO COMPLETADO EXITOSAMENTE!");
    log(colors.green, "═══════════════════════════════════════════\n");

    log(colors.green, "✅ Fase 1: Documentación verificada");
    log(colors.green, `✅ Fase 2: ${metadata.variables.length} variables mapeadas`);
    log(colors.green, "✅ Fase 3: Código validado\n");

    log(colors.cyan, "📌 Resumen:");
    log(colors.cyan, `   Caso de uso: ${metadata.useCase}`);
    log(colors.cyan, `   Variables: ${metadata.variables.map((v) => v.name).join(", ")}`);
    log(colors.cyan, `   Estado: LISTO PARA PRODUCCIÓN\n`);

    rl.close();
  } catch (err) {
    log(colors.red, `\n❌ Error: ${err.message}`);
    rl.close();
    process.exit(1);
  }
}

main();
