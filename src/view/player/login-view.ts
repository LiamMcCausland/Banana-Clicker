import PlayerController from "../../controller/player/player-controller.ts";

export default class LoginView {
    #playerController: PlayerController;

    constructor(playerController: PlayerController) {
        this.#playerController = playerController;
        this.render();
    }

    render() {
        const overlay = document.createElement("div");
        overlay.id = "login-overlay";
        overlay.className = "login-overlay";

        overlay.innerHTML = `
            <div class="login-box">
                <h2>Login</h2>

                <input 
                    id="username-input"
                    type="text"
                    placeholder="Username"
                />

                <input 
                    id="password-input"
                    type="password"
                    placeholder="Password"
                />

                <button id="login-button">
                    Login
                </button>

                <button id="register-button">
                    Create Account
                </button>

                <p id="login-error"></p>
            </div>
        `;

        document.body.appendChild(overlay);

        document
            .querySelector("#login-button")!
            .addEventListener("click", () => this.login());

        document
            .querySelector("#register-button")!
            .addEventListener("click", () => this.register());
    }


    async login() {
        const username = (
            document.querySelector("#username-input") as HTMLInputElement
        ).value;

        const password = (
            document.querySelector("#password-input") as HTMLInputElement
        ).value;

        try {
            await this.#playerController.login(username, password);
            this.close();
        } catch (e: any) {
            this.showError(e.message);
        }
    }


    async register() {
        const username = (
            document.querySelector("#username-input") as HTMLInputElement
        ).value;

        const password = (
            document.querySelector("#password-input") as HTMLInputElement
        ).value;

        try {
            await this.#playerController.register(username, password);
            this.close();
        } catch (e: any) {
            this.showError(e.message);
        }
    }


    showError(message: string) {
        document.querySelector("#login-error")!.textContent = message;
    }


    close() {
        document.querySelector("#login-overlay")?.remove();
    }
}
