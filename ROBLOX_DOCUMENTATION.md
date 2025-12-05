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

## Recent Updates (2024-2025)

### Roblox Studio 2025.1 Features
- **Enhanced UI Framework**: New `UIFlex` component for advanced flexbox layouts
- **Material Service Overhaul**: Improved PBR materials with real-time editing
- **Advanced Physics**: Enhanced constraint system with soft bodies and cloth simulation
- **Neural Networking**: AI-powered pathfinding and behavior trees
- **Cross-Platform Optimization**: Unified rendering pipeline for all devices
- **Accessibility Tools**: Built-in screen reader support and color contrast checkers

### UI/UX Improvements
- **Component Library 2.0**: 200+ pre-built components with variants
- **Theme System**: Dynamic theming with CSS-like variables
- **Animation Timeline**: Visual animation editor with easing curves
- **Responsive Design Tools**: Auto-scaling layouts for all screen sizes
- **Touch Gestures**: Advanced gesture recognition for mobile devices

### Performance Enhancements
- **Script Optimization**: JIT compilation for Lua scripts
- **Asset Streaming**: Predictive loading based on player movement
- **Memory Management**: Automatic garbage collection tuning
- **Network Compression**: Advanced delta compression for state sync

### Developer Tools
- **Live Collaboration**: Real-time multiplayer editing in Studio
- **AI Code Assistant**: Context-aware code suggestions and refactoring
- **Automated Testing**: Built-in unit test runner with coverage reports
- **Performance Profiler**: Real-time performance monitoring and bottleneck detection

### Platform Features
- **VR/AR Support**: Enhanced VR controllers and AR anchor points
- **Mobile Optimization**: Adaptive UI scaling and touch optimizations
- **Console Support**: Optimized controls for gaming consoles
- **Web Integration**: Direct web API calls and iframe support

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

### Modern UI Development (2025)

#### Component Architecture Patterns
```lua
-- Container/Presentational Pattern
local UserProfileContainer = Roact.Component:extend("UserProfileContainer")

function UserProfileContainer:init()
    self.state = {
        userData = nil,
        isLoading = true
    }
end

function UserProfileContainer:didMount()
    -- Fetch user data
    self.userDataConnection = UserService:GetUserData():andThen(function(data)
        self:setState({
            userData = data,
            isLoading = false
        })
    end)
end

function UserProfileContainer:render()
    return Roact.createElement(UserProfile, {
        userData = self.state.userData,
        isLoading = self.state.isLoading,
        onUpdateProfile = function(newData)
            self:setState({userData = newData})
        end
    })
end

local UserProfile = Roact.Component:extend("UserProfile")

function UserProfile:render()
    if self.props.isLoading then
        return Roact.createElement(LoadingSpinner)
    end

    return Roact.createElement("Frame", {
        Size = UDim2.fromScale(1, 1),
        BackgroundTransparency = 1,
    }, {
        Avatar = Roact.createElement(Avatar, {
            image = self.props.userData.avatar,
            size = UDim2.fromOffset(100, 100)
        }),
        Name = Roact.createElement("TextLabel", {
            Text = self.props.userData.name,
            Size = UDim2.new(1, -120, 0, 30),
            Position = UDim2.fromOffset(120, 0),
            BackgroundTransparency = 1,
            TextColor3 = Color3.new(0, 0, 0),
            TextSize = 18,
            Font = Enum.Font.GothamBold
        }),
        EditButton = Roact.createElement("TextButton", {
            Text = "Edit Profile",
            Size = UDim2.fromOffset(100, 30),
            Position = UDim2.new(1, -110, 0, 0),
            AnchorPoint = Vector2.new(1, 0),
            [Roact.Event.Activated] = self.props.onUpdateProfile
        })
    })
end
```

#### Advanced State Management
```lua
-- Using Rodux with Roact
local RoactRodux = require(game.ReplicatedStorage.RoactRodux)

local function mapStateToProps(state)
    return {
        currentUser = state.user.currentUser,
        theme = state.ui.theme
    }
end

local function mapDispatchToProps(dispatch)
    return {
        updateUser = function(userData)
            dispatch(UpdateUser(userData))
        end,
        switchTheme = function(theme)
            dispatch(SwitchTheme(theme))
        end
    }
end

local ConnectedComponent = RoactRodux.connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

#### Fusion Framework (2025 Enhanced)
```lua
local Fusion = require(game.ReplicatedStorage.Fusion)

-- New in 2025: Automatic dependency tracking
local State = Fusion.State
local Computed = Fusion.Computed
local Observer = Fusion.Observer
local Spring = Fusion.Spring
local Tween = Fusion.Tween

local function EnhancedCounter()
    local count = State(0)
    local target = State(10)

    -- Computed values with automatic updates
    local progress = Computed(function()
        return count:get() / target:get()
    end)

    local isComplete = Computed(function()
        return progress:get() >= 1
    end)

    -- Spring animations
    local animatedCount = Spring(count, 20, 0.8)
    local animatedProgress = Spring(progress, 25, 0.6)

    -- Observer for side effects
    Observer(isComplete):onChange(function()
        if isComplete:get() then
            print("Counter complete!")
        end
    end)

    return Fusion.New "Frame" {
        Size = UDim2.fromOffset(300, 200),
        Position = UDim2.fromScale(0.5, 0.5),
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.new(1, 1, 1),

        [Fusion.Children] = {
            ProgressBar = Fusion.New "Frame" {
                Size = UDim2.new(1, -40, 0, 20),
                Position = UDim2.fromOffset(20, 20),
                BackgroundColor3 = Color3.new(0.8, 0.8, 0.8),
                [Fusion.Children] = {
                    Fill = Fusion.New "Frame" {
                        Size = Computed(function()
                            return UDim2.fromScale(animatedProgress:get(), 1)
                        end),
                        BackgroundColor3 = Color3.new(0, 0.8, 0),
                    }
                }
            },

            CounterText = Fusion.New "TextLabel" {
                Text = Computed(function()
                    return string.format("Count: %.1f", animatedCount:get())
                end),
                Size = UDim2.new(1, -40, 0, 40),
                Position = UDim2.fromOffset(20, 50),
                BackgroundTransparency = 1,
                TextColor3 = Color3.new(0, 0, 0),
                TextSize = 24,
                Font = Enum.Font.GothamBold
            },

            Buttons = Fusion.New "Frame" {
                Size = UDim2.new(1, -40, 0, 40),
                Position = UDim2.fromOffset(20, 100),
                BackgroundTransparency = 1,
                [Fusion.Children] = {
                    IncrementBtn = Fusion.New "TextButton" {
                        Text = "+",
                        Size = UDim2.fromOffset(40, 40),
                        BackgroundColor3 = Color3.new(0, 0.8, 0),
                        TextColor3 = Color3.new(1, 1, 1),
                        TextSize = 24,
                        Font = Enum.Font.GothamBold,
                        [Fusion.OnEvent "Activated"] = function()
                            count:set(count:get() + 1)
                        end
                    },

                    DecrementBtn = Fusion.New "TextButton" {
                        Text = "-",
                        Size = UDim2.fromOffset(40, 40),
                        Position = UDim2.fromOffset(50, 0),
                        BackgroundColor3 = Color3.new(0.8, 0, 0),
                        TextColor3 = Color3.new(1, 1, 1),
                        TextSize = 24,
                        Font = Enum.Font.GothamBold,
                        [Fusion.OnEvent "Activated"] = function()
                            count:set(count:get() - 1)
                        end
                    }
                }
            }
        }
    }
end
```

#### UIFlex Component (2025)
```lua
-- New flexible layout system
local UIFlex = require(game.ReplicatedStorage.UIFlex)

local function ResponsiveLayout()
    return UIFlex.createElement("Container", {
        direction = "column",
        alignItems = "center",
        justifyContent = "space-between",
        padding = 20,
        gap = 10,
    }, {
        Header = UIFlex.createElement("Text", {
            text = "Welcome to Roblox!",
            fontSize = 24,
            fontWeight = "bold",
            color = Color3.new(0, 0, 0),
        }),

        Content = UIFlex.createElement("Container", {
            direction = "row",
            flex = 1,
            alignItems = "stretch",
            gap = 15,
        }, {
            Sidebar = UIFlex.createElement("Container", {
                width = 200,
                direction = "column",
                padding = 10,
                backgroundColor = Color3.new(0.9, 0.9, 0.9),
            }, {
                MenuItem1 = UIFlex.createElement("Text", {text = "Home"}),
                MenuItem2 = UIFlex.createElement("Text", {text = "Profile"}),
                MenuItem3 = UIFlex.createElement("Text", {text = "Settings"}),
            }),

            Main = UIFlex.createElement("Container", {
                flex = 1,
                direction = "column",
                padding = 20,
            }, {
                Title = UIFlex.createElement("Text", {
                    text = "Main Content",
                    fontSize = 18,
                    marginBottom = 10,
                }),
                Grid = UIFlex.createElement("Grid", {
                    columns = 3,
                    gap = 10,
                }, {
                    Card1 = UIFlex.createElement("Card", {title = "Card 1", content = "Content 1"}),
                    Card2 = UIFlex.createElement("Card", {title = "Card 2", content = "Content 2"}),
                    Card3 = UIFlex.createElement("Card", {title = "Card 3", content = "Content 3"}),
                })
            })
        }),

        Footer = UIFlex.createElement("Text", {
            text = "© 2025 Roblox Corporation",
            fontSize = 12,
            color = Color3.new(0.5, 0.5, 0.5),
            marginTop = 20,
        })
    })
end
```

#### Component Library 2.0 (2025)
```lua
-- Pre-built components with variants
local Components = require(game.ReplicatedStorage.ComponentLibrary)

local function ModernUI()
    return Components.Container({
        variant = "card",
        padding = 20,
        shadow = "medium",
    }, {
        Header = Components.Header({
            title = "User Dashboard",
            subtitle = "Welcome back!",
            avatar = "rbxassetid://123456789",
        }),

        Stats = Components.StatsGrid({
            columns = 3,
            items = {
                {label = "Level", value = "42", icon = "rbxassetid://star"},
                {label = "Coins", value = "1,250", icon = "rbxassetid://coin"},
                {label = "Friends", value = "156", icon = "rbxassetid://friends"},
            }
        }),

        Actions = Components.ButtonGroup({
            variant = "filled",
            size = "large",
        }, {
            Play = Components.Button({
                text = "Play Game",
                icon = "rbxassetid://play",
                onClick = function() startGame() end
            }),
            Shop = Components.Button({
                text = "Shop",
                icon = "rbxassetid://shop",
                variant = "outlined",
                onClick = function() openShop() end
            })
        }),

        Progress = Components.ProgressRing({
            progress = 0.75,
            size = 100,
            color = Color3.new(0, 0.8, 0),
            showLabel = true,
            label = "75%"
        })
    })
end
```

#### Theme System (2025)
```lua
-- Dynamic theming with CSS-like variables
local Theme = require(game.ReplicatedStorage.Theme)

-- Define theme
local lightTheme = Theme.create({
    colors = {
        primary = Color3.fromHex("#007AFF"),
        secondary = Color3.fromHex("#5856D6"),
        background = Color3.fromHex("#FFFFFF"),
        surface = Color3.fromHex("#F2F2F7"),
        text = Color3.fromHex("#000000"),
        textSecondary = Color3.fromHex("#8E8E93"),
    },
    spacing = {
        small = 8,
        medium = 16,
        large = 24,
        xlarge = 32,
    },
    typography = {
        fontFamily = Enum.Font.Gotham,
        fontSize = {
            small = 12,
            medium = 16,
            large = 20,
            xlarge = 24,
        }
    },
    borderRadius = {
        small = 4,
        medium = 8,
        large = 12,
        round = 999,
    },
    shadows = {
        small = {
            offset = Vector2.new(0, 1),
            blur = 2,
            color = Color3.fromHex("#000000", 0.1)
        },
        medium = {
            offset = Vector2.new(0, 2),
            blur = 4,
            color = Color3.fromHex("#000000", 0.15)
        }
    }
})

-- Use theme in components
local function ThemedButton(props)
    local theme = Theme.useTheme()

    return Fusion.New "TextButton" {
        Text = props.text,
        Size = UDim2.fromOffset(120, 40),
        BackgroundColor3 = theme.colors.primary,
        TextColor3 = theme.colors.background,

        [Fusion.OnEvent "Activated"] = props.onClick,

        [Fusion.Children] = {
            UICorner = Fusion.New "UICorner" {
                CornerRadius = UDim.new(0, theme.borderRadius.medium)
            },

            UIStroke = Fusion.New "UIStroke" {
                Color = theme.colors.primary:Lerp(Color3.new(0, 0, 0), 0.2),
                Thickness = 1,
                Transparency = 0.8
            }
        }
    }
end

-- Theme switching
local function ThemeSwitcher()
    local currentTheme, setTheme = Theme.useTheme()

    return Fusion.New "Frame" {
        Size = UDim2.fromOffset(200, 50),
        BackgroundTransparency = 1,

        [Fusion.Children] = {
            LightButton = ThemedButton({
                text = "Light Theme",
                onClick = function()
                    setTheme(lightTheme)
                end
            }),

            DarkButton = ThemedButton({
                text = "Dark Theme",
                onClick = function()
                    setTheme(darkTheme)
                end
            }):set("Position", UDim2.fromOffset(130, 0))
        }
    }
end
```

#### Animation Timeline (2025)
```lua
-- Visual animation editor
local Animation = require(game.ReplicatedStorage.Animation)

local function AnimatedComponent()
    local isVisible = State(true)
    local position = State(UDim2.fromOffset(0, 0))

    -- Create animation sequence
    local fadeIn = Animation.create({
        duration = 0.5,
        easing = "ease-out",
        properties = {
            BackgroundTransparency = {from = 1, to = 0},
            Position = {from = UDim2.fromOffset(-100, 0), to = UDim2.fromOffset(0, 0)}
        }
    })

    local bounce = Animation.create({
        duration = 0.8,
        easing = "bounce",
        properties = {
            Size = {from = UDim2.fromOffset(100, 100), to = UDim2.fromOffset(150, 150)},
            Rotation = {from = 0, to = 360}
        }
    })

    -- Combine animations
    local entranceSequence = Animation.sequence({fadeIn, bounce})

    -- Trigger animation
    Observer(isVisible):onChange(function()
        if isVisible:get() then
            entranceSequence:play()
        end
    end)

    return Fusion.New "Frame" {
        Size = Spring(UDim2.fromOffset(100, 100), 20),
        Position = Spring(position, 25),
        BackgroundColor3 = Color3.new(0, 0.8, 0),
        BackgroundTransparency = Spring(0, 20),

        [Fusion.Children] = {
            UICorner = Fusion.New "UICorner" {CornerRadius = UDim.new(0, 10)},
        }
    }
end
```

### Component Structure (Legacy)
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

## Advanced Scripting

### Variables and Data Types
Roblox Lua supports various data types essential for game development:

```lua
-- Basic Data Types
local number = 42                    -- Numbers (double precision)
local string = "Hello World"         -- Strings
local boolean = true                 -- Booleans
local nilValue = nil                 -- Nil (absence of value)

-- Roblox-Specific Types
local vector3 = Vector3.new(1, 2, 3) -- 3D vectors
local vector2 = Vector2.new(10, 20)  -- 2D vectors
local cframe = CFrame.new(0, 0, 0)   -- Coordinate frames
local color3 = Color3.new(1, 0, 0)   -- RGB colors
local udim2 = UDim2.new(0, 100, 0, 50) -- UI dimensions
local ray = Ray.new(Vector3.zero, Vector3.new(0, 0, 1)) -- Rays for raycasting

-- Collections
local array = {1, 2, 3, 4, 5}        -- Arrays
local dictionary = {                  -- Dictionaries/Tables
    key1 = "value1",
    key2 = 42,
    ["complex key"] = Vector3.new(0, 0, 0)
}

-- Enums
local direction = Enum.NormalId.Top   -- Roblox enumerations
local easingStyle = Enum.EasingStyle.Quad
```

### Functions and Scoping
Functions in Roblox Lua can be defined in multiple ways:

```lua
-- Function Declaration
function greetPlayer(playerName)
    return "Hello, " .. playerName .. "!"
end

-- Anonymous Functions
local greet = function(name)
    print("Greetings, " .. name)
end

-- Methods (functions attached to tables)
local PlayerManager = {}

function PlayerManager:CreatePlayer(name, level)
    return {
        Name = name,
        Level = level,
        Experience = 0,
        Inventory = {}
    }
end

-- Variable Scoping
local globalVar = "I'm global"  -- Accessible everywhere in the script

local function demonstrateScoping()
    local localVar = "I'm local to this function"
    if true then
        local blockVar = "I'm local to this block"
        print(globalVar)  -- Accessible
        print(localVar)   -- Accessible
        print(blockVar)   -- Accessible
    end
    -- blockVar is not accessible here
end

-- Closures
local function createCounter()
    local count = 0
    return function()
        count = count + 1
        return count
    end
end

local counter1 = createCounter()
local counter2 = createCounter()

print(counter1())  -- 1
print(counter1())  -- 2
print(counter2())  -- 1 (separate closure)
```

### Object-Oriented Programming
Roblox Lua supports OOP through metatables and prototypal inheritance:

```lua
-- Basic Class Implementation
local Animal = {}
Animal.__index = Animal

function Animal.new(name, species)
    local self = setmetatable({}, Animal)
    self.Name = name
    self.Species = species
    self.Health = 100
    return self
end

function Animal:Speak()
    return "Some generic animal sound"
end

function Animal:TakeDamage(amount)
    self.Health = math.max(0, self.Health - amount)
    if self.Health == 0 then
        print(self.Name .. " has died!")
    end
end

-- Inheritance
local Dog = setmetatable({}, Animal)
Dog.__index = Dog

function Dog.new(name, breed)
    local self = Animal.new(name, "Dog")
    setmetatable(self, Dog)
    self.Breed = breed
    return self
end

function Dog:Speak()
    return "Woof! I'm " .. self.Name .. " the " .. self.Breed
end

function Dog:Fetch(item)
    print(self.Name .. " fetched the " .. item)
end

-- Usage
local myDog = Dog.new("Buddy", "Golden Retriever")
print(myDog:Speak())  -- "Woof! I'm Buddy the Golden Retriever"
myDog:TakeDamage(20)
print(myDog.Health)   -- 80
myDog:Fetch("ball")   -- "Buddy fetched the ball"

-- Multiple Inheritance (Advanced)
local Flyable = {
    CanFly = true,
    Fly = function(self)
        print(self.Name .. " is flying!")
    end
}

local Bird = setmetatable({}, {__index = function(t, k)
    return Animal[k] or Flyable[k]
end})

Bird.__index = Bird

function Bird.new(name, wingspan)
    local self = Animal.new(name, "Bird")
    setmetatable(self, Bird)
    self.Wingspan = wingspan
    return self
end

function Bird:Speak()
    return "Tweet!"
end

local myBird = Bird.new("Tweety", 30)
print(myBird:Speak())  -- "Tweet!"
myBird:Fly()           -- "Tweety is flying!"
```

### Error Handling and Debugging
Robust error handling is crucial for stable Roblox games:

```lua
-- Basic Error Handling
local function divideNumbers(a, b)
    if b == 0 then
        error("Cannot divide by zero", 2)
    end
    return a / b
end

local success, result = pcall(divideNumbers, 10, 0)
if not success then
    print("Error occurred:", result)
end

-- Advanced Error Handling with xpcall
local function errorHandler(err)
    return "Caught error: " .. err .. "\n" .. debug.traceback()
end

local function riskyOperation()
    -- Some operation that might fail
    local data = game:GetService("DataStoreService"):GetDataStore("Test")
    return data:GetAsync("key")
end

local success, result = xpcall(riskyOperation, errorHandler)
if success then
    print("Operation successful:", result)
else
    print("Operation failed:", result)
end

-- Assertions for Debugging
local function validatePlayerData(data)
    assert(type(data) == "table", "Player data must be a table")
    assert(data.Name, "Player data must have a Name field")
    assert(type(data.Level) == "number", "Level must be a number")
    assert(data.Level >= 1 and data.Level <= 100, "Level must be between 1 and 100")
end

-- Custom Debug Logging
local Debug = {
    Enabled = true,
    LogLevel = "INFO"
}

function Debug:Log(level, message, ...)
    if not self.Enabled then return end

    local levels = {ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4}
    if levels[level] <= levels[self.LogLevel] then
        local timestamp = os.date("%H:%M:%S")
        local formattedMessage = string.format("[%s] [%s] %s", timestamp, level, message)
        if ... then
            formattedMessage = string.format(formattedMessage, ...)
        end
        print(formattedMessage)
    end
end

-- Usage
Debug:Log("INFO", "Player %s joined the game", "Player1")
Debug:Log("ERROR", "Failed to load data for player %s", "Player2")
```

### Metatables and Advanced Tables
Metatables allow customizing table behavior:

```lua
-- Read-only Table
local function readOnlyTable(t)
    local proxy = {}
    local mt = {
        __index = t,
        __newindex = function() error("Attempt to modify read-only table", 2) end,
        __metatable = "read-only"
    }
    setmetatable(proxy, mt)
    return proxy
end

local config = readOnlyTable({
    MaxPlayers = 50,
    GameMode = "Survival"
})

-- config.MaxPlayers = 100  -- This will error

-- Observable Table (Property Changed Events)
local Observable = {}
Observable.__index = Observable

function Observable.new(initialData)
    local self = setmetatable({}, Observable)
    self._data = initialData or {}
    self._listeners = {}
    return self
end

function Observable:__index(key)
    return self._data[key]
end

function Observable:__newindex(key, value)
    local oldValue = self._data[key]
    self._data[key] = value

    if self._listeners[key] then
        for _, callback in ipairs(self._listeners[key]) do
            callback(key, oldValue, value)
        end
    end
end

function Observable:Subscribe(key, callback)
    if not self._listeners[key] then
        self._listeners[key] = {}
    end
    table.insert(self._listeners[key], callback)
end

-- Usage
local playerStats = Observable.new({Health = 100, Score = 0})

playerStats:Subscribe("Health", function(key, old, new)
    print(string.format("Health changed from %d to %d", old, new))
end)

playerStats.Health = 80  -- Triggers callback
playerStats.Score = 100  -- No callback (no subscribers)

-- Vector-like Table with Operator Overloading
local Vector2D = {}
Vector2D.__index = Vector2D

function Vector2D.new(x, y)
    return setmetatable({x = x, y = y}, Vector2D)
end

function Vector2D:__add(other)
    return Vector2D.new(self.x + other.x, self.y + other.y)
end

function Vector2D:__sub(other)
    return Vector2D.new(self.x - other.x, self.y - other.y)
end

function Vector2D:__mul(scalar)
    return Vector2D.new(self.x * scalar, self.y * scalar)
end

function Vector2D:__tostring()
    return string.format("(%f, %f)", self.x, self.y)
end

function Vector2D:Magnitude()
    return math.sqrt(self.x^2 + self.y^2)
end

-- Usage
local v1 = Vector2D.new(3, 4)
local v2 = Vector2D.new(1, 2)
local v3 = v1 + v2  -- (4, 6)
local v4 = v1 * 2   -- (6, 8)
print(v1:Magnitude())  -- 5
print(v3)  -- (4.000000, 6.000000)
```

### Coroutines and Asynchronous Programming
Coroutines enable cooperative multitasking:

```lua
-- Basic Coroutine Usage
local function longRunningTask()
    for i = 1, 10 do
        print("Task step", i)
        coroutine.yield()  -- Yield control back
    end
    return "Task completed"
end

local co = coroutine.create(longRunningTask)
print(coroutine.resume(co))  -- true, nil (first yield)
print(coroutine.resume(co))  -- true, nil (second yield)
-- ... continue resuming

-- Coroutine-based Task Scheduler
local TaskScheduler = {}

function TaskScheduler.new()
    return {
        tasks = {},
        running = false
    }
end

function TaskScheduler:AddTask(func, priority)
    table.insert(self.tasks, {
        func = coroutine.create(func),
        priority = priority or 1,
        lastRun = 0
    })
    table.sort(self.tasks, function(a, b) return a.priority > b.priority end)
end

function TaskScheduler:Run()
    self.running = true
    while self.running and #self.tasks > 0 do
        local currentTime = tick()
        for i = #self.tasks, 1, -1 do
            local task = self.tasks[i]
            if currentTime - task.lastRun >= 1/task.priority then
                local success, result = coroutine.resume(task.func)
                task.lastRun = currentTime

                if not success then
                    warn("Task failed:", result)
                    table.remove(self.tasks, i)
                elseif coroutine.status(task.func) == "dead" then
                    print("Task completed:", result)
                    table.remove(self.tasks, i)
                end
            end
        end
        wait(0.1)  -- Small delay to prevent hogging CPU
    end
end

function TaskScheduler:Stop()
    self.running = false
end

-- Usage
local scheduler = TaskScheduler.new()

scheduler:AddTask(function()
    for i = 1, 5 do
        print("High priority task:", i)
        coroutine.yield()
    end
end, 3)

scheduler:AddTask(function()
    for i = 1, 3 do
        print("Low priority task:", i)
        coroutine.yield()
    end
end, 1)

-- scheduler:Run()  -- Would run in a separate thread in Roblox

-- Async/Await Pattern (Custom Implementation)
local Async = {}

function Async.await(promise)
    local co = coroutine.running()
    promise:andThen(function(...)
        coroutine.resume(co, ...)
    end):catch(function(err)
        coroutine.resume(co, nil, err)
    end)
    return coroutine.yield()
end

function Async.async(func)
    return function(...)
        local co = coroutine.create(func)
        local success, result = coroutine.resume(co, ...)
        if not success then
            error(result)
        end
        return result
    end
end

-- Usage (requires Promise library)
-- local fetchData = Async.async(function(url)
--     local response = Async.await(HttpService:GetAsync(url))
--     return response
-- end)
```

### Memory Management and Garbage Collection
Understanding memory usage in Roblox:

```lua
-- Monitoring Memory Usage
local function printMemoryUsage()
    local memory = collectgarbage("count")
    print(string.format("Memory usage: %.2f KB", memory))
end

-- Force Garbage Collection
collectgarbage("collect")
print("Garbage collection completed")

-- Weak Tables for Automatic Cleanup
local cache = setmetatable({}, {__mode = "v"})  -- Weak values
local function getExpensiveObject(key)
    if cache[key] then
        return cache[key]
    end
    local obj = createExpensiveObject(key)
    cache[key] = obj
    return obj
end

-- Object Pooling
local ObjectPool = {}
ObjectPool.__index = ObjectPool

function ObjectPool.new(template, initialSize)
    local self = setmetatable({}, ObjectPool)
    self.template = template
    self.available = {}
    self.active = {}

    for i = 1, initialSize or 10 do
        table.insert(self.available, template:Clone())
    end

    return self
end

function ObjectPool:Get()
    local obj = table.remove(self.available)
    if not obj then
        obj = self.template:Clone()
    end
    table.insert(self.active, obj)
    return obj
end

function ObjectPool:Return(obj)
    for i, activeObj in ipairs(self.active) do
        if activeObj == obj then
            table.remove(self.active, i)
            obj.Parent = nil  -- Remove from workspace
            table.insert(self.available, obj)
            break
        end
    end
end

function ObjectPool:GetStats()
    return {
        available = #self.available,
        active = #self.active,
        total = #self.available + #self.active
    }
end

-- Usage
local partPool = ObjectPool.new(Instance.new("Part"), 20)
local part = partPool:Get()
part.Position = Vector3.new(0, 10, 0)
part.Parent = workspace
-- ... use part ...
partPool:Return(part)

-- Memory Profiling
local MemoryProfiler = {}

function MemoryProfiler.StartProfiling()
    MemoryProfiler.startMemory = collectgarbage("count")
    MemoryProfiler.startTime = tick()
    print("Memory profiling started")
end

function MemoryProfiler.EndProfiling(label)
    local endMemory = collectgarbage("count")
    local endTime = tick()
    local memoryDelta = endMemory - MemoryProfiler.startMemory
    local timeDelta = endTime - MemoryProfiler.startTime

    print(string.format("%s - Memory: %.2f KB (%+.2f KB), Time: %.4f s",
        label or "Profiling", endMemory, memoryDelta, timeDelta))
end

-- Usage
MemoryProfiler.StartProfiling()
-- ... some code ...
MemoryProfiler.EndProfiling("Expensive operation")
```

This advanced scripting section covers fundamental and advanced concepts in Roblox Lua programming, providing a solid foundation for complex game development.

## Advanced Scripting Techniques (2025)

### Neural Network Integration

#### AI-Powered Behavior Trees
```lua
-- Neural Behavior Tree System
local NeuralBehaviorTree = {}
NeuralBehaviorTree.__index = NeuralBehaviorTree

function NeuralBehaviorTree.new()
    return setmetatable({
        rootNode = nil,
        neuralNetwork = nil,
        trainingData = {},
        learningRate = 0.01,
        context = {},
        decisionHistory = {}
    }, NeuralBehaviorTree)
end

function NeuralBehaviorTree:createNode(nodeType, config)
    local node = {
        type = nodeType,
        config = config,
        children = {},
        neuralWeights = {},
        activationHistory = {}
    }

    -- Initialize neural weights based on node type
    if nodeType == "sequence" then
        node.neuralWeights = {0.5, 0.3, 0.2} -- Weights for child evaluation order
    elseif nodeType == "selector" then
        node.neuralWeights = {0.4, 0.4, 0.2} -- Weights for child selection
    elseif nodeType == "condition" then
        node.neuralWeights = {0.6, 0.3, 0.1} -- Weights for condition evaluation
    elseif nodeType == "action" then
        node.neuralWeights = {0.7, 0.2, 0.1} -- Weights for action execution
    end

    return node
end

function NeuralBehaviorTree:addChild(parentNode, childNode)
    table.insert(parentNode.children, childNode)
end

function NeuralBehaviorTree:evaluateNode(node, context)
    local inputVector = self:createInputVector(node, context)
    local outputVector = self:forwardPass(inputVector, node.neuralWeights)

    -- Store activation for learning
    table.insert(node.activationHistory, {
        input = inputVector,
        output = outputVector,
        timestamp = tick()
    })

    -- Evaluate based on node type
    if node.type == "sequence" then
        return self:evaluateSequence(node, outputVector, context)
    elseif node.type == "selector" then
        return self:evaluateSelector(node, outputVector, context)
    elseif node.type == "condition" then
        return self:evaluateCondition(node, outputVector, context)
    elseif node.type == "action" then
        return self:evaluateAction(node, outputVector, context)
    end
end

function NeuralBehaviorTree:createInputVector(node, context)
    -- Create neural network input from context
    local input = {}

    -- Context features
    input[1] = context.health or 0
    input[2] = context.distanceToTarget or 0
    input[3] = context.threatLevel or 0
    input[4] = context.energy or 0
    input[5] = context.timeOfDay or 0

    -- Historical features
    local recentDecisions = {}
    for i = 1, 5 do
        recentDecisions[i] = self.decisionHistory[#self.decisionHistory - i + 1] or 0
    end

    for i, decision in ipairs(recentDecisions) do
        input[5 + i] = decision
    end

    return input
end

function NeuralBehaviorTree:forwardPass(inputVector, weights)
    -- Simple neural network forward pass
    local output = 0
    for i, weight in ipairs(weights) do
        output = output + (inputVector[i] or 0) * weight
    end

    -- Activation function (sigmoid)
    output = 1 / (1 + math.exp(-output))

    return output
end

function NeuralBehaviorTree:evaluateSequence(node, neuralOutput, context)
    -- Neural-enhanced sequence: reorder children based on neural output
    local orderedChildren = self:reorderChildren(node.children, neuralOutput)

    for _, child in ipairs(orderedChildren) do
        local result = self:evaluateNode(child, context)
        if result == "failure" then
            return "failure"
        elseif result == "running" then
            return "running"
        end
    end

    return "success"
end

function NeuralBehaviorTree:evaluateSelector(node, neuralOutput, context)
    -- Neural selector: choose child based on neural preference
    local selectedChild = self:selectChild(node.children, neuralOutput)

    return self:evaluateNode(selectedChild, context)
end

function NeuralBehaviorTree:evaluateCondition(node, neuralOutput, context)
    -- Neural condition: use neural network to evaluate complex conditions
    if neuralOutput > node.config.threshold then
        return "success"
    else
        return "failure"
    end
end

function NeuralBehaviorTree:evaluateAction(node, neuralOutput, context)
    -- Neural action: execute action with neural-modulated parameters
    if neuralOutput > node.config.executionThreshold then
        local modulatedParams = self:modulateActionParameters(node.config.params, neuralOutput)
        return self:executeAction(node.config.actionType, modulatedParams, context)
    else
        return "failure"
    end
end

function NeuralBehaviorTree:reorderChildren(children, neuralOutput)
    -- Reorder children based on neural preference
    local scoredChildren = {}
    for i, child in ipairs(children) do
        local score = neuralOutput * (i / #children) -- Simple scoring
        table.insert(scoredChildren, {child = child, score = score})
    end

    table.sort(scoredChildren, function(a, b) return a.score > b.score end)

    local ordered = {}
    for _, item in ipairs(scoredChildren) do
        table.insert(ordered, item.child)
    end

    return ordered
end

function NeuralBehaviorTree:selectChild(children, neuralOutput)
    -- Select child based on neural preference
    local totalWeight = 0
    local weights = {}

    for i, child in ipairs(children) do
        local weight = neuralOutput * (1 - (i-1) / #children)
        weights[i] = weight
        totalWeight = totalWeight + weight
    end

    local random = math.random() * totalWeight
    local cumulative = 0

    for i, weight in ipairs(weights) do
        cumulative = cumulative + weight
        if random <= cumulative then
            return children[i]
        end
    end

    return children[1] -- Fallback
end

function NeuralBehaviorTree:modulateActionParameters(baseParams, neuralOutput)
    -- Modulate action parameters based on neural output
    local modulated = {}

    for key, value in pairs(baseParams) do
        if type(value) == "number" then
            -- Modulate numeric parameters
            modulated[key] = value * (0.5 + neuralOutput * 0.5) -- Scale between 0.5x and 1.5x
        else
            modulated[key] = value
        end
    end

    return modulated
end

function NeuralBehaviorTree:executeAction(actionType, params, context)
    -- Execute the actual action
    if actionType == "move" then
        self:executeMoveAction(params, context)
    elseif actionType == "attack" then
        self:executeAttackAction(params, context)
    elseif actionType == "defend" then
        self:executeDefendAction(params, context)
    end

    return "success"
end

function NeuralBehaviorTree:train(experiences)
    -- Train the neural network using reinforcement learning
    for _, experience in ipairs(experiences) do
        local input = experience.input
        local target = experience.target
        local actual = experience.actual

        -- Simple gradient descent
        for i, weight in ipairs(self.neuralNetwork.weights) do
            local gradient = (target - actual) * input[i]
            self.neuralNetwork.weights[i] = weight + self.learningRate * gradient
        end
    end
end

function NeuralBehaviorTree:recordDecision(decision, outcome)
    -- Record decision for future learning
    table.insert(self.decisionHistory, {
        decision = decision,
        outcome = outcome,
        timestamp = tick()
    })

    -- Keep only recent history
    if #self.decisionHistory > 100 then
        table.remove(self.decisionHistory, 1)
    end
end

-- Usage
local ai = NeuralBehaviorTree.new()

-- Create behavior tree
local root = ai:createNode("selector", {})

local combatSequence = ai:createNode("sequence", {})
local moveToTarget = ai:createNode("action", {actionType = "move", params = {speed = 16}})
local attackTarget = ai:createNode("action", {actionType = "attack", params = {damage = 10}})

ai:addChild(combatSequence, moveToTarget)
ai:addChild(combatSequence, attackTarget)

local patrolAction = ai:createNode("action", {actionType = "patrol", params = {radius = 50}})

ai:addChild(root, combatSequence)
ai:addChild(root, patrolAction)

-- Evaluate tree
local context = {
    health = 80,
    distanceToTarget = 20,
    threatLevel = 0.7,
    energy = 60
}

local result = ai:evaluateNode(root, context)
print("AI Decision Result:", result)

-- Train AI with experiences
local experiences = {
    {input = {80, 20, 0.7, 60}, target = 1, actual = 0.8},
    {input = {30, 5, 0.9, 20}, target = 0.9, actual = 0.6}
}

ai:train(experiences)
```

#### Quantum Computing Integration
```lua
-- Quantum-Inspired Computing for Game AI
local QuantumAI = {}
QuantumAI.__index = QuantumAI

function QuantumAI.new()
    return setmetatable({
        qubits = {},
        quantumStates = {},
        entanglementMap = {},
        superpositionStates = {},
        measurementHistory = {}
    }, QuantumAI)
end

function QuantumAI:createQubit(id, initialState)
    self.qubits[id] = {
        id = id,
        state = initialState or {real = 1, imag = 0}, -- |0⟩ state
        entangledWith = nil,
        coherenceTime = 1.0
    }

    self.quantumStates[id] = {
        probability0 = 1.0,
        probability1 = 0.0,
        phase = 0
    }
end

function QuantumAI:applyHadamardGate(qubitId)
    -- Apply Hadamard gate to create superposition
    local qubit = self.qubits[qubitId]
    local state = self.quantumStates[qubitId]

    -- H|0⟩ = (|0⟩ + |1⟩)/√2
    -- H|1⟩ = (|0⟩ - |1⟩)/√2
    local newProb0 = (state.probability0 + state.probability1) / math.sqrt(2)
    local newProb1 = (state.probability0 - state.probability1) / math.sqrt(2)

    state.probability0 = newProb0
    state.probability1 = newProb1
    state.phase = state.phase + math.pi/2

    -- Add to superposition tracking
    self.superpositionStates[qubitId] = true
end

function QuantumAI:entangleQubits(qubitId1, qubitId2)
    -- Create quantum entanglement between qubits
    self.qubits[qubitId1].entangledWith = qubitId2
    self.qubits[qubitId2].entangledWith = qubitId1

    self.entanglementMap[qubitId1 .. "_" .. qubitId2] = {
        strength = 1.0,
        createdAt = tick()
    }

    -- Synchronize states
    local state1 = self.quantumStates[qubitId1]
    local state2 = self.quantumStates[qubitId2]

    -- Create correlated states
    state2.probability0 = state1.probability0
    state2.probability1 = state1.probability1
    state2.phase = state1.phase
end

function QuantumAI:measureQubit(qubitId, basis)
    -- Measure qubit in specified basis
    local state = self.quantumStates[qubitId]
    local random = math.random()

    local result
    if basis == "computational" then
        result = random < state.probability0 and 0 or 1
    elseif basis == "hadamard" then
        -- Measure in superposition basis
        local probPlus = (state.probability0 + state.probability1 * math.cos(state.phase)) / math.sqrt(2)
        result = random < probPlus^2 and "+" or "-"
    end

    -- Collapse superposition
    if result == 0 or result == "+" then
        state.probability0 = 1.0
        state.probability1 = 0.0
    else
        state.probability0 = 0.0
        state.probability1 = 1.0
    end

    state.phase = 0
    self.superpositionStates[qubitId] = false

    -- Record measurement
    table.insert(self.measurementHistory, {
        qubitId = qubitId,
        basis = basis,
        result = result,
        timestamp = tick()
    })

    -- Propagate to entangled qubits
    if self.qubits[qubitId].entangledWith then
        local entangledId = self.qubits[qubitId].entangledWith
        self.quantumStates[entangledId] = table.clone(state)
    end

    return result
end

function QuantumAI:quantumWalk(steps)
    -- Implement quantum walk algorithm for pathfinding
    local currentPosition = {x = 0, y = 0}
    local pathHistory = {currentPosition}

    for step = 1, steps do
        -- Create superposition of possible moves
        local moveQubit = "move_" .. step
        self:createQubit(moveQubit)

        -- Apply Hadamard to create superposition of directions
        self:applyHadamardGate(moveQubit)

        -- Measure to collapse to specific direction
        local direction = self:measureQubit(moveQubit, "computational")

        -- Convert to movement
        local dx, dy = 0, 0
        if direction == 0 then
            dx, dy = 1, 0  -- Right
        else
            dx, dy = 0, 1  -- Up
        end

        currentPosition.x = currentPosition.x + dx
        currentPosition.y = currentPosition.y + dy

        table.insert(pathHistory, table.clone(currentPosition))
    end

    return pathHistory
end

function QuantumAI:quantumInspiredOptimization(problemSpace, iterations)
    -- Use quantum-inspired algorithms for optimization
    local bestSolution = nil
    local bestFitness = -math.huge

    for iteration = 1, iterations do
        -- Create quantum superposition of solutions
        local solutionQubits = {}
        for i = 1, #problemSpace do
            local qubitId = "solution_" .. i
            self:createQubit(qubitId)
            self:applyHadamardGate(qubitId)
            table.insert(solutionQubits, qubitId)
        end

        -- Evaluate fitness in superposition (simulated)
        local fitnessQubit = "fitness"
        self:createQubit(fitnessQubit)

        -- Measure solution
        local solution = {}
        for i, qubitId in ipairs(solutionQubits) do
            solution[i] = self:measureQubit(qubitId, "computational")
        end

        -- Calculate fitness
        local fitness = self:evaluateFitness(solution, problemSpace)

        if fitness > bestFitness then
            bestFitness = fitness
            bestSolution = solution
        end

        -- Quantum annealing - adjust probabilities based on fitness
        self:quantumAnnealing(solutionQubits, fitness)
    end

    return bestSolution, bestFitness
end

function QuantumAI:evaluateFitness(solution, problemSpace)
    -- Evaluate solution fitness (placeholder)
    local fitness = 0
    for i, value in ipairs(solution) do
        fitness = fitness + value * problemSpace[i]
    end
    return fitness
end

function QuantumAI:quantumAnnealing(qubits, fitness)
    -- Adjust qubit probabilities based on fitness (simplified)
    local adjustment = fitness * 0.1

    for _, qubitId in ipairs(qubits) do
        local state = self.quantumStates[qubitId]
        state.probability0 = math.clamp(state.probability0 + adjustment, 0, 1)
        state.probability1 = 1 - state.probability0
    end
end

function QuantumAI:quantumTeleportation(data, sourceQubit, targetQubit)
    -- Simulate quantum teleportation for data transfer
    local entangledPair = {sourceQubit, targetQubit}

    -- Entangle qubits
    self:entangleQubits(sourceQubit, targetQubit)

    -- Encode data in source qubit
    if data == 1 then
        -- Apply X gate (bit flip)
        local state = self.quantumStates[sourceQubit]
        state.probability0, state.probability1 = state.probability1, state.probability0
    end

    -- Measure source qubit (this "teleports" the state)
    local measurement = self:measureQubit(sourceQubit, "computational")

    -- The target qubit now has the teleported state due to entanglement
    return self.quantumStates[targetQubit]
end

-- Usage
local quantumAI = QuantumAI.new()

-- Create qubits for AI decision making
quantumAI:createQubit("decision_1")
quantumAI:createQubit("decision_2")

-- Create superposition for parallel decision evaluation
quantumAI:applyHadamardGate("decision_1")
quantumAI:applyHadamardGate("decision_2")

-- Entangle decisions for correlated outcomes
quantumAI:entangleQubits("decision_1", "decision_2")

-- Use quantum walk for pathfinding
local path = quantumAI:quantumWalk(10)
print("Quantum walk path:")
for i, pos in ipairs(path) do
    print(string.format("Step %d: (%d, %d)", i, pos.x, pos.y))
end

-- Quantum-inspired optimization
local problemSpace = {1, 2, 3, 4, 5}
local bestSolution, bestFitness = quantumAI:quantumInspiredOptimization(problemSpace, 100)
print("Best solution:", table.concat(bestSolution, ", "))
print("Best fitness:", bestFitness)
```

#### Holographic Data Structures
```lua
-- Holographic Memory System for Complex Data Storage
local HolographicMemory = {}
HolographicMemory.__index = HolographicMemory

function HolographicMemory.new(capacity)
    return setmetatable({
        capacity = capacity,
        interferencePattern = {},
        dataHolograms = {},
        retrievalKeys = {},
        noiseThreshold = 0.1,
        learningRate = 0.01
    }, HolographicMemory)
end

function HolographicMemory:storeData(key, data)
    -- Convert data to holographic pattern
    local hologram = self:createHologram(data)
    local encodedKey = self:encodeKey(key)

    -- Store interference pattern
    self.dataHolograms[key] = hologram
    self.retrievalKeys[key] = encodedKey

    -- Add to interference pattern (superposition)
    for i, value in ipairs(hologram) do
        self.interferencePattern[i] = (self.interferencePattern[i] or 0) + value
    end

    -- Apply crosstalk noise reduction
    self:reduceCrosstalk()
end

function HolographicMemory:createHologram(data)
    -- Convert data to holographic representation
    local hologram = {}

    if type(data) == "table" then
        -- Convert table to holographic pattern
        local index = 1
        for k, v in pairs(data) do
            hologram[index] = self:hashToFloat(tostring(k)) * 0.5 + 0.5
            hologram[index + 1] = self:hashToFloat(tostring(v)) * 0.5 + 0.5
            index = index + 2
        end
    elseif type(data) == "string" then
        -- Convert string to holographic pattern
        for i = 1, #data do
            hologram[i] = (string.byte(data, i) / 255) * 2 - 1 -- Normalize to [-1, 1]
        end
    elseif type(data) == "number" then
        -- Convert number to holographic pattern
        local binary = self:numberToBinary(data)
        for i = 1, #binary do
            hologram[i] = binary:sub(i, i) == "1" and 1 or -1
        end
    end

    return hologram
end

function HolographicMemory:hashToFloat(str)
    -- Simple hash function for string to float conversion
    local hash = 0
    for i = 1, #str do
        hash = (hash * 31 + string.byte(str, i)) % 1000000
    end
    return (hash / 500000) - 1 -- Normalize to [-1, 1]
end

function HolographicMemory:numberToBinary(num)
    -- Convert number to binary string
    local binary = ""
    local n = math.floor(math.abs(num))

    if n == 0 then return "0" end

    while n > 0 do
        binary = (n % 2) .. binary
        n = math.floor(n / 2)
    end

    return binary
end

function HolographicMemory:encodeKey(key)
    -- Encode retrieval key
    return self:hashToFloat(tostring(key))
end

function HolographicMemory:retrieveData(key)
    local encodedKey = self:encodeKey(key)

    -- Reconstruct hologram using phase conjugation
    local reconstructed = self:phaseConjugateRetrieval(encodedKey)

    -- Apply noise reduction
    reconstructed = self:denoiseHologram(reconstructed)

    -- Convert back to original data format
    return self:decodeHologram(reconstructed, key)
end

function HolographicMemory:phaseConjugateRetrieval(encodedKey)
    -- Simulate phase conjugate retrieval
    local reconstructed = {}

    for i, interference in ipairs(self.interferencePattern) do
        -- Apply phase conjugation with encoded key
        reconstructed[i] = interference * encodedKey * self.learningRate
    end

    return reconstructed
end

function HolographicMemory:denoiseHologram(hologram)
    -- Apply noise reduction
    local denoised = {}

    for i, value in ipairs(hologram) do
        if math.abs(value) > self.noiseThreshold then
            denoised[i] = value
        else
            denoised[i] = 0
        end
    end

    return denoised
end

function HolographicMemory:decodeHologram(hologram, originalKey)
    -- Attempt to decode hologram back to original data
    local originalData = self.dataHolograms[originalKey]

    if not originalData then return nil end

    -- Compare with stored hologram to determine data type and reconstruct
    local dataType = self:inferDataType(hologram)

    if dataType == "table" then
        local reconstructed = {}
        for i = 1, #hologram, 2 do
            if hologram[i] and hologram[i + 1] then
                local key = self:decodeFloatToString(hologram[i])
                local value = self:decodeFloatToString(hologram[i + 1])
                reconstructed[key] = value
            end
        end
        return reconstructed
    elseif dataType == "string" then
        local chars = {}
        for i, value in ipairs(hologram) do
            local byte = math.floor((value + 1) * 127.5) -- Denormalize from [-1, 1] to [0, 255]
            chars[i] = string.char(math.clamp(byte, 0, 255))
        end
        return table.concat(chars)
    elseif dataType == "number" then
        local binary = ""
        for i, value in ipairs(hologram) do
            binary = binary .. (value > 0 and "1" or "0")
        end
        return self:binaryToNumber(binary)
    end
end

function HolographicMemory:inferDataType(hologram)
    -- Infer original data type from hologram pattern
    local hasPairs = false
    local maxValue = 0

    for i, value in ipairs(hologram) do
        maxValue = math.max(maxValue, math.abs(value))
        if i % 2 == 0 and hologram[i-1] then
            hasPairs = true
        end
    end

    if hasPairs and maxValue > 0.5 then
        return "table"
    elseif maxValue <= 1 then
        return "string"
    else
        return "number"
    end
end

function HolographicMemory:decodeFloatToString(floatValue)
    -- Attempt to reverse hash function (simplified)
    -- This is a limitation of the simplified implementation
    return tostring(floatValue) -- Placeholder
end

function HolographicMemory:binaryToNumber(binary)
    local num = 0
    for i = 1, #binary do
        if binary:sub(i, i) == "1" then
            num = num + 2^(#binary - i)
        end
    end
    return num
end

function HolographicMemory:reduceCrosstalk()
    -- Apply crosstalk cancellation
    local maxInterference = 0
    for _, value in ipairs(self.interferencePattern) do
        maxInterference = math.max(maxInterference, math.abs(value))
    end

    -- Normalize interference pattern
    for i, value in ipairs(self.interferencePattern) do
        self.interferencePattern[i] = value / maxInterference
    end
end

function HolographicMemory:getStorageStats()
    return {
        capacity = self.capacity,
        usedSlots = #self.dataHolograms,
        utilization = #self.dataHolograms / self.capacity,
        interferenceStrength = self:calculateInterferenceStrength(),
        noiseLevel = self:calculateNoiseLevel()
    }
end

function HolographicMemory:calculateInterferenceStrength()
    local total = 0
    for _, value in ipairs(self.interferencePattern) do
        total = total + math.abs(value)
    end
    return total / #self.interferencePattern
end

function HolographicMemory:calculateNoiseLevel()
    local noise = 0
    for _, hologram in pairs(self.dataHolograms) do
        for _, value in ipairs(hologram) do
            if math.abs(value) < self.noiseThreshold then
                noise = noise + 1
            end
        end
    end
    return noise / (#self.dataHolograms * 64) -- Assuming 64-element holograms
end

-- Usage
local holoMemory = HolographicMemory.new(1000)

-- Store different types of data
holoMemory:storeData("player_stats", {health = 100, mana = 50, level = 10})
holoMemory:storeData("game_settings", "difficulty=hard;music=on")
holoMemory:storeData("high_score", 999999)

-- Retrieve data
local playerStats = holoMemory:retrieveData("player_stats")
local settings = holoMemory:retrieveData("game_settings")
local score = holoMemory:retrieveData("high_score")

print("Retrieved player stats:", playerStats and playerStats.health or "nil")
print("Retrieved settings:", settings)
print("Retrieved score:", score)

-- Get storage statistics
local stats = holoMemory:getStorageStats()
print(string.format("Holographic Memory: %.1f%% utilized", stats.utilization * 100))
```

This advanced scripting section showcases cutting-edge techniques available in Roblox 2025, including neural networks, quantum computing, and holographic data structures for sophisticated game AI and data management.

## Networking

### RemoteEvents and RemoteFunctions
Networking in Roblox enables communication between server and clients:

```lua
-- Creating RemoteEvents
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local remoteEvent = Instance.new("RemoteEvent")
remoteEvent.Name = "PlayerAction"
remoteEvent.Parent = ReplicatedStorage

-- Server-side: Firing to all clients
remoteEvent:FireAllClients("ActionPerformed", player.Name, "jump")

-- Server-side: Firing to specific client
remoteEvent:FireClient(player, "PrivateMessage", "Welcome to the game!")

-- Client-side: Listening for events
local remoteEvent = ReplicatedStorage:WaitForChild("PlayerAction")

remoteEvent.OnClientEvent:Connect(function(action, data)
    if action == "ActionPerformed" then
        print(data .. " performed a " .. action)
    elseif action == "PrivateMessage" then
        print("Server says: " .. data)
    end
end)

-- Client-side: Firing to server
local remoteEvent = ReplicatedStorage:WaitForChild("PlayerAction")
remoteEvent:FireServer("RequestAction", "jump")

-- Server-side: Listening for client events
remoteEvent.OnServerEvent:Connect(function(player, action, data)
    if action == "RequestAction" and data == "jump" then
        -- Validate and perform action
        print(player.Name .. " wants to jump")
        -- Fire back to all clients
        remoteEvent:FireAllClients("ActionPerformed", player.Name, data)
    end
end)
```

### RemoteFunctions
RemoteFunctions allow two-way communication with return values:

```lua
-- Creating RemoteFunction
local remoteFunction = Instance.new("RemoteFunction")
remoteFunction.Name = "GetPlayerData"
remoteFunction.Parent = ReplicatedStorage

-- Server-side: Handling function calls
remoteFunction.OnServerInvoke = function(player, requestedPlayer)
    -- Validate request
    if requestedPlayer and game.Players:FindFirstChild(requestedPlayer) then
        local targetPlayer = game.Players[requestedPlayer]
        return {
            Name = targetPlayer.Name,
            Level = targetPlayer:GetAttribute("Level") or 1,
            Score = targetPlayer:GetAttribute("Score") or 0,
            IsOnline = true
        }
    else
        return nil, "Player not found"
    end
end

-- Client-side: Calling the function
local remoteFunction = ReplicatedStorage:WaitForChild("GetPlayerData")

local success, data = pcall(function()
    return remoteFunction:InvokeServer("TargetPlayerName")
end)

if success and data then
    print("Player data:", data.Name, "Level:", data.Level)
else
    print("Failed to get player data:", data)
end
```

### BindableEvents and BindableFunctions
For server-server or client-client communication within the same context:

```lua
-- BindableEvent for internal communication
local bindableEvent = Instance.new("BindableEvent")
bindableEvent.Name = "InternalUpdate"
bindableEvent.Parent = game.ServerScriptService

-- Firing the event
bindableEvent:Fire("UpdateReceived", {key = "value"})

-- Listening to the event
bindableEvent.Event:Connect(function(updateType, data)
    print("Internal update:", updateType, data.key)
end)

-- BindableFunction
local bindableFunction = Instance.new("BindableFunction")
bindableFunction.Name = "CalculateScore"
bindableFunction.Parent = game.ServerScriptService

bindableFunction.OnInvoke = function(player, baseScore, multiplier)
    return baseScore * multiplier + (player:GetAttribute("Bonus") or 0)
end

-- Invoking the function
local result = bindableFunction:Invoke(player, 100, 1.5)
print("Calculated score:", result)
```

### Networking Best Practices
Secure and efficient networking patterns:

```lua
-- Rate Limiting
local RateLimiter = {}
RateLimiter.__index = RateLimiter

function RateLimiter.new(maxRequests, timeWindow)
    return setmetatable({
        requests = {},
        maxRequests = maxRequests,
        timeWindow = timeWindow
    }, RateLimiter)
end

function RateLimiter:CanMakeRequest(player)
    local now = tick()
    local playerRequests = self.requests[player.UserId] or {}

    -- Remove old requests outside the time window
    for i = #playerRequests, 1, -1 do
        if now - playerRequests[i] > self.timeWindow then
            table.remove(playerRequests, i)
        end
    end

    if #playerRequests >= self.maxRequests then
        return false
    end

    table.insert(playerRequests, now)
    self.requests[player.UserId] = playerRequests
    return true
end

-- Usage
local actionLimiter = RateLimiter.new(5, 1)  -- 5 requests per second

remoteEvent.OnServerEvent:Connect(function(player, action)
    if not actionLimiter:CanMakeRequest(player) then
        player:Kick("Rate limit exceeded")
        return
    end
    -- Process action
end)

-- Data Validation
local function validatePlayerAction(actionData)
    local schema = {
        action = "string",
        position = "Vector3",
        target = "Instance"
    }

    for key, expectedType in pairs(schema) do
        local value = actionData[key]
        if value == nil then
            return false, "Missing required field: " .. key
        end

        if expectedType == "Vector3" and typeof(value) ~= "Vector3" then
            return false, "Invalid Vector3 for " .. key
        elseif expectedType == "Instance" and not value:IsA("Instance") then
            return false, "Invalid Instance for " .. key
        elseif type(value) ~= expectedType then
            return false, "Type mismatch for " .. key
        end
    end

    return true
end

-- Server-side validation
remoteEvent.OnServerEvent:Connect(function(player, actionData)
    local valid, errorMsg = validatePlayerAction(actionData)
    if not valid then
        warn("Invalid action data from " .. player.Name .. ": " .. errorMsg)
        return
    end
    -- Process valid action
end)

-- Batch Updates to Reduce Network Traffic
local UpdateBatcher = {}
UpdateBatcher.__index = UpdateBatcher

function UpdateBatcher.new(batchSize, delay)
    return setmetatable({
        pendingUpdates = {},
        batchSize = batchSize or 10,
        delay = delay or 0.1,
        lastBatchTime = 0
    }, UpdateBatcher)
end

function UpdateBatcher:AddUpdate(player, updateData)
    if not self.pendingUpdates[player] then
        self.pendingUpdates[player] = {}
    end
    table.insert(self.pendingUpdates[player], updateData)

    if #self.pendingUpdates[player] >= self.batchSize or tick() - self.lastBatchTime > self.delay then
        self:FlushUpdates(player)
    end
end

function UpdateBatcher:FlushUpdates(player)
    if not self.pendingUpdates[player] or #self.pendingUpdates[player] == 0 then
        return
    end

    local updates = self.pendingUpdates[player]
    self.pendingUpdates[player] = {}

    -- Send batched updates
    remoteEvent:FireClient(player, "BatchUpdate", updates)
    self.lastBatchTime = tick()
end

-- Usage
local batcher = UpdateBatcher.new(5, 0.2)

-- Instead of firing individual updates
batcher:AddUpdate(player, {type = "score", value = 100})
batcher:AddUpdate(player, {type = "health", value = 80})
```

### Advanced Networking Patterns

```lua
-- Event-Driven Architecture
local EventBus = {}
EventBus.__index = EventBus

function EventBus.new()
    return setmetatable({
        listeners = {},
        middlewares = {}
    }, EventBus)
end

function EventBus:Subscribe(eventName, callback)
    if not self.listeners[eventName] then
        self.listeners[eventName] = {}
    end
    table.insert(self.listeners[eventName], callback)
end

function EventBus:AddMiddleware(middleware)
    table.insert(self.middlewares, middleware)
end

function EventBus:Publish(eventName, ...)
    local event = {name = eventName, args = {...}, timestamp = tick()}

    -- Apply middlewares
    for _, middleware in ipairs(self.middlewares) do
        local result = middleware(event)
        if result == false then
            return  -- Middleware blocked the event
        end
    end

    -- Notify listeners
    if self.listeners[eventName] then
        for _, callback in ipairs(self.listeners[eventName]) do
            task.spawn(callback, unpack(event.args))
        end
    end
end

-- Usage
local networkBus = EventBus.new()

-- Add logging middleware
networkBus:AddMiddleware(function(event)
    print("Network event:", event.name, "at", event.timestamp)
end)

-- Subscribe to events
networkBus:Subscribe("PlayerJoined", function(player)
    print(player.Name .. " joined the game")
end)

-- Publish events
networkBus:Publish("PlayerJoined", player)

-- Reliable Messaging System
local ReliableMessenger = {}
ReliableMessenger.__index = ReliableMessenger

function ReliableMessenger.new(remoteEvent, maxRetries, timeout)
    return setmetatable({
        remoteEvent = remoteEvent,
        maxRetries = maxRetries or 3,
        timeout = timeout or 5,
        pendingMessages = {},
        messageId = 0
    }, ReliableMessenger)
end

function ReliableMessenger:SendReliable(player, ...)
    self.messageId = self.messageId + 1
    local messageId = self.messageId
    local args = {...}

    self.pendingMessages[messageId] = {
        player = player,
        args = args,
        retries = 0,
        timestamp = tick()
    }

    self:SendMessage(messageId)
end

function ReliableMessenger:SendMessage(messageId)
    local message = self.pendingMessages[messageId]
    if not message then return end

    message.retries = message.retries + 1
    message.timestamp = tick()

    self.remoteEvent:FireClient(message.player, "ReliableMessage", messageId, unpack(message.args))

    -- Set timeout for acknowledgment
    task.delay(self.timeout, function()
        if self.pendingMessages[messageId] and self.pendingMessages[messageId].retries < self.maxRetries then
            self:SendMessage(messageId)
        elseif self.pendingMessages[messageId] then
            warn("Message " .. messageId .. " failed after " .. self.maxRetries .. " retries")
            self.pendingMessages[messageId] = nil
        end
    end)
end

function ReliableMessenger:Acknowledge(messageId)
    if self.pendingMessages[messageId] then
        self.pendingMessages[messageId] = nil
    end
end

-- Client-side acknowledgment
remoteEvent.OnClientEvent:Connect(function(messageType, messageId, ...)
    if messageType == "ReliableMessage" then
        -- Process message
        print("Received reliable message:", ...)

        -- Send acknowledgment
        remoteEvent:FireServer("Acknowledge", messageId)
    end
end)

-- Server-side handling
remoteEvent.OnServerEvent:Connect(function(player, action, messageId)
    if action == "Acknowledge" then
        reliableMessenger:Acknowledge(messageId)
    end
end)
```

### Security Considerations
Protecting against common exploits:

```lua
-- Input Sanitization
local function sanitizeInput(input)
    if type(input) ~= "string" then return "" end

    -- Remove potentially harmful characters
    input = input:gsub("[<>\"'&]", "")

    -- Limit length
    if #input > 100 then
        input = input:sub(1, 100)
    end

    return input
end

-- Server-side validation for chat messages
remoteEvent.OnServerEvent:Connect(function(player, message)
    message = sanitizeInput(message)

    if message == "" then return end

    -- Additional validation
    if message:find("script") or message:find("loadstring") then
        player:Kick("Suspicious message content")
        return
    end

    -- Broadcast sanitized message
    remoteEvent:FireAllClients("ChatMessage", player.Name, message)
end)

-- Anti-Exploit Measures
local AntiExploit = {}

function AntiExploit.MonitorPlayer(player)
    local character = player.Character or player.CharacterAdded:Wait()

    -- Monitor for unusual movement
    local lastPosition = character.HumanoidRootPart.Position
    local lastCheck = tick()

    while character and character.Parent do
        wait(0.1)
        local currentPosition = character.HumanoidRootPart.Position
        local distance = (currentPosition - lastPosition).Magnitude
        local timeDiff = tick() - lastCheck

        -- Check for speed hacking (adjust threshold as needed)
        if distance / timeDiff > 100 then  -- 100 studs per second
            player:Kick("Speed hacking detected")
            break
        end

        lastPosition = currentPosition
        lastCheck = tick()
    end
end

-- Monitor all players
game.Players.PlayerAdded:Connect(function(player)
    task.spawn(function()
        AntiExploit.MonitorPlayer(player)
    end)
end)

-- Validate Remote Function Calls
local function validateRemoteCall(player, remoteFunction, ...)
    local args = {...}

    -- Check if player has permission
    if remoteFunction == "AdminCommand" and not player:GetAttribute("IsAdmin") then
        return false, "Insufficient permissions"
    end

    -- Validate argument types and ranges
    for i, arg in ipairs(args) do
        if i == 1 and type(arg) ~= "string" then
            return false, "First argument must be a string"
        end
        -- Add more validation as needed
    end

    return true
end

remoteFunction.OnServerInvoke = function(player, ...)
    local valid, errorMsg = validateRemoteCall(player, "SomeFunction", ...)
    if not valid then
        warn("Invalid remote call from " .. player.Name .. ": " .. errorMsg)
        return nil, errorMsg
    end

    -- Process valid call
    return "Success"
end
```

This networking section provides comprehensive coverage of Roblox's networking capabilities, including best practices for security, performance, and reliability.

## DataStores

### Basic DataStore Operations
DataStores provide persistent storage for game data:

```lua
local DataStoreService = game:GetService("DataStoreService")

-- Get a DataStore
local playerDataStore = DataStoreService:GetDataStore("PlayerData")

-- Save player data
local function savePlayerData(player, data)
    local key = "Player_" .. player.UserId
    local success, errorMessage = pcall(function()
        playerDataStore:SetAsync(key, data)
    end)

    if not success then
        warn("Failed to save player data for " .. player.Name .. ": " .. errorMessage)
        return false
    end

    print("Successfully saved data for " .. player.Name)
    return true
end

-- Load player data
local function loadPlayerData(player)
    local key = "Player_" .. player.UserId
    local success, data = pcall(function()
        return playerDataStore:GetAsync(key)
    end)

    if not success then
        warn("Failed to load player data for " .. player.Name .. ": " .. data)
        return nil
    end

    if data then
        print("Loaded existing data for " .. player.Name)
    else
        print("No existing data found for " .. player.Name .. ", using defaults")
        data = getDefaultPlayerData()
    end

    return data
end

-- Default player data
function getDefaultPlayerData()
    return {
        Level = 1,
        Experience = 0,
        Inventory = {},
        Achievements = {},
        LastLogin = os.time(),
        PlayTime = 0
    }
end

-- Usage in game
game.Players.PlayerAdded:Connect(function(player)
    local data = loadPlayerData(player)
    if data then
        -- Apply loaded data to player
        player:SetAttribute("Level", data.Level)
        player:SetAttribute("Experience", data.Experience)
        -- etc.
    end
end)

game.Players.PlayerRemoving:Connect(function(player)
    local data = {
        Level = player:GetAttribute("Level") or 1,
        Experience = player:GetAttribute("Experience") or 0,
        Inventory = player:GetAttribute("Inventory") or {},
        Achievements = player:GetAttribute("Achievements") or {},
        LastLogin = os.time(),
        PlayTime = (player:GetAttribute("PlayTime") or 0) + (os.time() - (player:GetAttribute("JoinTime") or os.time()))
    }

    savePlayerData(player, data)
end)
```

### OrderedDataStore for Leaderboards
OrderedDataStores maintain sorted data for rankings:

```lua
local orderedDataStore = DataStoreService:GetOrderedDataStore("PlayerScores")

-- Update player score
local function updatePlayerScore(player, score)
    local key = "Player_" .. player.UserId
    local success, errorMessage = pcall(function()
        orderedDataStore:SetAsync(key, score)
    end)

    if not success then
        warn("Failed to update score for " .. player.Name .. ": " .. errorMessage)
    else
        print("Updated score for " .. player.Name .. " to " .. score)
    end
end

-- Get top scores
local function getTopScores(limit)
    limit = limit or 10
    local success, pages = pcall(function()
        return orderedDataStore:GetSortedAsync(false, limit)
    end)

    if not success then
        warn("Failed to get top scores: " .. pages)
        return {}
    end

    local topScores = {}
    local page = pages:GetCurrentPage()

    for rank, data in ipairs(page) do
        table.insert(topScores, {
            Rank = rank,
            UserId = data.key:gsub("Player_", ""),
            Score = data.value
        })
    end

    return topScores
end

-- Display leaderboard
local function displayLeaderboard()
    local topScores = getTopScores(10)
    for _, entry in ipairs(topScores) do
        local playerName = game.Players:GetNameFromUserIdAsync(entry.UserId)
        print(entry.Rank .. ". " .. playerName .. " - " .. entry.Score)
    end
end
```

### DataStore2 for Reliable Saving
Using the popular DataStore2 library for better reliability:

```lua
-- Note: This requires the DataStore2 module
local DataStore2 = require(game.ServerScriptService.DataStore2)

-- Combine with ProfileService for session locking
local ProfileService = require(game.ServerScriptService.ProfileService)

local profileStore = ProfileService.GetProfileStore("PlayerProfiles", getDefaultPlayerData())

-- Load profile
local function loadProfile(player)
    local profile = profileStore:LoadProfileAsync("Player_" .. player.UserId)

    if profile then
        profile:AddUserId(player.UserId)
        profile:Reconcile()  -- Fill in missing data with defaults

        profile:SetMetaTag("LastLogin", os.time())

        return profile
    else
        player:Kick("Data loading failed, please rejoin")
        return nil
    end
end

-- Save profile
local function saveProfile(profile)
    profile:Save()
end

-- Handle player sessions
local profiles = {}

game.Players.PlayerAdded:Connect(function(player)
    local profile = loadProfile(player)
    if profile then
        profiles[player] = profile
        -- Apply profile data to player
    end
end)

game.Players.PlayerRemoving:Connect(function(player)
    local profile = profiles[player]
    if profile then
        profile:Save()
        profiles[player] = nil
    end
end)

-- Auto-save profiles periodically
task.spawn(function()
    while true do
        task.wait(300)  -- Save every 5 minutes
        for player, profile in pairs(profiles) do
            if player:IsDescendantOf(game.Players) then
                profile:Save()
            end
        end
    end
end)
```

### Advanced Data Management

```lua
-- Data versioning and migration
local DataManager = {}
DataManager.__index = DataManager

function DataManager.new(dataStoreName)
    return setmetatable({
        dataStore = DataStoreService:GetDataStore(dataStoreName),
        currentVersion = 2
    }, DataManager)
end

function DataManager:LoadData(key)
    local success, data = pcall(function()
        return self.dataStore:GetAsync(key)
    end)

    if not success then
        warn("Failed to load data for key " .. key .. ": " .. data)
        return nil
    end

    if not data then
        return self:GetDefaultData()
    end

    -- Migrate data if necessary
    data = self:MigrateData(data)

    return data
end

function DataManager:SaveData(key, data)
    -- Update version
    data._version = self.currentVersion

    local success, errorMessage = pcall(function()
        self.dataStore:SetAsync(key, data)
    end)

    if not success then
        warn("Failed to save data for key " .. key .. ": " .. errorMessage)
        return false
    end

    return true
end

function DataManager:MigrateData(data)
    local version = data._version or 1

    if version < 2 then
        -- Migration from v1 to v2
        data.NewField = data.OldField or "default"
        data.OldField = nil
        print("Migrated data from version " .. version .. " to 2")
    end

    -- Add more migrations as needed

    data._version = self.currentVersion
    return data
end

function DataManager:GetDefaultData()
    return {
        _version = self.currentVersion,
        Level = 1,
        Experience = 0,
        Inventory = {},
        Settings = {
            MusicVolume = 0.5,
            SFXVolume = 0.7
        }
    }
end

-- Usage
local dataManager = DataManager.new("PlayerData_v2")

local playerData = dataManager:LoadData("Player_12345")
-- Modify data
playerData.Level = playerData.Level + 1
dataManager:SaveData("Player_12345", playerData)
```

### DataStore Best Practices

```lua
-- Retry logic with exponential backoff
local function retryOperation(operation, maxRetries, baseDelay)
    maxRetries = maxRetries or 5
    baseDelay = baseDelay or 1

    for attempt = 1, maxRetries do
        local success, result = pcall(operation)

        if success then
            return result
        end

        if attempt < maxRetries then
            local delay = baseDelay * (2 ^ (attempt - 1))
            warn("Operation failed (attempt " .. attempt .. "): " .. result)
            warn("Retrying in " .. delay .. " seconds...")
            task.wait(delay)
        else
            error("Operation failed after " .. maxRetries .. " attempts: " .. result)
        end
    end
end

-- Safe data saving with retry
local function safeSave(dataStore, key, data)
    return retryOperation(function()
        return dataStore:SetAsync(key, data)
    end)
end

-- Data compression for large datasets
local HttpService = game:GetService("HttpService")

local function compressData(data)
    local jsonData = HttpService:JSONEncode(data)
    -- Note: Roblox doesn't have built-in compression, but you can implement simple compression
    return jsonData  -- In a real implementation, you'd compress here
end

local function decompressData(compressedData)
    return HttpService:JSONDecode(compressedData)
end

-- Chunking large data
local function saveLargeData(dataStore, key, data, chunkSize)
    chunkSize = chunkSize or 4000  -- Approximate max size per chunk

    local jsonData = HttpService:JSONEncode(data)
    local chunks = {}

    for i = 1, #jsonData, chunkSize do
        local chunk = jsonData:sub(i, i + chunkSize - 1)
        table.insert(chunks, chunk)
    end

    -- Save metadata
    dataStore:SetAsync(key .. "_metadata", {
        totalChunks = #chunks,
        originalSize = #jsonData
    })

    -- Save chunks
    for i, chunk in ipairs(chunks) do
        dataStore:SetAsync(key .. "_chunk_" .. i, chunk)
    end
end

local function loadLargeData(dataStore, key)
    local metadata = dataStore:GetAsync(key .. "_metadata")
    if not metadata then return nil end

    local chunks = {}
    for i = 1, metadata.totalChunks do
        local chunk = dataStore:GetAsync(key .. "_chunk_" .. i)
        if not chunk then return nil end
        table.insert(chunks, chunk)
    end

    local jsonData = table.concat(chunks)
    return HttpService:JSONDecode(jsonData)
end

-- Data validation
local function validatePlayerData(data)
    local schema = {
        Level = {type = "number", min = 1, max = 100},
        Experience = {type = "number", min = 0},
        Inventory = {type = "table"},
        LastLogin = {type = "number"}
    }

    for field, rules in pairs(schema) do
        local value = data[field]
        if value == nil then
            return false, "Missing required field: " .. field
        end

        if type(value) ~= rules.type then
            return false, "Invalid type for " .. field .. ": expected " .. rules.type .. ", got " .. type(value)
        end

        if rules.min and value < rules.min then
            return false, "Value too low for " .. field .. ": " .. value
        end

        if rules.max and value > rules.max then
            return false, "Value too high for " .. field .. ": " .. value
        end
    end

    return true
end

-- Safe loading with validation
local function safeLoadPlayerData(dataStore, key)
    local data = retryOperation(function()
        return dataStore:GetAsync(key)
    end)

    if not data then
        return getDefaultPlayerData()
    end

    local valid, errorMsg = validatePlayerData(data)
    if not valid then
        warn("Invalid data loaded for key " .. key .. ": " .. errorMsg)
        return getDefaultPlayerData()
    end

    return data
end
```

### Global Data and Cross-Server Communication

```lua
-- Global game statistics
local globalStatsStore = DataStoreService:GetDataStore("GlobalStats")

local function updateGlobalStat(statName, increment)
    local success, currentValue = pcall(function()
        return globalStatsStore:GetAsync(statName) or 0
    end)

    if not success then
        warn("Failed to get global stat " .. statName)
        return
    end

    local newValue = currentValue + increment

    success = pcall(function()
        globalStatsStore:SetAsync(statName, newValue)
    end)

    if not success then
        warn("Failed to update global stat " .. statName)
    end

    return newValue
end

-- Cross-server messaging using DataStore
local CrossServerMessenger = {}
CrossServerMessenger.__index = CrossServerMessenger

function CrossServerMessenger.new(channelName)
    return setmetatable({
        dataStore = DataStoreService:GetDataStore("CrossServer_" .. channelName),
        messageId = 0,
        listeners = {}
    }, CrossServerMessenger)
end

function CrossServerMessenger:SendMessage(message, targetServerId)
    self.messageId = self.messageId + 1
    local messageData = {
        id = self.messageId,
        content = message,
        timestamp = os.time(),
        sourceServer = game.JobId,
        targetServer = targetServerId
    }

    local key = "message_" .. self.messageId
    local success, errorMessage = pcall(function()
        self.dataStore:SetAsync(key, messageData)
    end)

    if not success then
        warn("Failed to send cross-server message: " .. errorMessage)
    end

    return success
end

function CrossServerMessenger:CheckForMessages()
    -- This would typically run in a loop
    local success, pages = pcall(function()
        return self.dataStore:GetSortedAsync(false, 10)  -- Get latest messages
    end)

    if not success then
        warn("Failed to check for messages: " .. pages)
        return
    end

    local page = pages:GetCurrentPage()
    for _, data in ipairs(page) do
        local message = data.value
        if message.targetServer == game.JobId or message.targetServer == nil then
            -- Process message
            self:ProcessMessage(message)
            -- Mark as processed (optional)
            self.dataStore:RemoveAsync(data.key)
        end
    end
end

function CrossServerMessenger:ProcessMessage(message)
    for _, callback in ipairs(self.listeners) do
        task.spawn(callback, message.content, message.sourceServer)
    end
end

function CrossServerMessenger:AddListener(callback)
    table.insert(self.listeners, callback)
end

-- Usage
local messenger = CrossServerMessenger.new("GameEvents")

messenger:AddListener(function(content, sourceServer)
    print("Received message from server " .. sourceServer .. ": " .. content)
end)

-- Check for messages periodically
task.spawn(function()
    while true do
        messenger:CheckForMessages()
        task.wait(1)  -- Check every second
    end
end)
```

This DataStores section covers comprehensive data persistence strategies, from basic operations to advanced patterns for reliability and scalability.

## Physics

### BasePart Properties and Physics
Core physics properties for parts:

```lua
-- Basic Physics Properties
local part = Instance.new("Part")
part.Anchored = false                    -- Allow physics simulation
part.CanCollide = true                  -- Enable collisions
part.Massless = false                   -- Use calculated mass
part.Density = 0.7                      -- Material density (affects mass)

-- Material Properties
part.Material = Enum.Material.Plastic   -- Plastic, Wood, Metal, etc.
part.CustomPhysicalProperties = PhysicalProperties.new(
    0.7,    -- Density
    0.5,    -- Friction
    0.2,    -- Elasticity
    100,    -- FrictionWeight
    100     -- ElasticityWeight
)

-- Movement and Forces
part.AssemblyLinearVelocity = Vector3.new(0, 10, 0)  -- Instant velocity
part.AssemblyAngularVelocity = Vector3.new(0, 5, 0)  -- Rotational velocity

-- Forces and Torques
local force = Vector3.new(0, 1000, 0)   -- 1000 studs upward force
part:ApplyImpulse(force)                -- Instant impulse
part:ApplyAngularImpulse(Vector3.new(0, 100, 0))  -- Rotational impulse

-- Continuous forces
local bodyForce = Instance.new("BodyForce")
bodyForce.Force = Vector3.new(0, part:GetMass() * workspace.Gravity, 0)  -- Counter gravity
bodyForce.Parent = part

local bodyGyro = Instance.new("BodyGyro")
bodyGyro.MaxTorque = Vector3.new(4000, 4000, 4000)
bodyGyro.CFrame = CFrame.new(part.Position, targetPosition)
bodyGyro.Parent = part
```

### Constraints
Roblox's constraint system for advanced physics:

```lua
-- BallSocketConstraint - Free rotation around a point
local ballSocket = Instance.new("BallSocketConstraint")
ballSocket.Attachment0 = part1:FindFirstChild("Attachment")
ballSocket.Attachment1 = part2:FindFirstChild("Attachment")
ballSocket.LimitsEnabled = true
ballSocket.TwistLimitsEnabled = true
ballSocket.UpperAngle = 45
ballSocket.TwistUpperAngle = 30
ballSocket.TwistLowerAngle = -30
ballSocket.Parent = part1

-- HingeConstraint - Rotation around one axis
local hinge = Instance.new("HingeConstraint")
hinge.Attachment0 = door:FindFirstChild("HingeAttachment")
hinge.Attachment1 = frame:FindFirstChild("HingeAttachment")
hinge.LimitsEnabled = true
hinge.LowerAngle = -90
hinge.UpperAngle = 90
hinge.MotorMaxTorque = 1000
hinge.AngularSpeed = 5
hinge.Parent = door

-- PrismaticConstraint - Linear motion along one axis
local prismatic = Instance.new("PrismaticConstraint")
prismatic.Attachment0 = platform:FindFirstChild("RailAttachment")
prismatic.Attachment1 = rail:FindFirstChild("PlatformAttachment")
prismatic.LimitsEnabled = true
prismatic.LowerLimit = 0
prismatic.UpperLimit = 50
prismatic.MotorMaxForce = 5000
prismatic.Speed = 10
prismatic.Parent = platform

-- SpringConstraint - Spring-like connection
local spring = Instance.new("SpringConstraint")
spring.Attachment0 = part1:FindFirstChild("SpringAttachment")
spring.Attachment1 = part2:FindFirstChild("SpringAttachment")
spring.Stiffness = 1000
spring.Damping = 100
spring.FreeLength = 10
spring.MaxForce = 10000
spring.Parent = part1

-- RopeConstraint - Maximum distance constraint
local rope = Instance.new("RopeConstraint")
rope.Attachment0 = part1:FindFirstChild("RopeAttachment")
rope.Attachment1 = part2:FindFirstChild("RopeAttachment")
rope.Length = 20
rope.Restitution = 0.5  -- Bounciness when at max length
rope.Parent = part1

-- CylindricalConstraint - Rotation and sliding
local cylindrical = Instance.new("CylindricalConstraint")
cylindrical.Attachment0 = piston:FindFirstChild("CylinderAttachment")
cylindrical.Attachment1 = cylinder:FindFirstChild("PistonAttachment")
cylindrical.LimitsEnabled = true
cylindrical.LowerLimit = -5
cylindrical.UpperAngle = 5
cylindrical.MotorMaxTorque = 2000
cylindrical.MotorMaxForce = 5000
cylindrical.Parent = piston

-- UniversalConstraint - Two-axis rotation
local universal = Instance.new("UniversalConstraint")
universal.Attachment0 = part1:FindFirstChild("UniversalAttachment")
universal.Attachment1 = part2:FindFirstChild("UniversalAttachment")
universal.LimitsEnabled = true
universal.MaxAngle = 45
universal.Parent = part1

-- WeldConstraint - Rigid connection
local weld = Instance.new("WeldConstraint")
weld.Part0 = part1
weld.Part1 = part2
weld.Parent = part1

-- NoCollisionConstraint - Prevent collisions between parts
local noCollision = Instance.new("NoCollisionConstraint")
noCollision.Part0 = part1
noCollision.Part1 = part2
noCollision.Parent = part1
```

### Raycasting
Detecting collisions and intersections:

```lua
-- Basic Raycast
local origin = Vector3.new(0, 10, 0)
local direction = Vector3.new(0, -20, 0)
local raycastParams = RaycastParams.new()

raycastParams.FilterDescendantsInstances = {character}  -- Ignore character
raycastParams.FilterType = Enum.RaycastFilterType.Blacklist
raycastParams.IgnoreWater = true

local raycastResult = workspace:Raycast(origin, direction, raycastParams)

if raycastResult then
    print("Hit:", raycastResult.Instance.Name)
    print("Position:", raycastResult.Position)
    print("Normal:", raycastResult.Normal)
    print("Material:", raycastResult.Material)
    print("Distance:", raycastResult.Distance)
end

-- Advanced Raycasting Functions
local function raycast(origin, direction, params)
    return workspace:Raycast(origin, direction, params)
end

local function sphereCast(origin, radius, direction, maxDistance, params)
    -- Simulate sphere casting with multiple rays
    local hits = {}
    local numRays = 8

    for i = 1, numRays do
        local angle = (i / numRays) * 2 * math.pi
        local offset = Vector3.new(math.cos(angle) * radius, 0, math.sin(angle) * radius)
        local rayOrigin = origin + offset
        local result = raycast(rayOrigin, direction, params)
        if result and result.Distance <= maxDistance then
            table.insert(hits, result)
        end
    end

    -- Return closest hit
    table.sort(hits, function(a, b) return a.Distance < b.Distance end)
    return hits[1]
end

local function boxCast(center, size, direction, params)
    -- Simulate box casting
    local halfSize = size / 2
    local corners = {
        center + Vector3.new(-halfSize.X, -halfSize.Y, -halfSize.Z),
        center + Vector3.new(halfSize.X, -halfSize.Y, -halfSize.Z),
        center + Vector3.new(-halfSize.X, halfSize.Y, -halfSize.Z),
        center + Vector3.new(halfSize.X, halfSize.Y, -halfSize.Z),
        center + Vector3.new(-halfSize.X, -halfSize.Y, halfSize.Z),
        center + Vector3.new(halfSize.X, -halfSize.Y, halfSize.Z),
        center + Vector3.new(-halfSize.X, halfSize.Y, halfSize.Z),
        center + Vector3.new(halfSize.X, halfSize.Y, halfSize.Z)
    }

    local hits = {}
    for _, corner in ipairs(corners) do
        local result = raycast(corner, direction, params)
        if result then
            table.insert(hits, result)
        end
    end

    table.sort(hits, function(a, b) return a.Distance < b.Distance end)
    return hits[1]
end

-- Usage
local params = RaycastParams.new()
params.FilterType = Enum.RaycastFilterType.Whitelist
params.FilterDescendantsInstances = {workspace.Baseplate}

local sphereHit = sphereCast(Vector3.new(0, 5, 0), 2, Vector3.new(0, -10, 0), 20, params)
if sphereHit then
    print("Sphere cast hit:", sphereHit.Instance.Name)
end
```

### Advanced Physics Simulation

```lua
-- Custom Physics Engine Integration
local PhysicsEngine = {}
PhysicsEngine.__index = PhysicsEngine

function PhysicsEngine.new()
    return setmetatable({
        objects = {},
        gravity = Vector3.new(0, -workspace.Gravity, 0),
        timeStep = 1/60
    }, PhysicsEngine)
end

function PhysicsEngine:AddObject(part, properties)
    local obj = {
        part = part,
        velocity = properties.velocity or Vector3.zero,
        acceleration = properties.acceleration or Vector3.zero,
        mass = properties.mass or part:GetMass(),
        drag = properties.drag or 0.1,
        bounciness = properties.bounciness or 0.5
    }
    table.insert(self.objects, obj)
    return obj
end

function PhysicsEngine:Update()
    for _, obj in ipairs(self.objects) do
        if not obj.part.Anchored then
            -- Apply gravity
            obj.acceleration = self.gravity

            -- Apply drag
            obj.acceleration = obj.acceleration - obj.velocity * obj.drag

            -- Integrate velocity
            obj.velocity = obj.velocity + obj.acceleration * self.timeStep

            -- Integrate position
            local newPosition = obj.part.Position + obj.velocity * self.timeStep

            -- Check for collisions
            local raycastResult = workspace:Raycast(obj.part.Position, newPosition - obj.part.Position)
            if raycastResult then
                -- Handle collision
                newPosition = raycastResult.Position
                obj.velocity = obj.velocity - 2 * obj.velocity:Dot(raycastResult.Normal) * raycastResult.Normal * obj.bounciness
            end

            obj.part.Position = newPosition
        end
    end
end

function PhysicsEngine:Start()
    task.spawn(function()
        while true do
            self:Update()
            task.wait(self.timeStep)
        end
    end)
end

-- Usage
local engine = PhysicsEngine.new()
local ball = engine:AddObject(workspace.Ball, {
    velocity = Vector3.new(10, 20, 0),
    drag = 0.05,
    bounciness = 0.8
})
engine:Start()

-- Vehicle Physics
local VehiclePhysics = {}
VehiclePhysics.__index = VehiclePhysics

function VehiclePhysics.new(vehicleModel)
    local self = setmetatable({}, VehiclePhysics)

    self.model = vehicleModel
    self.body = vehicleModel.Body
    self.wheels = {}

    -- Find wheels
    for _, part in ipairs(vehicleModel:GetChildren()) do
        if part.Name:find("Wheel") then
            table.insert(self.wheels, part)
        end
    end

    self.engineForce = 5000
    self.brakeForce = 3000
    self.steeringAngle = 30
    self.maxSpeed = 50

    return self
end

function VehiclePhysics:ApplyEngineForce(force)
    local forward = self.body.CFrame.LookVector
    self.body:ApplyImpulse(forward * force)
end

function VehiclePhysics:ApplySteering(angle)
    for _, wheel in ipairs(self.wheels) do
        if wheel.Name:find("Front") then
            wheel.CFrame = self.body.CFrame * CFrame.Angles(0, math.rad(angle), 0)
        end
    end
end

function VehiclePhysics:ApplyBrakes()
    local velocity = self.body.AssemblyLinearVelocity
    local brakeImpulse = -velocity.Unit * self.brakeForce * self.body:GetMass()
    self.body:ApplyImpulse(brakeImpulse)
end

function VehiclePhysics:Update()
    -- Limit speed
    local speed = self.body.AssemblyLinearVelocity.Magnitude
    if speed > self.maxSpeed then
        self.body.AssemblyLinearVelocity = self.body.AssemblyLinearVelocity.Unit * self.maxSpeed
    end

    -- Apply rolling resistance
    local rollingResistance = -self.body.AssemblyLinearVelocity * 0.1
    self.body:ApplyImpulse(rollingResistance)
end

-- Ragdoll Physics
local RagdollSystem = {}
RagdollSystem.__index = RagdollSystem

function RagdollSystem.new(character)
    local self = setmetatable({}, RagdollSystem)

    self.character = character
    self.originalParts = {}
    self.constraints = {}

    -- Store original properties
    for _, part in ipairs(character:GetChildren()) do
        if part:IsA("BasePart") then
            self.originalParts[part] = {
                Anchored = part.Anchored,
                CanCollide = part.CanCollide
            }
        end
    end

    return self
end

function RagdollSystem:Enable()
    -- Disable character controller
    local humanoid = self.character:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.PlatformStand = true
    end

    -- Make parts physical
    for part, original in pairs(self.originalParts) do
        part.Anchored = false
        part.CanCollide = true
    end

    -- Add ragdoll constraints
    self:AddRagdollConstraints()
end

function RagdollSystem:Disable()
    -- Remove constraints
    for _, constraint in ipairs(self.constraints) do
        constraint:Destroy()
    end
    self.constraints = {}

    -- Restore original properties
    for part, original in pairs(self.originalParts) do
        part.Anchored = original.Anchored
        part.CanCollide = original.CanCollide
    end

    -- Re-enable character controller
    local humanoid = self.character:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.PlatformStand = false
    end
end

function RagdollSystem:AddRagdollConstraints()
    local parts = self.character:GetChildren()

    -- Head to Torso
    local head = self.character:FindFirstChild("Head")
    local torso = self.character:FindFirstChild("Torso") or self.character:FindFirstChild("UpperTorso")

    if head and torso then
        local ballSocket = Instance.new("BallSocketConstraint")
        ballSocket.Attachment0 = self:GetAttachment(head, "NeckAttachment")
        ballSocket.Attachment1 = self:GetAttachment(torso, "NeckAttachment")
        ballSocket.LimitsEnabled = true
        ballSocket.UpperAngle = 45
        ballSocket.Parent = head
        table.insert(self.constraints, ballSocket)
    end

    -- Add more constraints for limbs...
end

function RagdollSystem:GetAttachment(part, name)
    local attachment = part:FindFirstChild(name)
    if not attachment then
        attachment = Instance.new("Attachment")
        attachment.Name = name
        attachment.Parent = part
    end
    return attachment
end

-- Usage
local ragdoll = RagdollSystem.new(character)
ragdoll:Enable()
task.wait(5)
ragdoll:Disable()
```

### Physics Optimization

```lua
-- Streaming Enabled for Large Worlds
workspace.StreamingEnabled = true
workspace.StreamingTargetRadius = 1000
workspace.StreamingBehavior = Enum.StreamingBehavior.Default

-- Physics Optimization Settings
local PhysicsSettings = game:GetService("PhysicsSettings")

PhysicsSettings.AllowSleep = true          -- Let stationary parts sleep
PhysicsSettings.AreAnchorsShown = false    -- Hide anchor indicators
PhysicsSettings.AreAssembliesShown = false -- Hide assembly indicators
PhysicsSettings.AreAwakePartsHighlighted = false
PhysicsSettings.AreBodyMoversShown = false
PhysicsSettings.AreContactIslandsShown = false
PhysicsSettings.AreContactPointsShown = false
PhysicsSettings.AreJointCoordinatesShown = false
PhysicsSettings.AreMechanismsShown = false
PhysicsSettings.AreModelCoordsShown = false
PhysicsSettings.AreOwnersShown = false
PhysicsSettings.ArePartCoordsShown = false
PhysicsSettings.AreRegionsShown = false
PhysicsSettings.AreTerrainReplicationRegionsShown = false
PhysicsSettings.AreTimestepsShown = false
PhysicsSettings.AreUnalignedPartsShown = false
PhysicsSettings.AreWorldCoordsShown = false
PhysicsSettings.DisableCSGv2 = false
PhysicsSettings.IsInterpolationThrottleShown = false
PhysicsSettings.IsReceiveAgeShown = false
PhysicsSettings.IsTreeShown = false
PhysicsSettings.ShowDecompositionGeometry = false
PhysicsSettings.ThrottleAdjustTime = 0.5
PhysicsSettings.UseCSGv2 = true

-- Network Ownership for Multiplayer Physics
local function setNetworkOwner(part, player)
    if part:IsA("BasePart") then
        part:SetNetworkOwner(player)
    end
end

-- Set ownership for player-specific objects
character.ChildAdded:Connect(function(child)
    if child:IsA("BasePart") then
        setNetworkOwner(child, player)
    end
end)

-- Physics Quality Settings
local function setPhysicsQuality(quality)
    if quality == "Low" then
        PhysicsSettings.PhysicsEnvironmentalThrottle = Enum.EnviromentalPhysicsThrottle.Disabled
        workspace.Gravity = 196.2 * 0.5  -- Reduced gravity
    elseif quality == "High" then
        PhysicsSettings.PhysicsEnvironmentalThrottle = Enum.EnviromentalPhysicsThrottle.Default
        workspace.Gravity = 196.2
    end
end

-- Adaptive Physics Based on Performance
local lastUpdate = tick()
local frameCount = 0

game:GetService("RunService").Heartbeat:Connect(function()
    frameCount = frameCount + 1

    if tick() - lastUpdate >= 1 then
        local fps = frameCount / (tick() - lastUpdate)

        if fps < 30 then
            setPhysicsQuality("Low")
        elseif fps > 50 then
            setPhysicsQuality("High")
        end

        frameCount = 0
        lastUpdate = tick()
    end
end)
```

This physics section covers comprehensive physics simulation, from basic properties to advanced constraints, raycasting, and optimization techniques for high-performance games.

## Terrain and Environment

### Terrain Generation and Editing
Creating and modifying terrain programmatically:

```lua
local Terrain = workspace.Terrain

-- Basic Terrain Operations
Terrain:Clear()  -- Clear all terrain

-- Set terrain material at position
local position = Vector3.new(0, 0, 0)
local size = Vector3.new(10, 10, 10)
Terrain:FillBlock(CFrame.new(position), size, Enum.Material.Grass)

-- Fill with different materials
Terrain:FillCylinder(CFrame.new(50, 0, 0), 20, 10, Enum.Material.Rock)
Terrain:FillBall(Vector3.new(0, 10, 50), 15, Enum.Material.Snow)

-- Read terrain data
local region = Region3.new(Vector3.new(-100, -100, -100), Vector3.new(100, 100, 100))
local material, occupancy = Terrain:ReadVoxels(region, 4)  -- 4x4x4 resolution

-- Modify terrain voxels
local newMaterial = {}
local newOccupancy = {}

for x = 1, #material do
    newMaterial[x] = {}
    newOccupancy[x] = {}
    for y = 1, #material[x] do
        newMaterial[x][y] = {}
        newOccupancy[x][y] = {}
        for z = 1, #material[x][y] do
            -- Create a sphere of rock
            local distance = math.sqrt((x-25)^2 + (y-25)^2 + (z-25)^2)
            if distance <= 20 then
                newMaterial[x][y][z] = Enum.Material.Rock
                newOccupancy[x][y][z] = 1
            else
                newMaterial[x][y][z] = Enum.Material.Air
                newOccupancy[x][y][z] = 0
            end
        end
    end
end

Terrain:WriteVoxels(region, 4, newMaterial, newOccupancy)

-- Terrain decoration
local function addDecoration(position, decorationType)
    if decorationType == "tree" then
        local tree = Instance.new("Model")
        tree.Name = "Tree"

        local trunk = Instance.new("Part")
        trunk.Size = Vector3.new(2, 20, 2)
        trunk.Position = position + Vector3.new(0, 10, 0)
        trunk.Anchored = true
        trunk.BrickColor = BrickColor.new("Brown")
        trunk.Parent = tree

        local leaves = Instance.new("Part")
        leaves.Size = Vector3.new(10, 10, 10)
        leaves.Position = position + Vector3.new(0, 20, 0)
        leaves.Anchored = true
        leaves.BrickColor = BrickColor.new("Green")
        leaves.Shape = Enum.PartType.Ball
        leaves.Parent = tree

        tree.Parent = workspace
    end
end

-- Procedural terrain generation
local function generateTerrain(width, height, seed)
    math.randomseed(seed)

    for x = 0, width - 1 do
        for z = 0, height - 1 do
            local noise = math.noise(x * 0.1, z * 0.1) * 10
            local y = math.floor(noise + 20)  -- Base height of 20

            -- Create terrain column
            Terrain:FillBlock(
                CFrame.new(x * 4, y * 4 - 2, z * 4),
                Vector3.new(4, y * 4, 4),
                Enum.Material.Grass
            )

            -- Add decorations randomly
            if math.random() < 0.05 and y > 15 then  -- 5% chance for trees
                addDecoration(Vector3.new(x * 4, y * 4 + 2, z * 4), "tree")
            end
        end
    end
end

generateTerrain(50, 50, 12345)
```

### Advanced Terrain Tools

```lua
-- Terrain smoothing and erosion
local function smoothTerrain(region, iterations)
    for _ = 1, iterations do
        local material, occupancy = Terrain:ReadVoxels(region, 4)

        local smoothedMaterial = {}
        local smoothedOccupancy = {}

        for x = 1, #material do
            smoothedMaterial[x] = {}
            smoothedOccupancy[x] = {}
            for y = 1, #material[x] do
                smoothedMaterial[x][y] = {}
                smoothedOccupancy[x][y] = {}
                for z = 1, #material[x][y] do
                    -- Average with neighbors
                    local sum = occupancy[x][y][z]
                    local count = 1

                    for dx = -1, 1 do
                        for dy = -1, 1 do
                            for dz = -1, 1 do
                                local nx, ny, nz = x + dx, y + dy, z + dz
                                if material[nx] and material[nx][ny] and material[nx][ny][nz] then
                                    sum = sum + occupancy[nx][ny][nz]
                                    count = count + 1
                                end
                            end
                        end
                    end

                    smoothedOccupancy[x][y][z] = sum / count
                    smoothedMaterial[x][y][z] = material[x][y][z]
                end
            end
        end

        Terrain:WriteVoxels(region, 4, smoothedMaterial, smoothedOccupancy)
    end
end

-- Terrain carving tools
local function carveTunnel(startPos, endPos, radius)
    local direction = (endPos - startPos).Unit
    local distance = (endPos - startPos).Magnitude
    local steps = math.ceil(distance / 4)

    for i = 0, steps do
        local pos = startPos + direction * (i * 4)
        Terrain:FillBall(pos, radius, Enum.Material.Air)
    end
end

-- Terrain painting
local function paintTerrain(position, radius, material)
    local region = Region3.new(
        position - Vector3.new(radius, radius, radius),
        position + Vector3.new(radius, radius, radius)
    )

    local mat, occ = Terrain:ReadVoxels(region, 4)

    for x = 1, #mat do
        for y = 1, #mat[x] do
            for z = 1, #mat[x][y] do
                local voxelPos = region.CFrame.Position +
                    Vector3.new((x-1) * 4, (y-1) * 4, (z-1) * 4) -
                    region.Size / 2

                if (voxelPos - position).Magnitude <= radius then
                    mat[x][y][z] = material
                end
            end
        end
    end

    Terrain:WriteVoxels(region, 4, mat, occ)
end

-- Terrain analysis
local function analyzeTerrain(region)
    local material, occupancy = Terrain:ReadVoxels(region, 4)

    local stats = {
        totalVoxels = 0,
        materialCounts = {},
        averageHeight = 0,
        heightSamples = 0
    }

    for x = 1, #material do
        for z = 1, #material[x][1] do
            local maxHeight = 0
            for y = 1, #material[x] do
                if occupancy[x][y][z] > 0 then
                    maxHeight = y
                    stats.totalVoxels = stats.totalVoxels + 1

                    local mat = material[x][y][z]
                    stats.materialCounts[mat] = (stats.materialCounts[mat] or 0) + 1
                end
            end

            if maxHeight > 0 then
                stats.averageHeight = stats.averageHeight + maxHeight
                stats.heightSamples = stats.heightSamples + 1
            end
        end
    end

    if stats.heightSamples > 0 then
        stats.averageHeight = stats.averageHeight / stats.heightSamples
    end

    return stats
end
```

### Lighting and Atmosphere

```lua
local Lighting = game:GetService("Lighting")

-- Basic lighting setup
Lighting.Brightness = 1
Lighting.GlobalShadows = true
Lighting.OutdoorAmbient = Color3.new(0.5, 0.5, 0.5)
Lighting.Ambient = Color3.new(0.3, 0.3, 0.3)

-- Time of day simulation
local function setTimeOfDay(hour)
    local timeFraction = hour / 24

    -- Sun position
    local sunAngle = (timeFraction - 0.5) * math.pi
    Lighting:SetSunPosition(Vector3.new(math.cos(sunAngle), math.sin(sunAngle), 0))

    -- Brightness based on time
    if hour >= 6 and hour <= 18 then
        Lighting.Brightness = 1
        Lighting.GlobalShadows = true
    else
        Lighting.Brightness = 0.3
        Lighting.GlobalShadows = false
    end

    -- Ambient colors
    if hour >= 6 and hour < 12 then  -- Morning
        Lighting.OutdoorAmbient = Color3.new(1, 0.8, 0.6)
    elseif hour >= 12 and hour < 18 then  -- Afternoon
        Lighting.OutdoorAmbient = Color3.new(1, 1, 1)
    elseif hour >= 18 and hour < 21 then  -- Evening
        Lighting.OutdoorAmbient = Color3.new(1, 0.6, 0.3)
    else  -- Night
        Lighting.OutdoorAmbient = Color3.new(0.2, 0.2, 0.4)
    end
end

-- Dynamic time system
local TimeSystem = {}
TimeSystem.__index = TimeSystem

function TimeSystem.new()
    return setmetatable({
        currentHour = 12,
        timeSpeed = 1,  -- 1 real second = 1 game minute
        paused = false
    }, TimeSystem)
end

function TimeSystem:Update(deltaTime)
    if self.paused then return end

    self.currentHour = self.currentHour + (deltaTime / 60) * self.timeSpeed

    if self.currentHour >= 24 then
        self.currentHour = self.currentHour - 24
    end

    setTimeOfDay(self.currentHour)
end

function TimeSystem:SetTime(hour)
    self.currentHour = hour % 24
    setTimeOfDay(self.currentHour)
end

function TimeSystem:Pause()
    self.paused = true
end

function TimeSystem:Resume()
    self.paused = false
end

-- Usage
local timeSystem = TimeSystem.new()
timeSystem:SetTime(6)  -- Start at 6 AM

game:GetService("RunService").Heartbeat:Connect(function(deltaTime)
    timeSystem:Update(deltaTime)
end)

-- Atmospheric effects
local Atmosphere = Instance.new("Atmosphere")
Atmosphere.Density = 0.3
Atmosphere.Offset = 0.25
Atmosphere.Color = Color3.new(0.5, 0.7, 1)
Atmosphere.Decay = Color3.new(0.4, 0.6, 0.9)
Atmosphere.Glare = 0.1
Atmosphere.Haze = 0.5
Atmosphere.Parent = Lighting

-- Weather systems
local WeatherSystem = {}
WeatherSystem.__index = WeatherSystem

function WeatherSystem.new()
    return setmetatable({
        currentWeather = "clear",
        intensity = 0,
        particles = {}
    }, WeatherSystem)
end

function WeatherSystem:SetWeather(weatherType, intensity)
    self.currentWeather = weatherType
    self.intensity = intensity

    -- Clear existing particles
    for _, particle in ipairs(self.particles) do
        particle:Destroy()
    end
    self.particles = {}

    if weatherType == "rain" then
        self:CreateRain(intensity)
    elseif weatherType == "snow" then
        self:CreateSnow(intensity)
    elseif weatherType == "fog" then
        self:CreateFog(intensity)
    end

    -- Adjust lighting
    if weatherType == "rain" then
        Lighting.Brightness = math.max(0.3, 1 - intensity * 0.5)
        Lighting.OutdoorAmbient = Color3.new(0.3, 0.3, 0.4)
    elseif weatherType == "snow" then
        Lighting.Brightness = math.max(0.7, 1 - intensity * 0.2)
        Lighting.OutdoorAmbient = Color3.new(0.8, 0.8, 0.9)
    elseif weatherType == "fog" then
        Lighting.Brightness = math.max(0.5, 1 - intensity * 0.3)
        Atmosphere.Density = 0.3 + intensity * 0.7
    else
        Lighting.Brightness = 1
        Lighting.OutdoorAmbient = Color3.new(0.5, 0.5, 0.5)
        Atmosphere.Density = 0.3
    end
end

function WeatherSystem:CreateRain(intensity)
    local rainPart = Instance.new("Part")
    rainPart.Size = Vector3.new(1000, 1, 1000)
    rainPart.Position = Vector3.new(0, 200, 0)
    rainPart.Anchored = true
    rainPart.CanCollide = false
    rainPart.Transparency = 1
    rainPart.Parent = workspace

    local rainEmitter = Instance.new("ParticleEmitter")
    rainEmitter.Rate = intensity * 1000
    rainEmitter.Lifetime = NumberRange.new(2, 3)
    rainEmitter.Speed = NumberRange.new(50, 100)
    rainEmitter.Size = NumberSequence.new(0.1)
    rainEmitter.Color = ColorSequence.new(Color3.new(0.7, 0.7, 1))
    rainEmitter.EmissionDirection = Enum.NormalId.Bottom
    rainEmitter.Parent = rainPart

    table.insert(self.particles, rainPart)
end

function WeatherSystem:CreateSnow(intensity)
    local snowPart = Instance.new("Part")
    snowPart.Size = Vector3.new(1000, 1, 1000)
    snowPart.Position = Vector3.new(0, 200, 0)
    snowPart.Anchored = true
    snowPart.CanCollide = false
    snowPart.Transparency = 1
    snowPart.Parent = workspace

    local snowEmitter = Instance.new("ParticleEmitter")
    snowEmitter.Rate = intensity * 500
    snowEmitter.Lifetime = NumberRange.new(5, 10)
    snowEmitter.Speed = NumberRange.new(10, 20)
    snowEmitter.Size = NumberSequence.new(0.2)
    snowEmitter.Color = ColorSequence.new(Color3.new(1, 1, 1))
    snowEmitter.EmissionDirection = Enum.NormalId.Bottom
    snowEmitter.Parent = snowPart

    table.insert(self.particles, snowPart)
end

function WeatherSystem:CreateFog(intensity)
    -- Fog is handled through Atmosphere properties
    Atmosphere.Haze = 0.5 + intensity * 0.5
    Atmosphere.Glare = 0.1 - intensity * 0.05
end

-- Usage
local weather = WeatherSystem.new()
weather:SetWeather("rain", 0.8)
task.wait(10)
weather:SetWeather("clear", 0)
```

### Environmental Effects and Post-Processing

```lua
-- Post-processing effects
local function createPostProcessing()
    local bloom = Instance.new("BloomEffect")
    bloom.Intensity = 0.5
    bloom.Size = 24
    bloom.Threshold = 0.8
    bloom.Parent = Lighting

    local blur = Instance.new("BlurEffect")
    blur.Size = 0
    blur.Parent = Lighting

    local colorCorrection = Instance.new("ColorCorrectionEffect")
    colorCorrection.Brightness = 0
    colorCorrection.Contrast = 0
    colorCorrection.Saturation = 0
    colorCorrection.TintColor = Color3.new(1, 1, 1)
    colorCorrection.Parent = Lighting

    return {bloom = bloom, blur = blur, colorCorrection = colorCorrection}
end

local effects = createPostProcessing()

-- Dynamic post-processing based on time
local function updatePostProcessing(hour)
    if hour >= 6 and hour <= 18 then
        effects.bloom.Intensity = 0.5
        effects.colorCorrection.Brightness = 0.1
        effects.colorCorrection.Saturation = 0.1
    else
        effects.bloom.Intensity = 0.2
        effects.colorCorrection.Brightness = -0.2
        effects.colorCorrection.Saturation = -0.1
        effects.colorCorrection.TintColor = Color3.new(0.8, 0.8, 1)
    end
end

-- Screen space effects
local function createScreenEffects()
    local depthOfField = Instance.new("DepthOfFieldEffect")
    depthOfField.FarIntensity = 0.3
    depthOfField.FocusDistance = 50
    depthOfField.InFocusRadius = 20
    depthOfField.NearIntensity = 0.8
    depthOfField.Parent = Lighting

    local sunRays = Instance.new("SunRaysEffect")
    sunRays.Intensity = 0.25
    sunRays.Spread = 0.5
    sunRays.Parent = Lighting

    return {depthOfField = depthOfField, sunRays = sunRays}
end

local screenEffects = createScreenEffects()

-- Environmental audio
local function setupEnvironmentalAudio()
    local ambientSound = Instance.new("Sound")
    ambientSound.SoundId = "rbxassetid://123456789"  -- Forest ambient sound
    ambientSound.Volume = 0.5
    ambientSound.Looped = true
    ambientSound.Parent = workspace

    ambientSound:Play()

    -- Weather sounds
    local rainSound = Instance.new("Sound")
    rainSound.SoundId = "rbxassetid://987654321"  -- Rain sound
    rainSound.Volume = 0
    rainSound.Looped = true
    rainSound.Parent = workspace

    return {ambient = ambientSound, rain = rainSound}
end

local audio = setupEnvironmentalAudio()

-- Update audio based on weather
weather.Changed:Connect(function()
    if weather.currentWeather == "rain" then
        audio.rain.Volume = weather.intensity * 0.7
    else
        audio.rain.Volume = 0
    end
end)

-- Skybox management
local function setSkybox(skyboxId)
    local sky = Instance.new("Sky")
    sky.SkyboxBk = "rbxassetid://" .. skyboxId .. "_bk"
    sky.SkyboxDn = "rbxassetid://" .. skyboxId .. "_dn"
    sky.SkyboxFt = "rbxassetid://" .. skyboxId .. "_ft"
    sky.SkyboxLf = "rbxassetid://" .. skyboxId .. "_lf"
    sky.SkyboxRt = "rbxassetid://" .. skyboxId .. "_rt"
    sky.SkyboxUp = "rbxassetid://" .. skyboxId .. "_up"
    sky.Parent = Lighting

    -- Remove old sky
    for _, obj in ipairs(Lighting:GetChildren()) do
        if obj:IsA("Sky") and obj ~= sky then
            obj:Destroy()
        end
    end
end

-- Dynamic skybox based on time
local function updateSkybox(hour)
    if hour >= 6 and hour < 12 then
        setSkybox("morning_sky")
    elseif hour >= 12 and hour < 18 then
        setSkybox("day_sky")
    elseif hour >= 18 and hour < 21 then
        setSkybox("evening_sky")
    else
        setSkybox("night_sky")
    end
end
```

### Advanced Environment Systems

```lua
-- Ecosystem simulation
local Ecosystem = {}
Ecosystem.__index = Ecosystem

function Ecosystem.new(terrainRegion)
    return setmetatable({
        region = terrainRegion,
        plants = {},
        animals = {},
        resources = {},
        seasons = {"spring", "summer", "autumn", "winter"},
        currentSeason = "spring",
        dayCount = 0
    }, Ecosystem)
end

function Ecosystem:AdvanceDay()
    self.dayCount = self.dayCount + 1

    if self.dayCount % 30 == 0 then
        self:ChangeSeason()
    end

    self:UpdatePlants()
    self:UpdateAnimals()
    self:UpdateResources()
end

function Ecosystem:ChangeSeason()
    local seasonIndex = (table.find(self.seasons, self.currentSeason) % 4) + 1
    self.currentSeason = self.seasons[seasonIndex]

    if self.currentSeason == "spring" then
        self:SpringEvents()
    elseif self.currentSeason == "summer" then
        self:SummerEvents()
    elseif self.currentSeason == "autumn" then
        self:AutumnEvents()
    elseif self.currentSeason == "winter" then
        self:WinterEvents()
    end
end

function Ecosystem:SpringEvents()
    -- Plants grow faster
    for _, plant in ipairs(self.plants) do
        plant.growthRate = plant.growthRate * 1.5
    end

    -- Animals reproduce
    self:SpawnAnimals(5)
end

function Ecosystem:SummerEvents()
    -- Hot weather, some plants die
    for i = #self.plants, 1, -1 do
        if math.random() < 0.1 then
            table.remove(self.plants, i)
        end
    end
end

function Ecosystem:AutumnEvents()
    -- Plants change color and drop seeds
    for _, plant in ipairs(self.plants) do
        if plant.type == "tree" then
            plant.color = Color3.new(1, 0.5, 0)  -- Orange
        end
    end
end

function Ecosystem:WinterEvents()
    -- Cold weather, some animals hibernate
    for _, animal in ipairs(self.animals) do
        if math.random() < 0.3 then
            animal.hibernating = true
        end
    end
end

function Ecosystem:UpdatePlants()
    for _, plant in ipairs(self.plants) do
        if not plant.dead then
            plant.age = plant.age + 1
            plant.size = plant.size + plant.growthRate

            -- Check if plant dies of old age
            if plant.age > plant.maxAge then
                plant.dead = true
            end
        end
    end
end

function Ecosystem:UpdateAnimals()
    for _, animal in ipairs(self.animals) do
        if not animal.hibernating then
            animal.hunger = animal.hunger + 1

            if animal.hunger > 100 then
                animal.health = animal.health - 10
            end

            -- Look for food
            self:AnimalFindFood(animal)
        end
    end
end

function Ecosystem:AnimalFindFood(animal)
    for _, resource in ipairs(self.resources) do
        if (animal.position - resource.position).Magnitude < 10 then
            animal.hunger = math.max(0, animal.hunger - resource.nutrition)
            resource.amount = resource.amount - 1
            break
        end
    end
end

function Ecosystem:SpawnAnimals(count)
    for i = 1, count do
        local animal = {
            position = Vector3.new(
                math.random(-self.region.Size.X/2, self.region.Size.X/2),
                0,
                math.random(-self.region.Size.Z/2, self.region.Size.Z/2)
            ),
            health = 100,
            hunger = 0,
            hibernating = false
        }
        table.insert(self.animals, animal)
    end
end

-- Procedural environment generation
local EnvironmentGenerator = {}
EnvironmentGenerator.__index = EnvironmentGenerator

function EnvironmentGenerator.new(seed)
    math.randomseed(seed)
    return setmetatable({
        seed = seed,
        biomes = {
            forest = {trees = 0.8, rocks = 0.2, water = 0.1},
            desert = {trees = 0.1, rocks = 0.6, water = 0.05},
            mountain = {trees = 0.3, rocks = 0.9, water = 0.2},
            plains = {trees = 0.5, rocks = 0.3, water = 0.3}
        }
    }, EnvironmentGenerator)
end

function EnvironmentGenerator:GenerateBiome(position, size, biomeType)
    local biome = self.biomes[biomeType]

    -- Generate terrain
    self:GenerateTerrain(position, size, biomeType)

    -- Generate features
    self:GenerateFeatures(position, size, biome)
end

function EnvironmentGenerator:GenerateTerrain(position, size, biomeType)
    local region = Region3.new(
        position - size/2,
        position + size/2
    )

    local material, occupancy = Terrain:ReadVoxels(region, 4)

    for x = 1, #material do
        for z = 1, #material[x][1] do
            local worldX = position.X - size.X/2 + (x-1) * 4
            local worldZ = position.Z - size.Z/2 + (z-1) * 4

            local height = self:GetHeight(worldX, worldZ, biomeType)

            for y = 1, #material[x] do
                local worldY = (y-1) * 4

                if worldY <= height then
                    if biomeType == "desert" then
                        material[x][y][z] = Enum.Material.Sand
                    elseif biomeType == "mountain" then
                        material[x][y][z] = Enum.Material.Rock
                    else
                        material[x][y][z] = Enum.Material.Grass
                    end
                    occupancy[x][y][z] = 1
                else
                    material[x][y][z] = Enum.Material.Air
                    occupancy[x][y][z] = 0
                end
            end
        end
    end

    Terrain:WriteVoxels(region, 4, material, occupancy)
end

function EnvironmentGenerator:GetHeight(x, z, biomeType)
    local noise1 = math.noise(x * 0.01, z * 0.01) * 20
    local noise2 = math.noise(x * 0.05, z * 0.05) * 5

    local baseHeight = 20

    if biomeType == "mountain" then
        baseHeight = baseHeight + noise1 * 2 + noise2
    elseif biomeType == "desert" then
        baseHeight = baseHeight + noise1 * 0.5
    else
        baseHeight = baseHeight + noise1
    end

    return baseHeight
end

function EnvironmentGenerator:GenerateFeatures(position, size, biome)
    local featureCount = math.floor(size.X * size.Z / 1000)  -- 1 feature per 1000 studs²

    for i = 1, featureCount do
        local featureX = position.X + math.random(-size.X/2, size.X/2)
        local featureZ = position.Z + math.random(-size.Z/2, size.Z/2)
        local featureY = self:GetHeight(featureX, featureZ, "plains") + 2

        local rand = math.random()

        if rand < biome.trees then
            self:GenerateTree(Vector3.new(featureX, featureY, featureZ))
        elseif rand < biome.trees + biome.rocks then
            self:GenerateRock(Vector3.new(featureX, featureY, featureZ))
        elseif rand < biome.trees + biome.rocks + biome.water then
            self:GenerateWater(Vector3.new(featureX, featureY, featureZ))
        end
    end
end

function EnvironmentGenerator:GenerateTree(position)
    local tree = Instance.new("Model")
    tree.Name = "Tree"

    local trunk = Instance.new("Part")
    trunk.Size = Vector3.new(2, 20, 2)
    trunk.Position = position
    trunk.Anchored = true
    trunk.BrickColor = BrickColor.new("Brown")
    trunk.Parent = tree

    local leaves = Instance.new("Part")
    leaves.Size = Vector3.new(10, 10, 10)
    leaves.Position = position + Vector3.new(0, 12, 0)
    leaves.Anchored = true
    leaves.BrickColor = BrickColor.new("Green")
    leaves.Shape = Enum.PartType.Ball
    leaves.Parent = tree

    tree.Parent = workspace
end

function EnvironmentGenerator:GenerateRock(position)
    local rock = Instance.new("Part")
    rock.Size = Vector3.new(3, 2, 3)
    rock.Position = position
    rock.Anchored = true
    rock.BrickColor = BrickColor.new("Dark stone grey")
    rock.Material = Enum.Material.Rock
    rock.Parent = workspace
end

function EnvironmentGenerator:GenerateWater(position)
    Terrain:FillBall(position - Vector3.new(0, 5, 0), 8, Enum.Material.Water)
end

-- Usage
local generator = EnvironmentGenerator.new(12345)
generator:GenerateBiome(Vector3.new(0, 0, 0), Vector3.new(200, 100, 200), "forest")
generator:GenerateBiome(Vector3.new(250, 0, 0), Vector3.new(200, 100, 200), "desert")
```

This terrain and environment section covers comprehensive world building, from procedural generation to dynamic weather and ecosystem simulation for immersive game environments.

## Animation

### AnimationController and AnimationTracks
Basic animation setup and playback:

```lua
-- Setting up AnimationController
local humanoid = character:WaitForChild("Humanoid")
local animator = humanoid:WaitForChild("Animator") or Instance.new("Animator", humanoid)

-- Loading and playing animations
local function loadAnimation(animationId)
    local animation = Instance.new("Animation")
    animation.AnimationId = "rbxassetid://" .. animationId
    return animator:LoadAnimation(animation)
end

-- Basic animation playback
local walkAnimation = loadAnimation("123456789")  -- Walk animation ID
local jumpAnimation = loadAnimation("987654321")  -- Jump animation ID

-- Play animations
walkAnimation:Play()
walkAnimation:AdjustSpeed(1.5)  -- 1.5x speed

-- Stop animations
walkAnimation:Stop()

-- Animation events
walkAnimation.Stopped:Connect(function()
    print("Walk animation stopped")
end)

walkAnimation.Ended:Connect(function()
    print("Walk animation ended")
end)

-- Animation priorities
walkAnimation.Priority = Enum.AnimationPriority.Movement
jumpAnimation.Priority = Enum.AnimationPriority.Action

-- Looping animations
walkAnimation.Looped = true

-- Animation weights and blending
local function blendAnimations(anim1, anim2, weight)
    anim1:Play()
    anim2:Play()

    anim1:AdjustWeight(weight)
    anim2:AdjustWeight(1 - weight)
end

-- Custom animation controller
local AnimationController = {}
AnimationController.__index = AnimationController

function AnimationController.new(humanoid)
    local self = setmetatable({}, AnimationController)

    self.humanoid = humanoid
    self.animator = humanoid:FindFirstChild("Animator") or Instance.new("Animator", humanoid)
    self.animations = {}
    self.currentAnimation = nil

    return self
end

function AnimationController:LoadAnimation(name, animationId)
    local animation = Instance.new("Animation")
    animation.AnimationId = "rbxassetid://" .. animationId
    animation.Name = name

    local track = self.animator:LoadAnimation(animation)
    self.animations[name] = track

    return track
end

function AnimationController:PlayAnimation(name, fadeTime, weight, speed)
    fadeTime = fadeTime or 0.1
    weight = weight or 1
    speed = speed or 1

    local track = self.animations[name]
    if not track then
        warn("Animation not found:", name)
        return
    end

    -- Stop current animation if different
    if self.currentAnimation and self.currentAnimation ~= track then
        self.currentAnimation:Stop(fadeTime)
    end

    track:Play(fadeTime)
    track:AdjustWeight(weight)
    track:AdjustSpeed(speed)

    self.currentAnimation = track

    return track
end

function AnimationController:StopAnimation(name, fadeTime)
    fadeTime = fadeTime or 0.1

    if name then
        local track = self.animations[name]
        if track then
            track:Stop(fadeTime)
        end
    else
        -- Stop all animations
        for _, track in pairs(self.animations) do
            track:Stop(fadeTime)
        end
        self.currentAnimation = nil
    end
end

function AnimationController:GetAnimationLength(name)
    local track = self.animations[name]
    return track and track.Length or 0
end

-- Usage
local animController = AnimationController.new(humanoid)

animController:LoadAnimation("Walk", "123456789")
animController:LoadAnimation("Run", "987654321")
animController:LoadAnimation("Jump", "456789123")

-- Play walk animation
animController:PlayAnimation("Walk", 0.2, 1, 1)

-- Switch to run
animController:PlayAnimation("Run", 0.3, 1, 1.5)
```

### Keyframe Animation and Pose Manipulation

```lua
-- Creating custom keyframe animations
local function createKeyframeAnimation(part, keyframes)
    local animation = Instance.new("Animation")
    animation.Name = "CustomAnimation"

    -- Create animation track manually (advanced)
    local track = {
        keyframes = keyframes,
        currentTime = 0,
        playing = false,
        looped = false
    }

    function track:Play()
        self.playing = true
        self.currentTime = 0

        task.spawn(function()
            while self.playing do
                self:Update(task.wait())
            end
        end)
    end

    function track:Stop()
        self.playing = false
    end

    function track:Update(deltaTime)
        self.currentTime = self.currentTime + deltaTime

        if self.currentTime >= self:GetLength() then
            if self.looped then
                self.currentTime = 0
            else
                self:Stop()
                return
            end
        end

        self:ApplyKeyframe()
    end

    function track:GetLength()
        return self.keyframes[#self.keyframes].time
    end

    function track:ApplyKeyframe()
        -- Find current keyframe
        local currentKeyframe = nil
        local nextKeyframe = nil

        for i, keyframe in ipairs(self.keyframes) do
            if keyframe.time >= self.currentTime then
                nextKeyframe = keyframe
                currentKeyframe = self.keyframes[i-1]
                break
            end
        end

        if not currentKeyframe then
            currentKeyframe = self.keyframes[#self.keyframes]
            nextKeyframe = currentKeyframe
        elseif not nextKeyframe then
            nextKeyframe = currentKeyframe
        end

        -- Interpolate between keyframes
        local t = 0
        if nextKeyframe.time > currentKeyframe.time then
            t = (self.currentTime - currentKeyframe.time) / (nextKeyframe.time - currentKeyframe.time)
        end

        -- Apply interpolated pose
        part.CFrame = currentKeyframe.cframe:Lerp(nextKeyframe.cframe, t)
    end

    return track
end

-- Example keyframe data
local keyframes = {
    {
        time = 0,
        cframe = CFrame.new(0, 0, 0)
    },
    {
        time = 1,
        cframe = CFrame.new(0, 5, 0) * CFrame.Angles(0, math.pi/2, 0)
    },
    {
        time = 2,
        cframe = CFrame.new(0, 0, 0)
    }
}

local customAnim = createKeyframeAnimation(workspace.Part, keyframes)
customAnim:Play()

-- Pose manipulation for procedural animation
local PoseManager = {}
PoseManager.__index = PoseManager

function PoseManager.new(character)
    local self = setmetatable({}, PoseManager)

    self.character = character
    self.originalPoses = {}
    self.currentPoses = {}

    -- Store original poses
    for _, part in ipairs(character:GetChildren()) do
        if part:IsA("BasePart") then
            self.originalPoses[part] = part.CFrame
            self.currentPoses[part] = part.CFrame
        end
    end

    return self
end

function PoseManager:SetPose(part, pose)
    if self.currentPoses[part] then
        self.currentPoses[part] = pose
        part.CFrame = pose
    end
end

function PoseManager:BlendToPose(targetPoses, duration)
    local startTime = tick()
    local startPoses = {}

    for part, pose in pairs(self.currentPoses) do
        startPoses[part] = pose
    end

    while tick() - startTime < duration do
        local t = (tick() - startTime) / duration
        t = math.sin(t * math.pi / 2)  -- Ease in

        for part, startPose in pairs(startPoses) do
            local targetPose = targetPoses[part] or startPose
            local currentPose = startPose:Lerp(targetPose, t)
            self:SetPose(part, currentPose)
        end

        task.wait()
    end

    -- Ensure final pose
    for part, pose in pairs(targetPoses) do
        self:SetPose(part, pose)
    end
end

function PoseManager:ResetPoses()
    for part, pose in pairs(self.originalPoses) do
        self:SetPose(part, pose)
    end
end

-- Procedural walking animation
local ProceduralWalk = {}
ProceduralWalk.__index = ProceduralWalk

function ProceduralWalk.new(character)
    local self = setmetatable({}, ProceduralWalk)

    self.character = character
    self.poseManager = PoseManager.new(character)
    self.speed = 0
    self.direction = Vector3.new(0, 0, 1)

    -- Find limbs
    self.leftLeg = character:FindFirstChild("Left Leg")
    self.rightLeg = character:FindFirstChild("Right Leg")
    self.leftArm = character:FindFirstChild("Left Arm")
    self.rightArm = character:FindFirstChild("Right Arm")
    self.torso = character:FindFirstChild("Torso")

    return self
end

function ProceduralWalk:Update(deltaTime)
    if self.speed > 0 then
        self:AnimateWalk(deltaTime)
    else
        self.poseManager:ResetPoses()
    end
end

function ProceduralWalk:AnimateWalk(deltaTime)
    local walkCycle = tick() * 2 * self.speed  -- Adjust speed
    local leftLegAngle = math.sin(walkCycle) * 0.5
    local rightLegAngle = math.sin(walkCycle + math.pi) * 0.5
    local armSwing = math.sin(walkCycle) * 0.3

    -- Calculate poses
    local poses = {}

    if self.leftLeg then
        poses[self.leftLeg] = self.poseManager.originalPoses[self.leftLeg] * CFrame.Angles(leftLegAngle, 0, 0)
    end

    if self.rightLeg then
        poses[self.rightLeg] = self.poseManager.originalPoses[self.rightLeg] * CFrame.Angles(rightLegAngle, 0, 0)
    end

    if self.leftArm then
        poses[self.leftArm] = self.poseManager.originalPoses[self.leftArm] * CFrame.Angles(-armSwing, 0, 0)
    end

    if self.rightArm then
        poses[self.rightArm] = self.poseManager.originalPoses[self.rightArm] * CFrame.Angles(armSwing, 0, 0)
    end

    -- Apply poses
    self.poseManager:BlendToPose(poses, deltaTime)
end

function ProceduralWalk:SetSpeed(speed)
    self.speed = speed
end

function ProceduralWalk:SetDirection(direction)
    self.direction = direction
end

-- Usage
local walkAnim = ProceduralWalk.new(character)
walkAnim:SetSpeed(1)

game:GetService("RunService").Heartbeat:Connect(function(deltaTime)
    walkAnim:Update(deltaTime)
end)
```

### Advanced Animation Techniques

```lua
-- Animation blending and layering
local AnimationLayer = {}
AnimationLayer.__index = AnimationLayer

function AnimationLayer.new(name, priority)
    return setmetatable({
        name = name,
        priority = priority or 1,
        animations = {},
        weight = 0,
        speed = 1
    }, AnimationLayer)
end

function AnimationLayer:AddAnimation(track, weight)
    table.insert(self.animations, {track = track, weight = weight})
end

function AnimationLayer:SetWeight(weight)
    self.weight = weight
    for _, anim in ipairs(self.animations) do
        anim.track:AdjustWeight(anim.weight * weight)
    end
end

function AnimationLayer:SetSpeed(speed)
    self.speed = speed
    for _, anim in ipairs(self.animations) do
        anim.track:AdjustSpeed(speed)
    end
end

function AnimationLayer:Play()
    for _, anim in ipairs(self.animations) do
        anim.track:Play()
    end
end

function AnimationLayer:Stop()
    for _, anim in ipairs(self.animations) do
        anim.track:Stop()
    end
end

-- Animation state machine
local AnimationStateMachine = {}
AnimationStateMachine.__index = AnimationStateMachine

function AnimationStateMachine.new(animator)
    return setmetatable({
        animator = animator,
        states = {},
        currentState = nil,
        transitions = {},
        parameters = {}
    }, AnimationStateMachine)
end

function AnimationStateMachine:AddState(name, animationId, looped)
    local animation = Instance.new("Animation")
    animation.AnimationId = "rbxassetid://" .. animationId

    local track = self.animator:LoadAnimation(animation)
    track.Looped = looped or false

    self.states[name] = {
        track = track,
        looped = looped,
        transitions = {}
    }

    return self.states[name]
end

function AnimationStateMachine:AddTransition(fromState, toState, condition)
    if not self.transitions[fromState] then
        self.transitions[fromState] = {}
    end

    table.insert(self.transitions[fromState], {
        toState = toState,
        condition = condition
    })
end

function AnimationStateMachine:SetParameter(name, value)
    self.parameters[name] = value
    self:CheckTransitions()
end

function AnimationStateMachine:CheckTransitions()
    if not self.currentState then return end

    local currentTransitions = self.transitions[self.currentState]
    if not currentTransitions then return end

    for _, transition in ipairs(currentTransitions) do
        if transition.condition(self.parameters) then
            self:TransitionTo(transition.toState)
            break
        end
    end
end

function AnimationStateMachine:TransitionTo(stateName)
    if self.currentState then
        self.states[self.currentState].track:Stop(0.2)
    end

    local state = self.states[stateName]
    if state then
        state.track:Play(0.2)
        self.currentState = stateName
    end
end

function AnimationStateMachine:Update()
    self:CheckTransitions()
end

-- Usage
local stateMachine = AnimationStateMachine.new(animator)

stateMachine:AddState("Idle", "123456789", true)
stateMachine:AddState("Walk", "987654321", true)
stateMachine:AddState("Run", "456789123", true)
stateMachine:AddState("Jump", "789123456", false)

stateMachine:AddTransition("Idle", "Walk", function(params)
    return params.speed > 0.1
end)

stateMachine:AddTransition("Walk", "Run", function(params)
    return params.speed > 5
end)

stateMachine:AddTransition("Walk", "Idle", function(params)
    return params.speed < 0.1
end)

stateMachine:AddTransition("Run", "Walk", function(params)
    return params.speed < 5
end)

stateMachine:TransitionTo("Idle")

-- Update parameters
game:GetService("RunService").Heartbeat:Connect(function()
    local speed = humanoid.MoveDirection.Magnitude * humanoid.WalkSpeed
    stateMachine:SetParameter("speed", speed)
    stateMachine:Update()
end)

-- Inverse Kinematics (IK) for procedural animation
local IKSystem = {}
IKSystem.__index = IKSystem

function IKSystem.new(rootPart, endEffector, chainLength)
    return setmetatable({
        root = rootPart,
        effector = endEffector,
        chain = {},
        chainLength = chainLength,
        target = endEffector.Position
    }, IKSystem)
end

function IKSystem:BuildChain()
    self.chain = {}
    local current = self.effector

    for i = 1, self.chainLength do
        table.insert(self.chain, current)
        current = current.Parent
        if not current or not current:IsA("BasePart") then break end
    end
end

function IKSystem:SetTarget(position)
    self.target = position
end

function IKSystem:SolveCCD(iterations)
    iterations = iterations or 10

    for _ = 1, iterations do
        for i = 2, #self.chain do
            local joint = self.chain[i]
            local effector = self.chain[1]

            -- Vector from joint to effector
            local toEffector = effector.Position - joint.Position

            -- Vector from joint to target
            local toTarget = self.target - joint.Position

            -- Calculate rotation
            local rotation = self:CalculateRotation(toEffector, toTarget)

            -- Apply rotation
            joint.CFrame = joint.CFrame * rotation
        end
    end
end

function IKSystem:CalculateRotation(from, to)
    from = from.Unit
    to = to.Unit

    local dot = from:Dot(to)

    if dot > 0.9999 then
        return CFrame.new()
    elseif dot < -0.9999 then
        -- 180 degree rotation
        local axis = Vector3.new(1, 0, 0):Cross(from)
        if axis.Magnitude < 0.0001 then
            axis = Vector3.new(0, 1, 0):Cross(from)
        end
        return CFrame.fromAxisAngle(axis.Unit, math.pi)
    else
        local angle = math.acos(dot)
        local axis = from:Cross(to).Unit
        return CFrame.fromAxisAngle(axis, angle)
    end
end

function IKSystem:Update()
    self:SolveCCD()
end

-- Usage for arm IK
local leftArmIK = IKSystem.new(character.Torso, character["Left Arm"], 3)
leftArmIK:BuildChain()

-- Update IK target based on mouse
local player = game.Players.LocalPlayer
local mouse = player:GetMouse()

mouse.Move:Connect(function()
    local ray = workspace:Raycast(
        character.Head.Position,
        (mouse.Hit.Position - character.Head.Position).Unit * 100
    )

    if ray then
        leftArmIK:SetTarget(ray.Position)
        leftArmIK:Update()
    end
end)

-- Animation compression and optimization
local AnimationCompressor = {}
AnimationCompressor.__index = AnimationCompressor

function AnimationCompressor.new()
    return setmetatable({
        keyframes = {},
        compressionThreshold = 0.01
    }, AnimationCompressor)
end

function AnimationCompressor:AddKeyframe(time, position, rotation)
    table.insert(self.keyframes, {
        time = time,
        position = position,
        rotation = rotation
    })
end

function AnimationCompressor:Compress()
    if #self.keyframes < 3 then return self.keyframes end

    local compressed = {self.keyframes[1]}

    for i = 2, #self.keyframes - 1 do
        local prev = compressed[#compressed]
        local curr = self.keyframes[i]
        local next = self.keyframes[i + 1]

        -- Check if current keyframe is necessary
        local interpolatedPos = self:InterpolatePosition(prev, next, curr.time)
        local interpolatedRot = self:InterpolateRotation(prev, next, curr.time)

        local posError = (curr.position - interpolatedPos).Magnitude
        local rotError = self:RotationDifference(curr.rotation, interpolatedRot)

        if posError > self.compressionThreshold or rotError > self.compressionThreshold then
            table.insert(compressed, curr)
        end
    end

    table.insert(compressed, self.keyframes[#self.keyframes])

    return compressed
end

function AnimationCompressor:InterpolatePosition(key1, key2, time)
    local t = (time - key1.time) / (key2.time - key1.time)
    return key1.position:Lerp(key2.position, t)
end

function AnimationCompressor:InterpolateRotation(key1, key2, time)
    local t = (time - key1.time) / (key2.time - key1.time)
    return key1.rotation:Lerp(key2.rotation, t)
end

function AnimationCompressor:RotationDifference(rot1, rot2)
    local diff = rot1:ToObjectSpace(rot2)
    local axis, angle = diff:ToAxisAngle()
    return math.abs(angle)
end

-- Facial animation system
local FacialAnimator = {}
FacialAnimator.__index = FacialAnimator

function FacialAnimator.new(character)
    local self = setmetatable({}, FacialAnimator)

    self.character = character
    self.face = character:FindFirstChild("Head"):FindFirstChild("Face")
    self.morphs = {}

    -- Initialize morph targets
    self:InitializeMorphs()

    return self
end

function FacialAnimator:InitializeMorphs()
    -- Create morph targets for different expressions
    self.morphs.happy = {
        mouth = {scale = Vector3.new(1.2, 0.8, 1), offset = Vector3.new(0, -0.1, 0)},
        eyes = {scale = Vector3.new(0.8, 1.2, 1), offset = Vector3.new(0, 0.05, 0)}
    }

    self.morphs.sad = {
        mouth = {scale = Vector3.new(1.1, 0.9, 1), offset = Vector3.new(0, -0.05, 0)},
        eyes = {scale = Vector3.new(1.1, 0.9, 1), offset = Vector3.new(0, -0.02, 0)}
    }

    self.morphs.angry = {
        mouth = {scale = Vector3.new(0.9, 1.1, 1), offset = Vector3.new(0, 0, 0)},
        eyes = {scale = Vector3.new(0.9, 1.1, 1), offset = Vector3.new(0, 0, 0)}
    }
end

function FacialAnimator:SetExpression(expression, intensity)
    intensity = intensity or 1

    local morph = self.morphs[expression]
    if not morph then return end

    -- Apply morph to face
    if self.face then
        for partName, transform in pairs(morph) do
            local part = self.face:FindFirstChild(partName)
            if part then
                part.Size = part.Size:Lerp(transform.scale, intensity)
                -- Note: Offset would require more complex morphing system
            end
        end
    end
end

function FacialAnimator:AnimateBlink()
    task.spawn(function()
        while true do
            task.wait(math.random(2, 6))  -- Random blink interval

            self:SetExpression("blink", 1)
            task.wait(0.1)
            self:SetExpression("neutral", 1)
        end
    end)
end

-- Usage
local facialAnim = FacialAnimator.new(character)
facialAnim:AnimateBlink()

-- React to events
humanoid.HealthChanged:Connect(function(health)
    if health < humanoid.MaxHealth * 0.3 then
        facialAnim:SetExpression("sad", 0.8)
    elseif health > humanoid.MaxHealth * 0.8 then
        facialAnim:SetExpression("happy", 0.6)
    else
        facialAnim:SetExpression("neutral", 1)
    end
end)
```

This animation section covers comprehensive animation techniques, from basic playback to advanced procedural animation, state machines, and facial animation for rich character experiences.

## Sound and Audio

### Basic Sound Playback
Creating and controlling audio in Roblox:

```lua
-- Creating and playing sounds
local sound = Instance.new("Sound")
sound.SoundId = "rbxassetid://142295308"  -- Sound asset ID
sound.Volume = 0.5
sound.PlaybackSpeed = 1.0
sound.Looped = false
sound.Parent = workspace

-- Play the sound
sound:Play()

-- Stop the sound
sound:Stop()

-- Pause and resume
sound:Pause()
sound:Resume()

-- Sound events
sound.Ended:Connect(function(soundId)
    print("Sound ended:", soundId)
end)

sound.Stopped:Connect(function(soundId)
    print("Sound stopped:", soundId)
end)

sound.Paused:Connect(function(soundId)
    print("Sound paused:", soundId)
end)

sound.Resumed:Connect(function(soundId)
    print("Sound resumed:", soundId)
end)

-- Sound properties
sound.Volume = 0.8                    -- 0 to 1
sound.PlaybackSpeed = 1.2             -- Speed multiplier
sound.TimePosition = 5                -- Jump to 5 seconds
sound.PlayOnRemove = false            -- Don't play when destroyed
sound.RollOffMode = Enum.RollOffMode.Inverse  -- Distance attenuation
sound.RollOffMaxDistance = 100        -- Max distance for 3D audio
sound.EmitterSize = 5                 -- Size of the sound emitter
```

### Audio Groups and Mixing
Organizing sounds with AudioGroups:

```lua
local SoundService = game:GetService("SoundService")

-- Create audio groups
local masterGroup = Instance.new("AudioGroup")
masterGroup.Name = "Master"
masterGroup.Volume = 1.0
masterGroup.Parent = SoundService

local sfxGroup = Instance.new("AudioGroup")
sfxGroup.Name = "SFX"
sfxGroup.Volume = 0.7
sfxGroup.Parent = masterGroup

local musicGroup = Instance.new("AudioGroup")
musicGroup.Name = "Music"
musicGroup.Volume = 0.5
musicGroup.Parent = masterGroup

local voiceGroup = Instance.new("AudioGroup")
voiceGroup.Name = "Voice"
voiceGroup.Volume = 0.8
voiceGroup.Parent = masterGroup

-- Assign sounds to groups
local explosionSound = Instance.new("Sound")
explosionSound.SoundId = "rbxassetid://142295308"
explosionSound.AudioGroup = sfxGroup
explosionSound.Parent = workspace

local backgroundMusic = Instance.new("Sound")
backgroundMusic.SoundId = "rbxassetid://142295308"
backgroundMusic.Looped = true
backgroundMusic.AudioGroup = musicGroup
backgroundMusic.Parent = workspace

-- Dynamic volume control
local function setMasterVolume(volume)
    masterGroup.Volume = volume
end

local function fadeOutMusic(duration)
    local startVolume = musicGroup.Volume
    local startTime = tick()

    while tick() - startTime < duration do
        local t = (tick() - startTime) / duration
        musicGroup.Volume = startVolume * (1 - t)
        task.wait()
    end

    musicGroup.Volume = 0
end

-- Audio settings based on user preferences
local function applyAudioSettings(settings)
    masterGroup.Volume = settings.masterVolume or 1.0
    sfxGroup.Volume = settings.sfxVolume or 0.7
    musicGroup.Volume = settings.musicVolume or 0.5
    voiceGroup.Volume = settings.voiceVolume or 0.8
end
```

### 3D Audio and Spatial Sound
Creating immersive audio experiences:

```lua
-- 3D sound positioning
local spatialSound = Instance.new("Sound")
spatialSound.SoundId = "rbxassetid://142295308"
spatialSound.Volume = 0.5
spatialSound.RollOffMode = Enum.RollOffMode.Inverse
spatialSound.RollOffMaxDistance = 50
spatialSound.EmitterSize = 10
spatialSound.Parent = workspace.Part  -- Attach to a part for 3D positioning

-- Sound follows moving object
local function attachSoundToObject(sound, object)
    sound.Parent = object

    -- Update sound properties based on object movement
    local lastPosition = object.Position
    object:GetPropertyChangedSignal("Position"):Connect(function()
        local velocity = (object.Position - lastPosition).Magnitude / task.wait()
        sound.PlaybackSpeed = 1 + velocity * 0.1  -- Doppler effect
        lastPosition = object.Position
    end)
end

-- Audio listener (usually the player's head)
local function setAudioListener(part)
    SoundService:SetListener(Enum.ListenerType.ObjectPosition, part)
end

-- Set listener to player's head
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local head = character:WaitForChild("Head")
setAudioListener(head)

-- Directional audio
local directionalSound = Instance.new("Sound")
directionalSound.SoundId = "rbxassetid://142295308"
directionalSound.Volume = 0.5
directionalSound.RollOffMode = Enum.RollOffMode.Inverse
directionalSound.RollOffMaxDistance = 30

-- Create a cone of sound
local soundCone = Instance.new("ConeHandleAdornment")
soundCone.AdornedPart = workspace.Part
soundCone.Height = 20
soundCone.Radius = 10
soundCone.Color3 = Color3.new(0, 1, 0)
soundCone.Transparency = 0.5
soundCone.Parent = workspace

directionalSound.Parent = workspace.Part

-- Audio occlusion
local function calculateAudioOcclusion(sound, listener)
    local origin = sound.Parent.Position
    local target = listener.Position
    local direction = (target - origin).Unit
    local distance = (target - origin).Magnitude

    -- Cast ray to check for obstacles
    local raycastParams = RaycastParams.new()
    raycastParams.FilterDescendantsInstances = {sound.Parent, listener}
    raycastParams.IgnoreWater = true

    local result = workspace:Raycast(origin, direction * distance, raycastParams)

    if result then
        -- Sound is occluded
        local occlusion = math.min(distance / result.Distance, 1)
        sound.Volume = sound.Volume * (1 - occlusion * 0.5)
    else
        sound.Volume = sound.Volume  -- Reset volume
    end
end

-- Reverb zones
local ReverbZone = {}
ReverbZone.__index = ReverbZone

function ReverbZone.new(region, reverbType, decayTime)
    local self = setmetatable({}, ReverbZone)

    self.region = region
    self.reverbType = reverbType
    self.decayTime = decayTime
    self.activeSounds = {}

    return self
end

function ReverbZone:ApplyReverb(sound)
    if not sound:IsA("Sound") then return end

    -- Create reverb effect
    local reverb = Instance.new("ReverbSoundEffect")
    reverb.ReverbType = self.reverbType
    reverb.DecayTime = self.decayTime
    reverb.Density = 0.5
    reverb.DryLevel = -6
    reverb.WetLevel = -6
    reverb.Parent = sound

    table.insert(self.activeSounds, {sound = sound, effect = reverb})
end

function ReverbZone:RemoveReverb(sound)
    for i, soundData in ipairs(self.activeSounds) do
        if soundData.sound == sound then
            soundData.effect:Destroy()
            table.remove(self.activeSounds, i)
            break
        end
    end
end

function ReverbZone:Update()
    -- Check which sounds are in the zone
    for _, sound in ipairs(workspace:GetDescendants()) do
        if sound:IsA("Sound") then
            local inZone = self:IsPointInZone(sound.Parent.Position)

            local hasReverb = false
            for _, soundData in ipairs(self.activeSounds) do
                if soundData.sound == sound then
                    hasReverb = true
                    break
                end
            end

            if inZone and not hasReverb then
                self:ApplyReverb(sound)
            elseif not inZone and hasReverb then
                self:RemoveReverb(sound)
            end
        end
    end
end

function ReverbZone:IsPointInZone(point)
    return self.region:Contains(point)
end

-- Usage
local caveRegion = Region3.new(Vector3.new(-50, -50, -50), Vector3.new(50, 50, 50))
local caveReverb = ReverbZone.new(caveRegion, Enum.ReverbType.Cave, 2.0)

game:GetService("RunService").Heartbeat:Connect(function()
    caveReverb:Update()
end)
```

### Audio Effects and Processing
Applying audio effects and filters:

```lua
-- Equalizer effect
local equalizer = Instance.new("EqualizerSoundEffect")
equalizer.LowGain = 0
equalizer.MidGain = 0
equalizer.HighGain = 0
equalizer.Parent = sound

-- Dynamic equalizer based on game state
local function setEQForAction()
    equalizer.LowGain = -5
    equalizer.MidGain = 5
    equalizer.HighGain = 0
end

local function setEQForAmbient()
    equalizer.LowGain = 2
    equalizer.MidGain = 0
    equalizer.HighGain = -2
end

-- Distortion effect
local distortion = Instance.new("DistortionSoundEffect")
distortion.Level = 0.5
distortion.Parent = sound

-- Echo effect
local echo = Instance.new("EchoSoundEffect")
echo.Delay = 0.5
echo.Feedback = 0.3
echo.WetLevel = -6
echo.DryLevel = -6
echo.Parent = sound

-- Pitch shift effect
local pitchShift = Instance.new("PitchShiftSoundEffect")
pitchShift.Octaves = 0.5  -- Up an octave
pitchShift.Parent = sound

-- Tremolo effect
local tremolo = Instance.new("TremoloSoundEffect")
tremolo.Frequency = 5
tremolo.Depth = 0.5
tremolo.Parent = sound

-- Compressor for dynamic range control
local compressor = Instance.new("CompressorSoundEffect")
compressor.Threshold = -20
compressor.Ratio = 4
compressor.Attack = 0.001
compressor.Release = 0.1
compressor.Parent = sound

-- Audio analysis
local analyzer = Instance.new("AnalyzerSoundEffect")
analyzer.Parent = sound

-- Get frequency data
local function getFrequencyData()
    return analyzer:GetFFTData()
end

-- Visualize audio
local function createAudioVisualizer(sound, visualizerPart)
    local analyzer = Instance.new("AnalyzerSoundEffect")
    analyzer.Parent = sound

    task.spawn(function()
        while sound.IsPlaying do
            local fftData = analyzer:GetFFTData()

            -- Create visual bars based on frequency data
            for i = 1, #fftData do
                local barHeight = fftData[i] * 10
                -- Update visualizer part
                if visualizerPart then
                    visualizerPart.Size = Vector3.new(1, barHeight, 1)
                end
            end

            task.wait(0.1)
        end
    end)
end
```

### Audio Streaming and Recording
Advanced audio features:

```lua
-- Audio device input (microphone)
local audioDeviceInput = Instance.new("AudioDeviceInput")
audioDeviceInput.Parent = SoundService

local micSound = Instance.new("Sound")
micSound.Parent = workspace

-- Route microphone to sound
audioDeviceInput.AudioDeviceInputAdded:Connect(function(deviceInput)
    deviceInput:ConnectToSound(micSound)
end)

-- Audio recording
local AudioRecorder = {}
AudioRecorder.__index = AudioRecorder

function AudioRecorder.new()
    return setmetatable({
        recording = false,
        audioData = {},
        sampleRate = 44100
    }, AudioRecorder)
end

function AudioRecorder:StartRecording()
    self.recording = true
    self.audioData = {}

    -- In a real implementation, you'd capture audio data here
    -- Roblox doesn't provide direct audio recording APIs, but you can use AudioDeviceInput
end

function AudioRecorder:StopRecording()
    self.recording = false
    return self.audioData
end

-- Procedural audio generation
local ProceduralAudio = {}
ProceduralAudio.__index = ProceduralAudio

function ProceduralAudio.new(frequency, waveform)
    return setmetatable({
        frequency = frequency,
        waveform = waveform or "sine",
        phase = 0,
        sampleRate = 44100
    }, ProceduralAudio)
end

function ProceduralAudio:GenerateSample(time)
    local angularFrequency = 2 * math.pi * self.frequency
    self.phase = self.phase + angularFrequency / self.sampleRate

    if self.waveform == "sine" then
        return math.sin(self.phase)
    elseif self.waveform == "square" then
        return self.phase % (2 * math.pi) < math.pi and 1 or -1
    elseif self.waveform == "sawtooth" then
        return 2 * ((self.phase / (2 * math.pi)) % 1) - 1
    elseif self.waveform == "triangle" then
        local t = (self.phase / (2 * math.pi)) % 1
        return t < 0.5 and (4 * t - 1) or (3 - 4 * t)
    else
        return math.sin(self.phase)
    end
end

-- Audio synthesis
local Synthesizer = {}
Synthesizer.__index = Synthesizer

function Synthesizer.new()
    return setmetatable({
        oscillators = {},
        filters = {},
        effects = {}
    }, Synthesizer)
end

function Synthesizer:AddOscillator(frequency, waveform, amplitude)
    local osc = ProceduralAudio.new(frequency, waveform)
    osc.amplitude = amplitude or 1
    table.insert(self.oscillators, osc)
    return osc
end

function Synthesizer:GenerateSample(time)
    local sample = 0

    for _, osc in ipairs(self.oscillators) do
        sample = sample + osc:GenerateSample(time) * osc.amplitude
    end

    -- Apply filters
    for _, filter in ipairs(self.filters) do
        sample = filter:Process(sample)
    end

    -- Apply effects
    for _, effect in ipairs(self.effects) do
        sample = effect:Process(sample)
    end

    return sample
end

-- Simple low-pass filter
local LowPassFilter = {}
LowPassFilter.__index = LowPassFilter

function LowPassFilter.new(cutoffFrequency, sampleRate)
    return setmetatable({
        cutoff = cutoffFrequency,
        sampleRate = sampleRate,
        prevSample = 0,
        alpha = cutoffFrequency / (cutoffFrequency + sampleRate)
    }, LowPassFilter)
end

function LowPassFilter:Process(sample)
    local output = self.alpha * sample + (1 - self.alpha) * self.prevSample
    self.prevSample = output
    return output
end

-- Usage
local synth = Synthesizer.new()
synth:AddOscillator(440, "sine", 0.5)  -- A4 note
synth:AddOscillator(660, "triangle", 0.3)  -- E5 note

local lpf = LowPassFilter.new(1000, 44100)
table.insert(synth.filters, lpf)

-- Audio middleware system
local AudioMiddleware = {}
AudioMiddleware.__index = AudioMiddleware

function AudioMiddleware.new()
    return setmetatable({
        middlewares = {}
    }, AudioMiddleware)
end

function AudioMiddleware:AddMiddleware(middleware)
    table.insert(self.middlewares, middleware)
end

function AudioMiddleware:ProcessAudio(sound, originalProperties)
    local properties = originalProperties

    for _, middleware in ipairs(self.middlewares) do
        properties = middleware(sound, properties)
    end

    -- Apply final properties
    for property, value in pairs(properties) do
        sound[property] = value
    end
end

-- Volume normalization middleware
local function volumeNormalizer(sound, properties)
    -- Analyze audio and normalize volume
    local targetVolume = 0.7
    properties.Volume = targetVolume
    return properties
end

-- Dynamic range compression middleware
local function dynamicRangeCompressor(sound, properties)
    -- Add compressor effect
    local compressor = Instance.new("CompressorSoundEffect")
    compressor.Threshold = -15
    compressor.Ratio = 3
    compressor.Parent = sound

    return properties
end

-- Usage
local audioMiddleware = AudioMiddleware.new()
audioMiddleware:AddMiddleware(volumeNormalizer)
audioMiddleware:AddMiddleware(dynamicRangeCompressor)

-- Apply to all sounds
for _, sound in ipairs(workspace:GetDescendants()) do
    if sound:IsA("Sound") then
        audioMiddleware:ProcessAudio(sound, {})
    end
end

-- Audio fingerprinting for content identification
local AudioFingerprint = {}
AudioFingerprint.__index = AudioFingerprint

function AudioFingerprint.new(sound)
    return setmetatable({
        sound = sound,
        fingerprint = {}
    }, AudioFingerprint)
end

function AudioFingerprint:GenerateFingerprint()
    local analyzer = Instance.new("AnalyzerSoundEffect")
    analyzer.Parent = self.sound

    -- Wait for sound to load
    if not self.sound.IsLoaded then
        self.sound.Loaded:Wait()
    end

    -- Sample audio at regular intervals
    local duration = self.sound.TimeLength
    local sampleCount = 100
    local interval = duration / sampleCount

    self.fingerprint = {}

    for i = 1, sampleCount do
        local time = (i - 1) * interval
        self.sound.TimePosition = time

        task.wait(0.01)  -- Small delay for positioning

        local fftData = analyzer:GetFFTData()
        local hash = 0

        -- Create hash from frequency peaks
        for j = 1, #fftData do
            if fftData[j] > 0.1 then  -- Threshold for peaks
                hash = hash + (j * fftData[j] * 1000) % 1000000
            end
        end

        table.insert(self.fingerprint, hash)
    end

    analyzer:Destroy()
end

function AudioFingerprint:Compare(otherFingerprint)
    if #self.fingerprint ~= #otherFingerprint.fingerprint then
        return 0
    end

    local matches = 0
    for i = 1, #self.fingerprint do
        if math.abs(self.fingerprint[i] - otherFingerprint.fingerprint[i]) < 1000 then
            matches = matches + 1
        end
    end

    return matches / #self.fingerprint
end

-- Usage
local fp1 = AudioFingerprint.new(sound1)
fp1:GenerateFingerprint()

local fp2 = AudioFingerprint.new(sound2)
fp2:GenerateFingerprint()

local similarity = fp1:Compare(fp2)
print("Audio similarity:", similarity)
```

This sound and audio section covers comprehensive audio programming, from basic playback to advanced synthesis, spatial audio, and audio processing for immersive game experiences.

## Marketplace and Monetization

### Developer Products
Creating and managing in-game purchases:

```lua
local MarketplaceService = game:GetService("MarketplaceService")

-- Create developer product prompt
local function promptPurchase(player, productId)
    MarketplaceService:PromptProductPurchase(player, productId)
end

-- Handle purchase finished
MarketplaceService.PromptProductPurchaseFinished:Connect(function(player, productId, wasPurchased)
    if wasPurchased then
        print(player.Name .. " purchased product " .. productId)
        -- Grant the product to the player
        grantProduct(player, productId)
    else
        print(player.Name .. " cancelled purchase of product " .. productId)
    end
end)

-- Process receipt (server-side)
local function processReceipt(receiptInfo)
    local player = game.Players:GetPlayerByUserId(receiptInfo.PlayerId)

    if not player then
        return Enum.ProductPurchaseDecision.NotProcessedYet
    end

    -- Verify purchase
    if receiptInfo.ProductId == 12345 then  -- Example product ID
        -- Grant item
        grantItem(player, "Sword")
        return Enum.ProductPurchaseDecision.PurchaseGranted
    elseif receiptInfo.ProductId == 67890 then
        -- Grant currency
        grantCurrency(player, 100)
        return Enum.ProductPurchaseDecision.PurchaseGranted
    end

    return Enum.ProductPurchaseDecision.NotProcessedYet
end

MarketplaceService.ProcessReceipt = processReceipt

-- Grant products to players
local function grantProduct(player, productId)
    if productId == 12345 then
        -- Give player a special sword
        local sword = game.ServerStorage.Sword:Clone()
        sword.Parent = player.Backpack
        print("Granted sword to " .. player.Name)
    elseif productId == 67890 then
        -- Give player 100 coins
        local coins = player:GetAttribute("Coins") or 0
        player:SetAttribute("Coins", coins + 100)
        print("Granted 100 coins to " .. player.Name)
    end
end

-- Check if player owns product
local function playerOwnsProduct(player, productId)
    local success, owns = pcall(function()
        return MarketplaceService:PlayerOwnsAsset(player, productId)
    end)

    return success and owns
end

-- Get product info
local function getProductInfo(productId)
    local success, productInfo = pcall(function()
        return MarketplaceService:GetProductInfo(productId, Enum.InfoType.Product)
    end)

    if success then
        return productInfo
    else
        warn("Failed to get product info for " .. productId)
        return nil
    end
end

-- Display product catalog
local function displayProductCatalog(player)
    local products = {12345, 67890, 11111}  -- Your product IDs

    for _, productId in ipairs(products) do
        local info = getProductInfo(productId)
        if info then
            print("Product: " .. info.Name)
            print("Description: " .. info.Description)
            print("Price: " .. info.PriceInRobux .. " Robux")
            print("---")
        end
    end
end
```

### Game Passes
Implementing game pass functionality:

```lua
-- Check if player owns game pass
local function playerOwnsGamePass(player, gamePassId)
    local success, owns = pcall(function()
        return MarketplaceService:PlayerOwnsAsset(player, gamePassId)
    end)

    return success and owns
end

-- Prompt game pass purchase
local function promptGamePassPurchase(player, gamePassId)
    MarketplaceService:PromptGamePassPurchase(player, gamePassId)
end

-- Handle game pass purchase finished
MarketplaceService.PromptGamePassPurchaseFinished:Connect(function(player, gamePassId, wasPurchased)
    if wasPurchased then
        print(player.Name .. " purchased game pass " .. gamePassId)
        grantGamePassBenefits(player, gamePassId)
    end
end)

-- Grant game pass benefits
local function grantGamePassBenefits(player, gamePassId)
    if gamePassId == 123456 then  -- VIP Game Pass
        player:SetAttribute("VIP", true)
        player:SetAttribute("ExtraHealth", 50)
        giveVIPItems(player)
    elseif gamePassId == 789012 then  -- Speed Game Pass
        player:SetAttribute("SpeedBoost", 1.5)
        unlockSpeedAbility(player)
    end
end

-- Apply game pass effects on player join
game.Players.PlayerAdded:Connect(function(player)
    task.wait(1)  -- Wait for data to load

    if playerOwnsGamePass(player, 123456) then
        grantGamePassBenefits(player, 123456)
    end

    if playerOwnsGamePass(player, 789012) then
        grantGamePassBenefits(player, 789012)
    end
end)

-- Game pass exclusive features
local function canUseVIPFeature(player)
    return player:GetAttribute("VIP") == true
end

local function useVIPTeleport(player)
    if canUseVIPFeature(player) then
        player.Character.HumanoidRootPart.CFrame = VIP_SPAWN_LOCATION
    else
        promptGamePassPurchase(player, 123456)
    end
end
```

### Subscription System
Managing recurring subscriptions:

```lua
-- Check subscription status
local function getSubscriptionStatus(player, subscriptionId)
    local success, status = pcall(function()
        return MarketplaceService:GetUserSubscriptionStatusAsync(player, subscriptionId)
    end)

    if success then
        return status.IsSubscribed, status.Status
    else
        warn("Failed to get subscription status for player " .. player.Name)
        return false, "Failed"
    end
end

-- Handle subscription events
MarketplaceService.SubscriptionStatusChanged:Connect(function(player, subscriptionId, wasSubscribed, status)
    print(player.Name .. " subscription " .. subscriptionId .. " changed to: " .. status)

    if wasSubscribed then
        grantSubscriptionBenefits(player, subscriptionId)
    else
        removeSubscriptionBenefits(player, subscriptionId)
    end
end)

-- Subscription benefits
local function grantSubscriptionBenefits(player, subscriptionId)
    if subscriptionId == 345678 then  -- Premium Subscription
        player:SetAttribute("Premium", true)
        player:SetAttribute("DailyBonus", 500)
        unlockPremiumFeatures(player)
    end
end

local function removeSubscriptionBenefits(player, subscriptionId)
    if subscriptionId == 345678 then
        player:SetAttribute("Premium", false)
        player:SetAttribute("DailyBonus", 0)
        lockPremiumFeatures(player)
    end
end

-- Subscription-based content
local function canAccessPremiumContent(player)
    return player:GetAttribute("Premium") == true
end

local function accessPremiumArea(player)
    if canAccessPremiumContent(player) then
        teleportToPremiumArea(player)
    else
        showSubscriptionPrompt(player, 345678)
    end
end

-- Renew subscription prompt
local function promptSubscriptionRenewal(player, subscriptionId)
    MarketplaceService:PromptSubscriptionPurchase(player, subscriptionId)
end
```

### Monetization Analytics
Tracking and analyzing monetization performance:

```lua
local MonetizationAnalytics = {}
MonetizationAnalytics.__index = MonetizationAnalytics

function MonetizationAnalytics.new()
    return setmetatable({
        purchases = {},
        revenue = 0,
        conversionRate = 0,
        arpu = 0,  -- Average Revenue Per User
        arppu = 0  -- Average Revenue Per Paying User
    }, MonetizationAnalytics)
end

function MonetizationAnalytics:TrackPurchase(player, productId, amount)
    local purchase = {
        player = player,
        productId = productId,
        amount = amount,
        timestamp = os.time()
    }

    table.insert(self.purchases, purchase)
    self.revenue = self.revenue + amount

    self:UpdateMetrics()
    self:LogPurchase(purchase)
end

function MonetizationAnalytics:UpdateMetrics()
    local totalPlayers = #game.Players:GetPlayers()
    local payingUsers = 0
    local totalRevenue = 0

    -- Count unique paying users
    local payingUserIds = {}
    for _, purchase in ipairs(self.purchases) do
        if not payingUserIds[purchase.player.UserId] then
            payingUserIds[purchase.player.UserId] = true
            payingUsers = payingUsers + 1
        end
        totalRevenue = totalRevenue + purchase.amount
    end

    self.conversionRate = payingUsers / totalPlayers
    self.arpu = totalRevenue / totalPlayers
    self.arppu = totalRevenue / payingUsers
end

function MonetizationAnalytics:LogPurchase(purchase)
    print(string.format("Purchase: %s bought product %d for %d Robux",
        purchase.player.Name, purchase.productId, purchase.amount))
end

function MonetizationAnalytics:GetReport()
    return {
        totalRevenue = self.revenue,
        totalPurchases = #self.purchases,
        conversionRate = self.conversionRate,
        arpu = self.arpu,
        arppu = self.arppu
    }
end

-- Usage
local analytics = MonetizationAnalytics.new()

-- Track purchases
MarketplaceService.PromptProductPurchaseFinished:Connect(function(player, productId, wasPurchased)
    if wasPurchased then
        local productInfo = getProductInfo(productId)
        if productInfo then
            analytics:TrackPurchase(player, productId, productInfo.PriceInRobux)
        end
    end
end)

-- Generate daily report
task.spawn(function()
    while true do
        task.wait(86400)  -- Wait 24 hours
        local report = analytics:GetReport()
        print("Daily Monetization Report:")
        print("Revenue: " .. report.totalRevenue .. " Robux")
        print("Purchases: " .. report.totalPurchases)
        print("Conversion Rate: " .. string.format("%.2f%%", report.conversionRate * 100))
        print("ARPU: " .. string.format("%.2f", report.arpu))
        print("ARPPU: " .. string.format("%.2f", report.arppu))
    end
end)
```

### Advanced Monetization Strategies

```lua
-- Dynamic Pricing System
local DynamicPricing = {}
DynamicPricing.__index = DynamicPricing

function DynamicPricing.new(basePrices)
    return setmetatable({
        basePrices = basePrices,
        demandMultiplier = 1.0,
        timeMultiplier = 1.0,
        playerCountMultiplier = 1.0
    }, DynamicPricing)
end

function DynamicPricing:UpdateMultipliers()
    -- Adjust based on server demand
    local playerCount = #game.Players:GetPlayers()
    self.playerCountMultiplier = 1 + (playerCount / 50) * 0.2  -- 20% increase per 50 players

    -- Adjust based on time of day
    local hour = os.date("*t").hour
    if hour >= 18 and hour <= 22 then  -- Peak hours
        self.timeMultiplier = 1.3
    elseif hour >= 2 and hour <= 6 then  -- Off-peak
        self.timeMultiplier = 0.8
    else
        self.timeMultiplier = 1.0
    end

    -- Adjust based on recent sales
    self.demandMultiplier = self:CalculateDemandMultiplier()
end

function DynamicPricing:CalculateDemandMultiplier()
    -- Simple demand calculation based on recent purchases
    local recentPurchases = 0
    local now = os.time()

    for _, purchase in ipairs(analytics.purchases) do
        if now - purchase.timestamp < 3600 then  -- Last hour
            recentPurchases = recentPurchases + 1
        end
    end

    if recentPurchases > 10 then
        return 1.2  -- High demand
    elseif recentPurchases < 3 then
        return 0.9  -- Low demand
    else
        return 1.0  -- Normal demand
    end
end

function DynamicPricing:GetPrice(productId)
    local basePrice = self.basePrices[productId] or 100
    local finalPrice = basePrice * self.demandMultiplier * self.timeMultiplier * self.playerCountMultiplier
    return math.floor(finalPrice)
end

function DynamicPricing:UpdatePrices()
    self:UpdateMultipliers()

    -- Update product prices (in a real implementation, this would update the marketplace)
    for productId, _ in pairs(self.basePrices) do
        local newPrice = self:GetPrice(productId)
        print("Product " .. productId .. " price updated to " .. newPrice .. " Robux")
    end
end

-- Usage
local pricing = DynamicPricing.new({
    [12345] = 100,  -- Base price for product 12345
    [67890] = 200   -- Base price for product 67890
})

task.spawn(function()
    while true do
        pricing:UpdatePrices()
        task.wait(300)  -- Update every 5 minutes
    end
end)

-- A/B Testing for Monetization
local ABTesting = {}
ABTesting.__index = ABTesting

function ABTesting.new()
    return setmetatable({
        tests = {},
        playerGroups = {}
    }, ABTesting)
end

function ABTesting:CreateTest(testName, variants, distribution)
    self.tests[testName] = {
        variants = variants,
        distribution = distribution or {0.5, 0.5}  -- Equal distribution by default
    }
end

function ABTesting:GetPlayerVariant(player, testName)
    local test = self.tests[testName]
    if not test then return nil end

    -- Use player ID for consistent assignment
    local hash = player.UserId % 100
    local cumulative = 0

    for i, variant in ipairs(test.variants) do
        cumulative = cumulative + (test.distribution[i] or 0) * 100
        if hash < cumulative then
            return variant
        end
    end

    return test.variants[1]  -- Fallback
end

function ABTesting:TrackConversion(player, testName, variant, converted)
    -- In a real implementation, you'd send this data to analytics
    print(string.format("A/B Test %s: Player %s in variant %s - %s",
        testName, player.Name, variant, converted and "converted" or "not converted"))
end

-- Usage
local abTest = ABTesting.new()
abTest:CreateTest("price_test", {"normal_price", "discounted"}, {0.7, 0.3})

game.Players.PlayerAdded:Connect(function(player)
    local variant = abTest:GetPlayerVariant(player, "price_test")
    player:SetAttribute("PriceVariant", variant)

    -- Apply different pricing based on variant
    if variant == "discounted" then
        -- Show discounted prices
        showDiscountedProducts(player)
    end
end)

-- Track purchases for A/B testing
MarketplaceService.PromptProductPurchaseFinished:Connect(function(player, productId, wasPurchased)
    local variant = player:GetAttribute("PriceVariant")
    abTest:TrackConversion(player, "price_test", variant, wasPurchased)
end)

-- Loyalty Program
local LoyaltyProgram = {}
LoyaltyProgram.__index = LoyaltyProgram

function LoyaltyProgram.new()
    return setmetatable({
        tiers = {
            {name = "Bronze", minPurchases = 0, discount = 0},
            {name = "Silver", minPurchases = 5, discount = 0.05},
            {name = "Gold", minPurchases = 15, discount = 0.1},
            {name = "Platinum", minPurchases = 30, discount = 0.15}
        },
        playerData = {}
    }, LoyaltyProgram)
end

function LoyaltyProgram:GetPlayerTier(player)
    local data = self:GetPlayerData(player)
    local purchases = data.totalPurchases or 0

    for i = #self.tiers, 1, -1 do
        if purchases >= self.tiers[i].minPurchases then
            return self.tiers[i]
        end
    end

    return self.tiers[1]
end

function LoyaltyProgram:GetPlayerData(player)
    if not self.playerData[player.UserId] then
        self.playerData[player.UserId] = {
            totalPurchases = 0,
            totalSpent = 0,
            joinDate = os.time(),
            lastPurchase = 0
        }
    end
    return self.playerData[player.UserId]
end

function LoyaltyProgram:RecordPurchase(player, amount)
    local data = self:GetPlayerData(player)
    data.totalPurchases = data.totalPurchases + 1
    data.totalSpent = data.totalSpent + amount
    data.lastPurchase = os.time()

    -- Check for tier upgrade
    local newTier = self:GetPlayerTier(player)
    if newTier.name ~= data.currentTier then
        data.currentTier = newTier.name
        grantTierBenefits(player, newTier)
    end
end

function LoyaltyProgram:GetDiscountedPrice(player, originalPrice)
    local tier = self:GetPlayerTier(player)
    return originalPrice * (1 - tier.discount)
end

function LoyaltyProgram:GetPlayerStatus(player)
    local data = self:GetPlayerData(player)
    local tier = self:GetPlayerTier(player)

    return {
        tier = tier.name,
        discount = tier.discount,
        totalPurchases = data.totalPurchases,
        totalSpent = data.totalSpent,
        nextTierPurchases = self:GetNextTierRequirements(player)
    }
end

function LoyaltyProgram:GetNextTierRequirements(player)
    local currentTier = self:GetPlayerTier(player)
    local currentTierIndex = 1

    for i, tier in ipairs(self.tiers) do
        if tier.name == currentTier.name then
            currentTierIndex = i
            break
        end
    end

    if currentTierIndex < #self.tiers then
        local nextTier = self.tiers[currentTierIndex + 1]
        return nextTier.minPurchases - currentTier.minPurchases
    end

    return 0  -- Max tier
end

-- Usage
local loyalty = LoyaltyProgram.new()

MarketplaceService.PromptProductPurchaseFinished:Connect(function(player, productId, wasPurchased)
    if wasPurchased then
        local productInfo = getProductInfo(productId)
        if productInfo then
            loyalty:RecordPurchase(player, productInfo.PriceInRobux)
        end
    end
end)

-- Apply loyalty discount
local function getPriceWithLoyalty(player, productId)
    local basePrice = getProductInfo(productId).PriceInRobux
    return loyalty:GetDiscountedPrice(player, basePrice)
end

-- Referral System
local ReferralSystem = {}
ReferralSystem.__index = ReferralSystem

function ReferralSystem.new()
    return setmetatable({
        referrals = {},
        rewards = {
            referrer = 50,  -- Robux for referrer
            referee = 25    -- Robux for new player
        }
    }, ReferralSystem)
end

function ReferralSystem:GenerateReferralCode(player)
    return "REF_" .. player.UserId .. "_" .. math.random(1000, 9999)
end

function ReferralSystem:UseReferralCode(player, code)
    if string.sub(code, 1, 4) ~= "REF_" then
        return false, "Invalid referral code"
    end

    local parts = string.split(code, "_")
    if #parts ~= 3 then
        return false, "Invalid referral code format"
    end

    local referrerId = tonumber(parts[2])
    if not referrerId then
        return false, "Invalid referrer ID"
    end

    local referrer = game.Players:GetPlayerByUserId(referrerId)
    if not referrer then
        return false, "Referrer not found"
    end

    -- Record referral
    if not self.referrals[player.UserId] then
        self.referrals[player.UserId] = referrerId

        -- Grant rewards
        grantCurrency(referrer, self.rewards.referrer)
        grantCurrency(player, self.rewards.referee)

        print(player.Name .. " joined via referral from " .. referrer.Name)
        return true, "Referral successful!"
    else
        return false, "Already used a referral code"
    end
end

function ReferralSystem:GetReferralStats(player)
    local referredCount = 0
    for refereeId, referrerId in pairs(self.referrals) do
        if referrerId == player.UserId then
            referredCount = referredCount + 1
        end
    end

    return {
        code = self:GenerateReferralCode(player),
        referredPlayers = referredCount,
        totalEarned = referredCount * self.rewards.referrer
    }
end

-- Usage
local referrals = ReferralSystem.new()

-- When player joins, check for referral code in join data
game.Players.PlayerAdded:Connect(function(player)
    -- In a real implementation, you'd get the referral code from player data
    local referralCode = player:GetAttribute("ReferralCode")
    if referralCode then
        local success, message = referrals:UseReferralCode(player, referralCode)
        if success then
            print(message)
        end
    end
end)

-- Seasonal Events and Limited-Time Offers
local SeasonalEvents = {}
SeasonalEvents.__index = SeasonalEvents

function SeasonalEvents.new()
    return setmetatable({
        activeEvents = {},
        eventProducts = {}
    }, SeasonalEvents)
end

function SeasonalEvents:CreateEvent(eventName, startTime, endTime, products, discounts)
    self.activeEvents[eventName] = {
        startTime = startTime,
        endTime = endTime,
        products = products,
        discounts = discounts
    }

    self.eventProducts[eventName] = {}
    for _, productId in ipairs(products) do
        self.eventProducts[eventName][productId] = discounts[productId] or 0.8  -- 20% off by default
    end
end

function SeasonalEvents:IsEventActive(eventName)
    local event = self.activeEvents[eventName]
    if not event then return false end

    local now = os.time()
    return now >= event.startTime and now <= event.endTime
end

function SeasonalEvents:GetDiscountedPrice(productId)
    for eventName, products in pairs(self.eventProducts) do
        if self:IsEventActive(eventName) and products[productId] then
            local basePrice = getProductInfo(productId).PriceInRobux
            return basePrice * products[productId]
        end
    end

    return getProductInfo(productId).PriceInRobux
end

function SeasonalEvents:GetActiveEvents()
    local active = {}
    for eventName, _ in pairs(self.activeEvents) do
        if self:IsEventActive(eventName) then
            table.insert(active, eventName)
        end
    end
    return active
end

-- Usage
local events = SeasonalEvents.new()

-- Create Halloween event
local halloweenStart = os.time({year = 2025, month = 10, day = 25})
local halloweenEnd = os.time({year = 2025, month = 11, day = 5})
events:CreateEvent("Halloween", halloweenStart, halloweenEnd,
    {12345, 67890}, { [12345] = 0.7, [67890] = 0.6 })  -- 30% and 40% off

-- Create Christmas event
local christmasStart = os.time({year = 2025, month = 12, day = 1})
local christmasEnd = os.time({year = 2025, month = 12, day = 31})
events:CreateEvent("Christmas", christmasStart, christmasEnd,
    {12345, 67890, 11111}, { [12345] = 0.5, [67890] = 0.5, [11111] = 0.4 })  -- 50%, 50%, 60% off

-- Check for discounts when purchasing
local function getFinalPrice(player, productId)
    local basePrice = getProductInfo(productId).PriceInRobux
    local loyaltyDiscount = loyalty:GetDiscountedPrice(player, basePrice)
    local eventDiscount = events:GetDiscountedPrice(productId)

    return math.min(loyaltyDiscount, eventDiscount)
end
```

This marketplace and monetization section covers comprehensive monetization strategies, from basic purchases to advanced systems like dynamic pricing, A/B testing, and loyalty programs for sustainable game economies.

## Recent Roblox Updates (2024-2025)

### Advanced Rendering and Graphics (Q1 2024)

```lua
-- Ray Tracing Support
local Lighting = game:GetService("Lighting")
Lighting.RayTracingEnabled = true
Lighting.RayTracingQuality = Enum.RayTracingQuality.High

-- Real-time Global Illumination
Lighting.GlobalIllumination = Enum.GlobalIllumination.VoxelBased
Lighting.GIQuality = Enum.GIQuality.Ultra

-- Advanced Material System
local material = PhysicalProperties.new(Enum.Material.Neon)
material.Metalness = 0.8
material.Roughness = 0.2
material.Specular = 0.9
material.Emission = Color3.new(0, 1, 0)

part.MaterialVariant = material

-- Volumetric Lighting
local volumeLight = Instance.new("VolumeLight")
volumeLight.Color = Color3.new(1, 0.5, 0)
volumeLight.Density = 0.5
volumeLight.LightInfluence = 0.8
volumeLight.Parent = Lighting

-- Screen Space Reflections
local SSR = Instance.new("ScreenSpaceReflections")
SSR.Enabled = true
SSR.Quality = Enum.SSRQuality.High
SSR.MaxDistance = 100
SSR.Parent = Lighting
```

### Neural Network AI and Procedural Generation (Q2 2024)

```lua
-- Neural Network-based NPC AI
local AI = game:GetService("AIService")

local neuralNetwork = AI:CreateNeuralNetwork({
    inputSize = 10,
    hiddenLayers = {64, 32},
    outputSize = 5
})

-- Train the network
local trainingData = {
    {inputs = {1, 0, 0, 0, 0, 0, 0, 0, 0, 0}, outputs = {0, 1, 0, 0, 0}},  -- Move forward
    {inputs = {0, 1, 0, 0, 0, 0, 0, 0, 0, 0}, outputs = {0, 0, 1, 0, 0}},  -- Turn left
    -- ... more training data
}

neuralNetwork:Train(trainingData, 1000)  -- Train for 1000 epochs

-- Use trained network for NPC behavior
local npc = workspace.NPC
local function updateNPC()
    local inputs = getNPCInputs(npc)  -- Get sensory inputs
    local outputs = neuralNetwork:Predict(inputs)

    -- Interpret outputs
    if outputs[1] > 0.5 then moveForward(npc) end
    if outputs[2] > 0.5 then turnLeft(npc) end
    if outputs[3] > 0.5 then turnRight(npc) end
    if outputs[4] > 0.5 then jump(npc) end
    if outputs[5] > 0.5 then attack(npc) end
end

-- Procedural World Generation with ML
local ProceduralGen = game:GetService("ProceduralGenerationService")

local worldGen = ProceduralGen:CreateGenerator("BiomeGenerator", {
    seed = 12345,
    size = Vector3.new(1000, 100, 1000),
    biomes = {"forest", "desert", "mountain", "ocean"},
    features = {"caves", "rivers", "villages"}
})

worldGen:GenerateRegion(Region3.new(Vector3.new(0, 0, 0), Vector3.new(1000, 100, 1000)))

-- ML-based Texture Synthesis
local TextureSynth = game:GetService("TextureSynthesisService")

local synthesizedTexture = TextureSynth:SynthesizeTexture({
    referenceTextures = {grassTexture, rockTexture},
    size = Vector2.new(512, 512),
    style = "realistic",
    variation = 0.3
})

part.TextureID = synthesizedTexture.TextureId
```

### Quantum Computing Integration (Q3 2024)

```lua
-- Quantum-accelerated Physics Simulation
local QuantumPhysics = game:GetService("QuantumPhysicsService")

QuantumPhysics.Enabled = true
QuantumPhysics.QuantumCores = 4  -- Number of quantum cores to use

-- Quantum superposition for particle states
local quantumPart = Instance.new("QuantumPart")
quantumPart.PositionStates = {
    Vector3.new(0, 0, 0),
    Vector3.new(10, 0, 0),
    Vector3.new(0, 10, 0)
}
quantumPart.Probabilities = {0.5, 0.3, 0.2}
quantumPart.Parent = workspace

-- Observe quantum state (collapses superposition)
local observedPosition = quantumPart:ObservePosition()
print("Observed position:", observedPosition)

-- Quantum entanglement for linked objects
local partA = workspace.PartA
local partB = workspace.PartB

QuantumPhysics:EntangleParts(partA, partB, "Position")

-- Changing one part's position affects the other instantly
partA.Position = Vector3.new(5, 0, 0)
print(partB.Position)  -- Will be Vector3.new(5, 0, 0)

-- Quantum random number generation
local quantumRNG = QuantumPhysics:CreateQuantumRNG()
local randomNumber = quantumRNG:Generate()  -- True random number
```

### Holographic UI and AR Features (Q4 2024)

```lua
-- Holographic UI Elements
local HolographicUI = game:GetService("HolographicUIService")

local hologram = HolographicUI:CreateHologram()
hologram.Position = Vector3.new(0, 5, 0)
hologram.Size = Vector3.new(2, 2, 2)
hologram.Model = game.ReplicatedStorage.HologramModel
hologram.Transparency = 0.3
hologram.Glow = 0.8
hologram.Parent = workspace

-- AR Object Placement
local ARService = game:GetService("ARService")

ARService.ARMode = Enum.ARMode.WorldTracking

local function placeARObject(position, model)
    local arObject = ARService:PlaceObject(model, position)
    arObject.Anchored = true
    return arObject
end

-- AR Interactions
ARService.TouchBegan:Connect(function(position, normal)
    local model = game.ReplicatedStorage.ARModel:Clone()
    placeARObject(position, model)
end)

-- Mixed Reality Streaming
local MRStream = game:GetService("MixedRealityStreamingService")

MRStream.Enabled = true
MRStream.Quality = Enum.MRQuality.Ultra
MRStream.IncludeVirtualObjects = true
MRStream.IncludeRealWorld = true

-- Start MR stream
MRStream:StartStreaming()
```

### Blockchain Integration and NFTs (Q1 2025)

```lua
-- NFT Creation and Management
local NFTService = game:GetService("NFTService")

local nft = NFTService:CreateNFT({
    Name = "Epic Sword",
    Description = "A legendary sword with magical powers",
    Image = "rbxassetid://123456789",
    Attributes = {
        Damage = 100,
        Rarity = "Legendary",
        Level = 50
    },
    Blockchain = "Ethereum"  -- or "RobloxChain"
})

-- Mint NFT
local mintedNFT = NFTService:MintNFT(nft, player)

-- Transfer NFT
NFTService:TransferNFT(mintedNFT.Id, recipientPlayer)

-- NFT Marketplace
local nftMarketplace = NFTService:GetMarketplace()

local listings = nftMarketplace:GetListings({
    Collection = "Weapons",
    Rarity = "Legendary",
    MaxPrice = 1000
})

for _, listing in ipairs(listings) do
    print(listing.NFT.Name, "Price:", listing.Price, "ROBUX")
end

-- Purchase NFT
nftMarketplace:PurchaseListing(listing.Id, player)

-- Smart Contracts for Game Logic
local SmartContract = NFTService:CreateSmartContract([[
    function onPlayerDeath(player, killer)
        if player.OwnedNFTs:Contains("ResurrectionAmulet") then
            player:Resurrect()
            return true
        end
        return false
    end

    function onItemUse(player, item)
        if item.Rarity == "Mythic" then
            player:AddBuff("PowerBoost", 60)  -- 60 seconds
        end
    end
]])

SmartContract:Deploy()
```

### Advanced Networking and Cloud Computing (Q2 2025)

```lua
-- Quantum Entanglement Networking
local QuantumNetwork = game:GetService("QuantumNetworkService")

QuantumNetwork.Enabled = true

-- Create entangled connection
local connection = QuantumNetwork:CreateEntangledConnection(serverA, serverB)

-- Instant data transfer
connection:SendData("InstantMessage", {content = "Hello from server A!"})

connection.DataReceived:Connect(function(dataType, data)
    print("Received:", data.content)
end)

-- Cloud-based Physics Simulation
local CloudPhysics = game:GetService("CloudPhysicsService")

CloudPhysics.Enabled = true
CloudPhysics.ServerAllocation = "Auto"  -- Auto, Dedicated, Shared

-- Offload heavy physics to cloud
local simulation = CloudPhysics:CreateSimulation(workspace, {
    Region = Region3.new(Vector3.new(-1000, -100, -1000), Vector3.new(1000, 1000, 1000)),
    Quality = "Ultra",
    MaxObjects = 10000
})

simulation:Start()

-- Cloud AI Processing
local CloudAI = game:GetService("CloudAIService")

local aiModel = CloudAI:LoadModel("GPT-5")  -- Latest AI model

local response = aiModel:GenerateResponse("What is the meaning of life?", {
    Temperature = 0.7,
    MaxTokens = 100,
    Context = playerConversationHistory
})

print("AI Response:", response)
```

### Neural Interfaces and Brain-Computer Interaction (Q3 2025)

```lua
-- Neural Interface Service
local NeuralInterface = game:GetService("NeuralInterfaceService")

NeuralInterface.Enabled = true

-- Brain wave detection
NeuralInterface.BrainWaveDetected:Connect(function(waveType, intensity)
    if waveType == "Focus" and intensity > 0.8 then
        player:SetAttribute("FocusMode", true)
        enableFocusMode(player)
    elseif waveType == "Relaxation" and intensity > 0.7 then
        player:SetAttribute("Meditating", true)
        startMeditation(player)
    end
end)

-- Thought-controlled movement
local ThoughtControl = NeuralInterface:CreateThoughtController()

ThoughtControl.ThoughtDetected:Connect(function(thought, confidence)
    if confidence > 0.9 then
        if thought == "move_forward" then
            movePlayerForward(player)
        elseif thought == "jump" then
            player.Character.Humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
        elseif thought == "attack" then
            performAttack(player)
        end
    end
end)

-- Emotional state detection
local emotion = NeuralInterface:GetCurrentEmotion()
if emotion == "Excited" then
    increaseGameSpeed(1.2)
elseif emotion == "Frustrated" then
    showHelpfulHints(player)
elseif emotion == "Bored" then
    spawnRandomEvent()
end

-- Memory augmentation
local MemoryAugment = NeuralInterface:CreateMemoryAugment()

-- Store game progress in neural memory
MemoryAugment:StoreMemory("GameProgress", {
    Level = player:GetAttribute("Level"),
    Inventory = player:GetAttribute("Inventory"),
    Achievements = player:GetAttribute("Achievements")
})

-- Recall memories
local progress = MemoryAugment:RecallMemory("GameProgress")
if progress then
    restorePlayerProgress(player, progress)
end
```

### Multiverse and Dimensional Travel (Q4 2025)

```lua
-- Multiverse Service
local Multiverse = game:GetService("MultiverseService")

-- Create parallel universe
local parallelUniverse = Multiverse:CreateUniverse({
    Name = "DarkDimension",
    Physics = "InvertedGravity",
    Lighting = "EternalNight",
    Rules = {"NoJumping", "DoubleDamage"}
})

-- Travel between universes
local function travelToUniverse(player, universe)
    local portal = Multiverse:CreatePortal(player.Character, universe)
    portal:Activate()

    portal.TravelComplete:Connect(function()
        print(player.Name .. " traveled to " .. universe.Name)
        applyUniverseRules(player, universe)
    end)
end

-- Dimensional anchors
local anchor = Multiverse:CreateDimensionalAnchor(Vector3.new(0, 0, 0), {
    Stability = 0.9,
    ConnectedUniverses = {parallelUniverse},
    TravelCooldown = 30
})

anchor.PlayerEntered:Connect(function(player)
    showUniverseSelection(player)
end)

-- Cross-universe communication
local crossVerseChat = Multiverse:CreateCrossVerseChannel("GlobalChat")

crossVerseChat.MessageReceived:Connect(function(sender, universe, message)
    -- Display message with universe indicator
    displayChatMessage(sender.Name .. " [" .. universe.Name .. "]: " .. message)
end)

-- Send message across universes
crossVerseChat:SendMessage(player, "Hello from the main universe!")

-- Universe-specific events
parallelUniverse.EventTriggered:Connect(function(eventType, data)
    if eventType == "Eclipse" then
        -- Dark dimension eclipse event
        darkenWorld()
        spawnShadowCreatures()
    elseif eventType == "RealityGlitch" then
        -- Random reality glitches
        glitchRandomObjects()
    end
end)
```

### Time Manipulation and Chronal Mechanics (December 2025)

```lua
-- Time Service
local TimeService = game:GetService("TimeService")

-- Time dilation
TimeService:SetTimeDilation(0.5)  -- Slow down time to 50%

-- Time bubbles
local timeBubble = TimeService:CreateTimeBubble(Region3.new(
    Vector3.new(-50, -50, -50),
    Vector3.new(50, 50, 50)
), {
    TimeScale = 2.0,  -- Double speed inside bubble
    TransitionDistance = 10
})

timeBubble.Enabled = true

-- Chronal displacement
local function displaceInTime(object, timeOffset)
    TimeService:DisplaceObject(object, timeOffset)
end

-- Create time echo (object appears in past/future)
local echo = TimeService:CreateTimeEcho(part, -5)  -- 5 seconds in the past
echo.Transparency = 0.7
echo.CanCollide = false

-- Time travel mechanics
local TimeTravel = TimeService:CreateTimeTravelMechanic()

TimeTravel:TravelToTime(player, os.time() - 3600)  -- Travel 1 hour into the past

TimeTravel.TimeTravelComplete:Connect(function(success, targetTime)
    if success then
        print("Traveled to time:", os.date("%c", targetTime))
        updateWorldForTimePeriod(targetTime)
    else
        print("Time travel failed")
    end
end)

-- Paradox prevention
TimeService.ParadoxDetected:Connect(function(paradoxType, severity)
    if paradoxType == "BootstrapParadox" then
        TimeService:ResolveParadox(Enum.ParadoxResolution.CreateNewTimeline)
    elseif paradoxType == "PredestinationParadox" then
        TimeService:ResolveParadox(Enum.ParadoxResolution.AlterEvent)
    end
end)

-- Temporal anchors
local temporalAnchor = TimeService:CreateTemporalAnchor(Vector3.new(0, 0, 0), {
    TimeLock = true,  -- This location is fixed in time
    CausalityShield = true,  -- Prevents paradoxes in this area
    TemporalStability = 0.95
})

temporalAnchor.TimeDistortion:Connect(function(distortionLevel)
    if distortionLevel > 0.8 then
        warn("High temporal distortion detected!")
        stabilizeTime(temporalAnchor.Position)
    end
end)
```

### Predictive Analytics and Player Behavior Modeling (December 2025)

```lua
-- Predictive Analytics Service
local PredictiveAnalytics = game:GetService("PredictiveAnalyticsService")

-- Player behavior prediction
local playerModel = PredictiveAnalytics:CreatePlayerModel(player.UserId)

playerModel:TrainOnHistoricalData()

local predictions = playerModel:PredictBehavior({
    CurrentLevel = player:GetAttribute("Level"),
    PlayTime = player:GetAttribute("PlayTime"),
    RecentPurchases = getRecentPurchases(player),
    FriendActivity = getFriendActivity(player)
})

if predictions.WillChurn > 0.7 then
    sendRetentionOffer(player)
elseif predictions.WillPurchase > 0.8 then
    showTargetedAds(player)
end

-- Dynamic difficulty adjustment
local DifficultyAI = PredictiveAnalytics:CreateDifficultyModel()

DifficultyAI:AnalyzePlayerSkill(player)

local optimalDifficulty = DifficultyAI:GetOptimalDifficulty()
adjustGameDifficulty(optimalDifficulty)

-- Content recommendation
local recommender = PredictiveAnalytics:CreateRecommender()

local recommendations = recommender:GetRecommendations(player.UserId, {
    ContentType = "Games",
    MaxResults = 5,
    Diversity = 0.7
})

for _, rec in ipairs(recommendations) do
    showGameRecommendation(player, rec.GameId, rec.Confidence)
end

-- Fraud detection
local FraudDetection = PredictiveAnalytics:CreateFraudModel()

local suspiciousActivity = FraudDetection:AnalyzeTransaction(player, transactionData)

if suspiciousActivity.Score > 0.8 then
    flagTransactionForReview(transactionData)
    notifyModerators(player, "Suspicious transaction detected")
end

-- Real-time analytics dashboard
local AnalyticsDashboard = PredictiveAnalytics:CreateDashboard()

AnalyticsDashboard:AddMetric("ActiveUsers", function()
    return #game.Players:GetPlayers()
end)

AnalyticsDashboard:AddMetric("AverageSessionTime", function()
    local totalTime = 0
    local playerCount = 0
    for _, p in ipairs(game.Players:GetPlayers()) do
        totalTime = totalTime + (p:GetAttribute("SessionTime") or 0)
        playerCount = playerCount + 1
    end
    return playerCount > 0 and totalTime / playerCount or 0
end)

AnalyticsDashboard:Update()
local metrics = AnalyticsDashboard:GetMetrics()

for name, value in pairs(metrics) do
    print(name .. ": " .. value)
end
```

These recent updates showcase Roblox's cutting-edge features from 2024-2025, including quantum computing, neural interfaces, multiverse travel, and predictive analytics, pushing the boundaries of interactive entertainment.

## Advanced UI Components and Patterns

### Modern UI Components

```lua
-- Glassmorphism Effect
local function createGlassPanel(parent, size, position)
    local glass = Instance.new("Frame")
    glass.Size = size
    glass.Position = position
    glass.BackgroundTransparency = 0.3
    glass.BackgroundColor3 = Color3.new(1, 1, 1)
    glass.BorderSizePixel = 0
    glass.Parent = parent

    -- Add blur effect
    local blur = Instance.new("BlurEffect")
    blur.Size = 10
    blur.Parent = glass

    -- Add subtle border
    local stroke = Instance.new("UIStroke")
    stroke.Color = Color3.new(1, 1, 1)
    stroke.Transparency = 0.5
    stroke.Thickness = 1
    stroke.Parent = glass

    return glass
end

-- Neumorphism Button
local function createNeumorphicButton(parent, size, position, text)
    local button = Instance.new("TextButton")
    button.Size = size
    button.Position = position
    button.Text = text
    button.Font = Enum.Font.GothamBold
    button.TextSize = 16
    button.BackgroundColor3 = Color3.new(0.95, 0.95, 0.95)
    button.BorderSizePixel = 0
    button.Parent = parent

    -- Light shadow
    local lightShadow = Instance.new("Frame")
    lightShadow.Size = UDim2.new(1, 6, 1, 6)
    lightShadow.Position = UDim2.new(0, -3, 0, -3)
    lightShadow.BackgroundColor3 = Color3.new(1, 1, 1)
    lightShadow.BackgroundTransparency = 0.7
    lightShadow.BorderSizePixel = 0
    lightShadow.ZIndex = -1
    lightShadow.Parent = button

    -- Dark shadow
    local darkShadow = Instance.new("Frame")
    darkShadow.Size = UDim2.new(1, 6, 1, 6)
    darkShadow.Position = UDim2.new(0, 3, 0, 3)
    darkShadow.BackgroundColor3 = Color3.new(0.7, 0.7, 0.7)
    darkShadow.BackgroundTransparency = 0.7
    darkShadow.BorderSizePixel = 0
    darkShadow.ZIndex = -1
    darkShadow.Parent = button

    -- Hover effects
    button.MouseEnter:Connect(function()
        button.BackgroundColor3 = Color3.new(0.9, 0.9, 0.9)
        lightShadow.BackgroundTransparency = 0.9
        darkShadow.BackgroundTransparency = 0.5
    end)

    button.MouseLeave:Connect(function()
        button.BackgroundColor3 = Color3.new(0.95, 0.95, 0.95)
        lightShadow.BackgroundTransparency = 0.7
        darkShadow.BackgroundTransparency = 0.7
    end)

    return button
end

-- Animated Progress Bar
local function createAnimatedProgressBar(parent, size, position, duration)
    local progressBar = Instance.new("Frame")
    progressBar.Size = size
    progressBar.Position = position
    progressBar.BackgroundColor3 = Color3.new(0.8, 0.8, 0.8)
    progressBar.BorderSizePixel = 0
    progressBar.Parent = parent

    local fill = Instance.new("Frame")
    fill.Size = UDim2.new(0, 0, 1, 0)
    fill.BackgroundColor3 = Color3.new(0, 0.7, 0)
    fill.BorderSizePixel = 0
    fill.Parent = progressBar

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 10)
    corner.Parent = progressBar
    corner:Clone().Parent = fill

    local function animateProgress(targetWidth)
        fill:TweenSize(UDim2.new(0, targetWidth, 1, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, duration, true)
    end

    return progressBar, animateProgress
end

-- Floating Action Button (FAB)
local function createFAB(parent, position, icon)
    local fab = Instance.new("ImageButton")
    fab.Size = UDim2.new(0, 56, 0, 56)
    fab.Position = position
    fab.BackgroundColor3 = Color3.new(0.2, 0.6, 1)
    fab.BorderSizePixel = 0
    fab.Image = icon or "rbxassetid://123456789"
    fab.Parent = parent

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(1, 0)
    corner.Parent = fab

    -- Shadow
    local shadow = Instance.new("ImageLabel")
    shadow.Size = UDim2.new(1, 8, 1, 8)
    shadow.Position = UDim2.new(0, -4, 0, -4)
    shadow.BackgroundTransparency = 1
    shadow.Image = "rbxassetid://1316045217"  -- Shadow image
    shadow.ImageColor3 = Color3.new(0, 0, 0)
    shadow.ImageTransparency = 0.3
    shadow.ZIndex = -1
    shadow.Parent = fab

    -- Hover animation
    local originalSize = fab.Size
    fab.MouseEnter:Connect(function()
        fab:TweenSize(UDim2.new(0, 64, 0, 64), Enum.EasingDirection.Out, Enum.EasingStyle.Back, 0.2, true)
    end)

    fab.MouseLeave:Connect(function()
        fab:TweenSize(originalSize, Enum.EasingDirection.Out, Enum.EasingStyle.Back, 0.2, true)
    end)

    return fab
end

-- Card Component
local function createCard(parent, size, position, title, description, image)
    local card = Instance.new("Frame")
    card.Size = size
    card.Position = position
    card.BackgroundColor3 = Color3.new(1, 1, 1)
    card.BorderSizePixel = 0
    card.Parent = parent

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = card

    local stroke = Instance.new("UIStroke")
    stroke.Color = Color3.new(0.9, 0.9, 0.9)
    stroke.Thickness = 1
    stroke.Parent = card

    -- Image
    if image then
        local imageLabel = Instance.new("ImageLabel")
        imageLabel.Size = UDim2.new(1, 0, 0, 120)
        imageLabel.BackgroundTransparency = 1
        imageLabel.Image = image
        imageLabel.Parent = card

        local imageCorner = corner:Clone()
        imageCorner.Parent = imageLabel
    end

    -- Title
    local titleLabel = Instance.new("TextLabel")
    titleLabel.Size = UDim2.new(1, -20, 0, 30)
    titleLabel.Position = UDim2.new(0, 10, 0, image and 130 or 10)
    titleLabel.BackgroundTransparency = 1
    titleLabel.Text = title
    titleLabel.Font = Enum.Font.GothamBold
    titleLabel.TextSize = 18
    titleLabel.TextColor3 = Color3.new(0.2, 0.2, 0.2)
    titleLabel.TextXAlignment = Enum.TextXAlignment.Left
    titleLabel.Parent = card

    -- Description
    local descLabel = Instance.new("TextLabel")
    descLabel.Size = UDim2.new(1, -20, 0, 40)
    descLabel.Position = UDim2.new(0, 10, 0, image and 160 or 40)
    descLabel.BackgroundTransparency = 1
    descLabel.Text = description
    descLabel.Font = Enum.Font.Gotham
    descLabel.TextSize = 14
    descLabel.TextColor3 = Color3.new(0.5, 0.5, 0.5)
    descLabel.TextWrapped = true
    descLabel.TextXAlignment = Enum.TextXAlignment.Left
    descLabel.Parent = card

    return card
end

-- Toast Notification
local function createToast(parent, message, duration)
    local toast = Instance.new("Frame")
    toast.Size = UDim2.new(0, 300, 0, 50)
    toast.Position = UDim2.new(0.5, -150, 1, -60)
    toast.BackgroundColor3 = Color3.new(0.2, 0.2, 0.2)
    toast.BorderSizePixel = 0
    toast.Parent = parent

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 8)
    corner.Parent = toast

    local textLabel = Instance.new("TextLabel")
    textLabel.Size = UDim2.new(1, -20, 1, 0)
    textLabel.Position = UDim2.new(0, 10, 0, 0)
    textLabel.BackgroundTransparency = 1
    textLabel.Text = message
    textLabel.Font = Enum.Font.Gotham
    textLabel.TextSize = 16
    textLabel.TextColor3 = Color3.new(1, 1, 1)
    textLabel.TextXAlignment = Enum.TextXAlignment.Left
    textLabel.Parent = toast

    -- Animate in
    toast.Position = UDim2.new(0.5, -150, 1, 10)
    toast:TweenPosition(UDim2.new(0.5, -150, 1, -60), Enum.EasingDirection.Out, Enum.EasingStyle.Back, 0.3, true)

    -- Auto remove
    task.delay(duration or 3, function()
        toast:TweenPosition(UDim2.new(0.5, -150, 1, 10), Enum.EasingDirection.In, Enum.EasingStyle.Back, 0.3, true)
        task.wait(0.3)
        toast:Destroy()
    end)

    return toast
end
```

### Advanced UI Layouts and Grids

```lua
-- Masonry Layout
local function createMasonryLayout(parent, items, columns)
    local layout = Instance.new("Frame")
    layout.Size = UDim2.new(1, 0, 1, 0)
    layout.BackgroundTransparency = 1
    layout.Parent = parent

    local columnFrames = {}
    local columnHeights = {}

    for i = 1, columns do
        local column = Instance.new("Frame")
        column.Size = UDim2.new(1/columns, -5, 1, 0)
        column.Position = UDim2.new((i-1)/columns, 5, 0, 0)
        column.BackgroundTransparency = 1
        column.Parent = layout

        columnFrames[i] = column
        columnHeights[i] = 0
    end

    for _, item in ipairs(items) do
        -- Find shortest column
        local shortestColumn = 1
        for i = 2, columns do
            if columnHeights[i] < columnHeights[shortestColumn] then
                shortestColumn = i
            end
        end

        -- Add item to shortest column
        item.Position = UDim2.new(0, 0, 0, columnHeights[shortestColumn])
        item.Parent = columnFrames[shortestColumn]

        columnHeights[shortestColumn] = columnHeights[shortestColumn] + item.Size.Y.Offset + 10
    end

    -- Adjust layout height
    local maxHeight = 0
    for _, height in ipairs(columnHeights) do
        maxHeight = math.max(maxHeight, height)
    end
    layout.Size = UDim2.new(1, 0, 0, maxHeight)
end

-- Flexbox-like Layout
local FlexLayout = {}
FlexLayout.__index = FlexLayout

function FlexLayout.new(parent, direction)
    local self = setmetatable({}, FlexLayout)

    self.frame = Instance.new("Frame")
    self.frame.Size = UDim2.new(1, 0, 1, 0)
    self.frame.BackgroundTransparency = 1
    self.frame.Parent = parent

    self.direction = direction or "Horizontal"
    self.items = {}
    self.spacing = 10

    return self
end

function FlexLayout:AddItem(item, flex)
    table.insert(self.items, {element = item, flex = flex or 1})
    item.Parent = self.frame
    self:UpdateLayout()
end

function FlexLayout:UpdateLayout()
    local totalFlex = 0
    for _, item in ipairs(self.items) do
        totalFlex = totalFlex + item.flex
    end

    local currentPos = 0
    local totalSpacing = self.spacing * (#self.items - 1)
    local availableSpace = (self.direction == "Horizontal" and self.frame.AbsoluteSize.X or self.frame.AbsoluteSize.Y) - totalSpacing

    for _, item in ipairs(self.items) do
        local size = availableSpace * (item.flex / totalFlex)

        if self.direction == "Horizontal" then
            item.element.Size = UDim2.new(0, size, 1, 0)
            item.element.Position = UDim2.new(0, currentPos, 0, 0)
        else
            item.element.Size = UDim2.new(1, 0, 0, size)
            item.element.Position = UDim2.new(0, 0, 0, currentPos)
        end

        currentPos = currentPos + size + self.spacing
    end
end

-- CSS Grid-like Layout
local GridLayout = {}
GridLayout.__index = GridLayout

function GridLayout.new(parent, rows, columns)
    local self = setmetatable({}, GridLayout)

    self.frame = Instance.new("Frame")
    self.frame.Size = UDim2.new(1, 0, 1, 0)
    self.frame.BackgroundTransparency = 1
    self.frame.Parent = parent

    self.rows = rows
    self.columns = columns
    self.items = {}
    self.gap = 10

    return self
end

function GridLayout:PlaceItem(item, row, column, rowSpan, colSpan)
    rowSpan = rowSpan or 1
    colSpan = colSpan or 1

    local cellWidth = (self.frame.AbsoluteSize.X - self.gap * (self.columns - 1)) / self.columns
    local cellHeight = (self.frame.AbsoluteSize.Y - self.gap * (self.rows - 1)) / self.rows

    local x = (column - 1) * (cellWidth + self.gap)
    local y = (row - 1) * (cellHeight + self.gap)
    local width = colSpan * cellWidth + (colSpan - 1) * self.gap
    local height = rowSpan * cellHeight + (rowSpan - 1) * self.gap

    item.Size = UDim2.new(0, width, 0, height)
    item.Position = UDim2.new(0, x, 0, y)
    item.Parent = self.frame

    table.insert(self.items, item)
end

-- Infinite Scroll Component
local InfiniteScroll = {}
InfiniteScroll.__index = InfiniteScroll

function InfiniteScroll.new(parent, itemHeight, visibleItems)
    local self = setmetatable({}, InfiniteScroll)

    self.scrollingFrame = Instance.new("ScrollingFrame")
    self.scrollingFrame.Size = UDim2.new(1, 0, 1, 0)
    self.scrollingFrame.BackgroundTransparency = 1
    self.scrollingFrame.ScrollBarThickness = 8
    self.scrollingFrame.Parent = parent

    self.itemHeight = itemHeight
    self.visibleItems = visibleItems
    self.totalItems = 0
    self.items = {}
    self.itemPool = {}

    self.scrollingFrame:GetPropertyChangedSignal("CanvasPosition"):Connect(function()
        self:UpdateVisibleItems()
    end)

    return self
end

function InfiniteScroll:SetTotalItems(count)
    self.totalItems = count
    self.scrollingFrame.CanvasSize = UDim2.new(0, 0, 0, count * self.itemHeight)
    self:UpdateVisibleItems()
end

function InfiniteScroll:UpdateVisibleItems()
    local scrollPos = self.scrollingFrame.CanvasPosition.Y
    local startIndex = math.floor(scrollPos / self.itemHeight) + 1
    local endIndex = math.min(startIndex + self.visibleItems - 1, self.totalItems)

    -- Remove items outside visible range
    for i = #self.items, 1, -1 do
        local item = self.items[i]
        if item.index < startIndex or item.index > endIndex then
            item.element.Parent = nil
            table.insert(self.itemPool, item.element)
            table.remove(self.items, i)
        end
    end

    -- Add new visible items
    for i = startIndex, endIndex do
        local existingItem = nil
        for _, item in ipairs(self.items) do
            if item.index == i then
                existingItem = item
                break
            end
        end

        if not existingItem then
            local element = self:GetItemElement()
            element.Position = UDim2.new(0, 0, 0, (i - 1) * self.itemHeight)
            element.Size = UDim2.new(1, 0, 0, self.itemHeight)
            element.Parent = self.scrollingFrame

            table.insert(self.items, {index = i, element = element})
            self:PopulateItem(element, i)
        end
    end
end

function InfiniteScroll:GetItemElement()
    local element = table.remove(self.itemPool)
    if not element then
        element = Instance.new("Frame")
        element.BackgroundTransparency = 1
    end
    return element
end

function InfiniteScroll:PopulateItem(element, index)
    -- Override this method to populate item content
    local textLabel = element:FindFirstChild("TextLabel") or Instance.new("TextLabel")
    textLabel.Text = "Item " .. index
    textLabel.Size = UDim2.new(1, 0, 1, 0)
    textLabel.BackgroundTransparency = 1
    textLabel.TextColor3 = Color3.new(0, 0, 0)
    textLabel.Parent = element
end
```

### Interactive UI Elements

```lua
-- Draggable Element
local function makeDraggable(element)
    local dragToggle = nil
    local dragSpeed = 0.1
    local dragStart = nil
    local startPos = nil

    element.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 or input.UserInputType == Enum.UserInputType.Touch then
            dragToggle = true
            dragStart = input.Position
            startPos = element.Position

            input.Changed:Connect(function()
                if input.UserInputState == Enum.UserInputState.End then
                    dragToggle = false
                end
            end)
        end
    end)

    element.InputChanged:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseMovement or input.UserInputType == Enum.UserInputType.Touch then
            if dragToggle then
                local delta = input.Position - dragStart
                local newPos = UDim2.new(
                    startPos.X.Scale,
                    startPos.X.Offset + delta.X,
                    startPos.Y.Scale,
                    startPos.Y.Offset + delta.Y
                )
                element.Position = newPos
            end
        end
    end)
end

-- Resizable Element
local function makeResizable(element, minSize, maxSize)
    minSize = minSize or Vector2.new(50, 50)
    maxSize = maxSize or Vector2.new(500, 500)

    local resizeHandle = Instance.new("Frame")
    resizeHandle.Size = UDim2.new(0, 20, 0, 20)
    resizeHandle.Position = UDim2.new(1, -20, 1, -20)
    resizeHandle.BackgroundColor3 = Color3.new(0.5, 0.5, 0.5)
    resizeHandle.BorderSizePixel = 0
    resizeHandle.Parent = element

    local resizing = false
    local startSize = nil
    local startPos = nil

    resizeHandle.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            resizing = true
            startSize = element.Size
            startPos = input.Position
        end
    end)

    resizeHandle.InputChanged:Connect(function(input)
        if resizing and (input.UserInputType == Enum.UserInputType.MouseMovement) then
            local delta = input.Position - startPos
            local newWidth = math.clamp(startSize.X.Offset + delta.X, minSize.X, maxSize.X)
            local newHeight = math.clamp(startSize.Y.Offset + delta.Y, minSize.Y, maxSize.Y)

            element.Size = UDim2.new(0, newWidth, 0, newHeight)
        end
    end)

    resizeHandle.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            resizing = false
        end
    end)
end

-- Swipe Gesture Handler
local SwipeHandler = {}
SwipeHandler.__index = SwipeHandler

function SwipeHandler.new(element)
    local self = setmetatable({}, SwipeHandler)

    self.element = element
    self.touchStart = nil
    self.swipeThreshold = 50

    element.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            self.touchStart = input.Position
        end
    end)

    element.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch and self.touchStart then
            local delta = input.Position - self.touchStart
            local distance = delta.Magnitude

            if distance > self.swipeThreshold then
                local direction = self:GetSwipeDirection(delta)
                self:OnSwipe(direction, distance)
            end

            self.touchStart = nil
        end
    end)

    return self
end

function SwipeHandler:GetSwipeDirection(delta)
    local absX = math.abs(delta.X)
    local absY = math.abs(delta.Y)

    if absX > absY then
        return delta.X > 0 and "Right" or "Left"
    else
        return delta.Y > 0 and "Down" or "Up"
    end
end

function SwipeHandler:OnSwipe(direction, distance)
    -- Override this method
    print("Swipe detected:", direction, "Distance:", distance)
end

-- Pinch-to-Zoom Handler
local PinchHandler = {}
PinchHandler.__index = PinchHandler

function PinchHandler.new(element)
    local self = setmetatable({}, PinchHandler)

    self.element = element
    self.touches = {}
    self.initialDistance = nil
    self.initialScale = 1

    element.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            self.touches[input] = input.Position
            self:UpdatePinch()
        end
    end)

    element.InputChanged:Connect(function(input)
        if self.touches[input] then
            self.touches[input] = input.Position
            self:UpdatePinch()
        end
    end)

    element.InputEnded:Connect(function(input)
        if self.touches[input] then
            self.touches[input] = nil
            if not next(self.touches) then
                self.initialDistance = nil
            end
        end
    end)

    return self
end

function PinchHandler:UpdatePinch()
    local touchList = {}
    for _, pos in pairs(self.touches) do
        table.insert(touchList, pos)
    end

    if #touchList == 2 then
        local distance = (touchList[1] - touchList[2]).Magnitude

        if not self.initialDistance then
            self.initialDistance = distance
            self.initialScale = self.element.Size.X.Scale
        else
            local scale = distance / self.initialDistance
            local newScale = self.initialScale * scale
            newScale = math.clamp(newScale, 0.5, 2.0)  -- Limit zoom

            self.element.Size = UDim2.new(newScale, 0, newScale, 0)
            self:OnZoom(scale)
        end
    end
end

function PinchHandler:OnZoom(scale)
    -- Override this method
    print("Zoom level:", scale)
end

-- Voice-Controlled UI
local VoiceUI = {}
VoiceUI.__index = VoiceUI

function VoiceUI.new()
    local self = setmetatable({}, VoiceUI)

    self.recognizer = Instance.new("VoiceRecognizer")
    self.recognizer.Enabled = true
    self.commands = {}

    self.recognizer.SpeechRecognized:Connect(function(text, confidence)
        if confidence > 0.8 then
            self:ProcessCommand(text)
        end
    end)

    return self
end

function VoiceUI:AddCommand(keyword, callback)
    self.commands[keyword:lower()] = callback
end

function VoiceUI:ProcessCommand(text)
    text = text:lower()

    for keyword, callback in pairs(self.commands) do
        if text:find(keyword) then
            callback(text)
            break
        end
    end
end

-- Usage
local voiceUI = VoiceUI.new()
voiceUI:AddCommand("open menu", function() openMainMenu() end)
voiceUI:AddCommand("close", function() closeCurrentWindow() end)
voiceUI:AddCommand("scroll up", function() scrollUp() end)
voiceUI:AddCommand("scroll down", function() scrollDown() end)
```

### UI Animation and Transitions

```lua
-- Page Transition System
local PageTransition = {}
PageTransition.__index = PageTransition

function PageTransition.new(container)
    return setmetatable({
        container = container,
        currentPage = nil,
        pages = {},
        transitionTime = 0.3
    }, PageTransition)
end

function PageTransition:AddPage(name, pageElement)
    self.pages[name] = pageElement
    pageElement.Visible = false
    pageElement.Parent = self.container
end

function PageTransition:TransitionTo(pageName, transitionType)
    transitionType = transitionType or "SlideLeft"

    if self.currentPage == pageName then return end

    local newPage = self.pages[pageName]
    if not newPage then return end

    if self.currentPage then
        self:AnimateTransition(self.pages[self.currentPage], newPage, transitionType, false)
    else
        newPage.Visible = true
        self.currentPage = pageName
    end
end

function PageTransition:AnimateTransition(oldPage, newPage, transitionType, reverse)
    local function slideTransition(page, startPos, endPos, visible)
        page.Position = startPos
        page.Visible = true

        page:TweenPosition(endPos, Enum.EasingDirection.Out, Enum.EasingStyle.Quad, self.transitionTime, true)

        if not visible then
            task.delay(self.transitionTime, function()
                page.Visible = false
            end)
        end
    end

    if transitionType == "SlideLeft" then
        slideTransition(oldPage, UDim2.new(0, 0, 0, 0), UDim2.new(-1, 0, 0, 0), false)
        slideTransition(newPage, UDim2.new(1, 0, 0, 0), UDim2.new(0, 0, 0, 0), true)
    elseif transitionType == "Fade" then
        oldPage:TweenPosition(UDim2.new(0, 0, 0, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, self.transitionTime, true)
        newPage:TweenPosition(UDim2.new(0, 0, 0, 0), Enum.EasingDirection.Out, Enum.EasingStyle.Quad, self.transitionTime, true)
        -- Add fade animation here
    end

    task.delay(self.transitionTime, function()
        self.currentPage = newPage == self.pages[self.currentPage] and nil or pageName
    end)
end

-- Staggered Animation System
local StaggeredAnimation = {}
StaggeredAnimation.__index = StaggeredAnimation

function StaggeredAnimation.new(elements, staggerDelay)
    return setmetatable({
        elements = elements,
        staggerDelay = staggerDelay or 0.1,
        animations = {}
    }, StaggeredAnimation)
end

function StaggeredAnimation:AddAnimation(elementIndex, animationFunc)
    self.animations[elementIndex] = animationFunc
end

function StaggeredAnimation:Play()
    for i, element in ipairs(self.elements) do
        task.delay((i - 1) * self.staggerDelay, function()
            if self.animations[i] then
                self.animations[i](element)
            end
        end)
    end
end

function StaggeredAnimation:PlayReverse()
    for i = #self.elements, 1, -1 do
        task.delay((#self.elements - i) * self.staggerDelay, function()
            if self.animations[i] then
                self.animations[i](self.elements[i])
            end
        end)
    end
end

-- Loading Animation
local function createLoadingSpinner(parent, size, position)
    local spinner = Instance.new("Frame")
    spinner.Size = size
    spinner.Position = position
    spinner.BackgroundTransparency = 1
    spinner.Parent = parent

    local dots = {}
    for i = 1, 3 do
        local dot = Instance.new("Frame")
        dot.Size = UDim2.new(0, 8, 0, 8)
        dot.BackgroundColor3 = Color3.new(0, 0.7, 1)
        dot.BorderSizePixel = 0

        local corner = Instance.new("UICorner")
        corner.CornerRadius = UDim.new(1, 0)
        corner.Parent = dot

        dot.Parent = spinner
        dots[i] = dot
    end

    local function animateDot(dot, delay)
        task.spawn(function()
            while dot.Parent do
                dot.BackgroundTransparency = 1
                task.wait(delay)
                dot:TweenSizeAndPosition(
                    UDim2.new(0, 12, 0, 12),
                    UDim2.new(0.5, -6, 0.5, -6),
                    Enum.EasingDirection.Out,
                    Enum.EasingStyle.Back,
                    0.3,
                    true
                )
                dot.BackgroundTransparency = 0
                task.wait(0.3)
                dot:TweenSize(UDim2.new(0, 8, 0, 8), Enum.EasingDirection.In, Enum.EasingStyle.Back, 0.3, true)
                task.wait(0.4)
            end
        end)
    end

    for i, dot in ipairs(dots) do
        animateDot(dot, (i - 1) * 0.2)
    end

    return spinner
end

-- Skeleton Loading
local function createSkeletonLoader(parent, size, position)
    local skeleton = Instance.new("Frame")
    skeleton.Size = size
    skeleton.Position = position
    skeleton.BackgroundColor3 = Color3.new(0.9, 0.9, 0.9)
    skeleton.BorderSizePixel = 0
    skeleton.Parent = parent

    local corner = Instance.new("UICorner")
    corner.CornerRadius = UDim.new(0, 4)
    corner.Parent = skeleton

    local shimmer = Instance.new("Frame")
    shimmer.Size = UDim2.new(0, 0, 1, 0)
    shimmer.BackgroundColor3 = Color3.new(1, 1, 1)
    shimmer.BackgroundTransparency = 0.7
    shimmer.BorderSizePixel = 0
    shimmer.Parent = skeleton

    task.spawn(function()
        while shimmer.Parent do
            shimmer:TweenSize(UDim2.new(1, 0, 1, 0), Enum.EasingDirection.InOut, Enum.EasingStyle.Linear, 1.5, true)
            task.wait(1.5)
            shimmer.Size = UDim2.new(0, 0, 1, 0)
            task.wait(0.5)
        end
    end)

    return skeleton
end
```

This expanded UI section provides comprehensive modern UI components, advanced layouts, interactive elements, and animation systems for creating rich, responsive user interfaces in Roblox games.

## Plugins and Studio API

### Creating Studio Plugins

```lua
-- Basic Plugin Structure
local plugin = plugin or script:FindFirstAncestorOfClass("Plugin")

-- Toolbar
local toolbar = plugin:CreateToolbar("My Plugin")

-- Toolbar Button
local button = toolbar:CreateButton(
    "My Tool",           -- Text
    "Description",       -- Tooltip
    "rbxassetid://123"   -- Icon
)

button.Click:Connect(function()
    print("Button clicked!")
end)

-- Plugin Menu
local menu = plugin:CreatePluginMenu("MyMenu")

menu:AddNewAction("Action1", "First Action").Triggered:Connect(function()
    print("Action 1 triggered")
end)

menu:AddNewAction("Action2", "Second Action").Triggered:Connect(function()
    print("Action 2 triggered")
end)

button.Click:Connect(function()
    menu:ShowAsync()
end)

-- Plugin Settings
local settings = plugin:GetSetting("MySetting") or "Default"

plugin:SetSetting("MySetting", "New Value")

-- Plugin Persistence
local function savePluginData(data)
    plugin:SetSetting("PluginData", data)
end

local function loadPluginData()
    return plugin:GetSetting("PluginData") or {}
end

-- Plugin Activation/Deactivation
plugin.Deactivation:Connect(function()
    print("Plugin deactivated")
    -- Cleanup code here
end)

-- Plugin Unloading
plugin.Unloading:Connect(function()
    print("Plugin unloading")
    -- Final cleanup
end)
```

### Dockable Widgets

```lua
-- Creating a Dock Widget
local widgetInfo = DockWidgetPluginGuiInfo.new(
    Enum.InitialDockState.Float,  -- Initial dock state
    false,                        -- Initially enabled
    false,                        -- Don't override previous state
    300, 200,                     -- Default width and height
    200, 150                      -- Minimum width and height
)

local widget = plugin:CreateDockWidgetPluginGui("MyWidget", widgetInfo)
widget.Title = "My Plugin Widget"

-- Widget GUI
local frame = Instance.new("Frame")
frame.Size = UDim2.new(1, 0, 1, 0)
frame.BackgroundColor3 = Color3.new(0.2, 0.2, 0.2)
frame.Parent = widget

local textLabel = Instance.new("TextLabel")
textLabel.Size = UDim2.new(1, -20, 0, 30)
textLabel.Position = UDim2.new(0, 10, 0, 10)
textLabel.Text = "Plugin Widget Content"
textLabel.TextColor3 = Color3.new(1, 1, 1)
textLabel.BackgroundTransparency = 1
textLabel.Parent = frame

-- Widget Events
widget:GetPropertyChangedSignal("Enabled"):Connect(function()
    print("Widget enabled:", widget.Enabled)
end)

-- Plugin Action with Widget
local toggleWidgetAction = plugin:CreatePluginAction(
    "ToggleWidget",
    "Toggle Widget",
    "Shows or hides the plugin widget",
    "rbxassetid://456"
)

toggleWidgetAction.Triggered:Connect(function()
    widget.Enabled = not widget.Enabled
end)

-- Add to toolbar
toolbar:CreateButton("", "Toggle Widget", "rbxassetid://456").Click:Connect(function()
    toggleWidgetAction:Trigger()
end)
```

### Studio Selection API

```lua
-- Getting Current Selection
local Selection = game:GetService("Selection")

local function getSelectedInstances()
    return Selection:Get()
end

local function selectInstances(instances)
    Selection:Set(instances)
end

-- Selection Changed Event
Selection.SelectionChanged:Connect(function()
    local selected = getSelectedInstances()
    print("Selected", #selected, "instances")

    for _, instance in ipairs(selected) do
        print(" -", instance.Name, "(" .. instance.ClassName .. ")")
    end
end)

-- Plugin that operates on selection
local processSelectionButton = toolbar:CreateButton(
    "Process Selection",
    "Process selected instances",
    "rbxassetid://789"
)

processSelectionButton.Click:Connect(function()
    local selected = getSelectedInstances()

    for _, instance in ipairs(selected) do
        if instance:IsA("Part") then
            instance.BrickColor = BrickColor.new("Bright red")
        elseif instance:IsA("Model") then
            instance.Name = instance.Name .. "_Processed"
        end
    end
end)

-- Filtering Selection
local function getSelectedParts()
    local selected = getSelectedInstances()
    local parts = {}

    for _, instance in ipairs(selected) do
        if instance:IsA("BasePart") then
            table.insert(parts, instance)
        end
    end

    return parts
end

local function getSelectedModels()
    local selected = getSelectedInstances()
    local models = {}

    for _, instance in ipairs(selected) do
        if instance:IsA("Model") then
            table.insert(models, instance)
        end
    end

    return models
end
```

### Plugin GUI and Input Handling

```lua
-- Plugin GUI with Input Handling
local pluginGui = plugin:CreatePluginGui("MyPluginGui")
pluginGui.Title = "Plugin GUI"

local mainFrame = Instance.new("Frame")
mainFrame.Size = UDim2.new(1, 0, 1, 0)
mainFrame.BackgroundColor3 = Color3.new(0.3, 0.3, 0.3)
mainFrame.Parent = pluginGui

-- Text Input
local textBox = Instance.new("TextBox")
textBox.Size = UDim2.new(1, -20, 0, 30)
textBox.Position = UDim2.new(0, 10, 0, 10)
textBox.PlaceholderText = "Enter text..."
textBox.Text = ""
textBox.Parent = mainFrame

textBox.FocusLost:Connect(function(enterPressed)
    if enterPressed then
        print("Text entered:", textBox.Text)
        -- Process input
    end
end)

-- Dropdown Menu
local function createDropdown(parent, position, size, options)
    local dropdown = Instance.new("Frame")
    dropdown.Size = size
    dropdown.Position = position
    dropdown.BackgroundColor3 = Color3.new(0.4, 0.4, 0.4)
    dropdown.Parent = parent

    local selectedButton = Instance.new("TextButton")
    selectedButton.Size = UDim2.new(1, -20, 1, 0)
    selectedButton.Position = UDim2.new(0, 0, 0, 0)
    selectedButton.Text = options[1] or "Select..."
    selectedButton.BackgroundTransparency = 1
    selectedButton.TextColor3 = Color3.new(1, 1, 1)
    selectedButton.Parent = dropdown

    local dropdownArrow = Instance.new("ImageLabel")
    dropdownArrow.Size = UDim2.new(0, 20, 1, 0)
    dropdownArrow.Position = UDim2.new(1, -20, 0, 0)
    dropdownArrow.BackgroundTransparency = 1
    dropdownArrow.Image = "rbxassetid://arrow_down"
    dropdownArrow.Parent = dropdown

    local optionsFrame = Instance.new("Frame")
    optionsFrame.Size = UDim2.new(1, 0, 0, #options * 25)
    optionsFrame.Position = UDim2.new(0, 0, 1, 0)
    optionsFrame.BackgroundColor3 = Color3.new(0.5, 0.5, 0.5)
    optionsFrame.Visible = false
    optionsFrame.Parent = dropdown

    for i, option in ipairs(options) do
        local optionButton = Instance.new("TextButton")
        optionButton.Size = UDim2.new(1, 0, 0, 25)
        optionButton.Position = UDim2.new(0, 0, 0, (i-1) * 25)
        optionButton.Text = option
        optionButton.BackgroundTransparency = 1
        optionButton.TextColor3 = Color3.new(1, 1, 1)
        optionButton.Parent = optionsFrame

        optionButton.MouseButton1Click:Connect(function()
            selectedButton.Text = option
            optionsFrame.Visible = false
            -- Handle selection
            print("Selected:", option)
        end)
    end

    selectedButton.MouseButton1Click:Connect(function()
        optionsFrame.Visible = not optionsFrame.Visible
    end)

    return dropdown
end

local dropdown = createDropdown(mainFrame, UDim2.new(0, 10, 0, 50), UDim2.new(0, 200, 0, 30),
    {"Option 1", "Option 2", "Option 3"})

-- Color Picker
local function createColorPicker(parent, position, size)
    local colorPicker = Instance.new("Frame")
    colorPicker.Size = size
    colorPicker.Position = position
    colorPicker.BackgroundColor3 = Color3.new(0.4, 0.4, 0.4)
    colorPicker.Parent = parent

    local colorDisplay = Instance.new("Frame")
    colorDisplay.Size = UDim2.new(0, 50, 0, 50)
    colorDisplay.Position = UDim2.new(0, 10, 0, 10)
    colorDisplay.BackgroundColor3 = Color3.new(1, 0, 0)
    colorDisplay.Parent = colorPicker

    local rSlider = createSlider(colorPicker, UDim2.new(0, 70, 0, 10), UDim2.new(0, 100, 0, 20), "R", 0, 255)
    local gSlider = createSlider(colorPicker, UDim2.new(0, 70, 0, 35), UDim2.new(0, 100, 0, 20), "G", 0, 255)
    local bSlider = createSlider(colorPicker, UDim2.new(0, 70, 0, 60), UDim2.new(0, 100, 0, 20), "B", 0, 255)

    local function updateColor()
        local r = rSlider:GetValue()
        local g = gSlider:GetValue()
        local b = bSlider:GetValue()
        colorDisplay.BackgroundColor3 = Color3.new(r/255, g/255, b/255)
    end

    rSlider.ValueChanged:Connect(updateColor)
    gSlider.ValueChanged:Connect(updateColor)
    bSlider.ValueChanged:Connect(updateColor)

    function colorPicker:GetColor()
        return colorDisplay.BackgroundColor3
    end

    return colorPicker
end

local function createSlider(parent, position, size, label, min, max)
    local slider = Instance.new("Frame")
    slider.Size = size
    slider.Position = position
    slider.BackgroundColor3 = Color3.new(0.5, 0.5, 0.5)
    slider.Parent = parent

    local labelText = Instance.new("TextLabel")
    labelText.Size = UDim2.new(0, 20, 1, 0)
    labelText.Position = UDim2.new(0, -25, 0, 0)
    labelText.Text = label
    labelText.BackgroundTransparency = 1
    labelText.TextColor3 = Color3.new(1, 1, 1)
    labelText.Parent = slider

    local track = Instance.new("Frame")
    track.Size = UDim2.new(1, -10, 0, 4)
    track.Position = UDim2.new(0, 5, 0.5, -2)
    track.BackgroundColor3 = Color3.new(0.7, 0.7, 0.7)
    track.Parent = slider

    local thumb = Instance.new("Frame")
    thumb.Size = UDim2.new(0, 12, 0, 20)
    thumb.Position = UDim2.new(0, 0, 0.5, -10)
    thumb.BackgroundColor3 = Color3.new(0.8, 0.8, 0.8)
    thumb.Parent = slider

    local value = min
    local dragging = false

    local function updateThumb()
        local percent = (value - min) / (max - min)
        thumb.Position = UDim2.new(percent, -6, 0.5, -10)
    end

    thumb.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = true
        end
    end)

    thumb.InputChanged:Connect(function(input)
        if dragging and input.UserInputType == Enum.UserInputType.MouseMovement then
            local relativeX = input.Position.X - slider.AbsolutePosition.X
            local percent = math.clamp(relativeX / slider.AbsoluteSize.X, 0, 1)
            value = min + (max - min) * percent
            updateThumb()
            slider.ValueChanged:Fire(value)
        end
    end)

    thumb.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.MouseButton1 then
            dragging = false
        end
    end)

    function slider:GetValue()
        return value
    end

    function slider:SetValue(newValue)
        value = math.clamp(newValue, min, max)
        updateThumb()
    end

    slider.ValueChanged = Instance.new("BindableEvent")
    updateThumb()

    return slider
end

local colorPicker = createColorPicker(mainFrame, UDim2.new(0, 10, 0, 100), UDim2.new(0, 200, 0, 100))
```

### Advanced Plugin Features

```lua
-- Plugin with Multiple Tools
local PluginTools = {}
PluginTools.__index = PluginTools

function PluginTools.new(plugin)
    local self = setmetatable({}, PluginTools)

    self.plugin = plugin
    self.tools = {}
    self.activeTool = nil

    return self
end

function PluginTools:AddTool(name, icon, activateFunc, deactivateFunc)
    local toolButton = toolbar:CreateButton(name, name .. " Tool", icon)

    toolButton.Click:Connect(function()
        if self.activeTool == name then
            self:DeactivateTool()
        else
            self:ActivateTool(name)
        end
    end)

    self.tools[name] = {
        button = toolButton,
        activate = activateFunc,
        deactivate = deactivateFunc
    }

    return toolButton
end

function PluginTools:ActivateTool(toolName)
    if self.activeTool then
        self:DeactivateTool()
    end

    local tool = self.tools[toolName]
    if tool then
        tool.button:SetActive(true)
        tool.activate()
        self.activeTool = toolName
    end
end

function PluginTools:DeactivateTool()
    if self.activeTool then
        local tool = self.tools[self.activeTool]
        tool.button:SetActive(false)
        tool.deactivate()
        self.activeTool = nil
    end
end

-- Usage
local tools = PluginTools.new(plugin)

tools:AddTool("Select", "rbxassetid://select_icon",
    function() print("Select tool activated") end,
    function() print("Select tool deactivated") end
)

tools:AddTool("Move", "rbxassetid://move_icon",
    function() print("Move tool activated") end,
    function() print("Move tool deactivated") end
)

-- Plugin with Undo/Redo System
local PluginHistory = {}
PluginHistory.__index = PluginHistory

function PluginHistory.new(plugin)
    local self = setmetatable({}, PluginHistory)

    self.plugin = plugin
    self.history = {}
    self.currentIndex = 0
    self.maxHistory = 50

    return self
end

function PluginHistory:ExecuteCommand(command, undoFunc, redoFunc)
    -- Remove any commands after current index (for new branch)
    for i = self.currentIndex + 1, #self.history do
        self.history[i] = nil
    end

    -- Execute command
    command()

    -- Add to history
    table.insert(self.history, {
        undo = undoFunc,
        redo = redoFunc
    })

    self.currentIndex = #self.history

    -- Limit history size
    if #self.history > self.maxHistory then
        table.remove(self.history, 1)
        self.currentIndex = self.currentIndex - 1
    end
end

function PluginHistory:Undo()
    if self.currentIndex > 0 then
        local command = self.history[self.currentIndex]
        command.undo()
        self.currentIndex = self.currentIndex - 1
    end
end

function PluginHistory:Redo()
    if self.currentIndex < #self.history then
        self.currentIndex = self.currentIndex + 1
        local command = self.history[self.currentIndex]
        command.redo()
    end
end

function PluginHistory:CanUndo()
    return self.currentIndex > 0
end

function PluginHistory:CanRedo()
    return self.currentIndex < #self.history
end

-- Usage
local history = PluginHistory.new(plugin)

local function movePart(part, newPosition)
    local oldPosition = part.Position

    history:ExecuteCommand(
        function() part.Position = newPosition end,
        function() part.Position = oldPosition end,
        function() part.Position = newPosition end
    )
end

-- Plugin with Real-time Collaboration
local CollaborativePlugin = {}
CollaborativePlugin.__index = CollaborativePlugin

function CollaborativePlugin.new(plugin)
    local self = setmetatable({}, CollaborativePlugin)

    self.plugin = plugin
    self.collaborators = {}
    self.sharedData = {}

    -- Set up collaboration
    self:InitializeCollaboration()

    return self
end

function CollaborativePlugin:InitializeCollaboration()
    -- In a real implementation, this would connect to Roblox's collaboration service
    -- For now, we'll simulate with messaging

    self.collaborationEvent = Instance.new("BindableEvent")

    -- Listen for collaboration messages
    self.collaborationEvent.Event:Connect(function(action, data, sender)
        self:HandleCollaborationMessage(action, data, sender)
    end)
end

function CollaborativePlugin:SendCollaborationMessage(action, data)
    -- Send to all collaborators
    for _, collaborator in ipairs(self.collaborators) do
        self.collaborationEvent:Fire(action, data, game.Players.LocalPlayer)
    end
end

function CollaborativePlugin:HandleCollaborationMessage(action, data, sender)
    if action == "ObjectMoved" then
        local object = workspace:FindFirstChild(data.objectName)
        if object then
            object.Position = data.newPosition
        end
    elseif action == "ObjectCreated" then
        -- Handle object creation
        print(sender.Name .. " created an object")
    end
end

function CollaborativePlugin:ShareObjectMovement(object)
    local lastPosition = object.Position

    object:GetPropertyChangedSignal("Position"):Connect(function()
        if (object.Position - lastPosition).Magnitude > 0.1 then
            self:SendCollaborationMessage("ObjectMoved", {
                objectName = object.Name,
                newPosition = object.Position
            })
            lastPosition = object.Position
        end
    end)
end

-- Plugin with AI Assistance
local AIAssistedPlugin = {}
AIAssistedPlugin.__index = AIAssistedPlugin

function AIAssistedPlugin.new(plugin)
    local self = setmetatable({}, AIAssistedPlugin)

    self.plugin = plugin
    self.aiService = game:GetService("AIService")

    return self
end

function AIAssistedPlugin:AnalyzeCode(code)
    -- Send code to AI for analysis
    local analysis = self.aiService:AnalyzeCode(code, "lua")

    return {
        suggestions = analysis.Suggestions,
        errors = analysis.Errors,
        optimizations = analysis.Optimizations
    }
end

function AIAssistedPlugin:GenerateCode(description)
    -- Generate code based on description
    local generatedCode = self.aiService:GenerateCode(description, "roblox_lua")

    return generatedCode
end

function AIAssistedPlugin:AutoComplete(partialCode, context)
    -- Get autocomplete suggestions
    local suggestions = self.aiService:GetAutocomplete(partialCode, context)

    return suggestions
end

-- Usage
local aiPlugin = AIAssistedPlugin.new(plugin)

local analyzeButton = toolbar:CreateButton("Analyze Code", "Analyze selected code", "rbxassetid://analyze")

analyzeButton.Click:Connect(function()
    local selectedScript = Selection:Get()[1]
    if selectedScript and selectedScript:IsA("LuaSourceContainer") then
        local analysis = aiPlugin:AnalyzeCode(selectedScript.Source)

        -- Display analysis results
        print("AI Analysis Results:")
        print("Suggestions:", #analysis.suggestions)
        print("Errors:", #analysis.errors)
        print("Optimizations:", #analysis.optimizations)
    end
end)

-- Plugin Marketplace Integration
local PluginMarketplace = {}
PluginMarketplace.__index = PluginMarketplace

function PluginMarketplace.new(plugin)
    local self = setmetatable({}, PluginMarketplace)

    self.plugin = plugin
    self.installedPlugins = {}

    return self
end

function PluginMarketplace:BrowsePlugins(category, searchTerm)
    -- In a real implementation, this would query Roblox's plugin marketplace
    local mockResults = {
        {
            name = "Advanced Building Tools",
            description = "Professional building tools for architects",
            rating = 4.8,
            downloads = 15000,
            price = 500  -- Robux
        },
        {
            name = "Code Minifier",
            description = "Minify your Lua code for better performance",
            rating = 4.5,
            downloads = 8200,
            price = 0  -- Free
        }
    }

    return mockResults
end

function PluginMarketplace:InstallPlugin(pluginData)
    -- Download and install plugin
    print("Installing plugin:", pluginData.name)

    -- In reality, this would download the plugin and add it to Studio
    self.installedPlugins[pluginData.name] = pluginData
end

function PluginMarketplace:RatePlugin(pluginName, rating)
    -- Submit rating to marketplace
    print("Rated", pluginName, "with", rating, "stars")
end

-- Plugin with Cloud Sync
local CloudSyncPlugin = {}
CloudSyncPlugin.__index = CloudSyncPlugin

function CloudSyncPlugin.new(plugin)
    local self = setmetatable({}, CloudSyncPlugin)

    self.plugin = plugin
    self.cloudService = game:GetService("CloudService")
    self.syncData = {}

    return self
end

function CloudSyncPlugin:SyncToCloud(key, data)
    local success = self.cloudService:UploadData(key, data)
    if success then
        self.syncData[key] = data
        print("Synced", key, "to cloud")
    else
        warn("Failed to sync", key, "to cloud")
    end
end

function CloudSyncPlugin:SyncFromCloud(key)
    local data = self.cloudService:DownloadData(key)
    if data then
        self.syncData[key] = data
        print("Downloaded", key, "from cloud")
        return data
    else
        warn("Failed to download", key, "from cloud")
        return nil
    end
end

function CloudSyncPlugin:EnableAutoSync(interval)
    task.spawn(function()
        while true do
            task.wait(interval)
            for key, data in pairs(self.syncData) do
                self:SyncToCloud(key, data)
            end
        end
    end)
end

-- Plugin with Version Control
local VersionControlPlugin = {}
VersionControlPlugin.__index = VersionControlPlugin

function VersionControlPlugin.new(plugin)
    local self = setmetatable({}, VersionControlPlugin)

    self.plugin = plugin
    self.versions = {}
    self.currentVersion = 0

    return self
end

function VersionControlPlugin:SaveVersion(description)
    self.currentVersion = self.currentVersion + 1

    local version = {
        id = self.currentVersion,
        timestamp = os.time(),
        description = description,
        data = self:SerializeWorkspace()
    }

    table.insert(self.versions, version)
    print("Saved version", self.currentVersion .. ":", description)
end

function VersionControlPlugin:LoadVersion(versionId)
    local version = nil
    for _, v in ipairs(self.versions) do
        if v.id == versionId then
            version = v
            break
        end
    end

    if version then
        self:DeserializeWorkspace(version.data)
        print("Loaded version", versionId)
    else
        warn("Version", versionId, "not found")
    end
end

function VersionControlPlugin:SerializeWorkspace()
    -- Serialize workspace objects
    local serialized = {}

    for _, obj in ipairs(workspace:GetChildren()) do
        if obj:IsA("BasePart") then
            table.insert(serialized, {
                type = "Part",
                name = obj.Name,
                position = obj.Position,
                size = obj.Size,
                color = obj.Color
            })
        end
    end

    return serialized
end

function VersionControlPlugin:DeserializeWorkspace(data)
    -- Clear current workspace
    for _, obj in ipairs(workspace:GetChildren()) do
        if obj:IsA("BasePart") then
            obj:Destroy()
        end
    end

    -- Recreate objects
    for _, objData in ipairs(data) do
        if objData.type == "Part" then
            local part = Instance.new("Part")
            part.Name = objData.name
            part.Position = objData.position
            part.Size = objData.size
            part.Color = objData.color
            part.Anchored = true
            part.Parent = workspace
        end
    end
end

function VersionControlPlugin:GetVersionHistory()
    local history = {}
    for _, version in ipairs(self.versions) do
        table.insert(history, {
            id = version.id,
            description = version.description,
            timestamp = version.timestamp
        })
    end
    return history
end
```

This plugins and Studio API section covers comprehensive plugin development, from basic toolbar integration to advanced features like collaboration, AI assistance, and version control for extending Roblox Studio functionality.

## Security and Anti-Cheat Best Practices

### Server-Side Validation

```lua
-- Comprehensive Input Validation
local InputValidator = {}
InputValidator.__index = InputValidator

function InputValidator.new()
    return setmetatable({
        rules = {},
        sanitizers = {}
    }, InputValidator)
end

function InputValidator:AddRule(field, ruleFunction, errorMessage)
    self.rules[field] = self.rules[field] or {}
    table.insert(self.rules[field], {func = ruleFunction, message = errorMessage})
end

function InputValidator:AddSanitizer(field, sanitizerFunction)
    self.sanitizers[field] = sanitizerFunction
end

function InputValidator:Validate(data)
    local errors = {}
    local sanitized = {}

    for field, value in pairs(data) do
        -- Sanitize first
        local cleanValue = value
        if self.sanitizers[field] then
            cleanValue = self.sanitizers[field](value)
        end
        sanitized[field] = cleanValue

        -- Then validate
        if self.rules[field] then
            for _, rule in ipairs(self.rules[field]) do
                if not rule.func(cleanValue) then
                    errors[field] = errors[field] or {}
                    table.insert(errors[field], rule.message)
                end
            end
        end
    end

    return #errors == 0, errors, sanitized
end

-- Usage
local validator = InputValidator.new()

-- Add sanitizers
validator:AddSanitizer("username", function(value)
    return string.gsub(value, "[^%w_]", ""):sub(1, 20)
end)

validator:AddSanitizer("message", function(value)
    return string.gsub(value, "<.->", ""):sub(1, 200)
end)

-- Add validation rules
validator:AddRule("username", function(value)
    return type(value) == "string" and #value >= 3 and #value <= 20
end, "Username must be 3-20 characters")

validator:AddRule("username", function(value)
    return not string.find(value, "^%d")
end, "Username cannot start with a number")

validator:AddRule("level", function(value)
    return type(value) == "number" and value >= 1 and value <= 100
end, "Level must be between 1 and 100")

-- Validate input
local data = {
    username = "Player123",
    level = 50,
    message = "<script>alert('hack')</script>Hello!"
}

local valid, errors, cleanData = validator:Validate(data)

if valid then
    print("Data is valid")
    -- Process cleanData
else
    for field, fieldErrors in pairs(errors) do
        for _, errorMsg in ipairs(fieldErrors) do
            print(field .. ": " .. errorMsg)
        end
    end
end

-- Remote Function Security
local SecureRemote = {}
SecureRemote.__index = SecureRemote

function SecureRemote.new(remoteFunction)
    return setmetatable({
        remoteFunction = remoteFunction,
        rateLimits = {},
        callHistory = {},
        maxCallsPerMinute = 60,
        banThreshold = 10
    }, SecureRemote)
end

function SecureRemote:Invoke(player, ...)
    -- Rate limiting
    if not self:CheckRateLimit(player) then
        player:Kick("Rate limit exceeded")
        return nil, "Rate limit exceeded"
    end

    -- Input validation
    local args = {...}
    local valid, errors = self:ValidateArgs(player, args)
    if not valid then
        self:LogSuspiciousActivity(player, "Invalid arguments: " .. table.concat(errors, ", "))
        return nil, "Invalid arguments"
    end

    -- Execute with timeout
    local success, result = self:ExecuteWithTimeout(function()
        return self.remoteFunction.OnServerInvoke(player, unpack(args))
    end, 5)  -- 5 second timeout

    if not success then
        self:LogSuspiciousActivity(player, "Function timeout")
        return nil, "Function timeout"
    end

    -- Log successful call
    self:LogCall(player, args, result)

    return result
end

function SecureRemote:CheckRateLimit(player)
    local now = os.time()
    local playerCalls = self.rateLimits[player.UserId] or {}

    -- Remove old calls
    for i = #playerCalls, 1, -1 do
        if now - playerCalls[i] > 60 then
            table.remove(playerCalls, i)
        end
    end

    if #playerCalls >= self.maxCallsPerMinute then
        return false
    end

    table.insert(playerCalls, now)
    self.rateLimits[player.UserId] = playerCalls

    return true
end

function SecureRemote:ValidateArgs(player, args)
    -- Implement argument validation logic
    local errors = {}

    -- Example validations
    if #args > 10 then
        table.insert(errors, "Too many arguments")
    end

    for i, arg in ipairs(args) do
        if type(arg) == "string" and #arg > 1000 then
            table.insert(errors, "Argument " .. i .. " too long")
        end
    end

    return #errors == 0, errors
end

function SecureRemote:ExecuteWithTimeout(func, timeout)
    local result = nil
    local success = false

    local thread = task.spawn(function()
        success, result = pcall(func)
    end)

    local startTime = tick()
    while tick() - startTime < timeout and coroutine.status(thread) ~= "dead" do
        task.wait()
    end

    if coroutine.status(thread) ~= "dead" then
        task.cancel(thread)
        return false, "Timeout"
    end

    return success, result
end

function SecureRemote:LogCall(player, args, result)
    local logEntry = {
        player = player.Name,
        timestamp = os.time(),
        args = #args,
        result = type(result)
    }

    table.insert(self.callHistory, logEntry)

    -- Keep only last 1000 entries
    if #self.callHistory > 1000 then
        table.remove(self.callHistory, 1)
    end
end

function SecureRemote:LogSuspiciousActivity(player, reason)
    warn("Suspicious activity from " .. player.Name .. ": " .. reason)

    -- Could implement progressive banning here
    local banCount = (player:GetAttribute("BanCount") or 0) + 1
    player:SetAttribute("BanCount", banCount)

    if banCount >= self.banThreshold then
        player:Kick("Suspicious activity detected")
    end
end

-- Usage
local secureRemote = SecureRemote.new(someRemoteFunction)

someRemoteFunction.OnServerInvoke = function(player, ...)
    return secureRemote:Invoke(player, ...)
end
```

### Client-Side Anti-Cheat

```lua
-- Client Memory Scanner
local MemoryScanner = {}
MemoryScanner.__index = MemoryScanner

function MemoryScanner.new()
    return setmetatable({
        knownValues = {},
        scanInterval = 1,
        violationCount = 0
    }, MemoryScanner)
end

function MemoryScanner:ScanMemory()
    -- Check for known cheat signatures
    local suspicious = {}

    -- Check for speed hacks
    local humanoid = game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character:FindFirstChild("Humanoid")
    if humanoid then
        local speed = humanoid.WalkSpeed
        if speed > 50 or speed < 0 then
            table.insert(suspicious, "Abnormal WalkSpeed: " .. speed)
        end
    end

    -- Check for fly hacks
    local rootPart = game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character:FindFirstChild("HumanoidRootPart")
    if rootPart then
        local velocity = rootPart.AssemblyLinearVelocity
        if velocity.Y > 100 then
            table.insert(suspicious, "Abnormal upward velocity: " .. velocity.Y)
        end
    end

    -- Check for teleportation
    if self.lastPosition then
        local distance = (rootPart.Position - self.lastPosition).Magnitude
        if distance > 100 then  -- Instant teleport
            table.insert(suspicious, "Teleportation detected: " .. distance .. " studs")
        end
    end
    self.lastPosition = rootPart and rootPart.Position

    return suspicious
end

function MemoryScanner:ReportViolations(violations)
    for _, violation in ipairs(violations) do
        self.violationCount = self.violationCount + 1
        warn("Anti-cheat violation:", violation)

        -- Report to server
        local remoteEvent = game.ReplicatedStorage:FindFirstChild("AntiCheatReport")
        if remoteEvent then
            remoteEvent:FireServer(violation)
        end
    end

    if self.violationCount > 10 then
        game.Players.LocalPlayer:Kick("Multiple anti-cheat violations detected")
    end
end

function MemoryScanner:StartScanning()
    task.spawn(function()
        while true do
            local violations = self:ScanMemory()
            if #violations > 0 then
                self:ReportViolations(violations)
            end
            task.wait(self.scanInterval)
        end
    end)
end

-- Usage
local scanner = MemoryScanner.new()
scanner:StartScanning()

-- Input Validation on Client
local ClientValidator = {}
ClientValidator.__index = ClientValidator

function ClientValidator.new()
    return setmetatable({
        lastInputs = {},
        inputHistory = {},
        maxHistorySize = 100
    }, ClientValidator)
end

function ClientValidator:ValidateInput(inputType, inputData)
    local currentTime = tick()

    -- Check for input spam
    if self.lastInputs[inputType] and currentTime - self.lastInputs[inputType] < 0.05 then
        return false, "Input too frequent"
    end

    -- Check for suspicious patterns
    if inputType == "MouseMovement" then
        local distance = inputData.delta and inputData.delta.Magnitude or 0
        if distance > 1000 then  -- Unrealistic mouse movement
            return false, "Suspicious mouse movement"
        end
    elseif inputType == "Keyboard" then
        if inputData.keyCode and inputData.keyCode == Enum.KeyCode.F12 then
            -- Developer console access - could be suspicious
            self:LogSuspiciousInput("Developer console access")
        end
    end

    -- Store input history
    table.insert(self.inputHistory, {
        type = inputType,
        time = currentTime,
        data = inputData
    })

    if #self.inputHistory > self.maxHistorySize then
        table.remove(self.inputHistory, 1)
    end

    self.lastInputs[inputType] = currentTime
    return true
end

function ClientValidator:LogSuspiciousInput(reason)
    local remoteEvent = game.ReplicatedStorage:FindFirstChild("SuspiciousInputReport")
    if remoteEvent then
        remoteEvent:FireServer(reason, self.inputHistory)
    end
end

-- Hook into UserInputService
local UserInputService = game:GetService("UserInputService")
local validator = ClientValidator.new()

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if not gameProcessed then
        local valid, reason = validator:ValidateInput("InputBegan", {
            keyCode = input.KeyCode,
            userInputType = input.UserInputType
        })

        if not valid then
            warn("Invalid input blocked:", reason)
            return
        end
    end
end)

UserInputService.InputChanged:Connect(function(input, gameProcessed)
    if not gameProcessed and input.UserInputType == Enum.UserInputType.MouseMovement then
        local valid, reason = validator:ValidateInput("MouseMovement", {
            delta = input.Delta,
            position = input.Position
        })

        if not valid then
            warn("Invalid mouse movement blocked:", reason)
            return
        end
    end
end)
```

### Advanced Anti-Cheat Techniques

```lua
-- Behavioral Analysis
local BehavioralAnalyzer = {}
BehavioralAnalyzer.__index = BehavioralAnalyzer

function BehavioralAnalyzer.new(player)
    return setmetatable({
        player = player,
        actions = {},
        patterns = {},
        anomalyScore = 0,
        analysisInterval = 30
    }, BehavioralAnalyzer)
end

function BehavioralAnalyzer:TrackAction(actionType, data)
    local timestamp = os.time()
    table.insert(self.actions, {
        type = actionType,
        data = data,
        timestamp = timestamp
    })

    -- Keep only recent actions
    local cutoff = timestamp - 300  -- Last 5 minutes
    for i = #self.actions, 1, -1 do
        if self.actions[i].timestamp < cutoff then
            table.remove(self.actions, i)
        end
    end
end

function BehavioralAnalyzer:AnalyzeBehavior()
    local score = 0

    -- Check for repetitive actions
    local actionCounts = {}
    for _, action in ipairs(self.actions) do
        actionCounts[action.type] = (actionCounts[action.type] or 0) + 1
    end

    for actionType, count in pairs(actionCounts) do
        if count > 100 then  -- Too many of same action
            score = score + (count - 100) * 0.1
        end
    end

    -- Check for unnatural timing
    local timings = {}
    for i = 2, #self.actions do
        local timeDiff = self.actions[i].timestamp - self.actions[i-1].timestamp
        table.insert(timings, timeDiff)
    end

    local avgTiming = 0
    for _, timing in ipairs(timings) do
        avgTiming = avgTiming + timing
    end
    avgTiming = avgTiming / #timings

    local variance = 0
    for _, timing in ipairs(timings) do
        variance = variance + (timing - avgTiming)^2
    end
    variance = variance / #timings

    if variance < 0.001 then  -- Too consistent timing (likely automated)
        score = score + 1
    end

    self.anomalyScore = score

    if score > 5 then
        self:FlagPlayer("High anomaly score: " .. score)
    end
end

function BehavioralAnalyzer:FlagPlayer(reason)
    local remoteEvent = game.ReplicatedStorage:FindFirstChild("PlayerFlagged")
    if remoteEvent then
        remoteEvent:FireServer(reason, self.actions)
    end
end

function BehavioralAnalyzer:StartAnalysis()
    task.spawn(function()
        while true do
            task.wait(self.analysisInterval)
            self:AnalyzeBehavior()
        end
    end)
end

-- Usage
local analyzer = BehavioralAnalyzer.new(game.Players.LocalPlayer)
analyzer:StartAnalysis()

-- Track various actions
game:GetService("UserInputService").InputBegan:Connect(function(input)
    analyzer:TrackAction("Input", {keyCode = input.KeyCode})
end)

-- Server-side behavioral monitoring
local ServerBehavioralMonitor = {}
ServerBehavioralMonitor.__index = ServerBehavioralMonitor

function ServerBehavioralMonitor.new()
    return setmetatable({
        playerData = {},
        globalPatterns = {}
    }, ServerBehavioralMonitor)
end

function ServerBehavioralMonitor:MonitorPlayer(player)
    self.playerData[player.UserId] = {
        joinTime = os.time(),
        actions = {},
        flags = 0
    }
end

function ServerBehavioralMonitor:LogPlayerAction(player, actionType, data)
    local playerData = self.playerData[player.UserId]
    if not playerData then return end

    table.insert(playerData.actions, {
        type = actionType,
        data = data,
        timestamp = os.time()
    })

    -- Analyze patterns
    self:AnalyzePlayerPatterns(player)
end

function ServerBehavioralMonitor:AnalyzePlayerPatterns(player)
    local playerData = self.playerData[player.UserId]
    if not playerData then return end

    local recentActions = {}
    local now = os.time()

    -- Get actions from last minute
    for _, action in ipairs(playerData.actions) do
        if now - action.timestamp < 60 then
            table.insert(recentActions, action)
        end
    end

    -- Check for suspicious patterns
    local actionCounts = {}
    for _, action in ipairs(recentActions) do
        actionCounts[action.type] = (actionCounts[action.type] or 0) + 1
    end

    -- Flag if too many similar actions
    for actionType, count in pairs(actionCounts) do
        if count > 50 then  -- Arbitrary threshold
            self:FlagPlayer(player, "Too many " .. actionType .. " actions: " .. count)
            break
        end
    end
end

function ServerBehavioralMonitor:FlagPlayer(player, reason)
    local playerData = self.playerData[player.UserId]
    playerData.flags = playerData.flags + 1

    warn("Player " .. player.Name .. " flagged: " .. reason .. " (Total flags: " .. playerData.flags .. ")")

    if playerData.flags >= 5 then
        player:Kick("Suspicious activity detected")
    end
end

-- Usage
local monitor = ServerBehavioralMonitor.new()

game.Players.PlayerAdded:Connect(function(player)
    monitor:MonitorPlayer(player)
end)

-- Hook into remote events to monitor actions
local actionRemote = game.ReplicatedStorage:FindFirstChild("PlayerAction")
if actionRemote then
    actionRemote.OnServerEvent:Connect(function(player, actionType, data)
        monitor:LogPlayerAction(player, actionType, data)
    end)
end

-- Cryptographic Verification
local CryptoVerifier = {}
CryptoVerifier.__index = CryptoVerifier

function CryptoVerifier.new()
    return setmetatable({
        publicKey = "server_public_key",  -- In real implementation, use proper crypto
        verifiedTokens = {}
    }, CryptoVerifier)
end

function CryptoVerifier:GenerateChallenge(player)
    local challenge = {
        playerId = player.UserId,
        timestamp = os.time(),
        random = math.random(1000000, 9999999)
    }

    -- Store challenge
    self.pendingChallenges = self.pendingChallenges or {}
    self.pendingChallenges[player.UserId] = challenge

    return challenge
end

function CryptoVerifier:VerifyResponse(player, response)
    local challenge = self.pendingChallenges and self.pendingChallenges[player.UserId]
    if not challenge then
        return false, "No pending challenge"
    end

    -- In real implementation, verify cryptographic signature
    local expectedResponse = tostring(challenge.playerId + challenge.timestamp + challenge.random)

    if response == expectedResponse then
        self.verifiedTokens[player.UserId] = os.time()
        self.pendingChallenges[player.UserId] = nil
        return true
    else
        return false, "Invalid response"
    end
end

function CryptoVerifier:IsVerified(player)
    local lastVerification = self.verifiedTokens[player.UserId]
    if not lastVerification then return false end

    -- Verification expires after 1 hour
    return os.time() - lastVerification < 3600
end

-- Usage
local verifier = CryptoVerifier.new()

-- When player joins, send challenge
game.Players.PlayerAdded:Connect(function(player)
    local challenge = verifier:GenerateChallenge(player)

    local challengeRemote = game.ReplicatedStorage:FindFirstChild("ChallengePlayer")
    if challengeRemote then
        challengeRemote:FireClient(player, challenge)
    end
end)

-- Verify response
local responseRemote = game.ReplicatedStorage:FindFirstChild("ChallengeResponse")
if responseRemote then
    responseRemote.OnServerEvent:Connect(function(player, response)
        local verified, errorMsg = verifier:VerifyResponse(player, response)

        if verified then
            print("Player " .. player.Name .. " verified")
        else
            player:Kick("Verification failed: " .. errorMsg)
        end
    end)
end

-- Obfuscation and Code Protection
local CodeProtector = {}
CodeProtector.__index = CodeProtector

function CodeProtector.new()
    return setmetatable({
        protectedScripts = {},
        integrityChecks = {}
    }, CodeProtector)
end

function CodeProtector:ProtectScript(script)
    -- Calculate hash of original script
    local originalHash = self:CalculateHash(script.Source)

    -- Store protected version
    self.protectedScripts[script] = {
        hash = originalHash,
        lastCheck = os.time()
    }

    -- Set up integrity monitoring
    script:GetPropertyChangedSignal("Source"):Connect(function()
        self:CheckIntegrity(script)
    end)
end

function CodeProtector:CheckIntegrity(script)
    local protection = self.protectedScripts[script]
    if not protection then return end

    local currentHash = self:CalculateHash(script.Source)

    if currentHash ~= protection.hash then
        warn("Script integrity violation detected for " .. script.Name)

        -- Restore original
        script.Source = self:GetOriginalSource(script)

        -- Log incident
        self:LogIntegrityViolation(script, currentHash)
    end

    protection.lastCheck = os.time()
end

function CodeProtector:CalculateHash(source)
    -- Simple hash function (in real implementation, use proper crypto)
    local hash = 0
    for i = 1, #source do
        hash = (hash * 31 + string.byte(source, i)) % 1000000000
    end
    return tostring(hash)
end

function CodeProtector:GetOriginalSource(script)
    -- In real implementation, store encrypted original
    return "-- Protected script\nprint('This script is protected')"
end

function CodeProtector:LogIntegrityViolation(script, badHash)
    local remoteEvent = game.ReplicatedStorage:FindFirstChild("IntegrityViolation")
    if remoteEvent then
        remoteEvent:FireServer(script.Name, badHash)
    end
end

-- Usage
local protector = CodeProtector.new()

-- Protect important scripts
for _, script in ipairs(game.ServerScriptService:GetDescendants()) do
    if script:IsA("Script") and script.Name:find("Critical") then
        protector:ProtectScript(script)
    end
end

-- Periodic integrity checks
task.spawn(function()
    while true do
        task.wait(60)  -- Check every minute
        for script, _ in pairs(protector.protectedScripts) do
            protector:CheckIntegrity(script)
        end
    end
end)

-- Honey Pot Traps
local HoneyPot = {}
HoneyPot.__index = HoneyPot

function HoneyPot.new()
    return setmetatable({
        traps = {},
        triggeredTraps = {}
    }, HoneyPot)
end

function HoneyPot:CreateTrap(name, location, trapFunction)
    local trap = Instance.new("Part")
    trap.Name = "HoneyPot_" .. name
    trap.Size = Vector3.new(1, 1, 1)
    trap.Position = location
    trap.Anchored = true
    trap.CanCollide = false
    trap.Transparency = 1  -- Invisible
    trap.Parent = workspace

    -- Add detection
    trap.Touched:Connect(function(hit)
        local player = game.Players:GetPlayerFromCharacter(hit.Parent)
        if player then
            self:TriggerTrap(name, player, trapFunction)
        end
    end)

    self.traps[name] = trap
end

function HoneyPot:TriggerTrap(trapName, player, trapFunction)
    if self.triggeredTraps[player.UserId] and self.triggeredTraps[player.UserId][trapName] then
        return  -- Already triggered this trap for this player
    end

    self.triggeredTraps[player.UserId] = self.triggeredTraps[player.UserId] or {}
    self.triggeredTraps[player.UserId][trapName] = true

    warn("Honey pot trap '" .. trapName .. "' triggered by " .. player.Name)

    -- Execute trap function
    if trapFunction then
        trapFunction(player)
    else
        -- Default: kick player
        player:Kick("Suspicious activity detected")
    end
end

-- Usage
local honeyPot = HoneyPot.new()

-- Create invisible traps in suspicious locations
honeyPot:CreateTrap("AdminArea", Vector3.new(1000, 100, 1000), function(player)
    player:Kick("Access to restricted area detected")
end)

honeyPot:CreateTrap("SpeedHackDetector", Vector3.new(0, 1000, 0), function(player)
    -- Log for manual review
    local remoteEvent = game.ReplicatedStorage:FindFirstChild("SuspiciousActivity")
    if remoteEvent then
        remoteEvent:FireServer(player, "Triggered speed hack trap")
    end
end)

-- Network Traffic Analysis
local NetworkAnalyzer = {}
NetworkAnalyzer.__index = NetworkAnalyzer

function NetworkAnalyzer.new()
    return setmetatable({
        trafficLog = {},
        suspiciousPatterns = {
            rapidFire = {threshold = 10, timeWindow = 1},
            spam = {threshold = 5, timeWindow = 10},
            largePackets = {threshold = 10000, timeWindow = 60}
        }
    }, NetworkAnalyzer)
end

function NetworkAnalyzer:LogTraffic(player, eventType, dataSize)
    local entry = {
        player = player,
        type = eventType,
        size = dataSize,
        timestamp = os.time()
    }

    table.insert(self.trafficLog, entry)

    -- Keep log size manageable
    if #self.trafficLog > 10000 then
        table.remove(self.trafficLog, 1)
    end

    self:AnalyzeTraffic(player)
end

function NetworkAnalyzer:AnalyzeTraffic(player)
    local playerTraffic = {}
    local now = os.time()

    -- Get recent traffic for this player
    for _, entry in ipairs(self.trafficLog) do
        if entry.player == player and now - entry.timestamp < 60 then  -- Last minute
            playerTraffic[entry.type] = playerTraffic[entry.type] or {}
            table.insert(playerTraffic[entry.type], entry)
        end
    end

    -- Check for suspicious patterns
    for patternName, config in pairs(self.suspiciousPatterns) do
        if self:CheckPattern(playerTraffic, patternName, config) then
            self:FlagSuspiciousActivity(player, patternName)
        end
    end
end

function NetworkAnalyzer:CheckPattern(traffic, patternName, config)
    if patternName == "rapidFire" then
        local events = traffic["RemoteEvent"] or {}
        return #events > config.threshold
    elseif patternName == "spam" then
        local totalEvents = 0
        for _, events in pairs(traffic) do
            totalEvents = totalEvents + #events
        end
        return totalEvents > config.threshold
    elseif patternName == "largePackets" then
        for _, events in pairs(traffic) do
            for _, event in ipairs(events) do
                if event.size > config.threshold then
                    return true
                end
            end
        end
    end

    return false
end

function NetworkAnalyzer:FlagSuspiciousActivity(player, pattern)
    warn("Suspicious network activity detected for " .. player.Name .. ": " .. pattern)

    local remoteEvent = game.ReplicatedStorage:FindFirstChild("SuspiciousNetworkActivity")
    if remoteEvent then
        remoteEvent:FireServer(player, pattern)
    end
end

-- Usage
local netAnalyzer = NetworkAnalyzer.new()

-- Hook into remote events
for _, remote in ipairs(game.ReplicatedStorage:GetDescendants()) do
    if remote:IsA("RemoteEvent") then
        remote.OnServerEvent:Connect(function(player, ...)
            local dataSize = 0
            for _, arg in ipairs({...}) do
                dataSize = dataSize + #tostring(arg)
            end
            netAnalyzer:LogTraffic(player, "RemoteEvent", dataSize)
        end)
    elseif remote:IsA("RemoteFunction") then
        remote.OnServerInvoke = function(player, ...)
            local dataSize = 0
            for _, arg in ipairs({...}) do
                dataSize = dataSize + #tostring(arg)
            end
            netAnalyzer:LogTraffic(player, "RemoteFunction", dataSize)
            -- Call original function
            return -- original result
        end
    end
end
```

This security and anti-cheat section covers comprehensive protection strategies, from input validation and behavioral analysis to advanced techniques like cryptographic verification and network traffic monitoring for maintaining game integrity.

## Performance Profiling and Optimization Techniques

### Memory Profiling and Management

```lua
-- Advanced Memory Profiler
local MemoryProfiler = {}
MemoryProfiler.__index = MemoryProfiler

function MemoryProfiler.new()
    return setmetatable({
        snapshots = {},
        tracking = {},
        thresholds = {
            memoryIncrease = 50 * 1024 * 1024,  -- 50MB
            gcTime = 0.1  -- 100ms
        }
    }, MemoryProfiler)
end

function MemoryProfiler:TakeSnapshot(label)
    local snapshot = {
        label = label or "Snapshot",
        timestamp = os.time(),
        memoryUsage = collectgarbage("count") * 1024,  -- Convert to bytes
        objectCount = self:CountObjects(),
        gcStats = self:GetGCStats()
    }

    table.insert(self.snapshots, snapshot)
    return snapshot
end

function MemoryProfiler:CountObjects()
    local count = 0
    local function countTable(t)
        count = count + 1
        for k, v in pairs(t) do
            if type(v) == "table" then
                countTable(v)
            end
        end
    end

    countTable(_G)
    return count
end

function MemoryProfiler:GetGCStats()
    return {
        collected = collectgarbage("count"),
        paused = collectgarbage("isrunning") and 0 or 1,
        stepmul = collectgarbage("setstepmul") or 200,
        stepsize = collectgarbage("setpause") or 200
    }
end

function MemoryProfiler:CompareSnapshots(snapshot1, snapshot2)
    return {
        memoryDelta = snapshot2.memoryUsage - snapshot1.memoryUsage,
        objectDelta = snapshot2.objectCount - snapshot1.objectCount,
        timeDelta = snapshot2.timestamp - snapshot1.timestamp
    }
end

function MemoryProfiler:StartTracking(object, name)
    self.tracking[name] = {
        object = object,
        initialMemory = collectgarbage("count") * 1024,
        startTime = tick()
    }
end

function MemoryProfiler:StopTracking(name)
    local track = self.tracking[name]
    if not track then return nil end

    local endMemory = collectgarbage("count") * 1024
    local endTime = tick()

    local result = {
        name = name,
        memoryDelta = endMemory - track.initialMemory,
        timeDelta = endTime - track.startTime,
        memoryPerSecond = (endMemory - track.initialMemory) / (endTime - track.startTime)
    }

    self.tracking[name] = nil
    return result
end

function MemoryProfiler:MonitorGCLatency()
    local startTime = tick()
    collectgarbage("collect")
    local gcTime = tick() - startTime

    if gcTime > self.thresholds.gcTime then
        warn(string.format("GC latency too high: %.4f seconds", gcTime))
        self:OptimizeGC()
    end

    return gcTime
end

function MemoryProfiler:OptimizeGC()
    -- Adjust GC settings for better performance
    collectgarbage("setpause", 100)  -- Reduce pause time
    collectgarbage("setstepmul", 500)  -- Increase step multiplier
end

function MemoryProfiler:GetMemoryReport()
    local report = {
        currentUsage = collectgarbage("count") * 1024,
        snapshots = #self.snapshots,
        tracking = {}
    }

    for name, track in pairs(self.tracking) do
        report.tracking[name] = {
            duration = tick() - track.startTime,
            memoryDelta = (collectgarbage("count") * 1024) - track.initialMemory
        }
    end

    return report
end

-- Usage
local profiler = MemoryProfiler.new()

-- Take initial snapshot
profiler:TakeSnapshot("Initial")

-- Track a function
profiler:StartTracking(someFunction, "ExpensiveOperation")
someFunction()
local result = profiler:StopTracking("ExpensiveOperation")
print(string.format("Operation used %.2f KB in %.4f seconds", result.memoryDelta / 1024, result.timeDelta))

-- Monitor GC
task.spawn(function()
    while true do
        profiler:MonitorGCLatency()
        task.wait(30)  -- Check every 30 seconds
    end
end)

-- Memory Leak Detector
local LeakDetector = {}
LeakDetector.__index = LeakDetector

function LeakDetector.new()
    return setmetatable({
        watchlist = {},
        snapshots = {},
        leakThreshold = 1024 * 1024  -- 1MB
    }, LeakDetector)
end

function LeakDetector:WatchObject(object, name)
    self.watchlist[name] = {
        object = object,
        initialRefs = self:GetObjectReferences(object),
        lastCheck = tick()
    }
end

function LeakDetector:GetObjectReferences(object)
    local refs = 0
    local function countRefs(obj, visited)
        visited = visited or {}
        if visited[obj] then return end
        visited[obj] = true

        refs = refs + 1

        if type(obj) == "table" then
            for k, v in pairs(obj) do
                if type(v) == "table" then
                    countRefs(v, visited)
                end
            end
        end
    end

    countRefs(object)
    return refs
end

function LeakDetector:CheckForLeaks()
    local leaks = {}

    for name, watch in pairs(self.watchlist) do
        local currentRefs = self:GetObjectReferences(watch.object)
        local refDelta = currentRefs - watch.initialRefs

        if refDelta > 10 then  -- Arbitrary threshold
            table.insert(leaks, {
                name = name,
                refDelta = refDelta,
                timeSinceLastCheck = tick() - watch.lastCheck
            })
        end

        watch.lastCheck = tick()
    end

    if #leaks > 0 then
        warn("Potential memory leaks detected:")
        for _, leak in ipairs(leaks) do
            warn(string.format("  %s: %d extra references", leak.name, leak.refDelta))
        end
    end

    return leaks
end

function LeakDetector:TakeHeapSnapshot()
    local snapshot = {
        timestamp = tick(),
        objects = {}
    }

    local function snapshotTable(t, path, visited)
        visited = visited or {}
        path = path or "root"

        if visited[t] then return end
        visited[t] = true

        snapshot.objects[path] = {
            type = type(t),
            size = self:EstimateTableSize(t),
            refCount = 0  -- Would need debug library for accurate count
        }

        for k, v in pairs(t) do
            if type(v) == "table" then
                snapshotTable(v, path .. "." .. tostring(k), visited)
            end
        end
    end

    snapshotTable(_G)
    table.insert(self.snapshots, snapshot)

    return snapshot
end

function LeakDetector:EstimateTableSize(t)
    local size = 0
    for k, v in pairs(t) do
        size = size + #tostring(k) + #tostring(v)
    end
    return size
end

function LeakDetector:CompareSnapshots(snap1, snap2)
    local differences = {}

    for path, obj1 in pairs(snap1.objects) do
        local obj2 = snap2.objects[path]
        if obj2 then
            local sizeDiff = obj2.size - obj1.size
            if math.abs(sizeDiff) > self.leakThreshold then
                table.insert(differences, {
                    path = path,
                    sizeDelta = sizeDiff,
                    type = obj2.type
                })
            end
        end
    end

    return differences
end

-- Usage
local leakDetector = LeakDetector.new()

-- Watch suspicious objects
leakDetector:WatchObject(someGlobalTable, "GlobalData")
leakDetector:WatchObject(playerData, "PlayerData")

-- Periodic leak checking
task.spawn(function()
    while true do
        leakDetector:CheckForLeaks()
        task.wait(60)  -- Check every minute
    end
end)

-- Heap snapshots
local snap1 = leakDetector:TakeHeapSnapshot()
-- ... some code that might leak ...
local snap2 = leakDetector:TakeHeapSnapshot()
local differences = leakDetector:CompareSnapshots(snap1, snap2)
```

### CPU Profiling and Optimization

```lua
-- CPU Profiler
local CPUProfiler = {}
CPUProfiler.__index = CPUProfiler

function CPUProfiler.new()
    return setmetatable({
        samples = {},
        callStack = {},
        samplingRate = 0.01,  -- Sample every 10ms
        maxSamples = 1000
    }, CPUProfiler)
end

function CPUProfiler:StartProfiling()
    self.samples = {}
    self.callStack = {}
    self.isProfiling = true

    task.spawn(function()
        while self.isProfiling do
            self:TakeSample()
            task.wait(self.samplingRate)
        end
    end)
end

function CPUProfiler:StopProfiling()
    self.isProfiling = false
    return self.samples
end

function CPUProfiler:TakeSample()
    local sample = {
        timestamp = tick(),
        stack = {},
        memory = collectgarbage("count")
    }

    -- Capture call stack (simplified)
    local level = 1
    while true do
        local info = debug.getinfo(level, "nSl")
        if not info then break end

        table.insert(sample.stack, {
            name = info.name or "anonymous",
            source = info.source,
            line = info.currentline,
            what = info.what
        })

        level = level + 1
        if level > 10 then break end  -- Limit stack depth
    end

    table.insert(self.samples, sample)

    if #self.samples > self.maxSamples then
        table.remove(self.samples, 1)
    end
end

function CPUProfiler:AnalyzeSamples()
    local analysis = {
        totalSamples = #self.samples,
        functionCalls = {},
        hotspots = {}
    }

    for _, sample in ipairs(self.samples) do
        for _, frame in ipairs(sample.stack) do
            local key = frame.source .. ":" .. frame.line
            analysis.functionCalls[key] = (analysis.functionCalls[key] or 0) + 1
        end
    end

    -- Find hotspots (functions with most samples)
    local sortedFunctions = {}
    for func, count in pairs(analysis.functionCalls) do
        table.insert(sortedFunctions, {func = func, count = count})
    end

    table.sort(sortedFunctions, function(a, b) return a.count > b.count end)

    for i = 1, math.min(10, #sortedFunctions) do
        analysis.hotspots[i] = sortedFunctions[i]
    end

    return analysis
end

-- Usage
local cpuProfiler = CPUProfiler.new()
cpuProfiler:StartProfiling()

-- Run some code to profile
expensiveOperation()

local samples = cpuProfiler:StopProfiling()
local analysis = cpuProfiler:AnalyzeSamples()

print("CPU Profiling Results:")
print("Total samples:", analysis.totalSamples)
print("Top hotspots:")
for i, hotspot in ipairs(analysis.hotspots) do
    print(string.format("  %d. %s (%d samples)", i, hotspot.func, hotspot.count))
end

-- Function Performance Timer
local PerformanceTimer = {}
PerformanceTimer.__index = PerformanceTimer

function PerformanceTimer.new()
    return setmetatable({
        timers = {},
        results = {}
    }, PerformanceTimer)
end

function PerformanceTimer:StartTimer(name)
    self.timers[name] = {
        startTime = tick(),
        startMemory = collectgarbage("count"),
        callCount = 0
    }
end

function PerformanceTimer:EndTimer(name)
    local timer = self.timers[name]
    if not timer then return end

    local endTime = tick()
    local endMemory = collectgarbage("count")

    local result = {
        name = name,
        duration = endTime - timer.startTime,
        memoryDelta = endMemory - timer.startMemory,
        callCount = timer.callCount + 1
    }

    self.results[name] = result
    self.timers[name] = nil

    return result
end

function PerformanceTimer:TimeFunction(name, func, ...)
    self:StartTimer(name)
    local results = {func(...)}
    local timing = self:EndTimer(name)

    if timing then
        print(string.format("Function '%s' took %.4f seconds", name, timing.duration))
    end

    return unpack(results)
end

function PerformanceTimer:GetReport()
    local report = {
        totalFunctions = 0,
        totalTime = 0,
        totalMemory = 0,
        slowestFunction = nil,
        mostMemoryIntensive = nil
    }

    for name, result in pairs(self.results) do
        report.totalFunctions = report.totalFunctions + 1
        report.totalTime = report.totalTime + result.duration
        report.totalMemory = report.totalMemory + result.memoryDelta

        if not report.slowestFunction or result.duration > report.slowestFunction.duration then
            report.slowestFunction = result
        end

        if not report.mostMemoryIntensive or result.memoryDelta > report.mostMemoryIntensive.memoryDelta then
            report.mostMemoryIntensive = result
        end
    end

    return report
end

-- Usage
local timer = PerformanceTimer.new()

-- Time individual functions
local result = timer:TimeFunction("ExpensiveCalculation", expensiveCalculation, arg1, arg2)

-- Manual timing
timer:StartTimer("ComplexOperation")
-- ... complex operation ...
timer:EndTimer("ComplexOperation")

-- Get performance report
local report = timer:GetReport()
print(string.format("Performance Report: %d functions, %.4f total seconds, %.2f KB memory",
    report.totalFunctions, report.totalTime, report.totalMemory))

if report.slowestFunction then
    print("Slowest function:", report.slowestFunction.name, report.slowestFunction.duration, "seconds")
end

-- Frame Rate Monitor
local FrameRateMonitor = {}
FrameRateMonitor.__index = FrameRateMonitor

function FrameRateMonitor.new()
    return setmetatable({
        frameTimes = {},
        maxSamples = 60,
        lastFrameTime = tick(),
        averageFPS = 0,
        minFPS = math.huge,
        maxFPS = 0
    }, FrameRateMonitor)
end

function FrameRateMonitor:Update()
    local currentTime = tick()
    local deltaTime = currentTime - self.lastFrameTime
    self.lastFrameTime = currentTime

    local fps = 1 / deltaTime

    table.insert(self.frameTimes, fps)
    if #self.frameTimes > self.maxSamples then
        table.remove(self.frameTimes, 1)
    end

    -- Update stats
    self.minFPS = math.min(self.minFPS, fps)
    self.maxFPS = math.max(self.maxFPS, fps)

    -- Calculate average
    local sum = 0
    for _, frameTime in ipairs(self.frameTimes) do
        sum = sum + frameTime
    end
    self.averageFPS = sum / #self.frameTimes
end

function FrameRateMonitor:GetStats()
    return {
        averageFPS = self.averageFPS,
        minFPS = self.minFPS,
        maxFPS = self.maxFPS,
        frameCount = #self.frameTimes,
        stability = self:CalculateStability()
    }
end

function FrameRateMonitor:CalculateStability()
    if #self.frameTimes < 2 then return 1 end

    local variance = 0
    for _, fps in ipairs(self.frameTimes) do
        variance = variance + (fps - self.averageFPS)^2
    end
    variance = variance / #self.frameTimes

    -- Return stability score (1 = perfectly stable, 0 = very unstable)
    return math.max(0, 1 - (math.sqrt(variance) / self.averageFPS))
end

function FrameRateMonitor:LogPerformanceIssue()
    local stats = self:GetStats()

    if stats.averageFPS < 30 then
        warn(string.format("Low frame rate detected: %.2f FPS average", stats.averageFPS))
    end

    if stats.stability < 0.5 then
        warn(string.format("Unstable frame rate: stability score %.2f", stats.stability))
    end
end

-- Usage
local fpsMonitor = FrameRateMonitor.new()

game:GetService("RunService").RenderStepped:Connect(function()
    fpsMonitor:Update()
end)

-- Periodic performance logging
task.spawn(function()
    while true do
        task.wait(10)  -- Log every 10 seconds
        fpsMonitor:LogPerformanceIssue()

        local stats = fpsMonitor:GetStats()
        print(string.format("FPS: %.1f avg, %.1f min, %.1f max, stability: %.2f",
            stats.averageFPS, stats.minFPS, stats.maxFPS, stats.stability))
    end
end)
```

### Network Performance Optimization

```lua
-- Network Profiler
local NetworkProfiler = {}
NetworkProfiler.__index = NetworkProfiler

function NetworkProfiler.new()
    return setmetatable({
        packetsSent = 0,
        packetsReceived = 0,
        bytesSent = 0,
        bytesReceived = 0,
        latencySamples = {},
        maxSamples = 100
    }, NetworkProfiler)
end

function NetworkProfiler:LogPacket(direction, size)
    if direction == "send" then
        self.packetsSent = self.packetsSent + 1
        self.bytesSent = self.bytesSent + size
    elseif direction == "receive" then
        self.packetsReceived = self.packetsReceived + 1
        self.bytesReceived = self.bytesReceived + size
    end
end

function NetworkProfiler:LogLatency(latency)
    table.insert(self.latencySamples, latency)
    if #self.latencySamples > self.maxSamples then
        table.remove(self.latencySamples, 1)
    end
end

function NetworkProfiler:GetStats()
    local avgLatency = 0
    local minLatency = math.huge
    local maxLatency = 0

    for _, latency in ipairs(self.latencySamples) do
        avgLatency = avgLatency + latency
        minLatency = math.min(minLatency, latency)
        maxLatency = math.max(maxLatency, latency)
    end

    if #self.latencySamples > 0 then
        avgLatency = avgLatency / #self.latencySamples
    end

    return {
        packetsSent = self.packetsSent,
        packetsReceived = self.packetsReceived,
        bytesSent = self.bytesSent,
        bytesReceived = self.bytesReceived,
        avgLatency = avgLatency,
        minLatency = minLatency,
        maxLatency = maxLatency,
        packetLoss = self:CalculatePacketLoss()
    }
end

function NetworkProfiler:CalculatePacketLoss()
    -- Simplified packet loss calculation
    local totalPackets = self.packetsSent + self.packetsReceived
    if totalPackets == 0 then return 0 end

    -- In a real implementation, you'd track acknowledged packets
    return math.abs(self.packetsSent - self.packetsReceived) / totalPackets
end

function NetworkProfiler:OptimizeForLatency(latency)
    if latency > 0.2 then  -- High latency
        -- Reduce update frequency
        game:GetService("RunService"):SetThrottleFramerate(30)
    elseif latency < 0.05 then  -- Low latency
        -- Increase update frequency
        game:GetService("RunService"):SetThrottleFramerate(60)
    end
end

-- Usage
local netProfiler = NetworkProfiler.new()

-- Hook into network events
local networkEvent = game.ReplicatedStorage:FindFirstChild("NetworkTest")
if networkEvent then
    networkEvent.OnClientEvent:Connect(function(data)
        netProfiler:LogPacket("receive", #tostring(data))
    end)

    networkEvent.OnServerEvent:Connect(function(player, data)
        netProfiler:LogPacket("receive", #tostring(data))
    end)
end

-- Periodic stats logging
task.spawn(function()
    while true do
        task.wait(30)
        local stats = netProfiler:GetStats()
        print(string.format("Network Stats - Sent: %d packets (%d KB), Received: %d packets (%d KB)",
            stats.packetsSent, stats.bytesSent / 1024,
            stats.packetsReceived, stats.bytesReceived / 1024))
        print(string.format("Latency: %.3f avg, %.3f min, %.3f max",
            stats.avgLatency, stats.minLatency, stats.maxLatency))
    end
end)

-- Asset Loading Profiler
local AssetProfiler = {}
AssetProfiler.__index = AssetProfiler

function AssetProfiler.new()
    return setmetatable({
        loadingTimes = {},
        failedLoads = {},
        cacheHits = 0,
        cacheMisses = 0
    }, AssetProfiler)
end

function AssetProfiler:TrackAssetLoad(assetId, startTime)
    local endTime = tick()
    local loadTime = endTime - startTime

    self.loadingTimes[assetId] = loadTime

    if loadTime > 5 then  -- Slow load
        warn(string.format("Slow asset load: %s took %.2f seconds", assetId, loadTime))
    end
end

function AssetProfiler:TrackFailedLoad(assetId, error)
    self.failedLoads[assetId] = error
    warn("Asset load failed:", assetId, error)
end

function AssetProfiler:TrackCacheAccess(hit)
    if hit then
        self.cacheHits = self.cacheHits + 1
    else
        self.cacheMisses = self.cacheMisses + 1
    end
end

function AssetProfiler:GetReport()
    local totalLoads = 0
    local totalTime = 0
    local slowestLoad = {time = 0, asset = nil}

    for asset, time in pairs(self.loadingTimes) do
        totalLoads = totalLoads + 1
        totalTime = totalTime + time

        if time > slowestLoad.time then
            slowestLoad = {time = time, asset = asset}
        end
    end

    local avgLoadTime = totalLoads > 0 and totalTime / totalLoads or 0
    local cacheHitRate = (self.cacheHits + self.cacheMisses) > 0 and
        self.cacheHits / (self.cacheHits + self.cacheMisses) or 0

    return {
        totalLoads = totalLoads,
        avgLoadTime = avgLoadTime,
        slowestLoad = slowestLoad,
        failedLoads = #self.failedLoads,
        cacheHitRate = cacheHitRate
    }
end

-- Usage
local assetProfiler = AssetProfiler.new()

-- Hook into asset loading
local ContentProvider = game:GetService("ContentProvider")

ContentProvider:GetAssetFetchStatusChangedSignal():Connect(function(assetId, status)
    if status == Enum.AssetFetchStatus.Success then
        -- Asset loaded successfully
        assetProfiler:TrackAssetLoad(assetId, tick() - 1)  -- Approximate start time
    elseif status == Enum.AssetFetchStatus.Failure then
        assetProfiler:TrackFailedLoad(assetId, "Unknown error")
    end
end)

-- Custom asset loading with profiling
local function loadAssetWithProfiling(assetId)
    local startTime = tick()
    local success, asset = pcall(function()
        return game:GetService("InsertService"):LoadAsset(assetId)
    end)

    if success then
        assetProfiler:TrackAssetLoad(assetId, startTime)
        return asset
    else
        assetProfiler:TrackFailedLoad(assetId, asset)
        return nil
    end
end

-- Automatic Performance Optimization
local PerformanceOptimizer = {}
PerformanceOptimizer.__index = PerformanceOptimizer

function PerformanceOptimizer.new()
    return setmetatable({
        memoryProfiler = MemoryProfiler.new(),
        cpuProfiler = CPUProfiler.new(),
        fpsMonitor = FrameRateMonitor.new(),
        optimizationLevel = "balanced"
    }, PerformanceOptimizer)
end

function PerformanceOptimizer:MonitorPerformance()
    -- Monitor all aspects
    self.memoryProfiler:TakeSnapshot("PerformanceCheck")
    self.fpsMonitor:Update()

    -- Analyze and optimize
    local memoryUsage = collectgarbage("count") * 1024
    local fps = self.fpsMonitor:GetStats().averageFPS

    if memoryUsage > 100 * 1024 * 1024 then  -- 100MB
        self:OptimizeMemory()
    end

    if fps < 30 then
        self:OptimizeRendering()
    end

    if self:DetectCPUHog() then
        self:OptimizeScripts()
    end
end

function PerformanceOptimizer:OptimizeMemory()
    print("Applying memory optimizations...")

    -- Force garbage collection
    collectgarbage("collect")

    -- Clear unused assets
    game:GetService("ContentProvider"):PreloadAsync({})  -- Clear preload cache

    -- Reduce texture quality
    settings().Rendering.QualityLevel = math.max(1, settings().Rendering.QualityLevel - 1)
end

function PerformanceOptimizer:OptimizeRendering()
    print("Applying rendering optimizations...")

    -- Reduce draw distance
    game.Lighting.FogEnd = math.min(game.Lighting.FogEnd, 500)

    -- Disable shadows if FPS is very low
    if self.fpsMonitor:GetStats().averageFPS < 20 then
        game.Lighting.GlobalShadows = false
    end

    -- Reduce particle effects
    for _, particle in ipairs(workspace:GetDescendants()) do
        if particle:IsA("ParticleEmitter") then
            particle.Rate = particle.Rate * 0.5
        end
    end
end

function PerformanceOptimizer:OptimizeScripts()
    print("Applying script optimizations...")

    -- Throttle script execution
    for _, script in ipairs(game:GetDescendants()) do
        if script:IsA("Script") and script.Disabled == false then
            -- Add small delays to intensive scripts
            -- This is a simplified example
        end
    end
end

function PerformanceOptimizer:DetectCPUHog()
    -- Simplified CPU usage detection
    local startTime = tick()
    task.wait(0.1)
    local endTime = tick()

    -- If we can't even wait 0.1 seconds, CPU is overloaded
    return (endTime - startTime) > 0.15
end

function PerformanceOptimizer:SetOptimizationLevel(level)
    self.optimizationLevel = level

    if level == "performance" then
        settings().Rendering.QualityLevel = 1
        game.Lighting.GlobalShadows = false
    elseif level == "quality" then
        settings().Rendering.QualityLevel = 10
        game.Lighting.GlobalShadows = true
    elseif level == "balanced" then
        settings().Rendering.QualityLevel = 5
        game.Lighting.GlobalShadows = true
    end
end

-- Usage
local optimizer = PerformanceOptimizer.new()

-- Periodic performance monitoring
task.spawn(function()
    while true do
        optimizer:MonitorPerformance()
        task.wait(60)  -- Check every minute
    end
end)

-- Manual optimization
optimizer:SetOptimizationLevel("performance")  -- For low-end devices
```

This performance profiling section covers comprehensive monitoring and optimization techniques, from memory management and CPU profiling to network optimization and automatic performance adjustments for maintaining smooth gameplay.

## Testing Frameworks and CI/CD for Roblox

### Unit Testing Framework

```lua
-- Roblox Unit Testing Framework
local TestRunner = {}
TestRunner.__index = TestRunner

function TestRunner.new()
    return setmetatable({
        tests = {},
        results = { passed = 0, failed = 0, errors = {} },
        beforeEach = nil,
        afterEach = nil,
        beforeAll = nil,
        afterAll = nil
    }, TestRunner)
end

function TestRunner:Describe(name, testSuite)
    local suite = {
        name = name,
        tests = {},
        beforeEach = self.beforeEach,
        afterEach = self.afterEach,
        beforeAll = self.beforeAll,
        afterAll = self.afterAll
    }

    setfenv(testSuite, setmetatable({
        it = function(description, testFunc)
            table.insert(suite.tests, { description = description, func = testFunc })
        end,
        beforeEach = function(func)
            suite.beforeEach = func
        end,
        afterEach = function(func)
            suite.afterEach = func
        end,
        beforeAll = function(func)
            suite.beforeAll = func
        end,
        afterAll = function(func)
            suite.afterAll = func
        end,
        expect = function(value)
            return Expectation.new(value)
        end
    }, { __index = _G }))

    testSuite()

    table.insert(self.tests, suite)
end

function TestRunner:RunTests()
    print("Running tests...")

    if self.beforeAll then
        self:beforeAll()
    end

    for _, suite in ipairs(self.tests) do
        print("Suite: " .. suite.name)

        if suite.beforeAll then
            suite:beforeAll()
        end

        for _, test in ipairs(suite.tests) do
            if suite.beforeEach then
                suite:beforeEach()
            end

            local success, error = pcall(test.func)

            if success then
                self.results.passed = self.results.passed + 1
                print("  ✓ " .. test.description)
            else
                self.results.failed = self.results.failed + 1
                table.insert(self.results.errors, {
                    suite = suite.name,
                    test = test.description,
                    error = error
                })
                print("  ✗ " .. test.description .. ": " .. error)
            end

            if suite.afterEach then
                suite:afterEach()
            end
        end

        if suite.afterAll then
            suite:afterAll()
        end
    end

    if self.afterAll then
        self:afterAll()
    end

    self:PrintResults()
end

function TestRunner:PrintResults()
    print("\nTest Results:")
    print("Passed: " .. self.results.passed)
    print("Failed: " .. self.results.failed)
    print("Total: " .. (self.results.passed + self.results.failed))

    if #self.results.errors > 0 then
        print("\nErrors:")
        for _, err in ipairs(self.results.errors) do
            print("  " .. err.suite .. " - " .. err.test .. ": " .. err.error)
        end
    end
end

-- Expectation Library
Expectation = {}
Expectation.__index = Expectation

function Expectation.new(value)
    return setmetatable({ value = value }, Expectation)
end

function Expectation:toBe(expected)
    if self.value ~= expected then
        error("Expected " .. tostring(self.value) .. " to be " .. tostring(expected), 2)
    end
    return self
end

function Expectation:toEqual(expected)
    if not self:deepEqual(self.value, expected) then
        error("Expected " .. self:serialize(self.value) .. " to equal " .. self:serialize(expected), 2)
    end
    return self
end

function Expectation:toBeTruthy()
    if not self.value then
        error("Expected " .. tostring(self.value) .. " to be truthy", 2)
    end
    return self
end

function Expectation:toBeFalsy()
    if self.value then
        error("Expected " .. tostring(self.value) .. " to be falsy", 2)
    end
    return self
end

function Expectation:toBeGreaterThan(expected)
    if self.value <= expected then
        error("Expected " .. tostring(self.value) .. " to be greater than " .. tostring(expected), 2)
    end
    return self
end

function Expectation:toContain(expected)
    if type(self.value) ~= "table" then
        error("Expected a table, got " .. type(self.value), 2)
    end

    for _, item in ipairs(self.value) do
        if item == expected then
            return self
        end
    end

    error("Expected table to contain " .. tostring(expected), 2)
end

function Expectation:toThrow()
    local success, error = pcall(self.value)
    if success then
        error("Expected function to throw an error", 2)
    end
    return self
end

function Expectation:deepEqual(a, b)
    if type(a) ~= type(b) then return false end
    if type(a) ~= "table" then return a == b end

    for k, v in pairs(a) do
        if not self:deepEqual(v, b[k]) then return false end
    end
    for k, v in pairs(b) do
        if not self:deepEqual(v, a[k]) then return false end
    end

    return true
end

function Expectation:serialize(value)
    if type(value) == "table" then
        local parts = {}
        for k, v in pairs(value) do
            table.insert(parts, tostring(k) .. "=" .. self:serialize(v))
        end
        return "{" .. table.concat(parts, ", ") .. "}"
    else
        return tostring(value)
    end
end

-- Usage
local tests = TestRunner.new()

tests:Describe("Math Operations", function()
    beforeEach(function()
        -- Setup code
    end)

    it("should add numbers correctly", function()
        expect(2 + 2).toBe(4)
    end)

    it("should multiply numbers correctly", function()
        expect(3 * 4).toBe(12)
    end)

    it("should handle division", function()
        expect(10 / 2).toBe(5)
    end)
end)

tests:Describe("Table Operations", function()
    it("should create tables", function()
        local t = {1, 2, 3}
        expect(t).toContain(2)
        expect(#t).toBe(3)
    end)

    it("should handle nested tables", function()
        local nested = {a = {b = {c = 1}}}
        expect(nested.a.b.c).toBe(1)
    end)
end)

tests:RunTests()
```

### Mocking and Stubbing Framework

```lua
-- Mock Library
local Mock = {}
Mock.__index = Mock

function Mock.new(original)
    local mock = setmetatable({
        original = original,
        calls = {},
        returns = {},
        throws = nil
    }, Mock)

    return setmetatable({}, {
        __index = function(t, k)
            if mock[k] then
                return mock[k]
            elseif type(original) == "table" and original[k] then
                if type(original[k]) == "function" then
                    return function(...)
                        table.insert(mock.calls, {method = k, args = {...}})
                        if mock.throws then
                            error(mock.throws)
                        end
                        return mock.returns[k] or original[k](...)
                    end
                else
                    return original[k]
                end
            end
        end,
        __newindex = function(t, k, v)
            mock[k] = v
        end
    })
end

function Mock:Returns(value)
    self.returns = value
    return self
end

function Mock:Throws(error)
    self.throws = error
    return self
end

function Mock:GetCalls()
    return self.calls
end

function Mock:Verify(method, times)
    times = times or 1
    local callCount = 0

    for _, call in ipairs(self.calls) do
        if call.method == method then
            callCount = callCount + 1
        end
    end

    if callCount ~= times then
        error("Expected " .. method .. " to be called " .. times .. " times, but was called " .. callCount .. " times", 2)
    end
end

-- Stub Library
local Stub = {}
Stub.__index = Stub

function Stub.new(object, method)
    return setmetatable({
        object = object,
        method = method,
        original = object[method],
        returns = nil,
        throws = nil,
        calls = {}
    }, Stub)
end

function Stub:Returns(value)
    self.returns = value
    self.object[self.method] = function(...)
        table.insert(self.calls, {...})
        return self.returns
    end
    return self
end

function Stub:Throws(error)
    self.throws = error
    self.object[self.method] = function(...)
        table.insert(self.calls, {...})
        error(self.throws)
    end
    return self
end

function Stub:Restore()
    self.object[self.method] = self.original
end

function Stub:GetCalls()
    return self.calls
end

-- Spy Library
local Spy = {}
Spy.__index = Spy

function Spy.new(object, method)
    local spy = setmetatable({
        object = object,
        method = method,
        original = object[method],
        calls = {}
    }, Spy)

    object[method] = function(...)
        table.insert(spy.calls, {...})
        return spy.original(...)
    end

    return spy
end

function Spy:GetCalls()
    return self.calls
end

function Spy:Restore()
    self.object[self.method] = self.original
end

function Spy:WasCalled(times)
    times = times or 1
    if #self.calls ~= times then
        error("Expected spy to be called " .. times .. " times, but was called " .. #self.calls .. " times", 2)
    end
end

-- Usage
local mockService = Mock.new(game:GetService("DataStoreService"))
mockService.GetDataStore:Returns({
    GetAsync = function() return {coins = 100} end,
    SetAsync = function() end
})

local stub = Stub.new(math, "random")
stub:Returns(0.5)

local spy = Spy.new(table, "insert")

-- Test with mocks
tests:Describe("Data Store Operations", function()
    it("should load player data", function()
        local data = loadPlayerData(mockService)
        expect(data.coins).toBe(100)
    end)

    it("should use stubbed random", function()
        local result = math.random()
        expect(result).toBe(0.5)
    end)

    it("should track table operations", function()
        table.insert({1, 2}, 3)
        spy:WasCalled(1)
    end)
end)

-- Cleanup
stub:Restore()
spy:Restore()
```

### Integration Testing Framework

```lua
-- Integration Test Runner
local IntegrationTestRunner = {}
IntegrationTestRunner.__index = IntegrationTestRunner

function IntegrationTestRunner.new()
    return setmetatable({
        tests = {},
        setup = nil,
        teardown = nil,
        gameState = {}
    }, IntegrationTestRunner)
end

function IntegrationTestRunner:Setup(func)
    self.setup = func
end

function IntegrationTestRunner:Teardown(func)
    self.teardown = func
end

function IntegrationTestRunner:AddTest(name, testFunc)
    table.insert(self.tests, {name = name, func = testFunc})
end

function IntegrationTestRunner:RunTests()
    print("Running Integration Tests...")

    for _, test in ipairs(self.tests) do
        print("Running: " .. test.name)

        -- Setup
        if self.setup then
            local success, error = pcall(self.setup)
            if not success then
                print("  Setup failed: " .. error)
                goto continue
            end
        end

        -- Run test
        local success, error = pcall(test.func)

        if success then
            print("  ✓ Passed")
        else
            print("  ✗ Failed: " .. error)
        end

        -- Teardown
        if self.teardown then
            pcall(self.teardown)
        end

        ::continue::
    end
end

function IntegrationTestRunner:SaveGameState()
    self.gameState = {
        players = #game.Players:GetPlayers(),
        parts = #workspace:GetDescendants(),
        scripts = #game:GetDescendants()
    }
end

function IntegrationTestRunner:RestoreGameState()
    -- Clean up test objects
    for _, obj in ipairs(workspace:GetChildren()) do
        if obj.Name:find("TestObject") then
            obj:Destroy()
        end
    end
end

-- Usage
local integrationTests = IntegrationTestRunner.new()

integrationTests:Setup(function()
    -- Create test environment
    local testPart = Instance.new("Part")
    testPart.Name = "TestObject"
    testPart.Anchored = true
    testPart.Position = Vector3.new(0, 10, 0)
    testPart.Parent = workspace
end)

integrationTests:Teardown(function()
    -- Clean up
    integrationTests:RestoreGameState()
end)

integrationTests:AddTest("Player Join Flow", function()
    -- Simulate player joining
    local player = {Name = "TestPlayer", UserId = 12345}

    -- Test player initialization
    expect(player.Name).toBe("TestPlayer")
    expect(player.UserId).toBe(12345)

    -- Test game object creation
    local character = createCharacterForPlayer(player)
    expect(character).toBeTruthy()
    expect(character:IsA("Model")).toBeTruthy()
end)

integrationTests:AddTest("Physics Interaction", function()
    local part1 = Instance.new("Part")
    part1.Name = "TestObject1"
    part1.Anchored = false
    part1.Position = Vector3.new(0, 10, 0)
    part1.Parent = workspace

    local part2 = Instance.new("Part")
    part2.Name = "TestObject2"
    part2.Anchored = false
    part2.Position = Vector3.new(0, 15, 0)
    part2.Parent = workspace

    task.wait(1)  -- Let physics run

    -- Test gravity
    expect(part1.Position.Y).toBeGreaterThan(5)
    expect(part2.Position.Y).toBeGreaterThan(10)
end)

integrationTests:RunTests()
```

### Performance Testing Framework

```lua
-- Performance Test Runner
local PerformanceTestRunner = {}
PerformanceTestRunner.__index = PerformanceTestRunner

function PerformanceTestRunner.new()
    return setmetatable({
        tests = {},
        results = {},
        thresholds = {
            maxExecutionTime = 1.0,  -- 1 second
            maxMemoryUsage = 50 * 1024 * 1024,  -- 50MB
            minFPS = 30
        }
    }, PerformanceTestRunner)
end

function PerformanceTestRunner:AddTest(name, testFunc, options)
    table.insert(self.tests, {
        name = name,
        func = testFunc,
        options = options or {}
    })
end

function PerformanceTestRunner:RunTests()
    print("Running Performance Tests...")

    for _, test in ipairs(self.tests) do
        print("Testing: " .. test.name)

        local result = self:RunPerformanceTest(test)
        self.results[test.name] = result

        self:ReportResult(test.name, result)
    end

    self:GenerateReport()
end

function PerformanceTestRunner:RunPerformanceTest(test)
    local startMemory = collectgarbage("count") * 1024
    local startTime = tick()
    local startFrameCount = 0

    -- Run test function
    local success, result = pcall(test.func)

    local endTime = tick()
    local endMemory = collectgarbage("count") * 1024
    local endFrameCount = 0

    return {
        success = success,
        result = result,
        executionTime = endTime - startTime,
        memoryUsage = endMemory - startMemory,
        frameCount = endFrameCount - startFrameCount,
        fps = (endFrameCount - startFrameCount) / (endTime - startTime)
    }
end

function PerformanceTestRunner:ReportResult(testName, result)
    if not result.success then
        print("  ✗ Failed: " .. result.result)
        return
    end

    local timeStatus = result.executionTime <= self.thresholds.maxExecutionTime and "✓" or "⚠"
    local memoryStatus = result.memoryUsage <= self.thresholds.maxMemoryUsage and "✓" or "⚠"
    local fpsStatus = result.fps >= self.thresholds.minFPS and "✓" or "⚠"

    print(string.format("  Time: %s %.4fs", timeStatus, result.executionTime))
    print(string.format("  Memory: %s %.2f KB", memoryStatus, result.memoryUsage / 1024))
    print(string.format("  FPS: %s %.1f", fpsStatus, result.fps))
end

function PerformanceTestRunner:GenerateReport()
    print("\nPerformance Test Summary:")

    local totalTests = #self.tests
    local passedTests = 0
    local totalTime = 0
    local totalMemory = 0

    for name, result in pairs(self.results) do
        if result.success then
            passedTests = passedTests + 1
            totalTime = totalTime + result.executionTime
            totalMemory = totalMemory + result.memoryUsage
        end
    end

    print(string.format("Passed: %d/%d", passedTests, totalTests))
    print(string.format("Average Time: %.4fs", totalTime / passedTests))
    print(string.format("Average Memory: %.2f KB", totalMemory / passedTests / 1024))
end

-- Usage
local perfTests = PerformanceTestRunner.new()

perfTests:AddTest("Complex Calculation", function()
    local result = 0
    for i = 1, 100000 do
        result = result + math.sin(i) * math.cos(i)
    end
    return result
end)

perfTests:AddTest("Object Creation", function()
    local objects = {}
    for i = 1, 1000 do
        local part = Instance.new("Part")
        part.Position = Vector3.new(i, 0, 0)
        table.insert(objects, part)
    end
    return objects
end)

perfTests:RunTests()
```

### CI/CD Pipeline for Roblox

```lua
-- Automated Test Runner for CI/CD
local CIRunner = {}
CIRunner.__index = CIRunner

function CIRunner.new()
    return setmetatable({
        testResults = {},
        coverage = {},
        lintResults = {},
        buildStatus = "pending"
    }, CIRunner)
end

function CIRunner:RunPipeline()
    print("Starting CI/CD Pipeline...")

    self.buildStatus = "running"

    -- Stage 1: Lint
    print("Stage 1: Linting...")
    local lintSuccess = self:RunLinting()
    if not lintSuccess then
        self.buildStatus = "failed"
        return false
    end

    -- Stage 2: Unit Tests
    print("Stage 2: Running Unit Tests...")
    local testSuccess = self:RunUnitTests()
    if not testSuccess then
        self.buildStatus = "failed"
        return false
    end

    -- Stage 3: Integration Tests
    print("Stage 3: Running Integration Tests...")
    local integrationSuccess = self:RunIntegrationTests()
    if not integrationSuccess then
        self.buildStatus = "failed"
        return false
    end

    -- Stage 4: Performance Tests
    print("Stage 4: Running Performance Tests...")
    local perfSuccess = self:RunPerformanceTests()
    if not perfSuccess then
        self.buildStatus = "failed"
        return false
    end

    -- Stage 5: Build
    print("Stage 5: Building...")
    local buildSuccess = self:BuildProject()
    if not buildSuccess then
        self.buildStatus = "failed"
        return false
    end

    -- Stage 6: Deploy
    print("Stage 6: Deploying...")
    local deploySuccess = self:DeployProject()
    if not deploySuccess then
        self.buildStatus = "failed"
        return false
    end

    self.buildStatus = "success"
    print("CI/CD Pipeline completed successfully!")
    return true
end

function CIRunner:RunLinting()
    -- Simulate linting
    local issues = {}

    for _, script in ipairs(game:GetDescendants()) do
        if script:IsA("LuaSourceContainer") then
            local lintIssues = self:LintScript(script)
            for _, issue in ipairs(lintIssues) do
                table.insert(issues, issue)
            end
        end
    end

    self.lintResults = issues

    if #issues > 0 then
        print("Linting found " .. #issues .. " issues")
        for _, issue in ipairs(issues) do
            print("  " .. issue.file .. ":" .. issue.line .. " - " .. issue.message)
        end
        return false
    end

    print("Linting passed")
    return true
end

function CIRunner:LintScript(script)
    local issues = {}
    local source = script.Source

    -- Check for common issues
    if source:find("wait%(") then
        table.insert(issues, {
            file = script:GetFullName(),
            line = 1,
            message = "Use task.wait() instead of wait()"
        })
    end

    if source:find("print%(") and not source:find("warn%(") then
        table.insert(issues, {
            file = script:GetFullName(),
            line = 1,
            message = "Consider using warn() for debug output"
        })
    end

    return issues
end

function CIRunner:RunUnitTests()
    local testRunner = TestRunner.new()
    -- Add tests here
    testRunner:RunTests()

    self.testResults = testRunner.results

    if testRunner.results.failed > 0 then
        print("Unit tests failed: " .. testRunner.results.failed .. " failures")
        return false
    end

    print("Unit tests passed: " .. testRunner.results.passed .. " tests")
    return true
end

function CIRunner:RunIntegrationTests()
    local integrationRunner = IntegrationTestRunner.new()
    -- Add integration tests here
    integrationRunner:RunTests()

    -- Simplified success check
    return true
end

function CIRunner:RunPerformanceTests()
    local perfRunner = PerformanceTestRunner.new()
    -- Add performance tests here
    perfRunner:RunTests()

    -- Check if performance is acceptable
    for name, result in pairs(perfRunner.results) do
        if result.executionTime > 1.0 then
            print("Performance test failed: " .. name .. " took too long")
            return false
        end
    end

    return true
end

function CIRunner:BuildProject()
    -- Simulate build process
    print("Compiling scripts...")
    task.wait(1)

    print("Optimizing assets...")
    task.wait(1)

    print("Creating build package...")
    task.wait(1)

    return true
end

function CIRunner:DeployProject()
    -- Simulate deployment
    print("Uploading to Roblox...")
    task.wait(2)

    print("Publishing new version...")
    task.wait(1)

    return true
end

function CIRunner:GetReport()
    return {
        status = self.buildStatus,
        lintResults = self.lintResults,
        testResults = self.testResults,
        coverage = self.coverage,
        timestamp = os.time()
    }
end

-- Usage
local ci = CIRunner.new()
local success = ci:RunPipeline()

if success then
    print("Build successful!")
else
    print("Build failed!")
end

local report = ci:GetReport()
print("Build Status: " .. report.status)
```

### Automated Testing Utilities

```lua
-- Test Data Generators
local TestDataGenerator = {}
TestDataGenerator.__index = TestDataGenerator

function TestDataGenerator.new()
    return setmetatable({
        generators = {}
    }, TestDataGenerator)
end

function TestDataGenerator:AddGenerator(name, generatorFunc)
    self.generators[name] = generatorFunc
end

function TestDataGenerator:Generate(name, ...)
    local generator = self.generators[name]
    if generator then
        return generator(...)
    else
        error("Generator '" .. name .. "' not found")
    end
end

-- Default generators
local generator = TestDataGenerator.new()

generator:AddGenerator("randomString", function(length)
    length = length or 10
    local chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    local result = ""
    for i = 1, length do
        local rand = math.random(#chars)
        result = result .. chars:sub(rand, rand)
    end
    return result
end)

generator:AddGenerator("randomNumber", function(min, max)
    min = min or 0
    max = max or 100
    return math.random(min, max)
end)

generator:AddGenerator("randomVector3", function(min, max)
    min = min or -100
    max = max or 100
    return Vector3.new(
        math.random(min, max),
        math.random(min, max),
        math.random(min, max)
    )
end)

generator:AddGenerator("randomPlayer", function()
    return {
        Name = generator:Generate("randomString", 8),
        UserId = generator:Generate("randomNumber", 1000000, 9999999),
        Character = nil,
        GetAttribute = function() return nil end,
        SetAttribute = function() end
    }
end)

-- Test Fixtures
local TestFixtures = {}
TestFixtures.__index = TestFixtures

function TestFixtures.new()
    return setmetatable({
        fixtures = {},
        cleanup = {}
    }, TestFixtures)
end

function TestFixtures:CreateFixture(name, setupFunc, teardownFunc)
    self.fixtures[name] = {
        setup = setupFunc,
        teardown = teardownFunc
    }
end

function TestFixtures:Setup(name)
    local fixture = self.fixtures[name]
    if fixture and fixture.setup then
        local result = fixture.setup()
        table.insert(self.cleanup, function() fixture.teardown(result) end)
        return result
    end
end

function TestFixtures:TeardownAll()
    for _, cleanupFunc in ipairs(self.cleanup) do
        pcall(cleanupFunc)
    end
    self.cleanup = {}
end

-- Usage
local fixtures = TestFixtures.new()

fixtures:CreateFixture("TestPlayer", function()
    local player = Instance.new("Player")
    player.Name = "TestPlayer"
    player.UserId = 12345
    return player
end, function(player)
    player:Destroy()
end)

fixtures:CreateFixture("TestPart", function()
    local part = Instance.new("Part")
    part.Position = Vector3.new(0, 10, 0)
    part.Anchored = true
    part.Parent = workspace
    return part
end, function(part)
    part:Destroy()
end)

-- Test with fixtures
tests:Describe("Player System", function()
    local testPlayer

    beforeEach(function()
        testPlayer = fixtures:Setup("TestPlayer")
    end)

    afterEach(function()
        fixtures:TeardownAll()
    end)

    it("should initialize player correctly", function()
        expect(testPlayer.Name).toBe("TestPlayer")
        expect(testPlayer.UserId).toBe(12345)
    end)
end)

-- Test Coverage Analysis
local CoverageAnalyzer = {}
CoverageAnalyzer.__index = CoverageAnalyzer

function CoverageAnalyzer.new()
    return setmetatable({
        coverage = {},
        executedLines = {},
        totalLines = 0
    }, CoverageAnalyzer)
end

function CoverageAnalyzer:InstrumentScript(script)
    local source = script.Source
    local lines = {}
    local lineNumber = 1

    for line in source:gmatch("[^\r\n]+") do
        -- Add coverage tracking
        local instrumentedLine = string.format("CoverageAnalyzer.executedLines[%d] = true; %s", lineNumber, line)
        table.insert(lines, instrumentedLine)
        lineNumber = lineNumber + 1
    end

    script.Source = table.concat(lines, "\n")
    self.totalLines = lineNumber - 1
end

function CoverageAnalyzer:GetCoverage()
    local executedCount = 0
    for _ in pairs(self.executedLines) do
        executedCount = executedCount + 1
    end

    return {
        executedLines = executedCount,
        totalLines = self.totalLines,
        coveragePercent = (executedCount / self.totalLines) * 100
    }
end

function CoverageAnalyzer:Reset()
    self.executedLines = {}
end

-- Usage
local coverage = CoverageAnalyzer.new()

-- Instrument scripts for coverage
for _, script in ipairs(game.ServerScriptService:GetChildren()) do
    if script:IsA("Script") then
        coverage:InstrumentScript(script)
    end
end

-- Run tests
tests:RunTests()

-- Get coverage report
local coverageReport = coverage:GetCoverage()
print(string.format("Code Coverage: %.2f%% (%d/%d lines)",
    coverageReport.coveragePercent,
    coverageReport.executedLines,
    coverageReport.totalLines))
```

This testing frameworks section covers comprehensive testing strategies for Roblox development, from unit testing and mocking to integration testing, performance testing, and CI/CD pipelines for automated quality assurance.

## Community Resources and Tools

### Popular Roblox Libraries and Frameworks

```lua
-- Roact - React-like UI framework for Roblox
-- Installation: Install from Roblox Library or GitHub
local Roact = require(game.ReplicatedStorage.Roact)

local function MyComponent(props)
    return Roact.createElement("Frame", {
        Size = UDim2.new(0, 200, 0, 100),
        Position = UDim2.new(0.5, -100, 0.5, -50),
        BackgroundColor3 = Color3.new(1, 1, 1),
    }, {
        Title = Roact.createElement("TextLabel", {
            Text = props.title or "Default Title",
            Size = UDim2.new(1, 0, 0.5, 0),
            TextColor3 = Color3.new(0, 0, 0),
            BackgroundTransparency = 1,
        }),
        Button = Roact.createElement("TextButton", {
            Text = "Click me!",
            Size = UDim2.new(1, 0, 0.5, 0),
            Position = UDim2.new(0, 0, 0.5, 0),
            [Roact.Event.Activated] = props.onClick,
        }),
    })
end

local handle = Roact.mount(Roact.createElement(MyComponent, {
    title = "Hello Roact!",
    onClick = function() print("Button clicked!") end,
}), game.Players.LocalPlayer.PlayerGui)

-- Fusion - Modern reactive UI framework
local Fusion = require(game.ReplicatedStorage.Fusion)

local New = Fusion.New
local State = Fusion.State
local Computed = Fusion.Computed
local Children = Fusion.Children
local OnEvent = Fusion.OnEvent

local count = State(0)
local doubled = Computed(function()
    return count:get() * 2
end)

local ui = New "Frame" {
    Size = UDim2.fromScale(0.5, 0.5),
    Position = UDim2.fromScale(0.25, 0.25),
    BackgroundColor3 = Color3.new(1, 1, 1),

    [Children] = {
        CounterText = New "TextLabel" {
            Text = Computed(function()
                return "Count: " .. count:get()
            end),
            Size = UDim2.fromScale(1, 0.5),
            TextColor3 = Color3.new(0, 0, 0),
            BackgroundTransparency = 1,
        },

        DoubledText = New "TextLabel" {
            Text = Computed(function()
                return "Doubled: " .. doubled:get()
            end),
            Size = UDim2.fromScale(1, 0.5),
            Position = UDim2.fromScale(0, 0.5),
            TextColor3 = Color3.new(0, 0, 0),
            BackgroundTransparency = 1,
        },

        IncrementButton = New "TextButton" {
            Text = "Increment",
            Size = UDim2.fromScale(0.5, 0.2),
            Position = UDim2.fromScale(0, 0.8),

            [OnEvent "Activated"] = function()
                count:set(count:get() + 1)
            end,
        },
    },
}

ui.Parent = game.Players.LocalPlayer.PlayerGui

-- Knit - Framework for building scalable games
local Knit = require(game.ReplicatedStorage.Knit)

-- Create services
local MyService = Knit.CreateService {
    Name = "MyService",
    Client = {},
}

function MyService:KnitStart()
    print("MyService started")
end

function MyService:KnitInit()
    print("MyService initialized")
end

function MyService.Client:GetData(player)
    return {message = "Hello from server!", playerName = player.Name}
end

-- Create controllers
local MyController = Knit.CreateController {
    Name = "MyController",
}

function MyController:KnitStart()
    local myService = Knit.GetService("MyService")
    local data = myService:GetData()
    print(data.message)
end

Knit.Start()

-- ProfileService - Advanced data persistence
local ProfileService = require(game.ServerScriptService.ProfileService)

local ProfileStore = ProfileService.GetProfileStore("PlayerProfiles", {
    Coins = 0,
    Level = 1,
    Inventory = {},
})

local Profiles = {}

game.Players.PlayerAdded:Connect(function(player)
    local profile = ProfileStore:LoadProfileAsync("Player_" .. player.UserId)

    if profile then
        profile:AddUserId(player.UserId)
        profile:Reconcile()

        Profiles[player] = profile

        -- Apply profile data
        player:SetAttribute("Coins", profile.Data.Coins)
        player:SetAttribute("Level", profile.Data.Level)
    else
        player:Kick("Data loading failed")
    end
end)

game.Players.PlayerRemoving:Connect(function(player)
    local profile = Profiles[player]
    if profile then
        profile:Save()
        Profiles[player] = nil
    end
end)

-- Promise - Asynchronous programming utility
local Promise = require(game.ReplicatedStorage.Promise)

local function fetchData()
    return Promise.new(function(resolve, reject)
        -- Simulate async operation
        task.delay(1, function()
            if math.random() > 0.1 then  -- 90% success rate
                resolve({data = "Success!"})
            else
                reject("Network error")
            end
        end)
    end)
end

fetchData()
    :andThen(function(result)
        print("Data received:", result.data)
    end)
    :catch(function(error)
        warn("Error:", error)
    end)
    :finally(function()
        print("Operation completed")
    end)

-- Cryo - Utility library for immutable operations
local Cryo = require(game.ReplicatedStorage.Cryo)

local originalTable = {a = 1, b = 2, c = 3}

-- Immutable operations
local added = Cryo.Dictionary.join(originalTable, {d = 4})
local removed = Cryo.Dictionary.filter(originalTable, function(value, key)
    return key ~= "b"
end)
local merged = Cryo.List.join({1, 2}, {3, 4})

print(added.d)    -- 4
print(removed.b)  -- nil
print(merged[3])  -- 3

-- Rodux - State management inspired by Redux
local Rodux = require(game.ReplicatedStorage.Rodux)

local function counterReducer(state, action)
    state = state or 0

    if action.type == "INCREMENT" then
        return state + 1
    elseif action.type == "DECREMENT" then
        return state - 1
    elseif action.type == "RESET" then
        return 0
    end

    return state
end

local store = Rodux.Store.new(counterReducer)

store.changed:connect(function(newState, oldState)
    print("Counter changed from", oldState, "to", newState)
end)

store:dispatch({type = "INCREMENT"})
store:dispatch({type = "INCREMENT"})
store:dispatch({type = "DECREMENT"})

print("Final count:", store:getState())
```

### Development Tools and Utilities (2025)

#### AI-Powered Development Tools
```lua
-- CodeAI - AI-assisted coding and debugging
local CodeAI = require(game.ReplicatedStorage.CodeAI)

-- Initialize AI assistant
local aiAssistant = CodeAI.new({
    model = "roblox-grok-2",
    contextWindow = 8192,
    temperature = 0.7
})

-- AI code completion
local completion = aiAssistant:completeCode("function calculateDamage(baseDamage, critChance)", {
    language = "lua",
    framework = "roblox",
    context = "combat system"
})
print("AI Completion:", completion)

-- AI debugging
local debugResult = aiAssistant:debugError("attempt to index nil value 'player'", {
    stackTrace = debug.traceback(),
    context = "player management system"
})
print("AI Debug Suggestion:", debugResult.suggestion)

-- AI refactoring
local refactoredCode = aiAssistant:refactorCode([[
    local function oldFunction(a, b, c)
        if a then
            return b + c
        else
            return b - c
        end
    end
]], {
    style = "functional",
    optimizations = {"readability", "performance"}
})
print("Refactored Code:", refactoredCode)

-- Quantum Debugger - Advanced debugging with quantum uncertainty analysis
local QuantumDebugger = require(game.ReplicatedStorage.QuantumDebugger)

local debugger = QuantumDebugger.new()

-- Attach to script
debugger:attachToScript(game.ServerScriptService.MainScript)

-- Quantum state analysis
local quantumState = debugger:analyzeQuantumState()
print("Quantum Uncertainty:", quantumState.uncertainty)
print("Possible Execution Paths:", quantumState.paths)

-- Probabilistic breakpoint
debugger:setProbabilisticBreakpoint("line 42", 0.3) -- 30% chance to break

-- Holographic Memory Analysis
local memoryHologram = debugger:createMemoryHologram()
print("Memory Interference Patterns:", memoryHologram.interference)

-- AI Test Generation
local AITestGen = require(game.ReplicatedStorage.AITestGen)

local testGenerator = AITestGen.new({
    coverage = 0.95,
    complexity = "high",
    edgeCases = true
})

-- Generate comprehensive test suite
local testSuite = testGenerator:generateTests(game.ServerScriptService.PlayerManager, {
    scenarios = {"normal", "edge", "error"},
    mockDependencies = true,
    performanceTests = true
})

print("Generated", #testSuite.tests, "tests with", testSuite.coverage * 100, "% coverage")

-- Run AI-generated tests
local results = testGenerator:runGeneratedTests(testSuite)
print("Test Results:", results.passed .. "/" .. results.total, "passed")
```

#### Advanced Development Environments
```lua
-- HoloStudio - Holographic development environment
local HoloStudio = require(game.ReplicatedStorage.HoloStudio)

local studio = HoloStudio.new()

-- Create holographic coding interface
local codeHologram = studio:createCodeHologram({
    position = Vector3.new(0, 2, -3),
    size = Vector3.new(2, 1.5, 0.1),
    language = "lua",
    theme = "quantum_dark"
})

-- Add collaborative cursors
studio:addCollaborator("Player1", Color3.new(1, 0, 0))
studio:addCollaborator("Player2", Color3.new(0, 1, 0))

-- Real-time collaborative editing
codeHologram:onTextChanged(function(changes, author)
    studio:broadcastChanges(changes, author)
end)

-- Quantum Code Editor - Code editing with quantum superposition
local QuantumEditor = require(game.ReplicatedStorage.QuantumEditor)

local editor = QuantumEditor.new()

-- Create superposition of code possibilities
local codeSuperposition = editor:createSuperposition([[
    function calculatePath(start, goal)
        -- Implementation here
    end
]], {
    algorithms = {"astar", "dijkstra", "theta_star"},
    optimizations = {"memory", "speed", "accuracy"}
})

-- Measure to collapse to optimal implementation
local optimalCode = editor:measureSuperposition(codeSuperposition, {
    criteria = "performance",
    testData = pathfindingTestData
})

print("Optimal Pathfinding Code:", optimalCode)

-- Neural Network Code Generator
local NeuralCodeGen = require(game.ReplicatedStorage.NeuralCodeGen)

local codeGen = NeuralCodeGen.new({
    architecture = "transformer",
    trainingData = "roblox_code_corpus",
    contextLength = 2048
})

-- Generate code from natural language
local generatedCode = codeGen:generateFromPrompt([[
Create a function that manages player inventory with the following features:
- Add/remove items
- Stack identical items
- Maximum capacity of 50 slots
- Support for equipped items
- Save/load functionality
]], {
    style = "roblox_lua",
    includeComments = true,
    addErrorHandling = true
})

print("Generated Inventory System:")
print(generatedCode)

-- Holographic Testing Environment
local HoloTest = require(game.ReplicatedStorage.HoloTest)

local testEnv = HoloTest.new()

-- Create holographic test scenarios
local scenario1 = testEnv:createScenario("Player Combat", {
    players = 2,
    environment = "arena",
    duration = 300
})

local scenario2 = testEnv:createScenario("Large Scale Battle", {
    players = 100,
    environment = "battlefield",
    duration = 1800
})

-- Run parallel holographic tests
local results = testEnv:runParallelScenarios({scenario1, scenario2}, {
    recordMetrics = true,
    generateReports = true,
    aiAnalysis = true
})

print("Holographic Test Results:")
for scenarioName, result in pairs(results) do
    print(scenarioName .. ":", result.status, "- Performance Score:", result.performanceScore)
end
```

#### Next-Generation Build Tools
```lua
-- Quantum Build System - Parallel compilation with quantum optimization
local QuantumBuild = require(game.ReplicatedStorage.QuantumBuild)

local buildSystem = QuantumBuild.new({
    parallelism = "quantum",
    optimization = "entangled",
    compression = "holographic"
})

-- Configure build
buildSystem:configure({
    entryPoint = game.ServerScriptService.MainScript,
    output = "game_build.rbxlx",
    minify = true,
    obfuscate = false,
    targetPlatforms = {"desktop", "mobile", "console", "vr"},
    performanceTargets = {
        fps = {desktop = 60, mobile = 30, console = 30, vr = 72},
        memory = {desktop = 512, mobile = 256, console = 1024, vr = 384}
    }
})

-- Start quantum-accelerated build
local buildPromise = buildSystem:build()

buildPromise:andThen(function(buildResult)
    print("Quantum Build Complete!")
    print("Build Size:", buildResult.size .. " KB")
    print("Compression Ratio:", buildResult.compressionRatio)
    print("Performance Scores:")
    for platform, score in pairs(buildResult.performanceScores) do
        print("  " .. platform .. ":", score.fps .. " FPS, " .. score.memory .. " MB")
    end
end):catch(function(error)
    warn("Build failed:", error)
end)

-- AI-Optimized Asset Pipeline
local AIOptimizer = require(game.ReplicatedStorage.AIOptimizer)

local assetOptimizer = AIOptimizer.new({
    quality = "adaptive",
    format = "intelligent",
    compression = "neural"
})

-- Optimize assets for multiple platforms
local optimizedAssets = assetOptimizer:optimizeDirectory(game.ReplicatedStorage.Assets, {
    targets = {
        desktop = {resolution = 1.0, quality = 0.9},
        mobile = {resolution = 0.75, quality = 0.7},
        vr = {resolution = 1.2, quality = 0.95}
    },
    aiUpscaling = true,
    formatConversion = true
})

print("Asset Optimization Complete:")
print("Original Size:", optimizedAssets.originalSize .. " MB")
print("Optimized Size:", optimizedAssets.optimizedSize .. " MB")
print("Compression Ratio:", optimizedAssets.compressionRatio)

-- Neural Package Manager
local NeuralPackage = require(game.ReplicatedStorage.NeuralPackage)

local pkgManager = NeuralPackage.new()

-- AI-powered dependency resolution
local dependencies = pkgManager:resolveDependencies({
    "roact@2.0.0",
    "rodux@4.0.0",
    "promise@4.0.0",
    "ai >= 1.0.0"
}, {
    compatibility = "strict",
    security = "high",
    performance = "optimized"
})

print("Resolved Dependencies:")
for name, version in pairs(dependencies) do
    print("  " .. name .. "@" .. version)
end

-- Install with neural acceleration
pkgManager:installDependencies(dependencies, {
    parallel = true,
    verify = true,
    optimize = true
}):andThen(function()
    print("All dependencies installed successfully!")
end)
```

#### Advanced Debugging and Profiling
```lua
-- Quantum Profiler - Performance analysis with quantum uncertainty
local QuantumProfiler = require(game.ReplicatedStorage.QuantumProfiler)

local profiler = QuantumProfiler.new()

-- Start quantum profiling
profiler:startSession({
    duration = 60, -- seconds
    samplingRate = 1000, -- Hz
    quantumUncertainty = 0.05
})

-- Profile with superposition analysis
profiler:profileFunction(game.ServerScriptService.MainScript.MainFunction, {
    inputs = "superposition", -- Test with multiple input combinations
    iterations = 1000,
    parallel = true
})

-- Get quantum performance report
local report = profiler:getQuantumReport()

print("Quantum Performance Analysis:")
print("Function executed in", report.averageTime, "±", report.uncertainty, "seconds")
print("Performance distribution:")
for percentile, time in pairs(report.percentiles) do
    print("  " .. percentile .. "th percentile:", time, "seconds")
end

-- AI Performance Advisor
local AIAdvisor = require(game.ReplicatedStorage.AIAdvisor)

local advisor = AIAdvisor.new({
    model = "performance-grok",
    context = "roblox_optimization"
})

-- Analyze performance bottlenecks
local bottlenecks = advisor:analyzeBottlenecks(report, {
    platform = "mobile",
    targetFPS = 30,
    memoryLimit = 256 -- MB
})

print("AI Performance Recommendations:")
for i, recommendation in ipairs(bottlenecks.recommendations) do
    print(i .. ".", recommendation.description)
    print("  Impact:", recommendation.impact)
    print("  Difficulty:", recommendation.difficulty)
end

-- Holographic Memory Debugger
local HoloMemoryDebugger = require(game.ReplicatedStorage.HoloMemoryDebugger)

local memoryDebugger = HoloMemoryDebugger.new()

-- Create holographic memory visualization
local memoryHologram = memoryDebugger:createMemoryHologram({
    position = Vector3.new(5, 2, 0),
    scale = 2,
    showLeaks = true,
    realTime = true
})

-- Analyze memory interference patterns
local interference = memoryDebugger:analyzeInterference()

print("Memory Interference Analysis:")
print("Total interference:", interference.total)
print("Leak probability:", interference.leakProbability)
print("Fragmentation level:", interference.fragmentation)

-- Get AI-generated fixes
local fixes = memoryDebugger:generateFixes(interference)

print("AI-Generated Memory Fixes:")
for i, fix in ipairs(fixes) do
    print(i .. ".", fix.description)
    print("  Expected improvement:", fix.improvement .. "%")
end
```

#### Collaborative Development Tools
```lua
-- Quantum Collaboration Suite
local QuantumCollab = require(game.ReplicatedStorage.QuantumCollab)

local collab = QuantumCollab.new({
    sessionId = "project_alpha",
    maxCollaborators = 8,
    realTimeSync = true,
    aiMediation = true
})

-- Join collaborative session
collab:joinSession("developer_123")

-- Create shared holographic workspace
local workspace = collab:createSharedWorkspace({
    dimensions = Vector3.new(10, 6, 8),
    grid = true,
    snapToGrid = true
})

-- Add collaborative coding panels
local codePanel1 = workspace:addCodePanel({
    position = Vector3.new(-3, 2, -2),
    size = Vector3.new(3, 2, 0.1),
    language = "lua",
    owner = "Alice"
})

local codePanel2 = workspace:addCodePanel({
    position = Vector3.new(0, 2, -2),
    size = Vector3.new(3, 2, 0.1),
    language = "lua",
    owner = "Bob"
})

-- Real-time collaborative editing with conflict resolution
codePanel1:onTextChanged(function(changes)
    collab:broadcastChanges("Alice", changes)
end)

collab:onRemoteChanges(function(author, changes)
    if author ~= "Alice" then
        codePanel1:applyRemoteChanges(changes)
    end
end)

-- AI conflict mediation
collab:onConflict(function(conflict)
    local resolution = collab.aiMediator:resolveConflict(conflict, {
        strategy = "merge_intelligent",
        preserveIntent = true
    })

    collab:applyResolution(resolution)
end)

-- Quantum code review
local reviewSystem = collab:createReviewSystem()

reviewSystem:submitForReview(codePanel1:getCode(), {
    reviewers = {"Bob", "Charlie"},
    criteria = {"performance", "readability", "security"},
    aiAnalysis = true
})

reviewSystem:onReviewComplete(function(review)
    print("Code Review Complete:")
    print("Overall Score:", review.score .. "/10")
    print("AI Suggestions:", #review.aiSuggestions)

    for _, suggestion in ipairs(review.aiSuggestions) do
        print("  - " .. suggestion.description)
    end
end)

-- Holographic brainstorming
local brainstorm = collab:createBrainstormSession({
    topic = "New Game Mechanics",
    duration = 1800, -- 30 minutes
    participants = {"Alice", "Bob", "Charlie", "Diana"}
})

brainstorm:addIdea("Quantum Inventory System", "Alice", {
    description = "Use quantum superposition for item states",
    tags = {"inventory", "quantum", "innovation"}
})

brainstorm:addIdea("Holographic UI", "Bob", {
    description = "3D floating interfaces with spatial audio",
    tags = {"ui", "holographic", "accessibility"}
})

-- AI idea clustering and prioritization
local clusters = brainstorm:clusterIdeas({
    algorithm = "neural_clustering",
    dimensions = 5
})

print("Idea Clusters:")
for i, cluster in ipairs(clusters) do
    print("Cluster " .. i .. " (" .. cluster.size .. " ideas):")
    print("  Theme:", cluster.theme)
    print("  Priority Score:", cluster.priority)
end
```

This 2025 development tools section showcases the next generation of AI-powered, quantum-enhanced, and collaborative development utilities for Roblox creators.

### Community Forums and Resources (2025)

#### Next-Generation Developer Platforms
```lua
-- Roblox Quantum Developer Hub
-- URL: https://quantum.roblox.com/
-- Features:
-- - AI-powered code generation and debugging
-- - Quantum-accelerated testing environments
-- - Holographic collaboration spaces
-- - Neural network optimization tools
-- - Real-time performance analytics

-- Roblox Metaverse Creator Studio
-- URL: https://metaverse.roblox.com/studio
-- Capabilities:
-- - Cross-reality development (VR/AR/PC/Mobile)
-- - AI-assisted world generation
-- - Quantum physics simulation
-- - Neural networking for multiplayer
-- - Holographic asset management

-- Roblox AI Development Platform
-- URL: https://ai.roblox.com/
-- Tools:
-- - CodeAI: AI pair programming
-- - TestGen: Automated test generation
-- - PerfAI: Performance optimization
-- - SecAI: Security analysis
-- - DocAI: Automatic documentation

-- Roblox Quantum Forge
-- URL: https://forge.roblox.com/
-- Advanced Features:
-- - Quantum compilation for scripts
-- - Neural asset optimization
-- - Holographic debugging
-- - AI code review
-- - Parallel build systems
```

#### Enhanced Community Resources (2025)
```lua
local CommunityResources2025 = {
    -- Quantum Libraries
    QuantumLibraries = {
        {name = "QuantumRoact", url = "https://github.com/Roblox/quantum-roact", description = "Quantum-enhanced React-like UI framework with holographic rendering"},
        {name = "NeuralFusion", url = "https://github.com/dphfox/neural-fusion", description = "AI-powered reactive UI with predictive state management"},
        {name = "QuantumKnit", url = "https://github.com/Sleitnick/quantum-knit", description = "Quantum networking framework with entanglement-based communication"},
        {name = "HoloProfile", url = "https://github.com/MadStudioRoblox/holo-profile", description = "Holographic data persistence with quantum redundancy"},
        {name = "NeuralPromise", url = "https://github.com/evaera/neural-promise", description = "AI-optimized promise implementation with predictive execution"},
        {name = "QuantumCryo", url = "https://github.com/evaera/quantum-cryo", description = "Quantum immutable utilities with holographic storage"},
        {name = "NeuralRodux", url = "https://github.com/Roblox/neural-rodux", description = "AI-enhanced state management with predictive updates"},
        {name = "QuantumTestEZ", url = "https://github.com/Roblox/quantum-testez", description = "Quantum-accelerated testing with AI-generated test cases"},
        {name = "HoloUI", url = "https://github.com/Roblox/holo-ui", description = "Holographic user interface framework"},
        {name = "NeuralPhysics", url = "https://github.com/Roblox/neural-physics", description = "AI-powered physics simulation"},
    },

    -- AI-Powered Tools
    AITools = {
        {name = "CodeAI", url = "https://github.com/Roblox/code-ai", description = "AI pair programming and code generation"},
        {name = "QuantumRojo", url = "https://github.com/rojo-rbx/quantum-rojo", description = "Quantum-accelerated file synchronization"},
        {name = "NeuralSelene", url = "https://github.com/Kampfkarren/neural-selene", description = "AI-enhanced Lua linting with predictive suggestions"},
        {name = "QuantumStylua", url = "https://github.com/JohnnyMorganz/quantum-stylua", description = "Neural code formatting with style learning"},
        {name = "HoloForeman", url = "https://github.com/Roblox/holo-foreman", description = "Holographic tool management with AI recommendations"},
        {name = "NeuralWally", url = "https://github.com/UpliftGames/neural-wally", description = "AI-powered package management with compatibility prediction"},
        {name = "QuantumDarkLua", url = "https://github.com/seaofvoices/quantum-darklua", description = "Quantum code processing and optimization"},
        {name = "HoloLSP", url = "https://github.com/Roblox/holo-lsp", description = "Holographic language server with spatial code navigation"},
    },

    -- Quantum Communities
    QuantumCommunities = {
        {name = "Quantum DevForum", url = "https://quantum.devforum.roblox.com/", description = "Advanced developer discussions on quantum computing"},
        {name = "Roblox Quantum OSS", url = "https://github.com/Roblox/quantum", description = "Official quantum and AI open source projects"},
        {name = "r/QuantumRoblox", url = "https://reddit.com/r/quantumroblox", description = "Quantum Roblox development community"},
        {name = "Roblox Quantum Discord", url = "https://discord.gg/roblox-quantum", description = "Real-time quantum development collaboration"},
        {name = "Roblox AI YouTube", url = "https://youtube.com/c/RobloxAI", description = "AI and quantum development tutorials"},
        {name = "HoloDev VR Chat", url = "https://holo.roblox.com/chat", description = "VR-based developer collaboration spaces"},
    },

    -- Advanced Learning Resources
    AdvancedLearning = {
        {name = "Quantum Developer Hub", url = "https://quantum.developer.roblox.com/", description = "Comprehensive quantum development documentation"},
        {name = "Roblox AI Academy", url = "https://ai.academy.roblox.com/", description = "AI and machine learning for game development"},
        {name = "Neural Engineering Course", url = "https://education.roblox.com/neural", description = "Advanced neural network programming"},
        {name = "Quantum Physics for Games", url = "https://education.roblox.com/quantum-physics", description = "Quantum mechanics applied to game development"},
        {name = "Holographic Design Institute", url = "https://education.roblox.com/holographic", description = "3D and holographic UI/UX design"},
        {name = "AI Ethics in Gaming", url = "https://education.roblox.com/ai-ethics", description = "Responsible AI development practices"},
        {name = "Quantum Code Camp", url = "https://codecademy.com/learn/quantum-roblox", description = "Interactive quantum programming course"},
        {name = "Neural Networks Bootcamp", url = "https://freecodecamp.org/quantum-roblox", description = "Free quantum and AI tutorials"},
        {name = "The Quantum Roblox Book", url = "https://quantumrobloxbook.com/", description = "Comprehensive quantum development guide"},
        {name = "Holographic Development Handbook", url = "https://holographic.roblox.com/handbook", description = "Spatial computing development guide"},
    },

    -- Specialized Communities
    SpecializedCommunities = {
        VR_AR = {
            {name = "VR/AR Developer Alliance", url = "https://vr.roblox.com/alliance", description = "Cross-reality development collaboration"},
            {name = "Holographic UI Guild", url = "https://holo.roblox.com/guild", description = "Spatial interface design community"},
        },
        AI_ML = {
            {name = "Roblox AI Research Lab", url = "https://ai.roblox.com/lab", description = "Cutting-edge AI research for games"},
            {name = "Neural Game Design", url = "https://neural.roblox.com/design", description = "AI-driven game design principles"},
        },
        Quantum = {
            {name = "Quantum Computing Group", url = "https://quantum.roblox.com/group", description = "Quantum algorithm development"},
            {name = "Entanglement Networks", url = "https://entanglement.roblox.com/", description = "Advanced networking techniques"},
        },
        Mobile = {
            {name = "Mobile Gaming Coalition", url = "https://mobile.roblox.com/coalition", description = "Mobile optimization experts"},
            {name = "Cross-Platform Alliance", url = "https://crossplatform.roblox.com/", description = "Universal platform development"},
        }
    }
}

-- AI-Powered Resource Discovery
local AIResourceFinder = {}

function AIResourceFinder.new()
    return setmetatable({
        neuralNetwork = nil,
        resourceDatabase = CommunityResources2025,
        userProfile = {},
        searchHistory = {}
    }, {__index = AIResourceFinder})
end

function AIResourceFinder:initializeNeuralNetwork()
    -- Initialize neural network for resource recommendations
    self.neuralNetwork = {
        weights = {
            library_relevance = {0.3, 0.4, 0.3},
            tool_compatibility = {0.2, 0.5, 0.3},
            community_engagement = {0.4, 0.3, 0.3}
        }
    }
end

function AIResourceFinder:findResources(query, context)
    -- AI-powered resource discovery
    local results = {
        libraries = {},
        tools = {},
        communities = {},
        learning = {},
        score = 0
    }

    -- Analyze query with neural network
    local queryVector = self:createQueryVector(query)
    local contextVector = self:createContextVector(context)

    -- Search libraries
    for _, lib in ipairs(self.resourceDatabase.QuantumLibraries) do
        local relevance = self:calculateRelevance(queryVector, contextVector, lib)
        if relevance > 0.3 then
            table.insert(results.libraries, {
                resource = lib,
                relevance = relevance,
                reasoning = self:generateReasoning(lib, query, context)
            })
        end
    end

    -- Search tools
    for _, tool in ipairs(self.resourceDatabase.AITools) do
        local compatibility = self:calculateCompatibility(queryVector, contextVector, tool)
        if compatibility > 0.4 then
            table.insert(results.tools, {
                resource = tool,
                compatibility = compatibility,
                recommendation = self:generateRecommendation(tool, context)
            })
        end
    end

    -- Search communities
    for _, community in ipairs(self.resourceDatabase.QuantumCommunities) do
        local engagement = self:calculateEngagement(queryVector, contextVector, community)
        if engagement > 0.2 then
            table.insert(results.communities, {
                resource = community,
                engagement = engagement
            })
        end
    end

    -- Calculate overall score
    results.score = self:calculateOverallScore(results)

    -- Record search for learning
    table.insert(self.searchHistory, {
        query = query,
        context = context,
        results = results,
        timestamp = tick()
    })

    return results
end

function AIResourceFinder:createQueryVector(query)
    -- Convert query to numerical vector
    local vector = {}
    local keywords = self:extractKeywords(query)

    -- Simple keyword matching (in practice, this would use embeddings)
    vector.experience = keywords.experience or 0
    vector.complexity = keywords.complexity or 0.5
    vector.urgency = keywords.urgency or 0.5

    return vector
end

function AIResourceFinder:createContextVector(context)
    -- Convert context to numerical vector
    return {
        platform = context.platform == "mobile" and 1 or 0,
        experience = context.experienceLevel or 0.5,
        projectSize = context.projectSize or 0.5,
        timeConstraint = context.timeConstraint or 0.5
    }
end

function AIResourceFinder:calculateRelevance(queryVec, contextVec, resource)
    -- Neural calculation of relevance
    local score = 0
    score = score + queryVec.experience * 0.4
    score = score + contextVec.experience * 0.3
    score = score + (1 - contextVec.timeConstraint) * 0.3 -- Less time = more relevant advanced resources

    return math.min(score, 1)
end

function AIResourceFinder:calculateCompatibility(queryVec, contextVec, resource)
    -- Calculate tool compatibility
    local score = 0
    if contextVec.platform == 1 and resource.name:find("Mobile") then
        score = score + 0.5
    end
    score = score + (1 - math.abs(queryVec.complexity - contextVec.experience)) * 0.5

    return math.min(score, 1)
end

function AIResourceFinder:calculateEngagement(queryVec, contextVec, resource)
    -- Calculate community engagement potential
    return (queryVec.urgency + contextVec.projectSize) / 2
end

function AIResourceFinder:calculateOverallScore(results)
    local totalScore = 0
    local totalItems = 0

    for _, libs in pairs(results.libraries) do
        totalScore = totalScore + libs.relevance
        totalItems = totalItems + 1
    end

    for _, tools in pairs(results.tools) do
        totalScore = totalScore + tools.compatibility
        totalItems = totalItems + 1
    end

    return totalItems > 0 and totalScore / totalItems or 0
end

function AIResourceFinder:generateReasoning(resource, query, context)
    -- Generate AI reasoning for recommendations
    local reasoning = {}

    if query:find("beginner") and resource.description:find("basic") then
        table.insert(reasoning, "Suitable for beginners")
    end

    if context.platform == "mobile" and resource.name:find("Mobile") then
        table.insert(reasoning, "Optimized for mobile development")
    end

    if context.timeConstraint > 0.7 then
        table.insert(reasoning, "Quick setup and integration")
    end

    return reasoning
end

function AIResourceFinder:generateRecommendation(resource, context)
    -- Generate personalized recommendations
    local recs = {}

    if context.experienceLevel < 0.3 then
        table.insert(recs, "Start with basic tutorials")
    end

    if context.projectSize > 0.7 then
        table.insert(recs, "Consider enterprise features")
    end

    return recs
end

function AIResourceFinder:extractKeywords(query)
    -- Simple keyword extraction
    local keywords = {}

    if query:find("beginner") or query:find("new") then
        keywords.experience = 0.2
    elseif query:find("advanced") or query:find("expert") then
        keywords.experience = 0.8
    else
        keywords.experience = 0.5
    end

    if query:find("urgent") or query:find("quick") then
        keywords.urgency = 0.8
    else
        keywords.urgency = 0.3
    end

    return keywords
end

function AIResourceFinder:getPersonalizedLearningPath(userProfile)
    -- Generate personalized learning path
    local path = {
        currentLevel = userProfile.level or 1,
        recommendedCourses = {},
        estimatedTime = 0,
        skillsToAcquire = {}
    }

    -- Analyze user profile and recommend learning path
    if userProfile.interests then
        for _, interest in ipairs(userProfile.interests) do
            if interest == "quantum" then
                table.insert(path.recommendedCourses, "Quantum Physics for Games")
                table.insert(path.skillsToAcquire, "Quantum Algorithms")
                path.estimatedTime = path.estimatedTime + 40 -- hours
            elseif interest == "ai" then
                table.insert(path.recommendedCourses, "AI Ethics in Gaming")
                table.insert(path.skillsToAcquire, "Neural Networks")
                path.estimatedTime = path.estimatedTime + 30
            end
        end
    end

    return path
end

-- Usage
local finder = AIResourceFinder.new()
finder:initializeNeuralNetwork()

-- Find resources for a specific need
local results = finder:findResources("I need a UI framework for mobile VR games", {
    platform = "mobile",
    experienceLevel = 0.7,
    projectSize = 0.8,
    timeConstraint = 0.3
})

print("AI Resource Recommendations:")
print("Overall Score:", string.format("%.2f", results.score))
print("Libraries found:", #results.libraries)
print("Tools found:", #results.tools)

for i, lib in ipairs(results.libraries) do
    print(string.format("%d. %s (Relevance: %.2f)", i, lib.resource.name, lib.relevance))
    for _, reason in ipairs(lib.reasoning) do
        print("   - " .. reason)
    end
end

-- Get personalized learning path
local userProfile = {
    level = 2,
    interests = {"quantum", "ai", "vr"},
    completedCourses = {"Basic Lua", "Roblox Studio Fundamentals"}
}

local learningPath = finder:getPersonalizedLearningPath(userProfile)

print("\nPersonalized Learning Path:")
print("Current Level:", learningPath.currentLevel)
print("Estimated Time:", learningPath.estimatedTime, "hours")
print("Recommended Courses:")
for i, course in ipairs(learningPath.recommendedCourses) do
    print("  " .. i .. ". " .. course)
end
print("Skills to Acquire:")
for i, skill in ipairs(learningPath.skillsToAcquire) do
    print("  " .. i .. ". " .. skill)
end
```

### Advanced Community Tools and Scripts

```lua
-- Hot Reloader for rapid development
local HotReloader = {}
HotReloader.__index = HotReloader

function HotReloader.new()
    return setmetatable({
        modules = {},
        watchers = {},
    }, HotReloader)
end

function HotReloader:WatchModule(moduleScript, callback)
    self.modules[moduleScript] = {
        lastModified = moduleScript:GetAttribute("LastModified") or 0,
        callback = callback,
    }

    -- Set up watcher
    moduleScript:GetPropertyChangedSignal("Source"):Connect(function()
        local currentModified = os.time()
        local lastModified = self.modules[moduleScript].lastModified

        if currentModified - lastModified > 1 then  -- Debounce
            self.modules[moduleScript].lastModified = currentModified
            self:ReloadModule(moduleScript)
        end
    end)
end

function HotReloader:ReloadModule(moduleScript)
    local callback = self.modules[moduleScript].callback

    -- Clear require cache
    package.loaded[moduleScript] = nil

    -- Reload module
    local success, newModule = pcall(require, moduleScript)

    if success then
        print("Reloaded module:", moduleScript.Name)
        if callback then
            callback(newModule)
        end
    else
        warn("Failed to reload module:", newModule)
    end
end

-- Usage
local reloader = HotReloader.new()

reloader:WatchModule(game.ServerScriptService.MyModule, function(newModule)
    -- Update references to the reloaded module
    MyService.myModule = newModule
end)

-- Live Coding Environment
local LiveCoding = {}
LiveCoding.__index = LiveCoding

function LiveCoding.new()
    return setmetatable({
        environment = {},
        history = {},
    }, LiveCoding)
end

function LiveCoding:ExecuteCode(code)
    -- Create safe environment
    local env = setmetatable({}, {__index = _G})

    -- Add custom globals
    env.print = function(...)
        local args = {...}
        for i, arg in ipairs(args) do
            args[i] = tostring(arg)
        end
        local message = table.concat(args, " ")
        print("[LiveCode] " .. message)

        -- Store in history
        table.insert(self.history, {
            timestamp = os.time(),
            code = code,
            output = message
        })
    end

    -- Execute code
    local func, error = loadstring(code)
    if not func then
        return false, error
    end

    setfenv(func, env)

    local success, result = pcall(func)

    if success then
        return true, result
    else
        return false, result
    end
end

function LiveCoding:GetHistory()
    return self.history
end

-- Usage
local liveCode = LiveCoding.new()

-- Execute live code
local success, result = liveCode:ExecuteCode("print('Hello from live coding!')")
if success then
    print("Code executed successfully")
else
    print("Code execution failed:", result)
end

-- Collaborative Coding Session
local CollaborativeCoding = {}
CollaborativeCoding.__index = CollaborativeCoding

function CollaborativeCoding.new(sessionId)
    return setmetatable({
        sessionId = sessionId,
        participants = {},
        code = "",
        cursorPositions = {},
    }, CollaborativeCoding)
end

function CollaborativeCoding:JoinSession(player)
    self.participants[player] = {
        joinedAt = os.time(),
        cursorPos = 0,
    }

    -- Send current code to new participant
    self:SendCodeToPlayer(player)
end

function CollaborativeCoding:LeaveSession(player)
    self.participants[player] = nil
end

function CollaborativeCoding:UpdateCode(player, newCode, cursorPos)
    self.code = newCode
    self.cursorPositions[player] = cursorPos

    -- Broadcast to other participants
    for participant, _ in pairs(self.participants) do
        if participant ~= player then
            self:SendCodeToPlayer(participant)
        end
    end
end

function CollaborativeCoding:SendCodeToPlayer(player)
    -- In a real implementation, this would use networking
    local remoteEvent = game.ReplicatedStorage:FindFirstChild("CodeUpdate")
    if remoteEvent then
        remoteEvent:FireClient(player, self.code, self.cursorPositions)
    end
end

function CollaborativeCoding:GetParticipants()
    local list = {}
    for player, data in pairs(self.participants) do
        table.insert(list, {
            name = player.Name,
            joinedAt = data.joinedAt,
            cursorPos = data.cursorPos,
        })
    end
    return list
end

-- Code Review System
local CodeReview = {}
CodeReview.__index = CodeReview

function CodeReview.new()
    return setmetatable({
        reviews = {},
        reviewers = {},
    }, CodeReview)
end

function CodeReview:SubmitForReview(script, author, description)
    local reviewId = #self.reviews + 1

    self.reviews[reviewId] = {
        id = reviewId,
        script = script,
        author = author,
        description = description,
        status = "pending",
        comments = {},
        reviewers = {},
        submittedAt = os.time(),
    }

    return reviewId
end

function CodeReview:AddReviewer(reviewId, reviewer)
    local review = self.reviews[reviewId]
    if review then
        table.insert(review.reviewers, reviewer)
        self.reviewers[reviewer] = self.reviewers[reviewer] or {}
        table.insert(self.reviewers[reviewer], reviewId)
    end
end

function CodeReview:AddComment(reviewId, reviewer, comment, lineNumber)
    local review = self.reviews[reviewId]
    if review then
        table.insert(review.comments, {
            reviewer = reviewer,
            comment = comment,
            lineNumber = lineNumber,
            timestamp = os.time(),
        })
    end
end

function CodeReview:ApproveReview(reviewId, reviewer)
    local review = self.reviews[reviewId]
    if review then
        review.status = "approved"
        print("Review", reviewId, "approved by", reviewer.Name)
    end
end

function CodeReview:RejectReview(reviewId, reviewer, reason)
    local review = self.reviews[reviewId]
    if review then
        review.status = "rejected"
        review.rejectReason = reason
        print("Review", reviewId, "rejected by", reviewer.Name .. ":", reason)
    end
end

function CodeReview:GetPendingReviews(reviewer)
    local pending = {}
    local reviewerReviews = self.reviewers[reviewer] or {}

    for _, reviewId in ipairs(reviewerReviews) do
        local review = self.reviews[reviewId]
        if review and review.status == "pending" then
            table.insert(pending, review)
        end
    end

    return pending
end

-- Usage
local codeReview = CodeReview.new()

local reviewId = codeReview:SubmitForReview(myScript, player, "Added new feature")
codeReview:AddReviewer(reviewId, reviewerPlayer)

codeReview:AddComment(reviewId, reviewerPlayer, "Consider adding error handling", 15)
codeReview:ApproveReview(reviewId, reviewerPlayer)

-- Asset Management System
local AssetManager = {}
AssetManager.__index = AssetManager

function AssetManager.new()
    return setmetatable({
        assets = {},
        categories = {},
        tags = {},
    }, AssetManager)
end

function AssetManager:RegisterAsset(asset, metadata)
    local assetId = asset:IsA("Instance") and asset:GetFullName() or tostring(asset)

    self.assets[assetId] = {
        asset = asset,
        metadata = metadata,
        registeredAt = os.time(),
        usageCount = 0,
    }

    -- Add to categories
    if metadata.category then
        self.categories[metadata.category] = self.categories[metadata.category] or {}
        table.insert(self.categories[metadata.category], assetId)
    end

    -- Add tags
    if metadata.tags then
        for _, tag in ipairs(metadata.tags) do
            self.tags[tag] = self.tags[tag] or {}
            table.insert(self.tags[tag], assetId)
        end
    end
end

function AssetManager:GetAsset(assetId)
    local assetData = self.assets[assetId]
    if assetData then
        assetData.usageCount = assetData.usageCount + 1
        return assetData.asset
    end
    return nil
end

function AssetManager:SearchAssets(query)
    local results = {}

    -- Search by name
    for assetId, assetData in pairs(self.assets) do
        if assetData.metadata.name and assetData.metadata.name:lower():find(query:lower()) then
            table.insert(results, assetData)
        end
    end

    -- Search by tags
    if self.tags[query] then
        for _, assetId in ipairs(self.tags[query]) do
            local assetData = self.assets[assetId]
            if assetData and not table.find(results, assetData) then
                table.insert(results, assetData)
            end
        end
    end

    return results
end

function AssetManager:GetAssetsByCategory(category)
    local categoryAssets = self.categories[category] or {}
    local results = {}

    for _, assetId in ipairs(categoryAssets) do
        local assetData = self.assets[assetId]
        if assetData then
            table.insert(results, assetData)
        end
    end

    return results
end

function AssetManager:GetAssetStats()
    local stats = {
        totalAssets = 0,
        totalUsage = 0,
        categoryCounts = {},
        tagCounts = {},
    }

    for assetId, assetData in pairs(self.assets) do
        stats.totalAssets = stats.totalAssets + 1
        stats.totalUsage = stats.totalUsage + assetData.usageCount

        if assetData.metadata.category then
            stats.categoryCounts[assetData.metadata.category] =
                (stats.categoryCounts[assetData.metadata.category] or 0) + 1
        end

        if assetData.metadata.tags then
            for _, tag in ipairs(assetData.metadata.tags) do
                stats.tagCounts[tag] = (stats.tagCounts[tag] or 0) + 1
            end
        end
    end

    return stats
end

-- Usage
local assetManager = AssetManager.new()

assetManager:RegisterAsset(myModel, {
    name = "Hero Character",
    category = "Characters",
    tags = {"hero", "player", "3d"},
    author = "Developer",
    version = "1.0"
})

local heroAsset = assetManager:GetAsset("Workspace.MyModel")
local searchResults = assetManager:SearchAssets("hero")
local characterAssets = assetManager:GetAssetsByCategory("Characters")
```

This community resources section covers popular libraries, development tools, forums, and advanced community-created utilities for enhancing Roblox development productivity and quality.

## Accessibility and Inclusive Design (2025)

### Core Accessibility Principles
Accessibility ensures that Roblox experiences are usable by everyone, including players with disabilities. Following WCAG 2.1 guidelines adapted for gaming:

#### Perceivable
- **Text Alternatives**: Provide text descriptions for images, icons, and non-text content
- **Color Independence**: Don't rely solely on color to convey information
- **Audio Control**: Allow users to control audio levels and provide captions for important audio
- **Visual Hierarchy**: Use clear typography and spacing to create logical content flow

#### Operable
- **Keyboard Navigation**: Ensure all interactive elements can be accessed via keyboard
- **Time Limits**: Provide options to extend or disable time-based actions
- **Seizure Prevention**: Avoid flashing content that could trigger seizures (limit to 3Hz)
- **Input Methods**: Support multiple input methods (keyboard, mouse, touch, gamepad, voice)

#### Understandable
- **Clear Language**: Use simple, consistent language
- **Predictable Behavior**: Maintain consistent navigation and interaction patterns
- **Input Assistance**: Provide clear labels and instructions for form fields
- **Error Prevention**: Include confirmation dialogs for destructive actions

#### Robust
- **Cross-Platform Compatibility**: Ensure experiences work across all Roblox platforms
- **Progressive Enhancement**: Core functionality works without advanced features
- **API Stability**: Use stable APIs that won't break with updates

### Implementing Accessibility in Roblox

#### Screen Reader Support
```lua
-- Screen reader compatible UI components
local AccessibleButton = Roact.Component:extend("AccessibleButton")

function AccessibleButton:init()
    self.ref = Roact.createRef()
end

function AccessibleButton:render()
    return Roact.createElement("TextButton", {
        Text = self.props.text,
        Size = self.props.size or UDim2.fromOffset(120, 40),
        BackgroundColor3 = self.props.backgroundColor or Color3.new(0, 0.5, 1),
        TextColor3 = Color3.new(1, 1, 1),
        TextSize = 16,
        Font = Enum.Font.Gotham,

        -- Accessibility attributes
        [Roact.Ref] = self.ref,
        AccessibleLabel = self.props.accessibleLabel or self.props.text,
        AccessibleHint = self.props.accessibleHint,
        AccessibleRole = "button",
        TabIndex = self.props.tabIndex or 0,

        [Roact.Event.Activated] = function()
            -- Play sound for screen reader users
            if self.props.soundEnabled then
                local sound = Instance.new("Sound")
                sound.SoundId = "rbxassetid://142700651" -- Button click sound
                sound.Parent = workspace
                sound:Play()
                task.delay(1, function() sound:Destroy() end)
            end

            if self.props.onActivated then
                self.props.onActivated()
            end
        end,

        [Roact.Event.MouseEnter] = function()
            -- Visual feedback for mouse users
            if self.ref.current then
                self.ref.current.BackgroundColor3 = self.props.hoverColor or Color3.new(0, 0.7, 1)
            end
        end,

        [Roact.Event.MouseLeave] = function()
            -- Reset visual feedback
            if self.ref.current then
                self.ref.current.BackgroundColor3 = self.props.backgroundColor or Color3.new(0, 0.5, 1)
            end
        end,

        [Roact.Event.Focused] = function()
            -- Keyboard focus feedback
            if self.ref.current then
                self.ref.current.UIStroke.Color = Color3.new(1, 1, 0)
                self.ref.current.UIStroke.Thickness = 2
            end
        end,

        [Roact.Event.FocusLost] = function()
            -- Remove focus feedback
            if self.ref.current then
                self.ref.current.UIStroke.Color = Color3.new(0, 0, 0)
                self.ref.current.UIStroke.Thickness = 1
            end
        end,
    }, {
        UICorner = Roact.createElement("UICorner", {
            CornerRadius = UDim.new(0, 8)
        }),
        UIStroke = Roact.createElement("UIStroke", {
            Color = Color3.new(0, 0, 0),
            Thickness = 1,
            Transparency = 0.8
        })
    })
end

-- Usage
local accessibleButton = Roact.createElement(AccessibleButton, {
    text = "Play Game",
    accessibleLabel = "Start the game",
    accessibleHint = "Press to begin playing",
    soundEnabled = true,
    onActivated = function()
        startGame()
    end
})
```

#### Color Contrast and Visual Accessibility
```lua
-- Color contrast checker utility
local ColorUtils = {}

function ColorUtils.getLuminance(color)
    local r, g, b = color.R, color.G, color.B

    -- Convert to linear RGB
    r = r <= 0.03928 and r/12.92 or ((r+0.055)/1.055)^2.4
    g = g <= 0.03928 and g/12.92 or ((g+0.055)/1.055)^2.4
    b = b <= 0.03928 and b/12.92 or ((b+0.055)/1.055)^2.4

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
end

function ColorUtils.getContrastRatio(color1, color2)
    local lum1 = ColorUtils.getLuminance(color1)
    local lum2 = ColorUtils.getLuminance(color2)

    local lighter = math.max(lum1, lum2)
    local darker = math.min(lum1, lum2)

    return (lighter + 0.05) / (darker + 0.05)
end

function ColorUtils.isAccessibleContrast(color1, color2, level)
    local ratio = ColorUtils.getContrastRatio(color1, color2)
    -- WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    -- WCAG AAA requires 7:1 for normal text, 4.5:1 for large text
    local requiredRatio = (level == "AAA") and 7 or 4.5
    return ratio >= requiredRatio
end

-- Accessible color palette
local AccessibleColors = {
    -- High contrast combinations
    primary = {
        background = Color3.fromHex("#FFFFFF"),
        text = Color3.fromHex("#000000"),
        accent = Color3.fromHex("#0066CC"),
        success = Color3.fromHex("#228B22"),
        warning = Color3.fromHex("#FF8C00"),
        error = Color3.fromHex("#DC143C")
    },

    -- Deuteranopia-friendly (green-blind)
    deuteranopia = {
        background = Color3.fromHex("#FFFFFF"),
        text = Color3.fromHex("#000000"),
        red = Color3.fromHex("#DC143C"),
        green = Color3.fromHex("#00CED1"), -- Cyan instead of green
        blue = Color3.fromHex("#4169E1")
    },

    -- Protanopia-friendly (red-blind)
    protanopia = {
        background = Color3.fromHex("#FFFFFF"),
        text = Color3.fromHex("#000000"),
        red = Color3.fromHex("#FF6B6B"), -- Lighter red
        green = Color3.fromHex("#4ECDC4"),
        blue = Color3.fromHex("#45B7D1")
    }
}

-- Usage
local function createAccessibleTextLabel(props)
    local backgroundColor = props.backgroundColor or AccessibleColors.primary.background
    local textColor = props.textColor or AccessibleColors.primary.text

    -- Check contrast
    if not ColorUtils.isAccessibleContrast(textColor, backgroundColor) then
        warn("Insufficient color contrast for text readability")
        -- Auto-adjust text color if needed
        textColor = Color3.new(0, 0, 0) -- Fallback to black
    end

    return Roact.createElement("TextLabel", {
        Text = props.text,
        Size = props.size,
        Position = props.position,
        BackgroundColor3 = backgroundColor,
        TextColor3 = textColor,
        TextSize = props.textSize or 16,
        Font = props.font or Enum.Font.Gotham,
        AccessibleLabel = props.accessibleLabel or props.text
    })
end
```

#### Keyboard Navigation System
```lua
-- Keyboard navigation manager
local KeyboardNavigation = {}
KeyboardNavigation.__index = KeyboardNavigation

function KeyboardNavigation.new()
    return setmetatable({
        focusableElements = {},
        currentFocusIndex = 1,
        focusRingColor = Color3.new(1, 1, 0),
        focusRingThickness = 2
    }, KeyboardNavigation)
end

function KeyboardNavigation:addFocusableElement(element, onFocus, onBlur)
    table.insert(self.focusableElements, {
        element = element,
        onFocus = onFocus,
        onBlur = onBlur,
        tabIndex = #self.focusableElements + 1
    })

    -- Add keyboard event handlers
    element.InputBegan:Connect(function(input)
        if input.KeyCode == Enum.KeyCode.Tab then
            self:handleTabNavigation(input)
        elseif input.KeyCode == Enum.KeyCode.Return or input.KeyCode == Enum.KeyCode.Space then
            if element:IsA("TextButton") or element:IsA("ImageButton") then
                element.Activated:Fire()
            end
        end
    end)
end

function KeyboardNavigation:handleTabNavigation(input)
    local direction = input:IsModifierKeyDown(Enum.ModifierKey.Shift) and -1 or 1
    self:setFocus(self.currentFocusIndex + direction)
end

function KeyboardNavigation:setFocus(index)
    -- Remove focus from current element
    if self.focusableElements[self.currentFocusIndex] then
        local current = self.focusableElements[self.currentFocusIndex]
        if current.onBlur then current.onBlur() end

        -- Remove focus ring
        if current.element:FindFirstChild("FocusRing") then
            current.element.FocusRing:Destroy()
        end
    end

    -- Set new focus
    self.currentFocusIndex = math.clamp(index, 1, #self.focusableElements)
    local newFocus = self.focusableElements[self.currentFocusIndex]

    if newFocus then
        if newFocus.onFocus then newFocus.onFocus() end

        -- Add focus ring
        local focusRing = Instance.new("UIStroke")
        focusRing.Name = "FocusRing"
        focusRing.Color = self.focusRingColor
        focusRing.Thickness = self.focusRingThickness
        focusRing.Parent = newFocus.element
    end
end

function KeyboardNavigation:getCurrentFocus()
    return self.focusableElements[self.currentFocusIndex]
end

-- Usage
local nav = KeyboardNavigation.new()

-- Add focusable elements
nav:addFocusableElement(playButton, function()
    print("Play button focused")
end, function()
    print("Play button blurred")
end)

nav:addFocusableElement(settingsButton, function()
    print("Settings button focused")
end, function()
    print("Settings button blurred")
end)

-- Handle initial focus
nav:setFocus(1)
```

#### Audio Accessibility
```lua
-- Audio accessibility manager
local AudioAccessibility = {}
AudioAccessibility.__index = AudioAccessibility

function AudioAccessibility.new()
    return setmetatable({
        masterVolume = 1,
        musicVolume = 0.7,
        sfxVolume = 0.8,
        voiceVolume = 1,
        captionsEnabled = true,
        audioDescriptionsEnabled = false,
        highContrastAudio = false
    }, AudioAccessibility)
end

function AudioAccessibility:setMasterVolume(volume)
    self.masterVolume = math.clamp(volume, 0, 1)
    self:updateAllAudio()
end

function AudioAccessibility:setMusicVolume(volume)
    self.musicVolume = math.clamp(volume, 0, 1)
    self:updateMusicVolume()
end

function AudioAccessibility:setSFXVolume(volume)
    self.sfxVolume = math.clamp(volume, 0, 1)
    self:updateSFXVolume()
end

function AudioAccessibility:enableCaptions(enabled)
    self.captionsEnabled = enabled
    if enabled then
        self:startCaptionSystem()
    else
        self:stopCaptionSystem()
    end
end

function AudioAccessibility:enableAudioDescriptions(enabled)
    self.audioDescriptionsEnabled = enabled
    if enabled then
        self:startAudioDescriptions()
    else
        self:stopAudioDescriptions()
    end
end

function AudioAccessibility:updateAllAudio()
    self:updateMusicVolume()
    self:updateSFXVolume()
    self:updateVoiceVolume()
end

function AudioAccessibility:updateMusicVolume()
    for _, sound in ipairs(workspace:GetDescendants()) do
        if sound:IsA("Sound") and sound.Name == "Music" then
            sound.Volume = self.musicVolume * self.masterVolume
        end
    end
end

function AudioAccessibility:updateSFXVolume()
    for _, sound in ipairs(workspace:GetDescendants()) do
        if sound:IsA("Sound") and sound.Name == "SFX" then
            sound.Volume = self.sfxVolume * self.masterVolume
        end
    end
end

function AudioAccessibility:updateVoiceVolume()
    for _, sound in ipairs(workspace:GetDescendants()) do
        if sound:IsA("Sound") and sound.Name == "Voice" then
            sound.Volume = self.voiceVolume * self.masterVolume
        end
    end
end

function AudioAccessibility:startCaptionSystem()
    -- Create caption UI
    local captionGui = Instance.new("ScreenGui")
    captionGui.Name = "CaptionSystem"
    captionGui.Parent = game.Players.LocalPlayer.PlayerGui

    local captionLabel = Instance.new("TextLabel")
    captionLabel.Name = "CaptionText"
    captionLabel.Size = UDim2.new(1, -40, 0, 60)
    captionLabel.Position = UDim2.new(0, 20, 1, -80)
    captionLabel.AnchorPoint = Vector2.new(0, 1)
    captionLabel.BackgroundColor3 = Color3.new(0, 0, 0)
    captionLabel.BackgroundTransparency = 0.3
    captionLabel.TextColor3 = Color3.new(1, 1, 1)
    captionLabel.TextSize = 18
    captionLabel.Font = Enum.Font.GothamBold
    captionLabel.TextWrapped = true
    captionLabel.Parent = captionGui

    self.captionLabel = captionLabel
end

function AudioAccessibility:stopCaptionSystem()
    if self.captionGui then
        self.captionGui:Destroy()
        self.captionGui = nil
        self.captionLabel = nil
    end
end

function AudioAccessibility:showCaption(text, duration)
    if not self.captionsEnabled or not self.captionLabel then return end

    self.captionLabel.Text = text
    self.captionLabel.Visible = true

    if duration then
        task.delay(duration, function()
            if self.captionLabel then
                self.captionLabel.Visible = false
            end
        end)
    end
end

function AudioAccessibility:startAudioDescriptions()
    -- Hook into game events to provide audio descriptions
    self.audioDescriptionConnection = game:GetService("ReplicatedStorage").GameEvents.Event:Connect(function(eventType, data)
        if eventType == "PlayerJoined" then
            self:playAudioDescription("A new player has joined the game")
        elseif eventType == "ObjectiveComplete" then
            self:playAudioDescription("Objective completed")
        end
    end)
end

function AudioAccessibility:stopAudioDescriptions()
    if self.audioDescriptionConnection then
        self.audioDescriptionConnection:Disconnect()
        self.audioDescriptionConnection = nil
    end
end

function AudioAccessibility:playAudioDescription(description)
    if not self.audioDescriptionsEnabled then return end

    -- Create and play description audio
    local sound = Instance.new("Sound")
    sound.SoundId = "rbxassetid://123456789" -- Placeholder for TTS audio
    sound.Volume = self.voiceVolume * self.masterVolume
    sound.Parent = workspace
    sound:Play()

    -- Show text description as well
    self:showCaption(description, 3)

    task.delay(sound.TimeLength, function()
        sound:Destroy()
    end)
end

-- Usage
local audioAccessibility = AudioAccessibility.new()

-- Create accessibility settings UI
local function AccessibilitySettings()
    return Fusion.New "Frame" {
        Size = UDim2.fromOffset(400, 300),
        Position = UDim2.fromScale(0.5, 0.5),
        AnchorPoint = Vector2.new(0.5, 0.5),
        BackgroundColor3 = Color3.new(1, 1, 1),

        [Fusion.Children] = {
            Title = Fusion.New "TextLabel" {
                Text = "Accessibility Settings",
                Size = UDim2.new(1, -40, 0, 40),
                Position = UDim2.fromOffset(20, 20),
                BackgroundTransparency = 1,
                TextColor3 = Color3.new(0, 0, 0),
                TextSize = 24,
                Font = Enum.Font.GothamBold
            },

            MasterVolume = Fusion.New "Frame" {
                Size = UDim2.new(1, -40, 0, 50),
                Position = UDim2.fromOffset(20, 70),
                BackgroundTransparency = 1,
                [Fusion.Children] = {
                    Label = Fusion.New "TextLabel" {
                        Text = "Master Volume",
                        Size = UDim2.new(0.5, -10, 1, 0),
                        BackgroundTransparency = 1,
                        TextColor3 = Color3.new(0, 0, 0),
                        TextSize = 16
                    },
                    Slider = Fusion.New "Frame" {
                        Size = UDim2.new(0.5, -10, 0, 20),
                        Position = UDim2.fromOffset(0.5, 0),
                        BackgroundColor3 = Color3.new(0.9, 0.9, 0.9),
                        [Fusion.Children] = {
                            Fill = Fusion.New "Frame" {
                                Size = UDim2.fromScale(audioAccessibility.masterVolume, 1),
                                BackgroundColor3 = Color3.new(0, 0.8, 0)
                            }
                        }
                    }
                }
            },

            CaptionsToggle = Fusion.New "TextButton" {
                Text = audioAccessibility.captionsEnabled and "Disable Captions" or "Enable Captions",
                Size = UDim2.new(0.5, -10, 0, 40),
                Position = UDim2.fromOffset(20, 130),
                BackgroundColor3 = Color3.new(0, 0.5, 1),
                TextColor3 = Color3.new(1, 1, 1),
                [Fusion.OnEvent "Activated"] = function()
                    audioAccessibility:enableCaptions(not audioAccessibility.captionsEnabled)
                end
            },

            AudioDescToggle = Fusion.New "TextButton" {
                Text = audioAccessibility.audioDescriptionsEnabled and "Disable Audio Descriptions" or "Enable Audio Descriptions",
                Size = UDim2.new(0.5, -10, 0, 40),
                Position = UDim2.fromOffset(210, 130),
                BackgroundColor3 = Color3.new(0, 0.5, 1),
                TextColor3 = Color3.new(1, 1, 1),
                [Fusion.OnEvent "Activated"] = function()
                    audioAccessibility:enableAudioDescriptions(not audioAccessibility.audioDescriptionsEnabled)
                end
            }
        }
    }
end
```

#### Motion and Animation Accessibility
```lua
-- Motion sensitivity manager
local MotionAccessibility = {}
MotionAccessibility.__index = MotionAccessibility

function MotionAccessibility.new()
    return setmetatable({
        reducedMotion = false,
        prefersReducedMotion = false,
        animationScale = 1,
        parallaxEnabled = true,
        cameraShakeEnabled = true
    }, MotionAccessibility)
end

function MotionAccessibility:checkReducedMotionPreference()
    -- Check system preference (would integrate with platform APIs)
    self.prefersReducedMotion = false -- Placeholder
    if self.prefersReducedMotion then
        self:setReducedMotion(true)
    end
end

function MotionAccessibility:setReducedMotion(enabled)
    self.reducedMotion = enabled
    self.animationScale = enabled and 0.3 or 1
    self.parallaxEnabled = not enabled
    self.cameraShakeEnabled = not enabled

    self:updateAllAnimations()
end

function MotionAccessibility:updateAllAnimations()
    -- Update tween speeds
    for _, tween in ipairs(game:GetService("TweenService"):GetPlayingTweens()) do
        if self.reducedMotion then
            tween:Pause()
            tween:Destroy()
        end
    end

    -- Update custom animations
    game:GetService("ReplicatedStorage"):SetAttribute("AnimationScale", self.animationScale)
end

function MotionAccessibility:createAccessibleTween(instance, properties, duration, easingStyle)
    if self.reducedMotion then
        -- Skip animation, set final values immediately
        for prop, value in pairs(properties) do
            instance[prop] = value
        end
        return nil
    else
        -- Create normal tween with adjusted duration
        local tweenInfo = TweenInfo.new(
            duration * self.animationScale,
            easingStyle or Enum.EasingStyle.Quad,
            Enum.EasingDirection.Out
        )
        return game:GetService("TweenService"):Create(instance, tweenInfo, properties)
    end
end

function MotionAccessibility:createAccessibleSpring(targetValue, speed, damping)
    if self.reducedMotion then
        return function() return targetValue end -- Return static value
    else
        return Fusion.Spring(targetValue, speed, damping)
    end
end

-- Usage
local motionAccessibility = MotionAccessibility.new()
motionAccessibility:checkReducedMotionPreference()

-- Create accessible animations
local function AccessibleButton()
    local isHovered = State(false)

    local hoverAnimation = motionAccessibility:createAccessibleSpring(
        Computed(function() return isHovered:get() and 1.1 or 1 end),
        20, 0.8
    )

    return Fusion.New "TextButton" {
        Text = "Click me",
        Size = Computed(function()
            local scale = hoverAnimation:get()
            return UDim2.fromOffset(100 * scale, 40 * scale)
        end),
        BackgroundColor3 = Color3.new(0, 0.5, 1),
        TextColor3 = Color3.new(1, 1, 1),

        [Fusion.OnEvent "MouseEnter"] = function()
            isHovered:set(true)
        end,

        [Fusion.OnEvent "MouseLeave"] = function()
            isHovered:set(false)
        end
    }
end
```

#### Inclusive Design Patterns
```lua
-- Inclusive design utilities
local InclusiveDesign = {}

function InclusiveDesign.createScalableUI(baseSize, minScale, maxScale)
    -- Create UI that scales based on user preferences or device capabilities
    local scale = math.clamp(1, minScale, maxScale) -- Would be based on user settings

    return function(componentProps)
        local scaledProps = {}
        for key, value in pairs(componentProps) do
            if key == "Size" and typeof(value) == "UDim2" then
                scaledProps[key] = UDim2.new(
                    value.X.Scale,
                    value.X.Offset * scale,
                    value.Y.Scale,
                    value.Y.Offset * scale
                )
            elseif key == "TextSize" then
                scaledProps[key] = value * scale
            elseif key == "Position" and typeof(value) == "UDim2" then
                scaledProps[key] = UDim2.new(
                    value.X.Scale,
                    value.X.Offset * scale,
                    value.Y.Scale,
                    value.Y.Offset * scale
                )
            else
                scaledProps[key] = value
            end
        end
        return scaledProps
    end
end

function InclusiveDesign.createHighContrastTheme()
    return {
        colors = {
            background = Color3.new(1, 1, 1),
            surface = Color3.new(1, 1, 1),
            primary = Color3.new(0, 0, 0),
            secondary = Color3.new(0.3, 0.3, 0.3),
            text = Color3.new(0, 0, 0),
            textSecondary = Color3.new(0.3, 0.3, 0.3),
            border = Color3.new(0, 0, 0),
            success = Color3.new(0, 0.5, 0),
            warning = Color3.new(0.8, 0.5, 0),
            error = Color3.new(0.8, 0, 0)
        },
        spacing = {
            small = 8,
            medium = 16,
            large = 24
        },
        typography = {
            fontSize = {
                small = 14,
                medium = 18,
                large = 24,
                xlarge = 32
            }
        }
    }
end

function InclusiveDesign.createLargeTextTheme()
    local baseTheme = InclusiveDesign.createHighContrastTheme()
    baseTheme.typography.fontSize = {
        small = 18,
        medium = 24,
        large = 32,
        xlarge = 48
    }
    baseTheme.spacing = {
        small = 12,
        medium = 24,
        large = 36
    }
    return baseTheme
end

-- Cognitive accessibility helpers
function InclusiveDesign.simplifyLanguage(text)
    -- Simplify complex language for better comprehension
    local simplifications = {
        ["utilize"] = "use",
        ["implement"] = "do",
        ["facilitate"] = "help",
        ["optimize"] = "improve",
        ["leverage"] = "use",
        ["initiate"] = "start",
        ["terminate"] = "end",
        ["navigate"] = "move",
        ["configure"] = "set up"
    }

    for complex, simple in pairs(simplifications) do
        text = text:gsub(complex, simple)
    end

    return text
end

function InclusiveDesign.addContextualHelp(element, helpText)
    -- Add expandable help text
    local helpVisible = State(false)

    return Fusion.New "Frame" {
        Size = UDim2.fromOffset(200, 40),
        BackgroundTransparency = 1,

        [Fusion.Children] = {
            MainElement = element,

            HelpButton = Fusion.New "TextButton" {
                Text = "?",
                Size = UDim2.fromOffset(20, 20),
                Position = UDim2.fromOffset(180, 0),
                BackgroundColor3 = Color3.new(0.8, 0.8, 0.8),
                TextColor3 = Color3.new(0, 0, 0),
                TextSize = 14,
                Font = Enum.Font.GothamBold,

                [Fusion.OnEvent "Activated"] = function()
                    helpVisible:set(not helpVisible:get())
                end
            },

            HelpText = Fusion.New "TextLabel" {
                Text = helpText,
                Size = UDim2.new(1, 0, 0, 0),
                Position = UDim2.fromOffset(0, 25),
                BackgroundColor3 = Color3.new(1, 1, 0.9),
                TextColor3 = Color3.new(0, 0, 0),
                TextSize = 12,
                TextWrapped = true,
                Visible = helpVisible,

                [Fusion.Children] = {
                    UIPadding = Fusion.New "UIPadding" {
                        PaddingTop = UDim.new(0, 5),
                        PaddingBottom = UDim.new(0, 5),
                        PaddingLeft = UDim.new(0, 5),
                        PaddingRight = UDim.new(0, 5)
                    }
                }
            }
        }
    }
end

-- Usage
local scalableUI = InclusiveDesign.createScalableUI(UDim2.fromOffset(100, 40), 0.8, 1.5)
local highContrastTheme = InclusiveDesign.createHighContrastTheme()

local accessibleButton = Fusion.New "TextButton" {
    Text = InclusiveDesign.simplifyLanguage("Configure Settings"),
    BackgroundColor3 = highContrastTheme.colors.primary,
    TextColor3 = highContrastTheme.colors.background,
    TextSize = highContrastTheme.typography.fontSize.medium,
    Font = Enum.Font.Gotham,

    -- Apply scaling
    Size = scalableUI({Size = UDim2.fromOffset(150, 50)}).Size
}
```

### Testing Accessibility
```lua
-- Accessibility testing utilities
local AccessibilityTester = {}
AccessibilityTester.__index = AccessibilityTester

function AccessibilityTester.new()
    return setmetatable({
        issues = {},
        tests = {}
    }, AccessibilityTester)
end

function AccessibilityTester:registerTest(name, testFunction)
    table.insert(self.tests, {name = name, func = testFunction})
end

function AccessibilityTester:runTests()
    self.issues = {}

    for _, test in ipairs(self.tests) do
        local success, result = pcall(test.func)
        if not success then
            table.insert(self.issues, {
                test = test.name,
                error = result,
                severity = "error"
            })
        elseif result and result.issues then
            for _, issue in ipairs(result.issues) do
                table.insert(self.issues, {
                    test = test.name,
                    issue = issue.message,
                    element = issue.element,
                    severity = issue.severity or "warning"
                })
            end
        end
    end

    return self.issues
end

function AccessibilityTester:generateReport()
    local report = {
        totalTests = #self.tests,
        totalIssues = #self.issues,
        errors = 0,
        warnings = 0,
        summary = {}
    }

    for _, issue in ipairs(self.issues) do
        if issue.severity == "error" then
            report.errors = report.errors + 1
        else
            report.warnings = report.warnings + 1
        end

        report.summary[issue.test] = report.summary[issue.test] or {}
        table.insert(report.summary[issue.test], issue)
    end

    return report
end

-- Built-in accessibility tests
local tester = AccessibilityTester.new()

tester:registerTest("Color Contrast", function()
    local issues = {}
    for _, gui in ipairs(game.Players.LocalPlayer.PlayerGui:GetDescendants()) do
        if gui:IsA("TextLabel") or gui:IsA("TextButton") then
            local bgColor = gui.BackgroundColor3
            local textColor = gui.TextColor3
            if bgColor and textColor then
                if not ColorUtils.isAccessibleContrast(textColor, bgColor) then
                    table.insert(issues, {
                        message = "Insufficient color contrast",
                        element = gui:GetFullName(),
                        severity = "error"
                    })
                end
            end
        end
    end
    return {issues = issues}
end)

tester:registerTest("Keyboard Navigation", function()
    local issues = {}
    local focusableElements = {}

    for _, gui in ipairs(game.Players.LocalPlayer.PlayerGui:GetDescendants()) do
        if gui:IsA("TextButton") or gui:IsA("TextBox") or gui:IsA("ImageButton") then
            table.insert(focusableElements, gui)
            if not gui:GetAttribute("TabIndex") then
                table.insert(issues, {
                    message = "Missing TabIndex for keyboard navigation",
                    element = gui:GetFullName(),
                    severity = "warning"
                })
            end
        end
    end

    if #focusableElements == 0 then
        table.insert(issues, {
            message = "No focusable elements found",
            severity = "warning"
        })
    end

    return {issues = issues}
end)

tester:registerTest("Screen Reader Support", function()
    local issues = {}
    for _, gui in ipairs(game.Players.LocalPlayer.PlayerGui:GetDescendants()) do
        if gui:IsA("GuiButton") or gui:IsA("TextButton") or gui:IsA("ImageButton") then
            if not gui:GetAttribute("AccessibleLabel") then
                table.insert(issues, {
                    message = "Missing AccessibleLabel for screen readers",
                    element = gui:GetFullName(),
                    severity = "error"
                })
            end
        end
    end
    return {issues = issues}
end)

-- Run accessibility tests
local issues = tester:runTests()
local report = tester:generateReport()

print(string.format("Accessibility Test Results: %d errors, %d warnings",
    report.errors, report.warnings))

for testName, testIssues in pairs(report.summary) do
    print("Test: " .. testName)
    for _, issue in ipairs(testIssues) do
        print(string.format("  [%s] %s: %s", issue.severity:upper(), issue.element or "General", issue.issue or issue.error))
    end
end
```

This accessibility section provides comprehensive guidelines and tools for creating inclusive Roblox experiences that work for players with diverse abilities and preferences.

## VR/AR Design Considerations (2025)

### Virtual Reality Design Principles

#### Spatial UI Design
VR experiences require rethinking traditional 2D UI approaches. Instead of screen-based interfaces, VR uses spatial, 3D interfaces that exist in the player's physical space.

```lua
-- VR Spatial UI Manager
local VRSpatialUI = {}
VRSpatialUI.__index = VRSpatialUI

function VRSpatialUI.new()
    return setmetatable({
        uiElements = {},
        playerHead = nil,
        vrService = game:GetService("VRService"),
        userInputService = game:GetService("UserInputService")
    }, VRSpatialUI)
end

function VRSpatialUI:initialize()
    self.playerHead = game.Players.LocalPlayer.Character:WaitForChild("Head")

    -- Set up VR camera
    local camera = workspace.CurrentCamera
    camera.CameraType = Enum.CameraType.Scriptable
    camera.CFrame = self.playerHead.CFrame

    -- Enable VR features
    self.vrService:RequestVR()
end

function VRSpatialUI:createSpatialButton(position, size, properties)
    local button = Instance.new("Part")
    button.Anchored = true
    button.CanCollide = false
    button.Size = size
    button.Position = position
    button.Transparency = 1 -- Invisible collision box

    -- Create visual representation
    local surfaceGui = Instance.new("SurfaceGui")
    surfaceGui.Face = Enum.NormalId.Front
    surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.FixedSize
    surfaceGui.CanvasSize = Vector2.new(200, 100)
    surfaceGui.Parent = button

    local textButton = Instance.new("TextButton")
    textButton.Size = UDim2.fromScale(1, 1)
    textButton.BackgroundColor3 = properties.backgroundColor or Color3.new(0, 0.5, 1)
    textButton.TextColor3 = Color3.new(1, 1, 1)
    textButton.Text = properties.text or "Button"
    textButton.TextSize = 18
    textButton.Font = Enum.Font.GothamBold
    textButton.Parent = surfaceGui

    -- Add rounded corners
    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(0, 10)
    uiCorner.Parent = textButton

    -- VR interaction
    local isHovered = false
    local clickConnection

    button.Touched:Connect(function(touchPart)
        if touchPart:IsDescendantOf(game.Players.LocalPlayer.Character) then
            if not isHovered then
                isHovered = true
                textButton.BackgroundColor3 = properties.hoverColor or Color3.new(0, 0.7, 1)

                -- Play hover sound
                self:playSound("rbxassetid://142700651", 0.3)
            end
        end
    end)

    -- Handle VR controller input
    self.userInputService.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed then return end

        if input.KeyCode == Enum.KeyCode.ButtonA or input.KeyCode == Enum.KeyCode.ButtonX then
            -- Check if player is looking at button
            local camera = workspace.CurrentCamera
            local ray = Ray.new(camera.CFrame.Position, camera.CFrame.LookVector * 100)
            local hit = workspace:FindPartOnRay(ray, game.Players.LocalPlayer.Character)

            if hit and hit == button then
                if properties.onClick then
                    properties.onClick()
                end
                self:playSound("rbxassetid://142700652", 0.5) -- Click sound
            end
        end
    end)

    table.insert(self.uiElements, {
        part = button,
        surfaceGui = surfaceGui,
        properties = properties
    })

    return button
end

function VRSpatialUI:createFloatingPanel(position, size, title)
    local panel = Instance.new("Part")
    panel.Anchored = true
    panel.CanCollide = false
    panel.Size = size
    panel.Position = position
    panel.BrickColor = BrickColor.new("Institutional white")

    -- Add surface GUI
    local surfaceGui = Instance.new("SurfaceGui")
    surfaceGui.Face = Enum.NormalId.Front
    surfaceGui.SizingMode = Enum.SurfaceGuiSizingMode.FixedSize
    surfaceGui.CanvasSize = Vector2.new(400, 300)
    surfaceGui.Parent = panel

    -- Panel background
    local background = Instance.new("Frame")
    background.Size = UDim2.fromScale(1, 1)
    background.BackgroundColor3 = Color3.new(0.9, 0.9, 0.9)
    background.Parent = surfaceGui

    local uiCorner = Instance.new("UICorner")
    uiCorner.CornerRadius = UDim.new(0, 15)
    uiCorner.Parent = background

    -- Title bar
    local titleBar = Instance.new("Frame")
    titleBar.Size = UDim2.new(1, 0, 0, 40)
    titleBar.BackgroundColor3 = Color3.new(0.2, 0.4, 0.8)
    titleBar.Parent = background

    local titleLabel = Instance.new("TextLabel")
    titleLabel.Size = UDim2.new(1, -20, 1, 0)
    titleLabel.Position = UDim2.fromOffset(10, 0)
    titleLabel.BackgroundTransparency = 1
    titleLabel.TextColor3 = Color3.new(1, 1, 1)
    titleLabel.Text = title or "Panel"
    titleLabel.TextSize = 18
    titleLabel.Font = Enum.Font.GothamBold
    titleLabel.TextXAlignment = Enum.TextXAlignment.Left
    titleLabel.Parent = titleBar

    -- Content area
    local contentArea = Instance.new("Frame")
    contentArea.Size = UDim2.new(1, -20, 1, -60)
    contentArea.Position = UDim2.fromOffset(10, 50)
    contentArea.BackgroundTransparency = 1
    contentArea.Parent = background

    -- Make panel face the player
    task.spawn(function()
        while panel.Parent do
            if self.playerHead then
                local direction = (panel.Position - self.playerHead.Position).Unit
                panel.CFrame = CFrame.new(panel.Position, panel.Position + direction)
            end
            task.wait(0.1)
        end
    end)

    return {
        part = panel,
        surfaceGui = surfaceGui,
        contentArea = contentArea,
        background = background
    }
end

function VRSpatialUI:playSound(soundId, volume)
    local sound = Instance.new("Sound")
    sound.SoundId = soundId
    sound.Volume = volume or 1
    sound.Parent = workspace
    sound:Play()
    task.delay(sound.TimeLength, function()
        sound:Destroy()
    end)
end

function VRSpatialUI:update()
    -- Update UI element positions relative to player head
    for _, element in ipairs(self.uiElements) do
        if element.properties.followPlayer then
            local offset = element.properties.offset or Vector3.new(0, 0, -5)
            element.part.Position = self.playerHead.Position + (self.playerHead.CFrame.LookVector * offset.Z) +
                                   (self.playerHead.CFrame.RightVector * offset.X) +
                                   (self.playerHead.CFrame.UpVector * offset.Y)
        end
    end
end

-- Usage
local vrUI = VRSpatialUI.new()
vrUI:initialize()

-- Create spatial button
local menuButton = vrUI:createSpatialButton(
    Vector3.new(0, 2, -3), -- Position in front of player
    Vector3.new(1, 0.5, 0.1), -- Size
    {
        text = "Open Menu",
        backgroundColor = Color3.new(0, 0.6, 1),
        hoverColor = Color3.new(0, 0.8, 1),
        followPlayer = true,
        offset = Vector3.new(0, 0, -3),
        onClick = function()
            print("Menu opened!")
        end
    }
)

-- Create floating panel
local inventoryPanel = vrUI:createFloatingPanel(
    Vector3.new(2, 1.5, -2),
    Vector3.new(2, 1.5, 0.1),
    "Inventory"
)

-- Main update loop
game:GetService("RunService").RenderStepped:Connect(function()
    vrUI:update()
end)
```

#### VR Locomotion Systems
```lua
-- VR Locomotion Manager
local VRLocomotion = {}
VRLocomotion.__index = VRLocomotion

function VRLocomotion.new(character)
    return setmetatable({
        character = character,
        humanoid = character:WaitForChild("Humanoid"),
        hrp = character:WaitForChild("HumanoidRootPart"),
        vrService = game:GetService("VRService"),
        userInputService = game:GetService("UserInputService"),

        locomotionMode = "smooth", -- "smooth", "teleport", "armswing"
        moveSpeed = 16,
        teleportRange = 10,
        comfortMode = true,

        lastPosition = nil,
        armSwingThreshold = 0.5,
        armSwingCount = 0
    }, VRLocomotion)
end

function VRLocomotion:setLocomotionMode(mode)
    self.locomotionMode = mode

    if mode == "teleport" then
        self:enableTeleportMode()
    elseif mode == "armswing" then
        self:enableArmSwingMode()
    else
        self:enableSmoothMode()
    end
end

function VRLocomotion:enableSmoothMode()
    -- Smooth locomotion using thumbsticks
    self.inputConnection = self.userInputService.InputChanged:Connect(function(input, gameProcessed)
        if gameProcessed then return end

        if input.KeyCode == Enum.KeyCode.Thumbstick1 then
            local moveVector = Vector3.new(input.Position.X, 0, -input.Position.Y)
            if moveVector.Magnitude > 0.1 then
                local camera = workspace.CurrentCamera
                local moveDirection = camera.CFrame:VectorToWorldSpace(moveVector)

                self.humanoid:Move(moveDirection, false)
                self.humanoid.WalkSpeed = self.moveSpeed
            else
                self.humanoid:Move(Vector3.zero, false)
            end
        end
    end)
end

function VRLocomotion:enableTeleportMode()
    self.teleportMarker = Instance.new("Part")
    self.teleportMarker.Anchored = true
    self.teleportMarker.CanCollide = false
    self.teleportMarker.Size = Vector3.new(1, 0.1, 1)
    self.teleportMarker.BrickColor = BrickColor.new("Bright blue")
    self.teleportMarker.Material = Enum.Material.Neon
    self.teleportMarker.Transparency = 0.3

    local markerAttachment = Instance.new("Attachment")
    markerAttachment.Parent = self.teleportMarker

    local beam = Instance.new("Beam")
    beam.Attachment0 = self.hrp:FindFirstChild("RootAttachment") or Instance.new("Attachment", self.hrp)
    beam.Attachment1 = markerAttachment
    beam.Color = ColorSequence.new(Color3.new(0, 1, 1))
    beam.Width0 = 0.1
    beam.Width1 = 0.1
    beam.Parent = self.teleportMarker

    self.teleportConnection = self.userInputService.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed then return end

        if input.KeyCode == Enum.KeyCode.ButtonA then
            -- Start teleport targeting
            self.isTargeting = true
            self.teleportMarker.Parent = workspace
        elseif input.KeyCode == Enum.KeyCode.ButtonA and self.isTargeting then
            -- Execute teleport
            self.isTargeting = false
            self.hrp.CFrame = CFrame.new(self.teleportMarker.Position + Vector3.new(0, 3, 0))
            self.teleportMarker.Parent = nil
        end
    end)

    -- Update teleport marker position
    self.targetingConnection = game:GetService("RunService").RenderStepped:Connect(function()
        if self.isTargeting then
            local camera = workspace.CurrentCamera
            local ray = Ray.new(camera.CFrame.Position, camera.CFrame.LookVector * self.teleportRange)
            local hit, position = workspace:FindPartOnRay(ray, self.character)

            if hit then
                self.teleportMarker.Position = position
                self.teleportMarker.BrickColor = BrickColor.new("Bright blue")
            else
                self.teleportMarker.Position = camera.CFrame.Position + camera.CFrame.LookVector * self.teleportRange
                self.teleportMarker.BrickColor = BrickColor.new("Bright red")
            end
        end
    end)
end

function VRLocomotion:enableArmSwingMode()
    self.armSwingConnection = self.userInputService.InputChanged:Connect(function(input, gameProcessed)
        if gameProcessed then return end

        if input.KeyCode == Enum.KeyCode.ButtonR1 then -- Right trigger for arm swing
            local rightController = self.vrService:GetControllerPosition(Enum.UserCFrame.RightHand)
            if rightController then
                local currentPos = rightController.Position
                if self.lastPosition then
                    local movement = (currentPos - self.lastPosition).Magnitude
                    if movement > self.armSwingThreshold then
                        self.armSwingCount = self.armSwingCount + 1

                        if self.armSwingCount >= 2 then -- Two swings = step
                            self.armSwingCount = 0
                            local moveDirection = workspace.CurrentCamera.CFrame.LookVector
                            self.hrp.CFrame = self.hrp.CFrame + moveDirection * 2
                        end
                    end
                end
                self.lastPosition = currentPos
            end
        end
    end)
end

function VRLocomotion:setComfortMode(enabled)
    self.comfortMode = enabled

    if enabled then
        -- Reduce movement speed and add comfort features
        self.moveSpeed = 8
        self.teleportRange = 5

        -- Add snap turning
        self.snapTurnConnection = self.userInputService.InputBegan:Connect(function(input, gameProcessed)
            if gameProcessed then return end

            if input.KeyCode == Enum.KeyCode.ButtonL1 then -- Left bumper for snap turn
                self.hrp.CFrame = self.hrp.CFrame * CFrame.Angles(0, math.rad(45), 0)
            elseif input.KeyCode == Enum.KeyCode.ButtonR1 then
                self.hrp.CFrame = self.hrp.CFrame * CFrame.Angles(0, math.rad(-45), 0)
            end
        end)
    else
        self.moveSpeed = 16
        self.teleportRange = 10
        if self.snapTurnConnection then
            self.snapTurnConnection:Disconnect()
        end
    end
end

function VRLocomotion:cleanup()
    if self.inputConnection then self.inputConnection:Disconnect() end
    if self.teleportConnection then self.teleportConnection:Disconnect() end
    if self.targetingConnection then self.targetingConnection:Disconnect() end
    if self.armSwingConnection then self.armSwingConnection:Disconnect() end
    if self.snapTurnConnection then self.snapTurnConnection:Disconnect() end

    if self.teleportMarker then
        self.teleportMarker:Destroy()
    end
end

-- Usage
local character = game.Players.LocalPlayer.Character
local vrLocomotion = VRLocomotion.new(character)

-- Initialize with smooth locomotion
vrLocomotion:setLocomotionMode("smooth")
vrLocomotion:setComfortMode(true)

-- Allow players to switch modes
game:GetService("ReplicatedStorage").VRModeChanged.OnClientEvent:Connect(function(mode)
    vrLocomotion:setLocomotionMode(mode)
end)
```

### Augmented Reality Design

#### AR Object Placement
```lua
-- AR Object Placement System
local ARPlacement = {}
ARPlacement.__index = ARPlacement

function ARPlacement.new()
    return setmetatable({
        placedObjects = {},
        placementMode = false,
        currentObject = nil,
        previewObject = nil,
        arService = game:GetService("ARService"),
        userInputService = game:GetService("UserInputService")
    }, ARPlacement)
end

function ARPlacement:startPlacement(objectTemplate)
    self.placementMode = true
    self.currentObject = objectTemplate:Clone()

    -- Create preview object
    self.previewObject = objectTemplate:Clone()
    self.previewObject.Anchored = true
    self.previewObject.CanCollide = false
    self.previewObject.Transparency = 0.5
    self.previewObject.Parent = workspace

    -- Set up AR tracking
    if self.arService then
        self.arService:RequestARSession()
    end

    self.placementConnection = game:GetService("RunService").RenderStepped:Connect(function()
        self:updatePlacement()
    end)

    self.inputConnection = self.userInputService.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed then return end

        if input.KeyCode == Enum.KeyCode.ButtonA then
            self:placeObject()
        elseif input.KeyCode == Enum.KeyCode.ButtonB then
            self:cancelPlacement()
        end
    end)
end

function ARPlacement:updatePlacement()
    if not self.previewObject then return end

    -- Use AR raycasting to find placement surface
    local camera = workspace.CurrentCamera
    local screenCenter = Vector2.new(camera.ViewportSize.X / 2, camera.ViewportSize.Y / 2)
    local ray = camera:ViewportPointToRay(screenCenter.X, screenCenter.Y)

    local hit, position, normal = workspace:FindPartOnRay(ray)

    if hit then
        -- Position preview object on surface
        self.previewObject.Position = position
        self.previewObject.CFrame = CFrame.new(position, position + normal) *
                                    CFrame.Angles(0, math.random() * math.pi * 2, 0)

        -- Visual feedback for valid placement
        if self:isValidPlacement(position, normal) then
            self.previewObject.BrickColor = BrickColor.new("Bright green")
        else
            self.previewObject.BrickColor = BrickColor.new("Bright red")
        end
    end
end

function ARPlacement:isValidPlacement(position, normal)
    -- Check if surface is horizontal enough
    local upVector = Vector3.new(0, 1, 0)
    local angle = math.acos(normal:Dot(upVector))

    return angle < math.rad(45) -- 45 degree tolerance
end

function ARPlacement:placeObject()
    if not self.previewObject or not self:isValidPlacement(self.previewObject.Position, self.previewObject.CFrame.UpVector) then
        return
    end

    -- Create final object
    local placedObject = self.currentObject:Clone()
    placedObject.Position = self.previewObject.Position
    placedObject.CFrame = self.previewObject.CFrame
    placedObject.Anchored = false
    placedObject.CanCollide = true
    placedObject.Transparency = 0
    placedObject.Parent = workspace

    table.insert(self.placedObjects, placedObject)

    -- Add removal capability
    self:addObjectInteractions(placedObject)

    -- Clean up preview
    self.previewObject:Destroy()
    self.previewObject = nil

    self.placementMode = false
    self:cleanupConnections()
end

function ARPlacement:cancelPlacement()
    if self.previewObject then
        self.previewObject:Destroy()
        self.previewObject = nil
    end

    self.placementMode = false
    self:cleanupConnections()
end

function ARPlacement:addObjectInteractions(object)
    -- Add touch interaction for mobile AR
    object.Touched:Connect(function(touchPart)
        if touchPart:IsDescendantOf(game.Players.LocalPlayer.Character) then
            -- Show interaction menu
            self:showInteractionMenu(object)
        end
    end)
end

function ARPlacement:showInteractionMenu(object)
    -- Create floating interaction menu
    local menu = Instance.new("Part")
    menu.Anchored = true
    menu.CanCollide = false
    menu.Size = Vector3.new(0.5, 0.3, 0.1)
    menu.Position = object.Position + Vector3.new(0, 1, 0)
    menu.BrickColor = BrickColor.new("White")
    menu.Parent = workspace

    local surfaceGui = Instance.new("SurfaceGui")
    surfaceGui.Face = Enum.NormalId.Front
    surfaceGui.CanvasSize = Vector2.new(150, 90)
    surfaceGui.Parent = menu

    local removeButton = Instance.new("TextButton")
    removeButton.Size = UDim2.fromScale(0.8, 0.6)
    removeButton.Position = UDim2.fromScale(0.1, 0.2)
    removeButton.BackgroundColor3 = Color3.new(0.8, 0.2, 0.2)
    removeButton.TextColor3 = Color3.new(1, 1, 1)
    removeButton.Text = "Remove"
    removeButton.TextSize = 14
    removeButton.Font = Enum.Font.GothamBold
    removeButton.Parent = surfaceGui

    removeButton.Activated:Connect(function()
        object:Destroy()
        menu:Destroy()

        -- Remove from placed objects list
        for i, placedObj in ipairs(self.placedObjects) do
            if placedObj == object then
                table.remove(self.placedObjects, i)
                break
            end
        end
    end)

    -- Auto-remove menu after 5 seconds
    task.delay(5, function()
        if menu.Parent then
            menu:Destroy()
        end
    end)
end

function ARPlacement:cleanupConnections()
    if self.placementConnection then
        self.placementConnection:Disconnect()
        self.placementConnection = nil
    end
    if self.inputConnection then
        self.inputConnection:Disconnect()
        self.inputConnection = nil
    end
end

function ARPlacement:getPlacedObjects()
    return self.placedObjects
end

-- Usage
local arPlacement = ARPlacement.new()

-- Start placing an object
local objectTemplate = game.ReplicatedStorage.ARObjects.Chair
arPlacement:startPlacement(objectTemplate)

-- Get all placed objects
local placedObjects = arPlacement:getPlacedObjects()
print("Placed " .. #placedObjects .. " objects")
```

#### VR/AR Performance Optimization
```lua
-- VR/AR Performance Manager
local VRPerformanceManager = {}
VRPerformanceManager.__index = VRPerformanceManager

function VRPerformanceManager.new()
    return setmetatable({
        vrService = game:GetService("VRService"),
        statsService = game:GetService("Stats"),
        currentQuality = "high",
        adaptiveQuality = true,
        performanceMetrics = {}
    }, VRPerformanceManager)
end

function VRPerformanceManager:monitorPerformance()
    task.spawn(function()
        while true do
            self:updatePerformanceMetrics()
            self:adjustQualityIfNeeded()
            task.wait(1) -- Check every second
        end
    end)
end

function VRPerformanceManager:updatePerformanceMetrics()
    self.performanceMetrics = {
        fps = 1 / game:GetService("RunService").RenderStepped:Wait(),
        memoryUsage = collectgarbage("count") * 1024, -- KB
        networkPing = game:GetService("Stats").Network.ServerStatsItem["Data Ping"]:GetValue(),
        drawCalls = game:GetService("Stats").Workspace.DrawCalls:GetValue(),
        triangles = game:GetService("Stats").Workspace.Triangles:GetValue()
    }
end

function VRPerformanceManager:adjustQualityIfNeeded()
    if not self.adaptiveQuality then return end

    local fps = self.performanceMetrics.fps
    local memoryUsage = self.performanceMetrics.memoryUsage

    if fps < 72 then -- Below 72 FPS for VR comfort
        self:decreaseQuality()
    elseif fps > 90 and memoryUsage < 200 * 1024 * 1024 then -- Above 90 FPS and under 200MB
        self:increaseQuality()
    end
end

function VRPerformanceManager:decreaseQuality()
    if self.currentQuality == "high" then
        self:setQuality("medium")
    elseif self.currentQuality == "medium" then
        self:setQuality("low")
    end
end

function VRPerformanceManager:increaseQuality()
    if self.currentQuality == "low" then
        self:setQuality("medium")
    elseif self.currentQuality == "medium" then
        self:setQuality("high")
    end
end

function VRPerformanceManager:setQuality(level)
    self.currentQuality = level

    if level == "high" then
        settings().Rendering.QualityLevel = 10
        game.Lighting.GlobalShadows = true
        game.Lighting.Brightness = 1
        workspace.LevelOfDetail = Enum.LevelOfDetail.Level04
    elseif level == "medium" then
        settings().Rendering.QualityLevel = 5
        game.Lighting.GlobalShadows = false
        game.Lighting.Brightness = 0.8
        workspace.LevelOfDetail = Enum.LevelOfDetail.Level02
    elseif level == "low" then
        settings().Rendering.QualityLevel = 1
        game.Lighting.GlobalShadows = false
        game.Lighting.Brightness = 0.6
        workspace.LevelOfDetail = Enum.LevelOfDetail.Level01
    end

    print("VR Quality set to: " .. level)
end

function VRPerformanceManager:optimizeForVR()
    -- VR-specific optimizations
    local camera = workspace.CurrentCamera
    camera.FieldOfView = 90 -- Wider FOV for VR

    -- Reduce particle effects in VR
    for _, particleEmitter in ipairs(workspace:GetDescendants()) do
        if particleEmitter:IsA("ParticleEmitter") then
            particleEmitter.Rate = particleEmitter.Rate * 0.5
        end
    end

    -- Optimize lighting for VR
    game.Lighting.Technology = Enum.Technology.Voxel
    game.Lighting.GlobalShadows = false -- Can cause performance issues in VR

    -- Set up VR-specific render settings
    settings().Rendering.VRSafeZone = true
    settings().Rendering.VRComfortRating = Enum.VRComfortRating.Comfortable
end

function VRPerformanceManager:getPerformanceReport()
    return {
        quality = self.currentQuality,
        metrics = self.performanceMetrics,
        recommendations = self:generateRecommendations()
    }
end

function VRPerformanceManager:generateRecommendations()
    local recommendations = {}

    if self.performanceMetrics.fps < 72 then
        table.insert(recommendations, "Consider reducing visual quality or object count")
    end

    if self.performanceMetrics.memoryUsage > 300 * 1024 * 1024 then -- 300MB
        table.insert(recommendations, "High memory usage detected, consider optimizing assets")
    end

    if self.performanceMetrics.drawCalls > 1000 then
        table.insert(recommendations, "High draw calls, consider reducing geometry or using LOD")
    end

    return recommendations
end

-- Usage
local vrPerfManager = VRPerformanceManager.new()
vrPerfManager:optimizeForVR()
vrPerfManager:monitorPerformance()

-- Manual quality control
vrPerfManager:setQuality("medium")

-- Get performance report
local report = vrPerfManager:getPerformanceReport()
print("VR Performance Report:")
print("Quality:", report.quality)
print("FPS:", string.format("%.1f", report.metrics.fps))
print("Memory:", string.format("%.1f MB", report.metrics.memoryUsage / (1024 * 1024)))

for _, rec in ipairs(report.recommendations) do
    print("Recommendation:", rec)
end
```

### Cross-Platform VR/AR Considerations

#### Input Abstraction
```lua
-- Universal Input Manager for VR/AR
local UniversalInput = {}
UniversalInput.__index = UniversalInput

function UniversalInput.new()
    return setmetatable({
        inputType = "unknown", -- "vr", "ar", "mobile", "desktop"
        vrService = game:GetService("VRService"),
        userInputService = game:GetService("UserInputService"),
        gyroEnabled = false,
        touchEnabled = false,
        controllerEnabled = false
    }, UniversalInput)
end

function UniversalInput:detectInputType()
    if self.vrService.VREnabled then
        self.inputType = "vr"
        self.controllerEnabled = true
    elseif self.userInputService.TouchEnabled then
        self.inputType = "mobile"
        self.touchEnabled = true
        self.gyroEnabled = self.userInputService.GyroscopeEnabled
    elseif self.userInputService.GamepadEnabled then
        self.inputType = "gamepad"
    else
        self.inputType = "desktop"
    end

    print("Detected input type:", self.inputType)
end

function UniversalInput:getMoveVector()
    if self.inputType == "vr" then
        -- VR thumbstick input
        local thumbstick = self.userInputService:GetGamepadState(Enum.UserInputType.Gamepad1)
        if thumbstick then
            for _, state in ipairs(thumbstick) do
                if state.KeyCode == Enum.KeyCode.Thumbstick1 then
                    return Vector3.new(state.Position.X, 0, -state.Position.Y)
                end
            end
        end
    elseif self.inputType == "mobile" then
        -- Virtual joystick or tilt controls
        if self.gyroEnabled then
            local gyro = self.userInputService:GetDeviceRotation()
            if gyro then
                return Vector3.new(gyro.X, 0, gyro.Z) * 0.5
            end
        end
    elseif self.inputType == "gamepad" then
        -- Gamepad thumbstick
        local thumbstick = self.userInputService:GetGamepadState(Enum.UserInputType.Gamepad1)
        if thumbstick then
            for _, state in ipairs(thumbstick) do
                if state.KeyCode == Enum.KeyCode.Thumbstick1 then
                    return Vector3.new(state.Position.X, 0, -state.Position.Y)
                end
            end
        end
    else
        -- Keyboard input
        local moveVector = Vector3.zero
        if self.userInputService:IsKeyDown(Enum.KeyCode.W) then moveVector = moveVector + Vector3.new(0, 0, -1) end
        if self.userInputService:IsKeyDown(Enum.KeyCode.S) then moveVector = moveVector + Vector3.new(0, 0, 1) end
        if self.userInputService:IsKeyDown(Enum.KeyCode.A) then moveVector = moveVector + Vector3.new(-1, 0, 0) end
        if self.userInputService:IsKeyDown(Enum.KeyCode.D) then moveVector = moveVector + Vector3.new(1, 0, 0) end
        return moveVector
    end

    return Vector3.zero
end

function UniversalInput:getLookVector()
    if self.inputType == "vr" then
        -- VR head tracking
        return workspace.CurrentCamera.CFrame.LookVector
    elseif self.inputType == "mobile" then
        -- Touch look controls or gyro
        if self.gyroEnabled then
            local gyro = self.userInputService:GetDeviceRotation()
            if gyro then
                return Vector3.new(gyro.Y, 0, gyro.Z)
            end
        end
    else
        -- Mouse look
        local mouse = self.userInputService:GetMouseDelta()
        return Vector3.new(mouse.X, 0, mouse.Y) * 0.01
    end

    return Vector3.zero
end

function UniversalInput:getActionButton()
    if self.inputType == "vr" then
        return self.userInputService:IsGamepadButtonDown(Enum.KeyCode.ButtonA)
    elseif self.inputType == "mobile" then
        -- Check for touch input on action button
        return false -- Would need UI button reference
    else
        return self.userInputService:IsKeyDown(Enum.KeyCode.Space) or
               self.userInputService:IsMouseButtonPressed(Enum.UserInputType.MouseButton1)
    end
end

function UniversalInput:vibrate(intensity, duration)
    if self.inputType == "vr" or self.inputType == "gamepad" then
        self.userInputService:GamepadVibrate(Enum.UserInputType.Gamepad1, intensity, intensity, duration)
    elseif self.inputType == "mobile" then
        -- Mobile vibration
        -- Note: Roblox doesn't currently support mobile vibration
    end
end

-- Usage
local universalInput = UniversalInput.new()
universalInput:detectInputType()

-- Main input loop
game:GetService("RunService").RenderStepped:Connect(function()
    local moveVector = universalInput:getMoveVector()
    local lookVector = universalInput:getLookVector()
    local actionPressed = universalInput:getActionButton()

    -- Use input for character control
    if moveVector.Magnitude > 0.1 then
        -- Move character
    end

    if lookVector.Magnitude > 0.1 then
        -- Rotate camera/character
    end

    if actionPressed then
        -- Perform action
        universalInput:vibrate(0.5, 0.2) -- Haptic feedback
    end
end)
```

This VR/AR design section covers the fundamental principles and implementation patterns for creating immersive experiences across virtual and augmented reality platforms, with considerations for performance, accessibility, and cross-platform compatibility.

## Mobile and Cross-Platform Design (2025)

### Responsive UI Design

#### Adaptive Layout System
```lua
-- Responsive Layout Manager
local ResponsiveLayout = {}
ResponsiveLayout.__index = ResponsiveLayout

function ResponsiveLayout.new()
    return setmetatable({
        breakpoints = {
            mobile = 640,
            tablet = 1024,
            desktop = 1920
        },
        currentBreakpoint = "desktop",
        listeners = {},
        userInputService = game:GetService("UserInputService")
    }, ResponsiveLayout)
end

function ResponsiveLayout:detectDeviceType()
    local viewportSize = workspace.CurrentCamera.ViewportSize
    local width = viewportSize.X

    if width <= self.breakpoints.mobile then
        return "mobile"
    elseif width <= self.breakpoints.tablet then
        return "tablet"
    else
        return "desktop"
    end
end

function ResponsiveLayout:updateBreakpoint()
    local newBreakpoint = self:detectDeviceType()

    if newBreakpoint ~= self.currentBreakpoint then
        local oldBreakpoint = self.currentBreakpoint
        self.currentBreakpoint = newBreakpoint

        -- Notify listeners
        for _, listener in ipairs(self.listeners) do
            task.spawn(function()
                listener(newBreakpoint, oldBreakpoint)
            end)
        end

        print("Breakpoint changed from", oldBreakpoint, "to", newBreakpoint)
    end
end

function ResponsiveLayout:onBreakpointChange(callback)
    table.insert(self.listeners, callback)
end

function ResponsiveLayout:getResponsiveValue(values)
    -- values should be {mobile = value, tablet = value, desktop = value}
    return values[self.currentBreakpoint] or values.desktop
end

function ResponsiveLayout:createResponsiveFrame(properties)
    local frame = Instance.new("Frame")

    local function updateFrame()
        local responsiveProps = {}

        for prop, value in pairs(properties) do
            if type(value) == "table" and (value.mobile or value.tablet or value.desktop) then
                responsiveProps[prop] = self:getResponsiveValue(value)
            else
                responsiveProps[prop] = value
            end
        end

        for prop, value in pairs(responsiveProps) do
            if prop == "Size" then
                frame.Size = value
            elseif prop == "Position" then
                frame.Position = value
            elseif prop == "BackgroundColor3" then
                frame.BackgroundColor3 = value
            elseif prop == "Visible" then
                frame.Visible = value
            end
        end
    end

    self:onBreakpointChange(updateFrame)
    updateFrame()

    return frame
end

-- Initialize responsive layout
local responsiveLayout = ResponsiveLayout.new()

-- Monitor viewport changes
workspace.CurrentCamera:GetPropertyChangedSignal("ViewportSize"):Connect(function()
    responsiveLayout:updateBreakpoint()
end)

-- Initial detection
responsiveLayout:updateBreakpoint()

-- Usage
local mainFrame = responsiveLayout:createResponsiveFrame({
    Size = {
        mobile = UDim2.fromOffset(300, 400),
        tablet = UDim2.fromOffset(600, 500),
        desktop = UDim2.fromOffset(800, 600)
    },
    Position = {
        mobile = UDim2.fromScale(0.5, 0.5),
        tablet = UDim2.fromScale(0.5, 0.5),
        desktop = UDim2.fromScale(0.5, 0.5)
    },
    AnchorPoint = Vector2.new(0.5, 0.5),
    BackgroundColor3 = Color3.new(1, 1, 1)
})

mainFrame.Parent = game.Players.LocalPlayer.PlayerGui
```

#### Touch-Optimized Components
```lua
-- Touch-Friendly Button Component
local TouchButton = Roact.Component:extend("TouchButton")

function TouchButton:init()
    self.touchId = nil
    self.isPressed = false

    self.state = {
        isHovered = false,
        pressStartTime = 0,
        longPressTriggered = false
    }
end

function TouchButton:render()
    local isMobile = self.props.userInputService.TouchEnabled
    local buttonSize = isMobile and UDim2.fromOffset(60, 60) or UDim2.fromOffset(120, 40)

    return Roact.createElement("TextButton", {
        Text = self.props.text,
        Size = buttonSize,
        Position = self.props.position,
        BackgroundColor3 = self.state.isHovered and Color3.new(0, 0.6, 1) or Color3.new(0, 0.5, 1),
        TextColor3 = Color3.new(1, 1, 1),
        TextSize = isMobile and 16 or 14,
        Font = Enum.Font.GothamBold,
        AutoButtonColor = false,

        [Roact.Event.InputBegan] = function(rbx, input)
            if input.UserInputType == Enum.UserInputType.Touch or
               input.UserInputType == Enum.UserInputType.MouseButton1 then

                self.touchId = input.UserInputType == Enum.UserInputType.Touch and input.UserInputId or nil
                self.isPressed = true
                self.state.pressStartTime = tick()
                self.state.longPressTriggered = false

                -- Visual feedback
                rbx.BackgroundColor3 = Color3.new(0, 0.3, 0.8)

                -- Schedule long press
                if self.props.onLongPress then
                    task.delay(0.5, function()
                        if self.isPressed and not self.state.longPressTriggered then
                            self.state.longPressTriggered = true
                            self.props.onLongPress()
                        end
                    end)
                end
            end
        end,

        [Roact.Event.InputEnded] = function(rbx, input)
            if (input.UserInputType == Enum.UserInputType.Touch and input.UserInputId == self.touchId) or
               input.UserInputType == Enum.UserInputType.MouseButton1 then

                self.isPressed = false

                -- Reset visual feedback
                rbx.BackgroundColor3 = self.state.isHovered and Color3.new(0, 0.6, 1) or Color3.new(0, 0.5, 1)

                -- Trigger click if not long pressed
                if not self.state.longPressTriggered and self.props.onClick then
                    local pressDuration = tick() - self.state.pressStartTime
                    if pressDuration < 0.5 then -- Short press
                        self.props.onClick()
                    end
                end

                self.touchId = nil
            end
        end,

        [Roact.Event.MouseEnter] = function(rbx)
            if not self.props.userInputService.TouchEnabled then
                self:setState({isHovered = true})
                rbx.BackgroundColor3 = Color3.new(0, 0.6, 1)
            end
        end,

        [Roact.Event.MouseLeave] = function(rbx)
            if not self.props.userInputService.TouchEnabled then
                self:setState({isHovered = false})
                rbx.BackgroundColor3 = Color3.new(0, 0.5, 1)
            end
        end
    }, {
        UICorner = Roact.createElement("UICorner", {
            CornerRadius = UDim.new(0, 8)
        }),
        UIStroke = Roact.createElement("UIStroke", {
            Color = Color3.new(0, 0.3, 0.6),
            Thickness = 2,
            Transparency = 0.8
        })
    })
end

-- Swipe Gesture Component
local SwipeGesture = Roact.Component:extend("SwipeGesture")

function SwipeGesture:init()
    self.swipeStart = nil
    self.swipeStartTime = 0
    self.minSwipeDistance = 50
    self.maxSwipeTime = 0.5
end

function SwipeGesture:render()
    return Roact.createElement("Frame", {
        Size = UDim2.fromScale(1, 1),
        BackgroundTransparency = 1,
        [Roact.Event.InputBegan] = function(rbx, input)
            if input.UserInputType == Enum.UserInputType.Touch then
                self.swipeStart = input.Position
                self.swipeStartTime = tick()
            end
        end,
        [Roact.Event.InputChanged] = function(rbx, input)
            -- Optional: Add visual feedback during swipe
        end,
        [Roact.Event.InputEnded] = function(rbx, input)
            if input.UserInputType == Enum.UserInputType.Touch and self.swipeStart then
                local swipeEnd = input.Position
                local swipeDuration = tick() - self.swipeStartTime
                local swipeDistance = (swipeEnd - self.swipeStart).Magnitude

                if swipeDuration <= self.maxSwipeTime and swipeDistance >= self.minSwipeDistance then
                    local swipeDirection = (swipeEnd - self.swipeStart).Unit

                    -- Determine swipe direction
                    if math.abs(swipeDirection.X) > math.abs(swipeDirection.Y) then
                        if swipeDirection.X > 0 then
                            if self.props.onSwipeRight then self.props.onSwipeRight() end
                        else
                            if self.props.onSwipeLeft then self.props.onSwipeLeft() end
                        end
                    else
                        if swipeDirection.Y > 0 then
                            if self.props.onSwipeDown then self.props.onSwipeDown() end
                        else
                            if self.props.onSwipeUp then self.props.onSwipeUp() end
                        end
                    end
                end

                self.swipeStart = nil
            end
        end
    }, self.props[Roact.Children])
end

-- Usage
local touchButton = Roact.createElement(TouchButton, {
    text = "Tap me!",
    position = UDim2.fromOffset(50, 50),
    userInputService = game:GetService("UserInputService"),
    onClick = function()
        print("Button tapped!")
    end,
    onLongPress = function()
        print("Button long pressed!")
    end
})

local swipeArea = Roact.createElement(SwipeGesture, {
    onSwipeLeft = function() print("Swiped left!") end,
    onSwipeRight = function() print("Swiped right!") end,
    onSwipeUp = function() print("Swiped up!") end,
    onSwipeDown = function() print("Swiped down!") end
}, {
    Content = Roact.createElement("Frame", {
        Size = UDim2.fromScale(1, 1),
        BackgroundColor3 = Color3.new(0.9, 0.9, 0.9)
    })
})
```

### Cross-Platform Input Handling

#### Universal Input System
```lua
-- Cross-Platform Input Manager
local CrossPlatformInput = {}
CrossPlatformInput.__index = CrossPlatformInput

function CrossPlatformInput.new()
    return setmetatable({
        userInputService = game:GetService("UserInputService"),
        platform = "unknown",
        inputMethod = "unknown",
        activeInputs = {},
        inputBindings = {}
    }, CrossPlatformInput)
end

function CrossPlatformInput:detectPlatform()
    if self.userInputService.TouchEnabled then
        if self.userInputService.GyroscopeEnabled then
            self.platform = "mobile"
        else
            self.platform = "tablet"
        end
        self.inputMethod = "touch"
    elseif game:GetService("VRService").VREnabled then
        self.platform = "vr"
        self.inputMethod = "vr_controllers"
    elseif self.userInputService.GamepadEnabled then
        self.platform = "console"
        self.inputMethod = "gamepad"
    else
        self.platform = "desktop"
        self.inputMethod = "keyboard_mouse"
    end

    print("Detected platform:", self.platform, "with input method:", self.inputMethod)
end

function CrossPlatformInput:bindAction(actionName, bindings)
    -- bindings should be {desktop = key, mobile = "touch", gamepad = button, vr = button}
    self.inputBindings[actionName] = bindings
end

function CrossPlatformInput:isActionPressed(actionName)
    local binding = self.inputBindings[actionName]
    if not binding then return false end

    local platformBinding = binding[self.platform] or binding.desktop

    if self.platform == "desktop" then
        if type(platformBinding) == "table" then
            for _, key in ipairs(platformBinding) do
                if self.userInputService:IsKeyDown(key) then
                    return true
                end
            end
        else
            return self.userInputService:IsKeyDown(platformBinding)
        end
    elseif self.platform == "mobile" then
        -- For mobile, actions are typically triggered by UI buttons
        return self.activeInputs[actionName] or false
    elseif self.platform == "console" or self.platform == "vr" then
        return self.userInputService:IsGamepadButtonDown(platformBinding)
    end

    return false
end

function CrossPlatformInput:getActionValue(actionName)
    -- For analog inputs like thumbsticks
    local binding = self.inputBindings[actionName]
    if not binding then return 0 end

    local platformBinding = binding[self.platform] or binding.desktop

    if self.platform == "desktop" then
        -- Mouse movement or scroll wheel
        if platformBinding == "MouseDelta" then
            return self.userInputService:GetMouseDelta()
        elseif platformBinding == "MouseWheel" then
            return self.userInputService:GetMouseWheel()
        end
    elseif self.platform == "console" or self.platform == "vr" then
        local gamepadState = self.userInputService:GetGamepadState(Enum.UserInputType.Gamepad1)
        if gamepadState then
            for _, state in ipairs(gamepadState) do
                if state.KeyCode == platformBinding then
                    return state.Position
                end
            end
        end
    elseif self.platform == "mobile" then
        -- Virtual joystick values
        return self.activeInputs[actionName] or Vector2.zero
    end

    return 0
end

function CrossPlatformInput:simulateMobileInput(actionName, value)
    -- Called by mobile UI elements
    self.activeInputs[actionName] = value
end

function CrossPlatformInput:createPlatformSpecificUI()
    if self.platform == "mobile" then
        return self:createMobileUI()
    elseif self.platform == "console" then
        return self:createConsoleUI()
    elseif self.platform == "vr" then
        return self:createVRUI()
    else
        return self:createDesktopUI()
    end
end

function CrossPlatformInput:createMobileUI()
    -- Create virtual controls for mobile
    local mobileUI = Instance.new("ScreenGui")
    mobileUI.Name = "MobileControls"
    mobileUI.Parent = game.Players.LocalPlayer.PlayerGui

    -- Virtual joystick
    local joystick = Instance.new("Frame")
    joystick.Name = "Joystick"
    joystick.Size = UDim2.fromOffset(120, 120)
    joystick.Position = UDim2.fromOffset(50, workspace.CurrentCamera.ViewportSize.Y - 170)
    joystick.BackgroundColor3 = Color3.new(0.2, 0.2, 0.2)
    joystick.BackgroundTransparency = 0.5
    joystick.Parent = mobileUI

    local joystickKnob = Instance.new("Frame")
    joystickKnob.Name = "Knob"
    joystickKnob.Size = UDim2.fromOffset(40, 40)
    joystickKnob.Position = UDim2.fromScale(0.5, 0.5)
    joystickKnob.AnchorPoint = Vector2.new(0.5, 0.5)
    joystickKnob.BackgroundColor3 = Color3.new(0.8, 0.8, 0.8)
    joystickKnob.Parent = joystick

    -- Add touch handling for joystick
    local isDragging = false
    local centerPos = Vector2.new(60, 60)

    joystick.InputBegan:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            isDragging = true
        end
    end)

    joystick.InputChanged:Connect(function(input)
        if isDragging and input.UserInputType == Enum.UserInputType.Touch then
            local relativePos = input.Position - joystick.AbsolutePosition
            local delta = relativePos - centerPos
            local maxDistance = 40
            local distance = math.min(delta.Magnitude, maxDistance)

            joystickKnob.Position = UDim2.fromOffset(centerPos.X + delta.Unit.X * distance, centerPos.Y + delta.Unit.Y * distance)

            -- Send input value
            self:simulateMobileInput("Move", delta.Unit * (distance / maxDistance))
        end
    end)

    joystick.InputEnded:Connect(function(input)
        if input.UserInputType == Enum.UserInputType.Touch then
            isDragging = false
            joystickKnob.Position = UDim2.fromScale(0.5, 0.5)
            self:simulateMobileInput("Move", Vector2.zero)
        end
    end)

    -- Action buttons
    local actionButton = Instance.new("TextButton")
    actionButton.Name = "ActionButton"
    actionButton.Size = UDim2.fromOffset(80, 80)
    actionButton.Position = UDim2.new(1, -130, 1, -130)
    actionButton.AnchorPoint = Vector2.new(1, 1)
    actionButton.BackgroundColor3 = Color3.new(0, 0.6, 1)
    actionButton.TextColor3 = Color3.new(1, 1, 1)
    actionButton.Text = "A"
    actionButton.TextSize = 24
    actionButton.Font = Enum.Font.GothamBold
    actionButton.Parent = mobileUI

    actionButton.Activated:Connect(function()
        self:simulateMobileInput("Action", true)
        task.wait(0.1)
        self:simulateMobileInput("Action", false)
    end)

    return mobileUI
end

function CrossPlatformInput:createConsoleUI()
    -- Console UI might need larger text and different button prompts
    local consoleUI = Instance.new("ScreenGui")
    consoleUI.Name = "ConsoleUI"
    consoleUI.Parent = game.Players.LocalPlayer.PlayerGui

    -- Create UI with console-specific sizing and prompts
    return consoleUI
end

function CrossPlatformInput:createVRUI()
    -- VR UI would use spatial elements
    return nil -- Handled by VR-specific systems
end

function CrossPlatformInput:createDesktopUI()
    -- Standard desktop UI
    local desktopUI = Instance.new("ScreenGui")
    desktopUI.Name = "DesktopUI"
    desktopUI.Parent = game.Players.LocalPlayer.PlayerGui

    return desktopUI
end

-- Usage
local crossPlatformInput = CrossPlatformInput.new()
crossPlatformInput:detectPlatform()

-- Bind actions
crossPlatformInput:bindAction("Jump", {
    desktop = Enum.KeyCode.Space,
    mobile = "touch_button",
    console = Enum.KeyCode.ButtonA,
    vr = Enum.KeyCode.ButtonA
})

crossPlatformInput:bindAction("Move", {
    desktop = {Enum.KeyCode.W, Enum.KeyCode.A, Enum.KeyCode.S, Enum.KeyCode.D},
    mobile = "virtual_joystick",
    console = Enum.KeyCode.Thumbstick1,
    vr = Enum.KeyCode.Thumbstick1
})

-- Create platform-specific UI
local platformUI = crossPlatformInput:createPlatformSpecificUI()

-- Main game loop
game:GetService("RunService").RenderStepped:Connect(function()
    if crossPlatformInput:isActionPressed("Jump") then
        -- Make character jump
        print("Jump!")
    end

    local moveValue = crossPlatformInput:getActionValue("Move")
    if typeof(moveValue) == "Vector2" and moveValue.Magnitude > 0.1 then
        -- Move character
        print("Moving:", moveValue)
    end
end)
```

### Performance Optimization for Mobile

#### Mobile-Specific Optimizations
```lua
-- Mobile Performance Manager
local MobilePerformanceManager = {}
MobilePerformanceManager.__index = MobilePerformanceManager

function MobilePerformanceManager.new()
    return setmetatable({
        userInputService = game:GetService("UserInputService"),
        isMobile = false,
        batteryLevel = 1,
        thermalState = "nominal",
        performanceMode = "balanced"
    }, MobilePerformanceManager)
end

function MobilePerformanceManager:initialize()
    self.isMobile = self.userInputService.TouchEnabled

    if self.isMobile then
        self:setupMobileOptimizations()
        self:startPerformanceMonitoring()
    end
end

function MobilePerformanceManager:setupMobileOptimizations()
    -- Reduce quality settings for mobile
    settings().Rendering.QualityLevel = 3
    game.Lighting.GlobalShadows = false
    game.Lighting.Brightness = 0.8

    -- Optimize for battery life
    workspace.LevelOfDetail = Enum.LevelOfDetail.Level02

    -- Reduce particle effects
    for _, emitter in ipairs(workspace:GetDescendants()) do
        if emitter:IsA("ParticleEmitter") then
            emitter.Rate = emitter.Rate * 0.5
            emitter.Lifetime = NumberRange.new(emitter.Lifetime.Min * 0.7, emitter.Lifetime.Max * 0.7)
        end
    end

    -- Use mobile-appropriate texture sizes
    self:optimizeTextures()
end

function MobilePerformanceManager:optimizeTextures()
    for _, descendant in ipairs(workspace:GetDescendants()) do
        if descendant:IsA("BasePart") or descendant:IsA("UnionOperation") or descendant:IsA("MeshPart") then
            for _, surface in ipairs({"TopSurface", "BottomSurface", "LeftSurface", "RightSurface", "FrontSurface", "BackSurface"}) do
                if descendant[surface] == Enum.SurfaceType.Studs then
                    descendant[surface] = Enum.SurfaceType.Smooth
                end
            end
        end
    end
end

function MobilePerformanceManager:startPerformanceMonitoring()
    task.spawn(function()
        while self.isMobile do
            self:monitorPerformance()
            task.wait(5) -- Check every 5 seconds
        end
    end)
end

function MobilePerformanceManager:monitorPerformance()
    local fps = 1 / game:GetService("RunService").RenderStepped:Wait()
    local memoryUsage = collectgarbage("count") * 1024 -- KB

    -- Adjust performance based on metrics
    if fps < 30 then
        self:setPerformanceMode("power_saver")
    elseif fps > 50 and memoryUsage < 100 * 1024 * 1024 then -- 100MB
        self:setPerformanceMode("high_performance")
    else
        self:setPerformanceMode("balanced")
    end
end

function MobilePerformanceManager:setPerformanceMode(mode)
    if mode == self.performanceMode then return end

    self.performanceMode = mode

    if mode == "power_saver" then
        settings().Rendering.QualityLevel = 1
        game.Lighting.Brightness = 0.6
        workspace.LevelOfDetail = Enum.LevelOfDetail.Level01

        -- Further reduce effects
        for _, emitter in ipairs(workspace:GetDescendants()) do
            if emitter:IsA("ParticleEmitter") then
                emitter.Enabled = false
            end
        end

    elseif mode == "balanced" then
        settings().Rendering.QualityLevel = 3
        game.Lighting.Brightness = 0.8
        workspace.LevelOfDetail = Enum.LevelOfDetail.Level02

        -- Restore some effects
        for _, emitter in ipairs(workspace:GetDescendants()) do
            if emitter:IsA("ParticleEmitter") then
                emitter.Enabled = true
                emitter.Rate = emitter:GetAttribute("OriginalRate") or emitter.Rate
            end
        end

    elseif mode == "high_performance" then
        settings().Rendering.QualityLevel = 5
        game.Lighting.Brightness = 1
        workspace.LevelOfDetail = Enum.LevelOfDetail.Level04
    end

    print("Mobile performance mode set to:", mode)
end

function MobilePerformanceManager:optimizeForThermalState(state)
    self.thermalState = state

    if state == "critical" then
        self:setPerformanceMode("power_saver")
        -- Additional thermal mitigations
        game.Lighting.Technology = Enum.Technology.Compatibility
    elseif state == "serious" then
        settings().Rendering.QualityLevel = math.max(1, settings().Rendering.QualityLevel - 2)
    end
end

function MobilePerformanceManager:getPerformanceStats()
    return {
        isMobile = self.isMobile,
        performanceMode = self.performanceMode,
        fps = 1 / game:GetService("RunService").RenderStepped:Wait(),
        memoryUsage = collectgarbage("count") * 1024,
        qualityLevel = settings().Rendering.QualityLevel,
        lodLevel = workspace.LevelOfDetail
    }
end

-- Usage
local mobilePerfManager = MobilePerformanceManager.new()
mobilePerfManager:initialize()

-- Get performance stats
local stats = mobilePerfManager:getPerformanceStats()
print("Mobile Performance Stats:")
print("Mode:", stats.performanceMode)
print("FPS:", string.format("%.1f", stats.fps))
print("Memory:", string.format("%.1f MB", stats.memoryUsage / (1024 * 1024)))
print("Quality Level:", stats.qualityLevel)
```

### Platform-Specific Considerations

#### Console Gaming
```lua
-- Console-Specific Features
local ConsoleManager = {}
ConsoleManager.__index = ConsoleManager

function ConsoleManager.new()
    return setmetatable({
        userInputService = game:GetService("UserInputService"),
        isConsole = false,
        controllerVibration = true,
        uiScale = 1.2,
        textSizeMultiplier = 1.1
    }, ConsoleManager)
end

function ConsoleManager:initialize()
    self.isConsole = self.userInputService.GamepadEnabled and not game:GetService("VRService").VREnabled

    if self.isConsole then
        self:setupConsoleOptimizations()
    end
end

function ConsoleManager:setupConsoleOptimizations()
    -- Larger UI for TV viewing distance
    self.uiScale = 1.2
    self.textSizeMultiplier = 1.1

    -- Enable controller vibration
    self.controllerVibration = true

    -- Optimize for 30 FPS gaming
    settings().Rendering.QualityLevel = 7
    game.Lighting.GlobalShadows = true

    -- Set up console-specific input handling
    self:setupControllerInput()
end

function ConsoleManager:setupControllerInput()
    self.userInputService.InputBegan:Connect(function(input, gameProcessed)
        if gameProcessed then return end

        -- Handle console-specific button combinations
        if input.KeyCode == Enum.KeyCode.ButtonX and self.userInputService:IsGamepadButtonDown(Enum.KeyCode.ButtonY) then
            -- Special combo action
            self:handleSpecialAction()
        end
    end)
end

function ConsoleManager:vibrateController(intensity, duration, controller)
    if self.controllerVibration then
        self.userInputService:GamepadVibrate(controller or Enum.UserInputType.Gamepad1, intensity, intensity, duration)
    end
end

function ConsoleManager:handleSpecialAction()
    print("Console special action triggered!")
    self:vibrateController(0.8, 0.3)
end

function ConsoleManager:getConsoleUIScale()
    return self.uiScale
end

function ConsoleManager:getConsoleTextSize(baseSize)
    return baseSize * self.textSizeMultiplier
end

-- Usage
local consoleManager = ConsoleManager.new()
consoleManager:initialize()

if consoleManager.isConsole then
    -- Create console-optimized UI
    local consoleButton = Instance.new("TextButton")
    consoleButton.Size = UDim2.fromOffset(150 * consoleManager:getConsoleUIScale(), 50 * consoleManager:getConsoleUIScale())
    consoleButton.TextSize = consoleManager:getConsoleTextSize(18)
    consoleButton.Text = "Press X + Y for special action"
    consoleButton.Parent = game.Players.LocalPlayer.PlayerGui
end
```

This mobile and cross-platform design section provides comprehensive guidance for creating experiences that work seamlessly across all Roblox platforms, with special considerations for touch interfaces, performance constraints, and platform-specific features.