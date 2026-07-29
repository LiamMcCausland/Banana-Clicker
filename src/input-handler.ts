
export default class InputHandler {

    checkStringInput(input: string): boolean {
        let result = true;
        if (input === null || input === undefined || input.trim() === "") {
            result = false;
        }
        return result;
    }
}
