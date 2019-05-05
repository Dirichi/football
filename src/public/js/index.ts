// TODO: This is not ideal, but will be replaced when we use a proper frontend
// framework like angular.

window.addEventListener("load", () => {
  const newGameButton = document.querySelector("#new-game-button");
  newGameButton.addEventListener("click", () => {
    const request = new XMLHttpRequest();
    request.open("POST", "/games/create");
    request.addEventListener("load", () => {
      const response = JSON.parse(request.responseText);
      window.location = response.redirectUrl;
    });
    request.send();
  });
});
