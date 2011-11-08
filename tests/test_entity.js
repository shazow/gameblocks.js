module('entity');

/** Setup helpers: */


test("Collider", function() {
    var collider = new Game.Collider();

    ok(!collider.is_collision(new Game.Entity({x: 1, y: 2})));

    collider.add(new Game.Entity({x: 1, y: 2}));

    ok(collider.is_collision(new Game.Entity({x: 1, y: 2})));
    ok(!collider.is_collision(new Game.Entity({x: 2, y: 1})));
});

test("ShapeCollider", function() {
    var collider = new Game.ShapeCollider({width: 10, height: 10});

    ok(!collider.is_collision(new Game.Entity({x: 1, y: 2})));

    collider.add(new Game.Entity({x: 1, y: 2}));

    ok(collider.is_collision(new Game.Entity({x: 1, y: 2})));
    ok(!collider.is_collision(new Game.Entity({x: 2, y: 1})));
});

test("Collide across shapes", function() {
    var a = new Game.BoxEntity({x: 5, y: 5, width: 10, height: 10});
    var b = new Game.CircleEntity({x: 10, y: 10, radius: 5});

    ok(a.is_collision(b));
    ok(b.is_collision(a));

    var a = new Game.BoxEntity({x: 10, y: 10, width: 30, height: 5});
    var b = new Game.CircleEntity({x: 15, y: 15, radius: 10});

    ok(a.is_collision(b));
    ok(b.is_collision(a));
});
