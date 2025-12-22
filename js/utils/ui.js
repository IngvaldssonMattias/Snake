export class UI {
  /* =========================
     Init
  ========================== */
  static init(board, gameContainer) {
    board.classList.add("hide-background");
    gameContainer.style.visibility = "hidden";
  }

  /* =========================
     Visa spel-läge
  ========================== */
  static showGame(gameContainer, board) {
    gameContainer.style.display = "block";
    gameContainer.style.visibility = "visible";
    board.classList.remove("hide-background");
  }

  /* =========================
     Visa start-skärm
  ========================== */
  static showStartScreen(instructionText, logo) {
    instructionText.style.display = "block";
    logo.style.display = "block";
  }

  /* =========================
     Start singleplayer
  ========================== */
  static showSinglePlayer(startMenu, gameContainer, board, logo) {
    startMenu.style.display = "none";
    gameContainer.style.display = "block";
    gameContainer.style.visibility = "visible";
    board.classList.remove("hide-background");
    logo.style.display = "block";
  }

  /* =========================
     Start multiplayer modal
  ========================== */
  static showMultiplayerModal(modal, startMenu, gameContainer, board, logo, instructionText, playerDisplay) {
    modal.classList.remove("hidden");

    startMenu.style.display = "none";
    gameContainer.style.display = "none";
    gameContainer.style.visibility = "hidden";
    logo.style.display = "none";
    instructionText.style.display = "none";
    playerDisplay.style.display = "none";

    board.classList.add("hide-background");
  }

  /* =========================
     Stäng multiplayer modal
  ========================== */
  static hideMultiplayerModal(modal, startMenu, gameContainer, board, logo, instructionText, playerDisplay) {
    modal.classList.add("hidden");

    startMenu.style.display = "flex";
    gameContainer.style.display = "none";
    gameContainer.style.visibility = "hidden";
    board.classList.add("hide-background");

    logo.style.display = "none";
    instructionText.style.display = "block";
    playerDisplay.style.display = "block";
  }

  /* =========================
     Dölj instruktionstext (Space)
  ========================== */
  static hideInstructionText(instructionText) {
    instructionText.style.display = "none";
  }

  /* =========================
     Visa ny rekord-message
  ========================== */
  static showNewRecordMessage(newRecordMsg, playerName) {
    newRecordMsg.textContent = `Grattis ${playerName}! Du har slagit nytt rekord!`;
    newRecordMsg.style.display = "block";
    setTimeout(() => (newRecordMsg.style.display = "none"), 6000);
  }
}
