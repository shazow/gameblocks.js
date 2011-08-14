# Game Blocks

## Programming Interface

### Classes

* ``Game.Camera``
  Create a viewport Div inside ``container`` of size ``width``x``height`` pixels.

* ``Game.Clock``
* ``Game.ClockThrottled``
  Time moves no faster than ``max_timestep`` ms.

* ``Game.Engine``
* ``Game.Entity``
* ``Game.Input``
* ``Game.Renderer``
  Bind to a ``camera`` Camera object and create ``num_layers`` Canvas layers inside the camera container.

* ``Game.StateMachine``
* ``Game.State``
* ``Game.Timer``
  Relative to the global ``Static.Time`` state.

      var t = Game.Timer();
      t.start();
      t.stop();


### Static Objects

* ``Static.Engine``
* ``Static.Input``
* ``Static.StateMachine``
* ``Static.Time``

# License

This project is released under the MIT license unless otherwise stated (such as with third-party libraries in ``extern``).
