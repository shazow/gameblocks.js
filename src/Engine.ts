interface Ticker {
    (): void; // TODO: Should the ticker take a timestamp?
}

let noop = function() {}

function AnimationFrameTicker(engine:Engine, state_machine:any, timer:TimeFetcher): Ticker {
    if (state_machine.run === undefined) {
        timer.update();
        return noop;
    }

    return function tick() {
        timer.update();
        state_machine.run();
        if (engine.is_running) {
            window.requestAnimationFrame(tick);
        }
    };
};

class Engine {
    state_machine: any;
    is_running: boolean;

    constructor(state_machine:any) {
        this.state_machine = state_machine;
    }

    start(fps:number): void {
        if(this.is_running) return;
        this.is_running = true;

        let tick = AnimationFrameTicker(this, this.state_machine, Game.Time)
        tick();
    }

    stop(): void {
        this.is_running = false;
    }
}
