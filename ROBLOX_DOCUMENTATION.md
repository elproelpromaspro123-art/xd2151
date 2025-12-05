# Roblox Studio API Documentation - Complete Reference

## Table of Contents
1. [Introduction](#introduction)
2. [Core Objects and Classes](#core-objects-and-classes)
3. [Properties Reference](#properties-reference)
4. [Methods Reference](#methods-reference)
5. [Events Reference](#events-reference)
6. [UI Framework (Roact/React-like)](#ui-framework)
7. [Best Practices](#best-practices)
8. [Common Patterns](#common-patterns)
9. [Performance Optimization](#performance-optimization)
10. [Debugging and Testing](#debugging-and-testing)

## Introduction

This comprehensive documentation covers Roblox Studio's Lua API, focusing on UI development, game mechanics, and best practices. All information is based on the latest Roblox Studio version and official documentation.

## Core Objects and Classes

### Instance Hierarchy
```
Instance (Base Class)
├── BasePart
│   ├── Part
│   ├── WedgePart
│   ├── CornerWedgePart
│   ├── TrussPart
│   ├── SpawnLocation
│   └── Seat
├── Terrain
├── Model
├── Folder
├── Tool
├── HopperBin
├── Backpack
├── Player
├── PlayerGui
├── StarterGui
├── StarterPack
├── StarterPlayer
├── Workspace
├── Lighting
├── SoundService
├── ReplicatedStorage
├── ServerStorage
├── ServerScriptService
├── ReplicatedFirst
├── StarterPlayerScripts
├── StarterCharacterScripts
└── Chat
```

### UI Objects Hierarchy
```
GuiBase (Base Class)
├── GuiObject
│   ├── Frame
│   ├── ScrollingFrame
│   ├── TextLabel
│   ├── TextButton
│   ├── TextBox
│   ├── ImageLabel
│   ├── ImageButton
│   ├── CanvasGroup
│   └── ViewportFrame
├── GuiButton
├── GuiLabel
├── ScreenGui
├── SurfaceGui
├── BillboardGui
├── AdGui
└── PluginGui
```

## Properties Reference

### GuiObject Properties
```lua
-- Position and Size
GuiObject.Position = UDim2.new(0, 0, 0, 0)  -- Relative and offset positioning
GuiObject.Size = UDim2.new(1, 0, 1, 0)      -- Relative and offset sizing
GuiObject.AnchorPoint = Vector2.new(0, 0)   -- Pivot point (0-1 range)

-- Layout
GuiObject.ZIndex = 1                        -- Stacking order
GuiObject.LayoutOrder = 0                   -- For UIListLayout ordering
GuiObject.Visible = true                    -- Visibility toggle
GuiObject.Active = true                     -- Interaction enabled

-- Appearance
GuiObject.BackgroundColor3 = Color3.new(1, 1, 1)    -- RGB color
GuiObject.BackgroundTransparency = 0       -- 0 = opaque, 1 = transparent
GuiObject.BorderSizePixel = 0              -- Border width in pixels
GuiObject.BorderColor3 = Color3.new(0, 0, 0)       -- Border color

-- Corner and Stroke
GuiObject.UICorner.CornerRadius = UDim.new(0, 8)   -- Rounded corners
GuiObject.UIStroke.Color = Color3.new(1, 1, 1)     -- Stroke color
GuiObject.UIStroke.Thickness = 2                   -- Stroke thickness
GuiObject.UIStroke.Transparency = 0                -- Stroke transparency

-- Effects
GuiObject.UIGradient.Color = ColorSequence.new(Color3.new(1,0,0), Color3.new(0,0,1))
GuiObject.UIGradient.Rotation = 45
GuiObject.UIPadding.PaddingTop = UDim.new(0, 10)
GuiObject.UIPadding.PaddingBottom = UDim.new(0, 10)
GuiObject.UIPadding.PaddingLeft = UDim.new(0, 10)
GuiObject.UIPadding.PaddingRight = UDim.new(0, 10)
```

### TextLabel/TextButton Properties
```lua
-- Text Properties
TextLabel.Text = "Hello World"
TextLabel.TextColor3 = Color3.new(0, 0, 0)
TextLabel.TextTransparency = 0
TextLabel.TextSize = 14
TextLabel.Font = Enum.Font.SourceSans        -- SourceSans, SourceSansBold, etc.
TextLabel.TextScaled = false                 -- Auto-scale text to fit
TextLabel.TextWrapped = true                 -- Wrap text to new lines
TextLabel.TextXAlignment = Enum.TextXAlignment.Left
TextLabel.TextYAlignment = Enum.TextYAlignment.Top
TextLabel.TextTruncate = Enum.TextTruncate.AtEnd

-- Rich Text (Roblox supports limited HTML-like tags)
TextLabel.RichText = true
TextLabel.Text = "<b>Bold</b> <i>Italic</i> <u>Underline</u> <font color='#FF0000'>Red</font>"
```

### ImageLabel/ImageButton Properties
```lua
ImageLabel.Image = "rbxassetid://123456789"  -- Roblox asset ID
ImageLabel.ImageColor3 = Color3.new(1, 1, 1) -- Tint color
ImageLabel.ImageTransparency = 0
ImageLabel.ImageRectOffset = Vector2.new(0, 0) -- For sprite sheets
ImageLabel.ImageRectSize = Vector2.new(100, 100)
ImageLabel.ScaleType = Enum.ScaleType.Stretch -- Stretch, Fit, Crop, Tile
ImageLabel.SliceCenter = Rect.new(10, 10, 10, 10) -- For 9-slice scaling
```

### ScrollingFrame Properties
```lua
ScrollingFrame.ScrollingDirection = Enum.ScrollingDirection.Y -- X, Y, XY
ScrollingFrame.ScrollBarThickness = 12
ScrollingFrame.ScrollBarImageColor3 = Color3.new(0.8, 0.8, 0.8)
ScrollingFrame.ScrollBarImageTransparency = 0
ScrollingFrame.CanvasSize = UDim2.new(0, 1000, 0, 1000) -- Total scrollable area
ScrollingFrame.CanvasPosition = Vector2.new(0, 0) -- Current scroll position
ScrollingFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y -- Auto-calculate canvas size
```

## Methods Reference

### Instance Methods
```lua
-- Hierarchy Management
instance:Clone()                                    -- Create a copy
instance:Destroy()                                  -- Remove from game
instance:ClearAllChildren()                         -- Remove all children
instance:FindFirstChild(name, recursive)            -- Find child by name
instance:FindFirstAncestor(name)                     -- Find ancestor by name
instance:GetChildren()                               -- Get all direct children
instance:GetDescendants()                            -- Get all descendants
instance:IsDescendantOf(other)                       -- Check ancestry

-- Property Management
instance:GetAttribute(name)                          -- Get custom attribute
instance:SetAttribute(name, value)                   -- Set custom attribute
instance:GetAttributes()                             -- Get all attributes
instance:WaitForChild(name, timeout)                 -- Wait for child to exist
```

### GuiObject Methods
```lua
-- Tweening
guiObject:TweenPosition(UDim2.new(0, 100, 0, 100), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.5, true)
guiObject:TweenSize(UDim2.new(0, 200, 0, 200), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.5, true)
guiObject:TweenSizeAndPosition(size, position, easingDirection, easingStyle, time, override, callback)

-- Size and Position
guiObject:GetFullName()                              -- Get full hierarchical path
guiObject:IsAncestorOf(descendant)                   -- Check if ancestor
guiObject:GetPropertyChangedSignal(property)         -- Get property change event
```

### TweenService Methods
```lua
local TweenService = game:GetService("TweenService")

-- Create Tween
local tween = TweenService:Create(
    instance,
    TweenInfo.new(
        1,                              -- Duration
        Enum.EasingStyle.Quad,          -- Easing style
        Enum.EasingDirection.Out,       -- Easing direction
        0,                              -- Repeat count
        false,                          -- Reverse
        0                               -- Delay
    ),
    {                                   -- Properties to tween
        Position = UDim2.new(0, 100, 0, 100),
        BackgroundTransparency = 0.5
    }
)

-- Control Tween
tween:Play()
tween:Pause()
tween:Cancel()
tween:Destroy()

-- Tween Events
tween.Completed:Connect(function(playbackState)
    print("Tween completed with state:", playbackState)
end)
```

## Events Reference

### GuiObject Events
```lua
-- Mouse Events
guiObject.MouseEnter:Connect(function() end)
guiObject.MouseLeave:Connect(function() end)
guiObject.MouseMoved:Connect(function(x, y) end)
guiObject.MouseWheelForward:Connect(function() end)
guiObject.MouseWheelBackward:Connect(function() end)

-- Button Events
guiButton.Activated:Connect(function(inputObject, clickCount) end)
guiButton.MouseButton1Down:Connect(function(x, y) end)
guiButton.MouseButton1Up:Connect(function(x, y) end)
guiButton.MouseButton1Click:Connect(function() end)
guiButton.MouseButton2Click:Connect(function() end)

-- Input Events
guiObject.InputBegan:Connect(function(input, gameProcessed) end)
guiObject.InputChanged:Connect(function(input, gameProcessed) end)
guiObject.InputEnded:Connect(function(input, gameProcessed) end)

-- Touch Events
guiObject.TouchTap:Connect(function(touchPositions, gameProcessed) end)
guiObject.TouchLongPress:Connect(function(touchPositions, state, gameProcessed) end)
guiObject.TouchPan:Connect(function(touchPositions, totalTranslation, velocity, state, gameProcessed) end)
guiObject.TouchPinch:Connect(function(touchPositions, scale, velocity, state, gameProcessed) end)
guiObject.TouchRotate:Connect(function(touchPositions, rotation, velocity, state, gameProcessed) end)
guiObject.TouchSwipe:Connect(function(swipeDirection, numberOfTouches, gameProcessed) end)
```

### Instance Events
```lua
-- Hierarchy Events
instance.ChildAdded:Connect(function(child) end)
instance.ChildRemoved:Connect(function(child) end)
instance.DescendantAdded:Connect(function(descendant) end)
instance.DescendantRemoving:Connect(function(descendant) end)

-- Property Events
instance:GetPropertyChangedSignal("Name"):Connect(function() end)
instance.AttributeChanged:Connect(function(attribute) end)
```

## UI Framework (Roact/React-like)

### Component Structure
```lua
local Roact = require(game.ReplicatedStorage.Roact)

local MyComponent = Roact.Component:extend("MyComponent")

function MyComponent:init()
    self.state = {
        count = 0,
        isVisible = true
    }
end

function MyComponent:render()
    return Roact.createElement("Frame", {
        Size = UDim2.new(0, 200, 0, 100),
        Position = UDim2.new(0.5, -100, 0.5, -50),
        BackgroundColor3 = Color3.new(1, 1, 1),
    }, {
        Title = Roact.createElement("TextLabel", {
            Text = "Count: " .. self.state.count,
            Size = UDim2.new(1, 0, 0.5, 0),
            BackgroundTransparency = 1,
            TextColor3 = Color3.new(0, 0, 0),
        }),
        Button = Roact.createElement("TextButton", {
            Text = "Increment",
            Size = UDim2.new(1, 0, 0.5, 0),
            Position = UDim2.new(0, 0, 0.5, 0),
            [Roact.Event.Activated] = function()
                self:setState({
                    count = self.state.count + 1
                })
            end
        })
    })
end

return MyComponent
```

### Fusion Framework (Modern Alternative)
```lua
local Fusion = require(game.ReplicatedStorage.Fusion)

local New = Fusion.New
local State = Fusion.State
local Computed = Fusion.Computed
local Children = Fusion.Children
local OnEvent = Fusion.OnEvent

local function Counter()
    local count = State(0)

    return New "Frame" {
        Size = UDim2.fromOffset(200, 100),
        Position = UDim2.fromScale(0.5, 0.5),
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.new(1, 1, 1),

        [Children] = {
            New "TextLabel" {
                Text = Computed(function()
                    return "Count: " .. count:get()
                end),
                Size = UDim2.fromScale(1, 0.5),
                TextColor3 = Color3.new(0, 0, 0),
                BackgroundTransparency = 1,
            },

            New "TextButton" {
                Text = "Increment",
                Size = UDim2.fromScale(1, 0.5),
                Position = UDim2.fromScale(0, 0.5),

                [OnEvent "Activated"] = function()
                    count:set(count:get() + 1)
                end
            }
        }
    }
end

return Counter
```

## Best Practices

### UI Layout Best Practices
```lua
-- Use UIListLayout for dynamic lists
local listLayout = Instance.new("UIListLayout")
listLayout.Parent = scrollingFrame
listLayout.FillDirection = Enum.FillDirection.Vertical
listLayout.HorizontalAlignment = Enum.HorizontalAlignment.Left
listLayout.VerticalAlignment = Enum.VerticalAlignment.Top
listLayout.SortOrder = Enum.SortOrder.LayoutOrder
listLayout.Padding = UDim.new(0, 5)

-- Use UIGridLayout for grids
local gridLayout = Instance.new("UIGridLayout")
gridLayout.Parent = scrollingFrame
gridLayout.CellSize = UDim2.new(0, 100, 0, 100)
gridLayout.CellPadding = UDim2.new(0, 10, 0, 10)
gridLayout.FillDirectionMaxCells = 5

-- Use UIAspectRatioConstraint for responsive design
local aspectRatio = Instance.new("UIAspectRatioConstraint")
aspectRatio.Parent = frame
aspectRatio.AspectRatio = 16/9
aspectRatio.AspectType = Enum.AspectType.FitWithinMaxSize
aspectRatio.DominantAxis = Enum.DominantAxis.Width

-- Use UISizeConstraint for minimum/maximum sizes
local sizeConstraint = Instance.new("UISizeConstraint")
sizeConstraint.Parent = frame
sizeConstraint.MinSize = Vector2.new(100, 50)
sizeConstraint.MaxSize = Vector2.new(500, 300)
```

### Performance Optimization
```lua
-- Cache frequently used services
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")
local RunService = game:GetService("RunService")

-- Use task.defer for non-blocking operations
task.defer(function()
    -- Expensive operation here
end)

-- Use task.spawn for fire-and-forget operations
task.spawn(function()
    while true do
        task.wait(1)
        -- Periodic update
    end
end)

-- Batch UI updates
local function batchUpdate(elements, properties)
    for element, props in pairs(elements) do
        for prop, value in pairs(props) do
            element[prop] = value
        end
    end
end

-- Use ObjectValues for complex data storage
local dataStore = Instance.new("ObjectValue")
dataStore.Name = "PlayerData"
dataStore.Value = {
    level = 1,
    experience = 0,
    inventory = {}
}
```

### Memory Management
```lua
-- Clean up connections
local connections = {}

local function connectEvent()
    local connection = button.Activated:Connect(function()
        print("Button clicked")
    end)
    table.insert(connections, connection)
end

local function cleanup()
    for _, connection in ipairs(connections) do
        connection:Disconnect()
    end
    connections = {}
end

-- Use weak tables for caches
local cache = setmetatable({}, {__mode = "v"}) -- Weak values
local function getCachedObject(key)
    if cache[key] then
        return cache[key]
    end
    local obj = createExpensiveObject()
    cache[key] = obj
    return obj
end
```

## Common Patterns

### Singleton Pattern
```lua
local MySingleton = {}

MySingleton.__index = MySingleton

function MySingleton.new()
    if MySingleton._instance then
        return MySingleton._instance
    end

    local self = setmetatable({}, MySingleton)
    MySingleton._instance = self

    -- Initialize singleton
    self.value = 0

    return self
end

function MySingleton:increment()
    self.value = self.value + 1
end

return MySingleton
```

### Observer Pattern
```lua
local EventSystem = {}

function EventSystem.new()
    return {
        listeners = {},
        Connect = function(self, eventName, callback)
            if not self.listeners[eventName] then
                self.listeners[eventName] = {}
            end
            table.insert(self.listeners[eventName], callback)

            -- Return disconnect function
            return function()
                for i, cb in ipairs(self.listeners[eventName]) do
                    if cb == callback then
                        table.remove(self.listeners[eventName], i)
                        break
                    end
                end
            end
        end,

        Fire = function(self, eventName, ...)
            if self.listeners[eventName] then
                for _, callback in ipairs(self.listeners[eventName]) do
                    task.spawn(callback, ...)
                end
            end
        end
    }
end

return EventSystem
```

### Module Pattern
```lua
local MyModule = {}

-- Private variables
local privateVar = "secret"

-- Private functions
local function privateFunction()
    print("This is private")
end

-- Public API
function MyModule.publicFunction()
    privateFunction()
    return privateVar
end

function MyModule.setPrivateVar(value)
    privateVar = value
end

return MyModule
```

## Performance Optimization

### UI Rendering Optimization
```lua
-- Use AutomaticSize for dynamic content
frame.AutomaticSize = Enum.AutomaticSize.XY

-- Minimize draw calls with fewer UI elements
-- Combine multiple text labels into one with RichText
label.RichText = true
label.Text = "<b>Title</b>\nDescription text"

-- Use UIAspectRatioConstraint instead of manual calculations
local aspectRatio = Instance.new("UIAspectRatioConstraint")
aspectRatio.AspectRatio = 16/9
aspectRatio.Parent = frame

-- Cache UI elements
local cachedElements = {}
local function getElement(name)
    if not cachedElements[name] then
        cachedElements[name] = frame:FindFirstChild(name)
    end
    return cachedElements[name]
end
```

### Memory Optimization
```lua
-- Use object pooling for frequently created/destroyed objects
local ObjectPool = {}

function ObjectPool.new(template)
    local pool = {
        available = {},
        template = template:Clone(),
        Get = function(self)
            local obj = table.remove(self.available)
            if not obj then
                obj = self.template:Clone()
            end
            obj.Parent = workspace
            return obj
        end,
        Return = function(self, obj)
            obj.Parent = nil
            table.insert(self.available, obj)
        end
    }
    return pool
end

-- Clean up unused assets
local function cleanupUnusedAssets()
    for _, descendant in ipairs(workspace:GetDescendants()) do
        if descendant:IsA("BasePart") and not descendant:IsDescendantOf(workspace) then
            descendant:Destroy()
        end
    end
end
```

## Debugging and Testing

### Debug Tools
```lua
-- Print with context
local function debugPrint(message, context)
    print(string.format("[DEBUG] %s: %s", context or "Unknown", message))
end

-- Inspect object properties
local function inspectObject(obj, depth)
    depth = depth or 0
    local indent = string.rep("  ", depth)

    if depth > 3 then return "..." end

    if typeof(obj) == "table" then
        local result = "{\n"
        for k, v in pairs(obj) do
            result = result .. indent .. "  " .. tostring(k) .. " = " .. inspectObject(v, depth + 1) .. ",\n"
        end
        return result .. indent .. "}"
    else
        return tostring(obj)
    end
end

-- Performance profiling
local function profileFunction(func, ...)
    local start = os.clock()
    local results = {func(...)}
    local elapsed = os.clock() - start
    print(string.format("Function took %.4f seconds", elapsed))
    return unpack(results)
end
```

### Unit Testing Framework
```lua
local TestRunner = {}

function TestRunner.new()
    return {
        tests = {},
        results = { passed = 0, failed = 0, errors = {} },

        AddTest = function(self, name, testFunc)
            table.insert(self.tests, { name = name, func = testFunc })
        end,

        RunTests = function(self)
            print("Running tests...")
            for _, test in ipairs(self.tests) do
                local success, error = pcall(test.func)
                if success then
                    self.results.passed = self.results.passed + 1
                    print("✓ " .. test.name)
                else
                    self.results.failed = self.results.failed + 1
                    table.insert(self.results.errors, {
                        test = test.name,
                        error = error
                    })
                    print("✗ " .. test.name .. ": " .. error)
                end
            end

            print(string.format("\nResults: %d passed, %d failed", self.results.passed, self.results.failed))
            if #self.results.errors > 0 then
                print("Errors:")
                for _, err in ipairs(self.results.errors) do
                    print("  " .. err.test .. ": " .. err.error)
                end
            end
        end
    }
end

-- Example usage
local tests = TestRunner.new()

tests:AddTest("Basic assertion", function()
    assert(1 + 1 == 2, "Math is broken")
end)

tests:AddTest("UI element creation", function()
    local frame = Instance.new("Frame")
    assert(frame:IsA("GuiObject"), "Frame should be a GuiObject")
    assert(frame.BackgroundTransparency == 0, "Default transparency should be 0")
end)

tests:RunTests()
```

This documentation provides comprehensive coverage of Roblox Studio's API for UI development and game mechanics. Always refer to the official Roblox documentation for the most up-to-date information and breaking changes.