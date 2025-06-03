package utils

// Example function that adds two integers and returns the result.
func Add(a int, b int) int {
    return a + b
}

// Example function that subtracts two integers and returns the result.
func Subtract(a int, b int) int {
    return a - b
}

// Example function that multiplies two integers and returns the result.
func Multiply(a int, b int) int {
    return a * b
}

// Example function that divides two integers and returns the result.
// It returns an error if the divisor is zero.
func Divide(a int, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}