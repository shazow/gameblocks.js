# Getting Started

## Importing

Gameblocks doesn't come with a dynamic dependency loader like some other frameworks, so you will need include all the source in the HTML in dependency order:

```html
<script src="../externs/Class.js"></script>
<script src="../externs/unstdlib.js"></script>

<script src="../src/Dom.js"></script>
<script src="../src/Global.js"></script>

<script src="../src/Camera.js"></script>
<script src="../src/Clock.js"></script>
<script src="../src/Engine.js"></script>
<script src="../src/Entity.js"></script>
<script src="../src/Input.js"></script>
<script src="../src/Renderer.js"></script>
<script src="../src/State.js"></script>
```

Alternatively you can compile the entire framework into one file to include. *(This is untested, there might be bugs.)*

```bash
$ cd myrepos/gameblocks.js/
$ ./build.sh
Compiling...  Done.
```

This will create a file `gameblocks.js` which you can import:

```html
<script src="../gameblocks.js"></script>
```

## Creating the game blocks

Now that we've imported the gameblocks, we need to instantiate the pieces we want to use.

### Camera
The Camera object is the view pane of our game. This will be the container of everything we render and where we will implement things like panning if necessary.

Gameblocks.js comes with a really minimal utility for selecting and creating DOM elements, kind of like a tiny subset of jQuery. First we make a container which the Camera will render into:

```javascript
var container = Dom.create("div"); // Create a container div
Dom.select("body")[0].appendChild(container); // Append it to the <body>
```

Next we make our Camera object, let's make it 400px by 300px:

```javascript
var camera = new Game.Camera(container, 400, 300);
```

### Renderer
The Renderer manages the things we'll be drawing, a Canvas-based renderer is used by default. You can have multiple layers, such as a background layer and a collideable foreground layer and a player entity layer. In this case, we'll make just one layer:

```javascript
var renderer = new Game.Renderer(camera, 1);
```

### State Machine
All games have multiple states they take the player through. These could be your intro screen, the first level, the second level, the death screen, the high scores screen, and whatever else. The State Machine keeps track of all the states and which state you're currently in.

```javascript
var intro_state = new Game.State('intro', {
    'run': function() {
        // Code to render the intro screen
        alert('Hi.');
    }
});
var gameover_state = new Game.State('gameover', {
    'enter': function() {
        // Code to render the game over screen
        alert('Game over!');
    }
});

var state_machine = new Game.StateMachine();
state_machine.add(intro_state);
state_machine.add(gameover_state);
```

Each state has at an ``id`` and a dictionary of ``handlers`` which is a mapping from the handler name to a function. Valid handlers include ``run`` which gets called every tick by the Engine while it's running, ``enter`` which gets called when the State is first entered, and ``exit`` which gets called just before the State is transitioned out of.

### Input
The Input manager keeps track of key bindings and listens to the user's key presses. Presses are tracked in a stateful manner rather than in an eventful manner. That means as part of the game loop, you'll be checking if a specific action is currently activated.

```javascript
var input = new Game.Input();

input.bind({
    // (Key -> Action) mapping
    'LEFT_ARROW': 'left',
    'RIGHT_ARROW': 'right',
    'SPACE': 'jump',
});
```

You can also queue one-time callback-based key bindings, for things like pausing.

```javascript
input.queue('ESC', function() {
    // Code to pause the game
    alert('Pause?');
});
```

### Engine

Finally, the engine. This is the part that maintains the main event loop which is based off of the State Machine.

```javascript
var engine = new Game.Engine(state_machine);
```

## Activating the blocks

Now that we've instantiated all the game blocks, we can activate them and start our game.

### Enter our initial state
This defines what state our game starts in.

```javascript
state_machine.enter('intro');
```

### Start the engine
This starts the main loop based on the current state in our State Machine.

```javascript
engine.start();
```

### Start listening to user input

```javascript
input.start_listening();
```

## Next steps
Now we need to write code which reacts to the user input and takes the StateMachine across different states as needed. Each state defines its own game mechanic and draws things to the screen using the Renderer's layers.
