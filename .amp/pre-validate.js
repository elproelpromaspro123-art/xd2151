#!/usr/bin/env node

/**
 * Pre-validador de Código Roblox
 * Ejecuta ANTES de generar código para garantizar calidad
 * 
 * Uso: node .amp/pre-validate.js
 */

import fs from "fs";
import path from "path";
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

function checkPrerequisites() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}📋 PRE-VALIDACIÓN DE CÓDIGO ROBLOX${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

  const files = [
    "CONTRATO_ROBLOX.md",
    "ROBLOX_DOCUMENTATION.md",
    "ROBLOX_VALIDATION.md",
    ".amp/ROBLOX_API_REAL.md",
  ];

  let allFilesExist = true;

  files.forEach((file) => {
    const fullPath = path.join(__dirname, "..", file);
    const exists = fs.existsSync(fullPath);

    if (exists) {
      console.log(`${colors.green}✅ ${file}${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ ${file} FALTA${colors.reset}`);
      allFilesExist = false;
    }
  });

  console.log();

  if (!allFilesExist) {
    console.error(`${colors.red}ERROR: Faltan archivos de validación${colors.reset}`);
    process.exit(1);
  }

  return true;
}

function validateCodeStructure(code) {
  console.log(`${colors.cyan}📊 Analizando estructura de código...${colors.reset}\n`);

  const lines = code.split("\n");
  const analysis = {
    variables: [],
    functions: [],
    tableMethods: [],
    eventHandlers: [],
    issues: [],
  };

  const varRegex = /^\s*local\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=/;
  const funcRegex = /^\s*local\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
  const methodRegex = /^\s*function\s+([a-zA-Z_][a-zA-Z0-9_]*):([a-zA-Z_][a-zA-Z0-9_]*)/;

  // Encontrar todas las variables
  lines.forEach((line, idx) => {
    const varMatch = line.match(varRegex);
    if (varMatch) {
      analysis.variables.push({ name: varMatch[1], line: idx + 1 });
    }

    const funcMatch = line.match(funcRegex);
    if (funcMatch) {
      analysis.functions.push({ name: funcMatch[1], line: idx + 1 });
    }

    const methodMatch = line.match(methodRegex);
    if (methodMatch) {
      analysis.tableMethods.push({
        table: methodMatch[1],
        method: methodMatch[2],
        line: idx + 1,
      });
    }
  });

  // Validar que no hay pairs(nil)
  lines.forEach((line, idx) => {
    if (line.includes("pairs(") || line.includes("ipairs(")) {
      const match = line.match(/pairs\(([a-zA-Z_][a-zA-Z0-9_]*)\)/);
      if (match) {
        const varName = match[1];
        const varDef = analysis.variables.find((v) => v.name === varName);

        if (!varDef) {
          analysis.issues.push({
            type: "potential_nil_iteration",
            severity: "error",
            line: idx + 1,
            variable: varName,
            description: `⚠️ pairs(${varName}) pero ${varName} podría ser nil`,
            fix: `Validar: if ${varName} then for k,v in pairs(${varName}) do`,
          });
        }
      }
    }
  });

  // Validar orden de declaración
  lines.forEach((line, idx) => {
    const keywords = [
      "if",
      "then",
      "for",
      "while",
      "function",
      "do",
      "else",
      "end",
      "local",
      "return",
      "print",
      "table",
      "string",
      "math",
      "game",
      "Instance",
      "Roact",
      "require",
      "assert",
      "type",
      "pcall",
    ];

    const funcCallRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;
    let match;

    while ((match = funcCallRegex.exec(line)) !== null) {
      const funcName = match[1];

      if (keywords.includes(funcName)) continue;

      const funcDef = analysis.functions.find((f) => f.name === funcName);
      if (funcDef && idx + 1 < funcDef.line) {
        analysis.issues.push({
          type: "forward_reference",
          severity: "warning",
          line: idx + 1,
          function: funcName,
          fix: `Mover definición de ${funcName} ANTES de línea ${idx + 1}`,
        });
      }
    }
  });

  return analysis;
}

