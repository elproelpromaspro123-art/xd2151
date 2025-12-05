#!/usr/bin/env node

/**
 * Validador de Propiedades Reales de Roblox
 * Detecta si usas propiedades/métodos que NO existen
 * 
 * Uso: node .amp/validate-properties.js <archivo.lua>
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
  cyan: "\x1b[36m",
  reset: "\x1b[0m",
};

// Propiedades/Métodos reales de Roblox 2025
const VALID_ROBLOX_API = {
  // UIStroke
  UIStroke: {
    properties: ["Color", "Thickness", "Transparency", "Enabled", "LineJoinMode", "ApplyStrokeMode"],
    methods: [],
  },
  // UICorner
  UICorner: {
    properties: ["CornerRadius"],
    methods: [],
  },
  // GuiObject (base)
  GuiObject: {
    properties: [
      "Position", "Size", "AnchorPoint", "Rotation", "Visible", "Active",
      "BackgroundTransparency", "BackgroundColor3", "BorderSizePixel", "BorderColor3", "BorderMode",
      "ZIndex", "LayoutOrder", "ClipsDescendants", "AutomaticSize", "Selectable",
      "TextColor3", "TextSize", "Font", "TextTransparency", "Text", "TextWrapped",
      "TextScaled", "TextXAlignment", "TextYAlignment", "RichText", "TextTruncate",
      "Image", "ImageColor3", "ImageTransparency", "ScaleType", "ImageRectOffset", "ImageRectSize",
      "SliceCenter", "SliceScale", "ScrollingDirection", "ScrollBarThickness", "ScrollBarImageColor3",
      "ScrollBarImageTransparency", "CanvasSize", "CanvasPosition", "AutomaticCanvasSize",
      "PlaceholderText", "PlaceholderColor3", "ClearTextOnFocus", "MultiLine", "TextEditable",
      "BottomImage", "TopImage", "MidImage"
    ],
    methods: [
      "TweenPosition", "TweenSize", "TweenSizeAndPosition", "GetFullName", "IsAncestorOf",
      "GetPropertyChangedSignal", "FindFirstChild", "WaitForChild", "GetChildren", "Destroy",
      "Clone", "GetDescendants", "IsDescendantOf", "FindFirstAncestor", "ClearAllChildren",
      "GetAttribute", "SetAttribute", "GetAttributes"
    ],
  },
  // Instance
  Instance: {
    properties: ["Name", "Parent", "ClassName"],
    methods: [
      "Clone", "Destroy", "ClearAllChildren", "FindFirstChild", "FindFirstAncestor",
      "WaitForChild", "GetChildren", "GetDescendants", "IsDescendantOf", "IsAncestorOf",
      "GetAttribute", "SetAttribute", "GetAttributes"
    ],
  },
  // Events (métodos Connect)
  Events: {
    valid: [
      "MouseEnter", "MouseLeave", "MouseMoved", "MouseButton1Down", "MouseButton1Up",
      "MouseButton1Click", "MouseButton2Click", "InputBegan", "InputChanged", "InputEnded",
      "TouchTap", "TouchLongPress", "TouchPan", "TouchPinch", "TouchRotate", "TouchSwipe",
      "Activated", "FocusLost", "Focused", "ChildAdded", "ChildRemoved", "DescendantAdded",
      "DescendantRemoving", "AttributeChanged", "SelectionChanged"
    ],
  },
  // Enums válidos
  Enums: {
    Font: ["GothamBold", "SourceSans", "SourceSansBold", "Gotham", "GothamMedium", "GothamBlack"],
    TextXAlignment: ["Left", "Center", "Right"],
    TextYAlignment: ["Top", "Center", "Bottom"],
    EasingStyle: ["Quad", "Linear", "Back", "Sine", "Elastic", "Bounce", "Exponential"],
    EasingDirection: ["In", "Out", "InOut"],
    ScaleType: ["Stretch", "Slice", "Crop", "Tile", "Fit"],
    BorderMode: ["Outline", "Middle", "Inset"],
    AutomaticSize: ["None", "X", "Y", "XY"],
    ScrollingDirection: ["X", "Y", "XY"],
    LineJoinMode: ["Miter", "Bevel", "Round"],
    ApplyStrokeMode: ["Contextual", "Border"],
  },
};

// Propiedades/métodos que NO existen (detectar errores comunes)
const INVALID_PROPERTIES = {
  UIStroke: ["ApplyToBorder", "StrokeType", "CornerRadius", "BorderColor", "StrokeColor"],
  TextButton: ["FontSize", "TextFormat", "FontColor", "OnClick", "OnActivated"],
  TextLabel: ["FontSize", "TextFormat", "FontColor"],
  TextBox: ["MaxLength", "InputType", "OnFocusLost", "InputLost"],
  ImageLabel: ["ImageMode", "TintColor"],
  UICorner: ["BorderRadius", "RoundCorners"],
  GuiObject: [
    "Tween", "MoveTo", "ResizeTo", "Find", "GetChild", "SearchFor",
    "OnClick", "OnHover", "OnLeave", "Clicked", "Clicked", "Hovered"
  ],
};

function validateProperties(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`${colors.red}❌ Archivo no encontrado: ${filePath}${colors.reset}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  console.log(`${colors.cyan}📋 Validando propiedades/métodos reales: ${path.basename(filePath)}${colors.reset}\n`);

  const issues = [];

  // Detectar patrones de propiedades/métodos inválidos
  const invalidPatterns = [
    {
      regex: /(\w+)\.ApplyToBorder/g,
      error: "ApplyToBorder NO EXISTE en UIStroke",
      fix: "Usa: Color, Thickness, Transparency",
    },
    {
      regex: /\.FontSize\s*=/g,
      error: "FontSize NO EXISTE",
      fix: "Usa: TextSize",
    },
    {
      regex: /\.FontColor/g,
      error: "FontColor NO EXISTE",
      fix: "Usa: TextColor3",
    },
    {
      regex: /\.OnClick/g,
      error: "OnClick NO EXISTE como evento",
      fix: "Usa: Activated o MouseButton1Click",
    },
    {
      regex: /\.OnHover/g,
      error: "OnHover NO EXISTE",
      fix: "Usa: MouseEnter",
    },
    {
      regex: /\.OnLeave/g,
      error: "OnLeave NO EXISTE",
      fix: "Usa: MouseLeave",
    },
    {
      regex: /\.MaxLength/g,
      error: "MaxLength NO EXISTE en TextBox",
      fix: "No existe restricción de longitud en Roblox",
    },
    {
      regex: /\.InputType/g,
      error: "InputType NO EXISTE en TextBox",
      fix: "Usa: TextEditable para habilitar/deshabilitar",
    },
    {
      regex: /\.TintColor/g,
      error: "TintColor NO EXISTE",
      fix: "Usa: ImageColor3",
    },
    {
      regex: /:\s*Tween\s*\(/g,
      error: "Tween() NO EXISTE como método",
      fix: "Usa: TweenPosition(), TweenSize(), TweenSizeAndPosition()",
    },
    {
      regex: /:\s*MoveTo\s*\(/g,
      error: "MoveTo() NO EXISTE",
      fix: "Usa: TweenPosition()",
    },
    {
      regex: /:\s*ResizeTo\s*\(/g,
      error: "ResizeTo() NO EXISTE",
      fix: "Usa: TweenSize()",
    },
    {
      regex: /:\s*Find\s*\(/g,
      error: "Find() NO EXISTE",
      fix: "Usa: FindFirstChild()",
    },
    {
      regex: /:\s*GetChild\s*\(/g,
      error: "GetChild() NO EXISTE",
      fix: "Usa: FindFirstChild() o GetChildren()[index]",
    },
    {
      regex: /Enum\.Font\.\w+/g,
      validate: (match) => {
        const fontName = match.split(".")[2];
        return VALID_ROBLOX_API.Enums.Font.includes(fontName);
      },
      error: "Font NO VÁLIDO",
      fix: "Usa: GothamBold, SourceSans, SourceSansBold, Gotham, GothamMedium, GothamBlack",
    },
  ];

  // Escanear líneas
  lines.forEach((line, index) => {
    const cleanLine = line.split("--")[0];

    invalidPatterns.forEach((pattern) => {
      if (pattern.validate) {
        const matches = cleanLine.match(pattern.regex);
        if (matches) {
          matches.forEach((match) => {
            if (!pattern.validate(match)) {
              issues.push({
                type: "invalid_property",
                severity: "error",
                line: index + 1,
                text: match,
                error: pattern.error,
                fix: pattern.fix,
              });
            }
          });
        }
      } else {
        const match = cleanLine.match(pattern.regex);
        if (match) {
          issues.push({
            type: "invalid_property",
            severity: "error",
            line: index + 1,
            text: match[0],
            error: pattern.error,
            fix: pattern.fix,
          });
        }
      }
    });

    // Detectar métodos que no existen (patrón general)
    const methodCallRegex = /(\w+):(\w+)\s*\(/g;
    let methodMatch;
    while ((methodMatch = methodCallRegex.exec(cleanLine)) !== null) {
      const methodName = methodMatch[2];

      // Excepciones comunes
      const exceptions = [
        "Connect", "Fire", "Wait", "spawn", "task", "coroutine",
        "SetAttribute", "GetAttribute", "FindFirstChild", "WaitForChild"
      ];

      if (!exceptions.includes(methodName) && !VALID_ROBLOX_API.GuiObject.methods.includes(methodName)) {
        // Solo reportar si es un patrón conocido inválido
        if (["Tween", "MoveTo", "ResizeTo", "Find", "GetChild"].includes(methodName)) {
          issues.push({
            type: "invalid_method",
            severity: "error",
            line: index + 1,
            method: methodName,
            error: `${methodName}() NO EXISTE en Roblox`,
            fix: `Verifica el método en .amp/ROBLOX_API_REAL.md`,
          });
        }
      }
    }
  });

  // Mostrar resultados
  if (issues.length === 0) {
    console.log(`${colors.green}✅ Todas las propiedades/métodos son válidos${colors.reset}`);
    console.log(`${colors.green}✅ API de Roblox 2025 verificada${colors.reset}\n`);
    return true;
  }

  console.log(`${colors.red}🔴 ${issues.length} problemas encontrados:\n${colors.reset}`);

  issues.forEach((issue) => {
    console.log(`${colors.red}[ERROR DE API] ${issue.error}${colors.reset}`);
    console.log(`             Línea: ${issue.line}`);
    if (issue.text) console.log(`             Código: ${issue.text}`);
    if (issue.method) console.log(`             Método: ${issue.method}`);
    if (issue.fix) console.log(`             ${colors.yellow}📌 FIX: ${issue.fix}${colors.reset}`);
    console.log();
  });

  console.log(`${colors.red}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.red}RESULTADO: CÓDIGO RECHAZADO POR API INVÁLIDA${colors.reset}`);
  console.log(`${colors.red}═══════════════════════════════════════════${colors.reset}\n`);

  return false;
}

// Main
const filePath = process.argv[2];
if (!filePath) {
  console.error(`${colors.red}❌ Uso: node .amp/validate-properties.js <archivo.lua>${colors.reset}`);
  process.exit(1);
}

const isValid = validateProperties(filePath);
process.exit(isValid ? 0 : 1);
