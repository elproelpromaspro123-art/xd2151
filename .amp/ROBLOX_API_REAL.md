# Roblox API Real - Propiedades/Métodos Válidos (2025)

## ⚠️ IMPORTANTE
**ESTE DOCUMENTO LISTA SOLO PROPIEDADES Y MÉTODOS QUE EXISTEN REALMENTE EN ROBLOX 2025.**

Si usas una propiedad/método que NO está aquí, **CÓDIGO SERÁ RECHAZADO**.

---

## UIStroke - Propiedades Válidas

```lua
UIStroke.Color = Color3.new(1, 0, 0)          -- ✅ VÁLIDO
UIStroke.Thickness = 2                         -- ✅ VÁLIDO
UIStroke.Transparency = 0                      -- ✅ VÁLIDO
UIStroke.Enabled = true                        -- ✅ VÁLIDO
UIStroke.LineJoinMode = Enum.LineJoinMode.Miter -- ✅ VÁLIDO (2025)
UIStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Contextual -- ✅ VÁLIDO (2025)

-- ❌ INVÁLIDO (NO EXISTEN):
UIStroke.ApplyToBorder                         -- ❌ NO EXISTE
UIStroke.StrokeType                            -- ❌ NO EXISTE
UIStroke.CornerRadius                          -- ❌ NO EXISTE (está en UICorner)
```

---

## UICorner - Propiedades Válidas

```lua
UICorner.CornerRadius = UDim.new(0, 8)         -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
UICorner.BorderRadius                          -- ❌ NO EXISTE
UICorner.RoundCorners                          -- ❌ NO EXISTE
```

---

## GuiObject - Propiedades Válidas

### Posición y Tamaño
```lua
obj.Position = UDim2.new(0, 0, 0, 0)          -- ✅ VÁLIDO
obj.Size = UDim2.new(1, 0, 1, 0)              -- ✅ VÁLIDO
obj.AnchorPoint = Vector2.new(0.5, 0.5)       -- ✅ VÁLIDO
obj.Rotation = 45                              -- ✅ VÁLIDO
```

### Visibilidad
```lua
obj.Visible = true                             -- ✅ VÁLIDO
obj.Active = true                              -- ✅ VÁLIDO
obj.BackgroundTransparency = 0.5               -- ✅ VÁLIDO
obj.BackgroundColor3 = Color3.new(1, 1, 1)    -- ✅ VÁLIDO
```

### Border
```lua
obj.BorderSizePixel = 1                        -- ✅ VÁLIDO
obj.BorderColor3 = Color3.new(0, 0, 0)        -- ✅ VÁLIDO
obj.BorderMode = Enum.BorderMode.Outline      -- ✅ VÁLIDO
```

### Layout
```lua
obj.ZIndex = 1                                 -- ✅ VÁLIDO
obj.LayoutOrder = 0                            -- ✅ VÁLIDO
obj.ClipsDescendants = true                    -- ✅ VÁLIDO
obj.AutomaticSize = Enum.AutomaticSize.None   -- ✅ VÁLIDO
obj.Selectable = true                          -- ✅ VÁLIDO
```

---

## TextButton / TextLabel - Propiedades Válidas

### Texto
```lua
obj.Text = "Hello"                             -- ✅ VÁLIDO
obj.TextColor3 = Color3.new(1, 1, 1)          -- ✅ VÁLIDO
obj.TextSize = 14                              -- ✅ VÁLIDO
obj.Font = Enum.Font.GothamBold               -- ✅ VÁLIDO
obj.TextTransparency = 0                       -- ✅ VÁLIDO
obj.TextScaled = false                         -- ✅ VÁLIDO
obj.TextWrapped = true                         -- ✅ VÁLIDO
obj.TextXAlignment = Enum.TextXAlignment.Center -- ✅ VÁLIDO
obj.TextYAlignment = Enum.TextYAlignment.Center -- ✅ VÁLIDO
obj.RichText = true                            -- ✅ VÁLIDO
obj.TextTruncate = Enum.TextTruncate.AtEnd    -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
obj.FontSize                                   -- ❌ NO EXISTE (usa TextSize)
obj.TextFormat                                 -- ❌ NO EXISTE
obj.FontColor                                  -- ❌ NO EXISTE (usa TextColor3)
```

