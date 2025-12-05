-- TEST 2: Código CORRECTO (sin errores naranja)
-- Las funciones se definen ANTES de usarlas

local function helper()
    return 42
end

local function main()
    helper()  -- OK: helper existe
end

main()
