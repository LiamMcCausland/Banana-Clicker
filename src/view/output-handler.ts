
export default class OutputHandler {
    // Display a message to the user
    displayMessage(message: string) {
            let dialogPopUp = document.createElement('dialog');
            const app = document.getElementById("app")!;
            dialogPopUp.className = "popup-message";
            dialogPopUp.textContent = message;
            app.appendChild(dialogPopUp);

            let closeButton = document.createElement('button');
            closeButton.className = "close-button";
            closeButton.textContent = "Close";
            dialogPopUp.appendChild(closeButton);

            closeButton.addEventListener('click', () => {dialogPopUp.close();});

            dialogPopUp.showModal();
    }
}