---

## ImageLabel / ImageButton - Propiedades Válidas

```lua
obj.Image = "rbxassetid://123456"              -- ✅ VÁLIDO
obj.ImageColor3 = Color3.new(1, 1, 1)         -- ✅ VÁLIDO
obj.ImageTransparency = 0                      -- ✅ VÁLIDO
obj.ScaleType = Enum.ScaleType.Stretch         -- ✅ VÁLIDO
obj.ImageRectOffset = Vector2.new(0, 0)       -- ✅ VÁLIDO
obj.ImageRectSize = Vector2.new(256, 256)     -- ✅ VÁLIDO
obj.SliceCenter = Rect.new(10, 10, 10, 10)    -- ✅ VÁLIDO
obj.SliceScale = 1                             -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
obj.ImageMode                                  -- ❌ NO EXISTE
obj.TintColor                                  -- ❌ NO EXISTE (usa ImageColor3)
```

---

## ScrollingFrame - Propiedades Válidas

```lua
obj.ScrollingDirection = Enum.ScrollingDirection.Y -- ✅ VÁLIDO
obj.ScrollBarThickness = 12                    -- ✅ VÁLIDO
obj.ScrollBarImageColor3 = Color3.new(0, 0, 0) -- ✅ VÁLIDO
obj.ScrollBarImageTransparency = 0             -- ✅ VÁLIDO
obj.CanvasSize = UDim2.new(0, 1000, 0, 1000) -- ✅ VÁLIDO
obj.CanvasPosition = Vector2.new(0, 0)        -- ✅ VÁLIDO
obj.AutomaticCanvasSize = Enum.AutomaticSize.Y -- ✅ VÁLIDO
obj.BottomImage = ""                           -- ✅ VÁLIDO
obj.TopImage = ""                              -- ✅ VÁLIDO
obj.MidImage = ""                              -- ✅ VÁLIDO
```

---

## GuiObject - Métodos Válidos

```lua
obj:TweenPosition(UDim2.new(0, 100, 0, 100), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.5, true) -- ✅
obj:TweenSize(UDim2.new(0, 200, 0, 200), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.5, true) -- ✅
obj:TweenSizeAndPosition(size, pos, dir, style, time, override, callback) -- ✅
obj:GetFullName()                              -- ✅ VÁLIDO
obj:IsAncestorOf(descendant)                   -- ✅ VÁLIDO
obj:GetPropertyChangedSignal("Name"):Connect(function() end) -- ✅

-- ❌ INVÁLIDO (NO EXISTEN):
obj:Tween()                                    -- ❌ NO EXISTE
obj:MoveTo()                                   -- ❌ NO EXISTE
obj:ResizeTo()                                 -- ❌ NO EXISTE
```

---

## Instance - Métodos Válidos

```lua
instance:Clone()                               -- ✅ VÁLIDO
instance:Destroy()                             -- ✅ VÁLIDO
instance:ClearAllChildren()                    -- ✅ VÁLIDO
instance:FindFirstChild(name, recursive)       -- ✅ VÁLIDO
instance:FindFirstAncestor(name)               -- ✅ VÁLIDO
instance:WaitForChild(name, timeout)           -- ✅ VÁLIDO
instance:GetChildren()                         -- ✅ VÁLIDO
instance:GetDescendants()                      -- ✅ VÁLIDO
instance:IsDescendantOf(ancestor)              -- ✅ VÁLIDO
instance:IsAncestorOf(descendant)              -- ✅ VÁLIDO
instance:GetAttribute(name)                    -- ✅ VÁLIDO
instance:SetAttribute(name, value)             -- ✅ VÁLIDO
instance:GetAttributes()                       -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
instance:Find()                                -- ❌ NO EXISTE
instance:GetChild()                            -- ❌ NO EXISTE
instance:SearchFor()                           -- ❌ NO EXISTE
```

