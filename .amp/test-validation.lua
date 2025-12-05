-- TEST 1: Código CON errores naranja (forward reference)
-- Este archivo demuestra errores que el validador detectará

local function main()
    helper()  -- ERROR: helper no existe aún
end

local function helper()
    return 42
end

main()
