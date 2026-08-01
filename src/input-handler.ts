// Handles string input validation for the application at a basic level
export default class InputHandler {

    // Checks if the input string is valid (not null, undefined, or empty)
    checkStringInput(input: string): boolean {
        let result = true;
        if (input === null || input === undefined || input.trim() === "") {
            result = false;
        }
        return result;
    }
}
