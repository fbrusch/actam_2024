let lastUpdateTime = 0
let wasPressed = false
let isPressed = false
// 100ms between updates
let UPDATE_INTERVAL = 100
basic.showString("Hi")
basic.forever(function () {
    isPressed = input.pinIsPressed(TouchPin.P0)
    // Handle button state changes immediately
    if (isPressed && !(wasPressed)) {
        // Button just pressed - show pressed pattern
        basic.showLeds(`
            # . . . #
            . # # # .
            . # # # .
            . # # # .
            # . . . #
            `)
        wasPressed = true
    } else if (!(isPressed) && wasPressed) {
        // Button just released - show released pattern and send release code
        basic.showLeds(`
            # . . . #
            . # . # .
            . . . . .
            . # . # .
            # . . . #
            `)
        serial.writeNumber(101)
        wasPressed = false
    }
    // Only send random numbers if enough time has passed
    if (isPressed && input.runningTime() - lastUpdateTime >= UPDATE_INTERVAL) {
        serial.writeNumber(randint(0, 100))
        lastUpdateTime = input.runningTime()
    }
})
