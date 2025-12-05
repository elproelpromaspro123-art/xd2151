// Roblox Studio API Documentation for AI Models
// This file contains comprehensive documentation of Roblox Studio APIs, best practices,
// and code patterns that AI models should use when generating Roblox code.

export const ROBLOX_DOCUMENTATION = {
  // Core APIs and Services
  services: {
    Players: {
      description: "Manages player connections and data",
      methods: {
        GetPlayers: "Returns a table of all Player objects",
        GetPlayerByUserId: "Returns a Player object by user ID",
        PlayerAdded: "Event fired when a player joins",
        PlayerRemoving: "Event fired when a player leaves"
      },
      properties: {
        LocalPlayer: "The Player object for the local client",
        MaxPlayers: "Maximum number of players allowed"
      }
    },

    ReplicatedStorage: {
      description: "Storage for objects that need to be accessed by both client and server",
      usage: "Store shared modules, assets, and data here"
    },

    ServerStorage: {
      description: "Server-only storage for sensitive data and server scripts",
      usage: "Store server-only modules and assets"
    },

    ServerScriptService: {
      description: "Container for server scripts",
      usage: "Place server scripts here for organization"
    },

    StarterPlayer: {
      description: "Contains player-specific starter content",
      subcontainers: {
        StarterPlayerScripts: "Client scripts that run for each player",
        StarterCharacterScripts: "Scripts that run on each player's character",
        StarterGui: "GUI elements cloned to each player's PlayerGui"
      }
    },

    Workspace: {
      description: "The main 3D environment container",
      methods: {
        FindFirstChild: "Find child by name",
        GetChildren: "Get all children",
        WaitForChild: "Wait for a child to exist"
      }
    },

    RunService: {
      description: "Provides events for running code at specific times",
      events: {
        Heartbeat: "Fires every frame (client and server)",
        RenderStepped: "Fires every frame before rendering (client only)",
        Stepped: "Fires every physics step (server only)"
      }
    },

    UserInputService: {
      description: "Handles user input events",
      events: {
        InputBegan: "Fired when input starts",
        InputEnded: "Fired when input ends",
        InputChanged: "Fired when input changes"
      },
      methods: {
        IsKeyDown: "Check if a key is currently pressed",
        GetMouseLocation: "Get current mouse position"
      }
    },

    TweenService: {
      description: "Creates smooth animations and transitions",
      methods: {
        Create: "Create a tween object",
        GetValue: "Get current tween value"
      }
    },

    HttpService: {
      description: "Makes HTTP requests",
      methods: {
        GetAsync: "Make GET request",
        PostAsync: "Make POST request",
        JSONDecode: "Parse JSON string",
        JSONEncode: "Convert table to JSON"
      }
    },

    DataStoreService: {
      description: "Persistent data storage",
      methods: {
        GetDataStore: "Get a DataStore object",
        GetOrderedDataStore: "Get an ordered DataStore"
      }
    }
  },

  // GUI System
  gui: {
    ScreenGui: {
      description: "Main container for GUI elements",
      properties: {
        Enabled: "Whether the GUI is visible",
        ResetOnSpawn: "Reset GUI when player respawns",
        ZIndexBehavior: "How ZIndex is handled"
      }
    },

    Frame: {
      description: "Basic GUI container",
      properties: {
        BackgroundColor3: "Background color",
        BackgroundTransparency: "Background opacity (0-1)",
        BorderSizePixel: "Border thickness",
        Position: "UDim2 position",
        Size: "UDim2 size",
        AnchorPoint: "Pivot point for positioning",
        Visible: "Whether frame is visible"
      }
    },

    TextLabel: {
      description: "Displays text",
      properties: {
        Text: "The text to display",
        TextColor3: "Text color",
        TextSize: "Font size",
        Font: "Font family",
        TextScaled: "Auto-scale text to fit",
        TextWrapped: "Wrap text to new lines",
        TextXAlignment: "Horizontal alignment",
        TextYAlignment: "Vertical alignment"
      }
    },

    TextButton: {
      description: "Clickable text button",
      events: {
        Activated: "Fired when clicked",
        MouseEnter: "Fired when mouse enters",
        MouseLeave: "Fired when mouse leaves"
      }
    },

    ImageLabel: {
      description: "Displays images",
      properties: {
        Image: "Asset ID of the image",
        ImageColor3: "Image tint color",
        ImageTransparency: "Image opacity",
        ScaleType: "How image scales",
        SliceCenter: "Nine-slice scaling center"
      }
    },

    ScrollingFrame: {
      description: "Scrollable container",
      properties: {
        CanvasSize: "Total scrollable area size",
        ScrollBarThickness: "Thickness of scroll bars",
        ScrollBarImageColor3: "Scroll bar color",
        AutomaticCanvasSize: "Auto-calculate canvas size"
      }
    },

    UICorner: {
      description: "Rounds corners of GUI elements",
      properties: {
        CornerRadius: "Radius of corner rounding"
      }
    },

    UIStroke: {
      description: "Adds outline/border to GUI elements",
      properties: {
        Color: "Stroke color",
        Thickness: "Stroke thickness",
        Transparency: "Stroke opacity"
      }
    },

    UIGradient: {
      description: "Applies color gradients",
      properties: {
        Color: "Color sequence for gradient",
        Offset: "Gradient offset",
        Rotation: "Gradient rotation angle"
      }
    },

    UIAspectRatioConstraint: {
      description: "Maintains aspect ratio",
      properties: {
        AspectRatio: "Width/Height ratio",
        AspectType: "How aspect ratio is applied",
        DominantAxis: "Which axis dominates"
      }
    },

    UISizeConstraint: {
      description: "Constrains minimum/maximum size",
      properties: {
        MinSize: "Minimum size",
        MaxSize: "Maximum size"
      }
    },

    UITextSizeConstraint: {
      description: "Constrains text size",
      properties: {
        MinTextSize: "Minimum text size",
        MaxTextSize: "Maximum text size"
      }
    }
  },

  // Luau Language Features
  luau: {
    types: {
      description: "Type annotations for better code",
      examples: {
        function: "function greet(name: string): string",
        variable: "local player: Player = Players.LocalPlayer",
        table: "local config: {enabled: boolean, speed: number}"
      }
    },

    task: {
      description: "Modern async/await system",
      methods: {
        spawn: "Run function in new thread",
        defer: "Run function at end of current scope",
        delay: "Run function after delay",
        wait: "Yield for specified time",
        cancel: "Cancel a running thread"
      }
    },

    string: {
      methods: {
        format: "Format string with placeholders",
        match: "Pattern matching",
        gsub: "Global string substitution",
        split: "Split string by delimiter"
      }
    },

    table: {
      methods: {
        insert: "Insert element at position",
        remove: "Remove element at position",
        sort: "Sort table elements",
        concat: "Concatenate table elements",
        find: "Find element in table"
      }
    }
  },

  // Best Practices
  bestPractices: {
    performance: [
      "Use task.defer() instead of wait() for non-blocking delays",
      "Cache frequently accessed services and objects",
      "Use LocalScripts for client-side logic",
      "Use Script for server-side logic",
      "Avoid creating too many connections to events",
      "Use object pooling for frequently created/destroyed objects",
      "Minimize use of FindFirstChild in loops",
      "Use WaitForChild with timeout for async loading"
    ],

    security: [
      "Validate all remote events and functions",
      "Use server-side validation for critical operations",
      "Don't trust client-side data",
      "Use HttpService filtering for external requests",
      "Sanitize user input",
      "Use proper data store key validation"
    ],

    ui: [
      "Use UDim2.Scale for responsive design",
      "Set AnchorPoint for proper positioning",
      "Use UI constraints for responsive layouts",
      "Group related GUI elements in Frames",
      "Use consistent spacing and sizing",
      "Test on multiple screen sizes",
      "Use appropriate ZIndex values"
    ],

    codeOrganization: [
      "Use ModuleScripts for reusable code",
      "Organize scripts in logical folder structure",
      "Use descriptive variable and function names",
      "Add comments for complex logic",
      "Use type annotations for clarity",
      "Follow consistent naming conventions",
      "Separate concerns (UI, logic, data)"
    ]
  },

  // Common Patterns
  patterns: {
    eventConnections: {
      description: "Proper event connection cleanup",
      example: `
local connections = {}

local function setupEvents()
    connections.playerAdded = Players.PlayerAdded:Connect(function(player)
        print(player.Name .. " joined")
    end)

    connections.playerRemoving = Players.PlayerRemoving:Connect(function(player)
        print(player.Name .. " left")
    end)
end

local function cleanup()
    for _, connection in connections do
        connection:Disconnect()
    end
    connections = {}
end

setupEvents()
-- Call cleanup() when done
      `
    },

    tweening: {
      description: "Smooth animations with TweenService",
      example: `
local TweenService = game:GetService("TweenService")

local function tweenObject(object, properties, duration)
    local tweenInfo = TweenInfo.new(
        duration or 0.5,
        Enum.EasingStyle.Quad,
        Enum.EasingDirection.Out
    )

    local tween = TweenService:Create(object, tweenInfo, properties)
    tween:Play()
    return tween
end

-- Usage
tweenObject(myFrame, {
    Position = UDim2.new(0.5, 0, 0.5, 0),
    BackgroundTransparency = 0.5
}, 1.0)
      `
    },

    datastore: {
      description: "Safe DataStore operations",
      example: `
local DataStoreService = game:GetService("DataStoreService")
local dataStore = DataStoreService:GetDataStore("PlayerData")

local function loadPlayerData(userId: number)
    local success, data = pcall(function()
        return dataStore:GetAsync(tostring(userId))
    end)

    if success then
        return data or {}
    else
        warn("Failed to load data for " .. userId)
        return {}
    end
end

local function savePlayerData(userId: number, data: table)
    local success = pcall(function()
        dataStore:SetAsync(tostring(userId), data)
    end)

    if not success then
        warn("Failed to save data for " .. userId)
    end
end
      `
    },

    moduleScript: {
      description: "Reusable module structure",
      example: `
-- MyModule.lua
local MyModule = {}

function MyModule.init()
    print("Module initialized")
end

function MyModule.doSomething(value: string)
    return value:upper()
end

return MyModule

-- Usage in another script
local MyModule = require(path.to.MyModule)
MyModule.init()
local result = MyModule.doSomething("hello")
      `
    }
  },

  // Instance Types and Properties
  instances: {
    Part: {
      properties: {
        Position: "Vector3 position in workspace",
        Size: "Vector3 dimensions",
        Color: "Base color",
        Transparency: "Opacity (0-1)",
        CanCollide: "Whether part collides with others",
        Anchored: "Whether part is anchored",
        Material: "Surface material"
      }
    },

    Model: {
      description: "Container for related instances",
      methods: {
        GetChildren: "Get all child instances",
        FindFirstChild: "Find child by name",
        MoveTo: "Move model to position"
      }
    },

    Humanoid: {
      description: "Controls character movement and animation",
      properties: {
        WalkSpeed: "Movement speed",
        JumpPower: "Jump force",
        Health: "Current health",
        MaxHealth: "Maximum health",
        PlatformStand: "Whether character stands on platforms"
      },
      events: {
        Died: "Fired when humanoid dies",
        Running: "Fired when movement speed changes"
      }
    },

    Tool: {
      description: "Items that can be equipped by players",
      events: {
        Activated: "Fired when tool is activated",
        Deactivated: "Fired when tool is deactivated",
        Equipped: "Fired when tool is equipped",
        Unequipped: "Fired when tool is unequipped"
      }
    }
  },

  // Enums (commonly used)
  enums: {
    KeyCode: {
      description: "Keyboard key codes",
      common: ["A", "B", "C", "Space", "Return", "LeftShift", "RightMouseButton"]
    },

    UserInputType: {
      description: "Types of user input",
      values: ["MouseButton1", "MouseButton2", "Keyboard", "Touch", "Gamepad1"]
    },

    EasingStyle: {
      description: "Animation easing styles",
      values: ["Linear", "Quad", "Cubic", "Quart", "Quint", "Sine", "Exponential", "Circular", "Elastic", "Back", "Bounce"]
    },

    EasingDirection: {
      description: "Animation easing directions",
      values: ["In", "Out", "InOut"]
    },

    Material: {
      description: "Part surface materials",
      values: ["Plastic", "Wood", "Slate", "Concrete", "CorrodedMetal", "DiamondPlate", "Foil", "Grass", "Ice", "Marble", "Metal", "Pebble", "Sand", "Fabric", "SmoothPlastic", "ForceField"]
    }
  },

  // UDim2 Usage Guide
  udim2: {
    description: "Responsive positioning and sizing system",
    scale: {
      description: "Relative to parent size (0-1)",
      example: "UDim2.new(0.5, 0, 0.5, 0) -- Center of parent"
    },
    offset: {
      description: "Absolute pixels",
      example: "UDim2.new(0, 100, 0, 50) -- 100px from left, 50px from top"
    },
    mixed: {
      description: "Combining scale and offset",
      example: "UDim2.new(0.5, -50, 0, 100) -- Center horizontally with 50px left offset, 100px from top"
    }
  },

  // Common Issues and Solutions
  troubleshooting: {
    "GUI not appearing": [
      "Check if ScreenGui.Enabled is true",
      "Ensure ScreenGui is parented to PlayerGui",
      "Verify ZIndex is appropriate",
      "Check if parent frames are visible"
    ],

    "Script not running": [
      "Check if script is enabled",
      "Verify script location (ServerScriptService for server, StarterPlayerScripts for client)",
      "Check for syntax errors in output",
      "Ensure required services are available"
    ],

    "Event not firing": [
      "Check event connections are established",
      "Verify event parameters match",
      "Ensure objects exist when connecting",
      "Check for conflicting event handlers"
    ],

    "Data not saving": [
      "Use pcall for DataStore operations",
      "Check DataStore key format",
      "Verify data size limits",
      "Handle rate limiting properly"
    ]
  }
};

// Export for use in AI models
export default ROBLOX_DOCUMENTATION;