---

## TextBox - Propiedades Válidas

```lua
obj.Text = ""                                  -- ✅ VÁLIDO
obj.TextColor3 = Color3.new(0, 0, 0)          -- ✅ VÁLIDO
obj.TextSize = 14                              -- ✅ VÁLIDO
obj.Font = Enum.Font.GothamBold               -- ✅ VÁLIDO
obj.TextTransparency = 0                       -- ✅ VÁLIDO
obj.PlaceholderText = "Escribe aquí"           -- ✅ VÁLIDO
obj.PlaceholderColor3 = Color3.new(0.5, 0.5, 0.5) -- ✅ VÁLIDO
obj.ClearTextOnFocus = true                    -- ✅ VÁLIDO
obj.MultiLine = true                           -- ✅ VÁLIDO
obj.TextWrapped = true                         -- ✅ VÁLIDO
obj.TextXAlignment = Enum.TextXAlignment.Left  -- ✅ VÁLIDO
obj.TextYAlignment = Enum.TextYAlignment.Top   -- ✅ VÁLIDO
obj.TextEditable = true                        -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
obj.MaxLength                                  -- ❌ NO EXISTE
obj.InputType                                  -- ❌ NO EXISTE
```

---

## Eventos Válidos

### GuiObject Events
```lua
obj.MouseEnter:Connect(function() end)         -- ✅ VÁLIDO
obj.MouseLeave:Connect(function() end)         -- ✅ VÁLIDO
obj.MouseMoved:Connect(function(x, y) end)    -- ✅ VÁLIDO
obj.MouseButton1Down:Connect(function() end)   -- ✅ VÁLIDO
obj.MouseButton1Up:Connect(function() end)     -- ✅ VÁLIDO
obj.MouseButton1Click:Connect(function() end)  -- ✅ VÁLIDO
obj.MouseButton2Click:Connect(function() end)  -- ✅ VÁLIDO
obj.InputBegan:Connect(function(input, gp) end) -- ✅ VÁLIDO
obj.InputChanged:Connect(function(input, gp) end) -- ✅ VÁLIDO
obj.InputEnded:Connect(function(input, gp) end) -- ✅ VÁLIDO
obj.TouchTap:Connect(function(pos, gp) end)   -- ✅ VÁLIDO
obj.TouchLongPress:Connect(function(pos, state, gp) end) -- ✅ VÁLIDO
obj.TouchPan:Connect(function(pos, delta, vel, state, gp) end) -- ✅ VÁLIDO
obj.TouchPinch:Connect(function(pos, scale, vel, state, gp) end) -- ✅ VÁLIDO
obj.TouchRotate:Connect(function(pos, rot, vel, state, gp) end) -- ✅ VÁLIDO
obj.TouchSwipe:Connect(function(dir, count, gp) end) -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
obj.OnClick                                    -- ❌ NO EXISTE (usa Activated o MouseButton1Click)
obj.OnHover                                    -- ❌ NO EXISTE (usa MouseEnter)
obj.OnLeave                                    -- ❌ NO EXISTE (usa MouseLeave)
```

### TextButton Events
```lua
obj.Activated:Connect(function(inputObject, clickCount) end) -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
obj.OnActivated                                -- ❌ NO EXISTE
obj.Clicked                                    -- ❌ NO EXISTE
```

### TextBox Events
```lua
obj.FocusLost:Connect(function(enterPressed) end) -- ✅ VÁLIDO
obj.Focused:Connect(function() end)            -- ✅ VÁLIDO

-- ❌ INVÁLIDO (NO EXISTEN):
obj.OnFocusLost                                -- ❌ NO EXISTE
obj.InputLost                                  -- ❌ NO EXISTE
```

