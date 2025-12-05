#!/usr/bin/env node

/**
 * Validador de Lua para Roblox
 * Detecta errores naranja comunes
 * 
 * Uso: node .amp/validate-lua.js <archivo.lua>
 */

const fs = require("fs");
const path = require("path");

// Colores para terminal
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function validateLuaFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}❌ Archivo no encontrado: ${filePath}${colors.reset}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  console.log(
    `${colors.blue}📋 Validando: ${path.basename(filePath)}${colors.reset}\n`
  );

  const functionDefs = new Map(); // { nombre: lineNumber }
  const functionCalls = new Map(); // { nombre: [lineNumbers] }
  const issues = [];

  // Regex para detectar definiciones y llamadas
  const localFunctionRegex = /^\s*local\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  const methodDefRegex = /^\s*function\s+([a-zA-Z_][a-zA-Z0-9_]*):([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  const globalFunctionRegex = /^\s*function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  const functionCallRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  // Pasar 1: Encontrar todas las definiciones
  lines.forEach((line, index) => {
    // Local function
    const localMatch = line.match(localFunctionRegex);
    if (localMatch) {
      functionDefs.set(localMatch[1], index + 1);
    }

    // Method definition
    const methodMatch = line.match(methodDefRegex);
    if (methodMatch) {
      const methodName = `${methodMatch[1]}:${methodMatch[2]}`;
      functionDefs.set(methodName, index + 1);
    }

    // Global function
    const globalMatch = line.match(globalFunctionRegex);
    if (globalMatch && !localMatch && !methodMatch) {
      functionDefs.set(globalMatch[1], index + 1);
    }
  });

  // Pasar 2: Encontrar todas las llamadas
  lines.forEach((line, index) => {
    // Ignorar comentarios
    const cleanLine = line.split("--")[0];

    let match;
    while ((match = functionCallRegex.exec(cleanLine)) !== null) {
      const funcName = match[1];

      // Ignorar palabras clave
      if (
        [
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
        ].includes(funcName)
      ) {
        continue;
      }

      if (!functionCalls.has(funcName)) {
        functionCalls.set(funcName, []);
      }
      functionCalls.get(funcName).push(index + 1);
    }
  });

  // Pasar 3: Validar orden de declaración
  functionCalls.forEach((callLines, funcName) => {
    const defLine = functionDefs.get(funcName);

    if (!defLine) {
      issues.push({
        type: "undefined",
        function: funcName,
        lines: callLines,
        severity: "error",
      });
    } else {
      callLines.forEach((callLine) => {
        if (callLine < defLine) {
          issues.push({
            type: "forward_reference",
            function: funcName,
            callLine,
            defLine,
            severity: "error",
          });
        }
      });
    }
  });

  // Mostrar resultados
  if (issues.length === 0) {
    console.log(
      `${colors.green}✅ Sin errores naranja detectados${colors.reset}`
    );
    console.log(
      `${colors.green}✅ Orden de declaración correcto${colors.reset}\n`
    );
    return true;
  } else {
    console.log(`${colors.red}❌ ${issues.length} problemas encontrados:\n${colors.reset}`);

    issues.forEach((issue) => {
      if (issue.type === "undefined") {
        console.log(
          `${colors.red}[ERROR] Función no definida: ${issue.function}${colors.reset}`
        );
        console.log(`        Usada en línea(s): ${issue.lines.join(", ")}`);
        console.log(
          `        ${colors.yellow}FIX: Define 'function ${issue.function}()' antes de usarla${colors.reset}\n`
        );
      } else if (issue.type === "forward_reference") {
        console.log(
          `${colors.red}[ERROR] Forward reference: ${issue.function}${colors.reset}`
        );
        console.log(`        Usada en línea: ${issue.callLine}`);
        console.log(`        Definida en línea: ${issue.defLine}`);
        console.log(
          `        ${colors.yellow}FIX: Mueve la definición a una línea anterior a ${issue.callLine}${colors.reset}\n`
        );
      }
    });

    return false;
  }
}

// Ejecutar
const filePath = process.argv[2];
if (!filePath) {
  console.error(`${colors.red}Uso: node .amp/validate-lua.js <archivo.lua>${colors.reset}`);
  process.exit(1);
}

const isValid = validateLuaFile(filePath);
process.exit(isValid ? 0 : 1);
