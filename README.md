# Game Blocks

This codebase is extracted from [LineRage](https://chrome.google.com/webstore/detail/oplmlhhgdcliikihbehklkagmeophnlh), a fast-paced Tron-like arcade-style JavaScript game.

It's not a complete working game out of the box, you'll need to implement a lot
of your own logic between the glue. There are more complete frameworks out there
but this one has some interesting optimizations that could be reused.


## Getting Started

Have a look at the [Getting Started](docs/Getting-Started.md) document and some of the [Examples](examples/).


## Organization & Philosophy

Much of the code is written with performance optimization in mind to support a
fast-paced game environment.

Each major component is maintained within its own closure that binds to a
global ``Game`` variable. Generally they're separated into their
own JavaScript files.


## Programming Interface

### Classes

* ``Game.Camera``
    Create a viewport Div inside ``container`` of size ``width``x``height``
    pixels.

* ``Game.Time``
    Static object for maintaining a cached value of time.
* ``Game.Clock``
* ``Game.ClockThrottled``
    Clock that moves no faster than ``max_timestep`` ms.
* ``Game.Timer``
    Timer relative to a given clock.

    ```javascript
var clock = new Game.Clock();
var timer = new Game.Timer(clock);
timer.start();
// Do stuff...
var seconds_elapsed = timer.stop();
    ```

* ``Game.Engine``
    Much of the glue lives here.

* ``Game.Entity``
* ``Game.Input``
    Manage key bindings in one place, with the ability to globally turn event
    listening on or off and create one-time bindings.

* ``Game.Renderer``
    Bind to a ``camera`` Camera object and create ``num_layers`` Canvas layers
    inside the camera container.

* ``Game.StateMachine``
    Define and traverse the flow of the game experience from navigation menus
    to levels or whatever else.

* ``Game.State``

## TODO

* Build script
* More examples
* Tests

## Contributing

* **Bug fixes and improvements**: Please open an issue and make a pull request if
  if you have a fix.
* **Examples**: If you wrote a game using this project, message me or open an
  an issue and I'll toss a mention of it in the documentation.
* **Tutorials**: There's a severe lack of documentation because the codebase was
  extracted from another proprietary project. Any effort is very appreciated.
* **Forking**: Please do. :)

## License

This project is released under the MIT license unless otherwise stated (such as
with third-party libraries in ``extern``).