---

## Enumeraciones Válidas

```lua
Enum.Font.GothamBold                           -- ✅ VÁLIDO
Enum.Font.SourceSans                           -- ✅ VÁLIDO
Enum.Font.SourceSansBold                       -- ✅ VÁLIDO
Enum.Font.Gotham                               -- ✅ VÁLIDO
Enum.Font.GothamMedium                         -- ✅ VÁLIDO
Enum.Font.GothamBlack                          -- ✅ VÁLIDO

Enum.TextXAlignment.Left                       -- ✅ VÁLIDO
Enum.TextXAlignment.Center                     -- ✅ VÁLIDO
Enum.TextXAlignment.Right                      -- ✅ VÁLIDO

Enum.TextYAlignment.Top                        -- ✅ VÁLIDO
Enum.TextYAlignment.Center                     -- ✅ VÁLIDO
Enum.TextYAlignment.Bottom                     -- ✅ VÁLIDO

Enum.EasingStyle.Quad                          -- ✅ VÁLIDO
Enum.EasingStyle.Linear                        -- ✅ VÁLIDO
Enum.EasingStyle.Back                          -- ✅ VÁLIDO

Enum.EasingDirection.In                        -- ✅ VÁLIDO
Enum.EasingDirection.Out                       -- ✅ VÁLIDO
Enum.EasingDirection.InOut                     -- ✅ VÁLIDO

Enum.ScaleType.Stretch                         -- ✅ VÁLIDO
Enum.ScaleType.Slice                           -- ✅ VÁLIDO
Enum.ScaleType.Crop                            -- ✅ VÁLIDO
Enum.ScaleType.Tile                            -- ✅ VÁLIDO
Enum.ScaleType.Fit                             -- ✅ VÁLIDO

Enum.BorderMode.Outline                        -- ✅ VÁLIDO
Enum.BorderMode.Middle                         -- ✅ VÁLIDO
Enum.BorderMode.Inset                          -- ✅ VÁLIDO

Enum.AutomaticSize.None                        -- ✅ VÁLIDO
Enum.AutomaticSize.X                           -- ✅ VÁLIDO
Enum.AutomaticSize.Y                           -- ✅ VÁLIDO
Enum.AutomaticSize.XY                          -- ✅ VÁLIDO

Enum.ScrollingDirection.X                      -- ✅ VÁLIDO
Enum.ScrollingDirection.Y                      -- ✅ VÁLIDO
Enum.ScrollingDirection.XY                     -- ✅ VÁLIDO
```

---

## Servicios Válidos

```lua
game:GetService("Players")                     -- ✅ VÁLIDO
game:GetService("UserInputService")            -- ✅ VÁLIDO
game:GetService("GuiService")                  -- ✅ VÁLIDO
game:GetService("TweenService")                -- ✅ VÁLIDO
game:GetService("RunService")                  -- ✅ VÁLIDO
game:GetService("Debris")                      -- ✅ VÁLIDO
game:GetService("HttpService")                 -- ✅ VÁLIDO
game:GetService("MarketplaceService")          -- ✅ VÁLIDO
```

---

## ⚠️ ERRORES COMUNES DETECTADOS

| Error | Causa | Solución |
|-------|-------|----------|
| `ApplyToBorder is not valid` | NO existe en UIStroke | Usa `Color`, `Thickness`, `Transparency` |
| `FontSize is not valid` | NO existe en TextButton | Usa `TextSize` |
| `OnClick is not valid` | NO existe evento | Usa `Activated` o `MouseButton1Click` |
| `Tween() is not valid` | NO existe método | Usa `TweenPosition()`, `TweenSize()`, etc. |

---

## REGLA DE ORO

**Si una propiedad/método/evento NO está en este documento = NO EXISTE en Roblox.**

**Si lo usas = Código RECHAZADO.**

---

**Fecha**: 5/12/2025  
**Versión**: 1.0  
**Fuente**: Roblox Official API Documentation
