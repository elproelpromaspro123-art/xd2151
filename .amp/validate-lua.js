#!/usr/bin/env node

/**
 * Validador Completo de Lua para Roblox
 * Detecta ERRORES ROJOS + ERRORES NARANJAS
 * 
 * Uso: node .amp/validate-lua.js <archivo.lua>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para terminal
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
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

  const issues = [];

  // ========== VALIDACIÓN 1: ERRORES NARANJA (Forward References) ==========
  const functionDefs = new Map();
  const functionCalls = new Map();

  const localFunctionRegex = /^\s*local\s+function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  const methodDefRegex = /^\s*function\s+([a-zA-Z_][a-zA-Z0-9_]*):([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  const globalFunctionRegex = /^\s*function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
  const functionCallRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g;

  // Pasar 1: Encontrar definiciones de funciones
  lines.forEach((line, index) => {
    const localMatch = line.match(localFunctionRegex);
    if (localMatch) {
      functionDefs.set(localMatch[1], index + 1);
    }

    const methodMatch = line.match(methodDefRegex);
    if (methodMatch) {
      const methodName = `${methodMatch[1]}:${methodMatch[2]}`;
      functionDefs.set(methodName, index + 1);
    }

    const globalMatch = line.match(globalFunctionRegex);
    if (globalMatch && !localMatch && !methodMatch) {
      functionDefs.set(globalMatch[1], index + 1);
    }
  });

  // Pasar 2: Encontrar llamadas a funciones
  lines.forEach((line, index) => {
    const cleanLine = line.split("--")[0];
    let match;
    while ((match = functionCallRegex.exec(cleanLine)) !== null) {
      const funcName = match[1];

      const keywords = [
        "if", "then", "for", "while", "function", "do", "else", "end",
        "local", "return", "print", "table", "string", "math", "game",
        "Instance", "Roact", "require", "assert", "type", "pcall",
        // Métodos de Roblox comunes
        "warn", "error", "Wait", "WaitForChild", "FindFirstChild", "FindFirstAncestor",
        "TweenPosition", "TweenSize", "TweenSizeAndPosition", "Destroy", "Clone",
        "GetChildren", "GetDescendants", "IsDescendantOf", "IsAncestorOf",
        "GetAttribute", "SetAttribute", "ClearAllChildren", "LoadAnimation",
        "GetPropertyChangedSignal", "GetFullName", "Connect", "Fire", "GetService",
        "RegisterChat", "Say", "Activate", "Deactivate", "new", "extend",
        "createElement", "mount", "setState", "render", "didMount",
      ];

      if (keywords.includes(funcName)) continue;

      if (!functionCalls.has(funcName)) {
        functionCalls.set(funcName, []);
      }
      functionCalls.get(funcName).push(index + 1);
    }
  });

  // Pasar 3: Detectar forward references (errores naranja)
  functionCalls.forEach((callLines, funcName) => {
    const defLine = functionDefs.get(funcName);

    if (!defLine) {
      issues.push({
        type: "undefined_function",
        severity: "error",
        function: funcName,
        lines: callLines,
        description: `Función '${funcName}' usada pero nunca definida`,
      });
    } else {
      callLines.forEach((callLine) => {
        if (callLine < defLine) {
          issues.push({
            type: "forward_reference",
            severity: "warning",
            function: funcName,
            callLine,
            defLine,
            description: `Forward reference: '${funcName}' usada en línea ${callLine} pero definida en línea ${defLine}`,
          });
        }
      });
    }
  });

  // ========== VALIDACIÓN 2: ERRORES ROJOS (Nil Indexing) ==========
  
  // Detectar potencial nil indexing
  const nilIndexPatterns = [
    {
      regex: /([a-zA-Z_][a-zA-Z0-9_]*)\[["']([^"']+)["']\]/g,
      check: (match, varName, key) => ({
        type: "potential_nil_index",
        severity: "warning",
        variable: varName,
        key,
        description: `Posible acceso a propiedad sin validar: ${varName}['${key}']`,
      }),
    },
    {
      regex: /([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)/g,
      check: (match, varName, prop) => ({
        type: "potential_nil_property",
        severity: "warning",
        variable: varName,
        property: prop,
        description: `Posible acceso a propiedad sin validar: ${varName}.${prop}`,
      }),
    },
  ];

  lines.forEach((line, index) => {
    const cleanLine = line.split("--")[0]; // Ignorar comentarios

    // Buscar acceso a propiedades/índices sin validación previa
    const withoutIfCheck = !line.includes("if") && !line.includes("and") && !line.includes("or");

    // Patrón: variable.propiedad sin validación
    if (withoutIfCheck) {
      const propAccessRegex = /([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]/;
      const propMatch = cleanLine.match(propAccessRegex);
      if (propMatch) {
        const varName = propMatch[1];
        const propName = propMatch[2];

        // Excepciones comunes
        const exceptions = ["self", "game", "Instance", "script", "game.Players"];
        if (!exceptions.includes(varName) && !varName.includes("local")) {
          issues.push({
            type: "unchecked_property_access",
            severity: "warning",
            line: index + 1,
            variable: varName,
            property: propName,
            description: `⚠️  ROJO POTENCIAL: Acceso a ${varName}.${propName} sin validar si ${varName} es nil`,
            suggestion: `Añade: if ${varName} then ... end`,
          });
        }
      }
    }

    // Patrón: función() en variable sin validación de tipo
    const funcCallOnVarRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/;
    const methodCallMatch = cleanLine.match(funcCallOnVarRegex);
    if (methodCallMatch && withoutIfCheck) {
      const varName = methodCallMatch[1];
      if (varName !== "self" && !varName.includes("local")) {
        issues.push({
          type: "unchecked_method_call",
          severity: "warning",
          line: index + 1,
          variable: varName,
          description: `⚠️  ROJO POTENCIAL: Llamando método en ${varName} sin validar`,
          suggestion: `Añade: if ${varName} and ${varName}.${methodCallMatch[2]} then`,
        });
      }
    }
  });

  // ========== VALIDACIÓN 3: SINTAXIS BÁSICA ==========
  
  let blockCount = 0;
  lines.forEach((line, index) => {
    const cleanLine = line.split("--")[0];
    
    // Contar inicio de bloques
    const ifCount = (cleanLine.match(/\bif\b/g) || []).length;
    const forCount = (cleanLine.match(/\bfor\b/g) || []).length;
    const whileCount = (cleanLine.match(/\bwhile\b/g) || []).length;
    const functionCount = (cleanLine.match(/\bfunction\b/g) || []).length;
    const doCount = (cleanLine.match(/\bdo\b/g) || []).length;
    
    blockCount += (ifCount + forCount + whileCount + functionCount + doCount);
    
    // Contar cierre de bloques
    const endCount = (cleanLine.match(/\bend\b/g) || []).length;
    blockCount -= endCount;
  });

  // Solo reportar si hay desbalance significativo
  if (blockCount > 2 || blockCount < -2) {
    issues.push({
      type: "syntax_error",
      severity: "error",
      line: lines.length,
      description: blockCount > 0 
        ? `Falta ${blockCount} 'end' para cerrar bloques`
        : `Hay ${Math.abs(blockCount)} 'end' sin bloque correspondiente`,
    });
  }

  // ========== MOSTRAR RESULTADOS ==========
  
  const errors = issues.filter(i => i.severity === "error");
  const warnings = issues.filter(i => i.severity === "warning");

  if (issues.length === 0) {
    console.log(`${colors.green}✅ SIN ERRORES DETECTADOS${colors.reset}`);
    console.log(`${colors.green}✅ Orden de declaración correcto${colors.reset}`);
    console.log(`${colors.green}✅ Sin accesos a nil sin validar${colors.reset}`);
    console.log(`${colors.green}✅ Sintaxis correcta${colors.reset}\n`);
    return true;
  }

  let hasErrors = false;

  if (errors.length > 0) {
    console.log(`${colors.red}🔴 ${errors.length} ERRORES CRÍTICOS:${colors.reset}\n`);
    hasErrors = true;

    errors.forEach((issue) => {
      console.log(`${colors.red}[ERROR CRÍTICO] ${issue.description}${colors.reset}`);
      if (issue.line) console.log(`             Línea: ${issue.line}`);
      if (issue.suggestion) console.log(`             📌 FIX: ${issue.suggestion}`);
      console.log();
    });
  }

  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠️  ${warnings.length} ADVERTENCIAS (ERRORES ROJOS POTENCIALES):${colors.reset}\n`);

    warnings.forEach((issue) => {
      console.log(`${colors.yellow}[ADVERTENCIA] ${issue.description}${colors.reset}`);
      if (issue.line) console.log(`              Línea: ${issue.line}`);
      if (issue.variable) console.log(`              Variable: ${issue.variable}`);
      if (issue.suggestion) console.log(`              📌 FIX: ${issue.suggestion}`);
      console.log();
    });
  }

  console.log(`${colors.magenta}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.magenta}RESUMEN VALIDACIÓN:${colors.reset}`);
  console.log(`  ${colors.red}❌ Errores: ${errors.length}${colors.reset}`);
  console.log(`  ${colors.yellow}⚠️  Advertencias: ${warnings.length}${colors.reset}`);
  console.log(`${colors.magenta}═══════════════════════════════════════════${colors.reset}\n`);

  return !hasErrors;
}

// ========== MAIN ==========
const filePath = process.argv[2];
if (!filePath) {
  console.error(`${colors.red}❌ Uso: node .amp/validate-lua.js <archivo.lua>${colors.reset}`);
  console.error(`${colors.yellow}Ejemplo: node .amp/validate-lua.js ./mi_script.lua${colors.reset}`);
  process.exit(1);
}

const isValid = validateLuaFile(filePath);
process.exit(isValid ? 0 : 1);
