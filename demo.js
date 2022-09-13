document.addEventListener('DOMContentLoaded', () => {
  // logger
  const logsContainer = document.querySelector('#logs');
  const logger = (text) => {
    const li = document.createElement('li');
    li.textContent = `[${(new Date).toISOString()}] ${text}`;
    logsContainer.prepend(li);
  };

  // handle gamepad events
  const controller = [];

  const deepEqual = (before, after) => {
    if (!before) { return false; }

    if (before.buttons.length != after.buttons.length) { return false; }
    for (let i = 0; i < before.buttons.length; i++) {
      beforeButton = before.buttons[i];
      afterButton  = after.buttons[i];
      if (beforeButton.pressed != afterButton.pressed || beforeButton.value != afterButton.value) {
        return false;
      }
    }

    if (before.axes.length != after.axes.length) { return false; }
    for (let i = 0; i < before.axes.length; i++) {
      beforeAxes = before.axes[i];
      afterAxes  = after.axes[i];
      if (beforeAxes != afterAxes) {
        return false;
      }
    }

    return true;
  };

  const updateGamepadState = () => {
    const gamepads = navigator.getGamepads();
    for (i in gamepads) {
      const gamepad = gamepads[i];
      const nextState = {
        id: gamepad.id,
        buttons: [],
        axes: [],
      };
      gamepad.buttons.forEach(e => nextState.buttons.push({ pressed: e.pressed, value: e.value }));
      gamepad.axes.forEach(e => nextState.axes.push(e));

      if (!deepEqual(controller[i], nextState)) {
        controller[i] = nextState;
        logger(JSON.stringify(nextState));
      }
    }

    const haveActivePads = gamepads.filter(g => g.connected).length > 0;
    if (haveActivePads) {
      window.requestAnimationFrame(updateGamepadState);
    }
  };

  const connectHandler = (e) => {
    const gamepad = e.gamepad;
    console.log(gamepad);
    logger(`${gamepad.id} connected`);
    window.requestAnimationFrame(updateGamepadState);
  };

  const disconnectHandler = (e) => {
    const gamepad = e.gamepad;
    logger(`${gamepad.id} disconnected`);
  };

  window.addEventListener("gamepadconnected", connectHandler);
  window.addEventListener("gamepaddisconnected", disconnectHandler);
});