function printAnalysis(analysis) {
  console.log(`${colors.green}📌 VARIABLES DETECTADAS:${colors.reset}`);
  if (analysis.variables.length > 0) {
    analysis.variables.forEach((v) => {
      console.log(`  - ${v.name} (línea ${v.line})`);
    });
  } else {
    console.log(`  (ninguna)`);
  }

  console.log(`\n${colors.green}📌 FUNCIONES DETECTADAS:${colors.reset}`);
  if (analysis.functions.length > 0) {
    analysis.functions.forEach((f) => {
      console.log(`  - ${f.name}() (línea ${f.line})`);
    });
  } else {
    console.log(`  (ninguna)`);
  }

  console.log(`\n${colors.green}📌 MÉTODOS DE TABLA DETECTADOS:${colors.reset}`);
  if (analysis.tableMethods.length > 0) {
    analysis.tableMethods.forEach((m) => {
      console.log(`  - ${m.table}:${m.method}() (línea ${m.line})`);
    });
  } else {
    console.log(`  (ninguno)`);
  }

  if (analysis.issues.length > 0) {
    console.log(`\n${colors.red}⚠️  PROBLEMAS DETECTADOS:${colors.reset}\n`);

    const errors = analysis.issues.filter((i) => i.severity === "error");
    const warnings = analysis.issues.filter((i) => i.severity === "warning");

    if (errors.length > 0) {
      console.log(`${colors.red}🔴 ERRORES CRÍTICOS (${errors.length}):${colors.reset}`);
      errors.forEach((e) => {
        console.log(`  Línea ${e.line}: ${e.description}`);
        console.log(`  📌 FIX: ${e.fix}`);
      });
    }

    if (warnings.length > 0) {
      console.log(`\n${colors.yellow}⚠️  ADVERTENCIAS (${warnings.length}):${colors.reset}`);
      warnings.forEach((w) => {
        console.log(`  Línea ${w.line}: ${w.description}`);
        console.log(`  📌 FIX: ${w.fix}`);
      });
    }

    return false;
  } else {
    console.log(`${colors.green}✅ SIN PROBLEMAS DETECTADOS${colors.reset}`);
    return true;
  }
}

function printChecklist() {
  console.log(
    `\n${colors.magenta}═══════════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.magenta}✅ CHECKLIST ANTES DE GENERAR CÓDIGO${colors.reset}`);
  console.log(
    `${colors.magenta}═══════════════════════════════════════════${colors.reset}\n`
  );

  const checklist = [
    "[ ] ¿Leí CONTRATO_ROBLOX.md?",
    "[ ] ¿Leí ROBLOX_DOCUMENTATION.md?",
    "[ ] ¿Leí ROBLOX_VALIDATION.md?",
    "[ ] ¿Leí ROBLOX_API_REAL.md?",
    "[ ] ¿Identifiqué TODAS las variables?",
    "[ ] ¿Validé TODAS antes de usar?",
    "[ ] ¿Mapeé el flujo de ejecución?",
    "[ ] ¿Seguí el orden: Vars → Funciones → Handlers → Init?",
    "[ ] ¿SIN forward references?",
    "[ ] ¿SIN acceso a nil sin validación?",
  ];

  checklist.forEach((item) => {
    console.log(`${colors.cyan}${item}${colors.reset}`);
  });

  console.log();
}

function main() {
  checkPrerequisites();

  console.log(`${colors.cyan}📖 LECTURA DE DOCUMENTACIÓN OBLIGATORIA:${colors.reset}\n`);
  console.log(`${colors.yellow}1. Lee: CONTRATO_ROBLOX.md${colors.reset}`);
  console.log(`${colors.yellow}2. Lee: ROBLOX_DOCUMENTATION.md${colors.reset}`);
  console.log(`${colors.yellow}3. Lee: ROBLOX_VALIDATION.md${colors.reset}`);
  console.log(`${colors.yellow}4. Lee: .amp/ROBLOX_API_REAL.md${colors.reset}`);
  console.log(`${colors.yellow}5. Lee: .amp/ESTRATEGIA_GENERACION.md${colors.reset}\n`);

  printChecklist();

  console.log(
    `${colors.green}✅ SISTEMA DE VALIDACIÓN LISTO${colors.reset}`
  );
  console.log(`${colors.green}Cuando generes código, ejecuta:${colors.reset}`);
  console.log(`  ${colors.cyan}npm run validate:lua ./tu_script.lua${colors.reset}`);
  console.log(`  ${colors.cyan}npm run validate:api ./tu_script.lua${colors.reset}\n`);
}

main();
