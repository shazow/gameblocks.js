# Game Blocks

This codebase is extracted from [LineRage](https://chrome.google.com/webstore/detail/oplmlhhgdcliikihbehklkagmeophnlh), a fast-paced Tron-like arcade-style JavaScript game.


## Organization & Philosophy

Much of the code is written with performance optimization in mind to support a
fast-paced game environment.

Each major component is maintained within its own closure that binds to a
global ``Game`` or ``Static`` variable. Generally they're separated into their
own JavaScript files.


## Programming Interface

### Classes

* ``Game.Camera``
    Create a viewport Div inside ``container`` of size ``width``x``height``
    pixels.

* ``Game.Clock``
* ``Game.ClockThrottled``
    Time moves no faster than ``max_timestep`` ms.

* ``Game.Engine``
* ``Game.Entity``
* ``Game.Input``
* ``Game.Renderer``
    Bind to a ``camera`` Camera object and create ``num_layers`` Canvas layers
    inside the camera container.

* ``Game.StateMachine``
* ``Game.State``
* ``Game.Timer``
    Relative to the global ``Static.Time`` state.

    ```javascript
var t = Game.Timer();
t.start();
t.stop();
    ```


### Static Objects

* ``Static.Engine``
* ``Static.Input``
* ``Static.StateMachine``
* ``Static.Time``

# License

This project is released under the MIT license unless otherwise stated (such as
with third-party libraries in ``extern``).