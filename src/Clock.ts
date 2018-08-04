/*
 * Turns out that calling ``new Date()`` many times per frame is noticeably
 * slow, so having a global clock that you can refer to many times per
 * update is an effective performance optimization.
 *
 * Values are handled in milliseconds since epoch. 1ms = 1/1000 seconds.
 */

// The current time that we update on-demand, for performance reasons.
let now:number = +new Date();

interface TimeFetcher {
    update(): void;
    get(): number;
}

let Time:TimeFetcher = {
    update() {
        now = +new Date();
    },
    get(): number {
        return now;
    }
}

class Clock {
    num_ticks: number = 0;
    time_ticked: number;
    time_created: number;

    constructor() {
        this.time_created = now;
        this.time_ticked = now;
    }
    tick(): number {
        let delta = now - this.time_ticked;
        this.time_ticked = now;
        this.num_ticks++;
        return delta;
    }
    delta(): number {
        return now - this.time_ticked;
    }
}

class ClockThrottled extends Clock {
    constructor(public max_timestep:number) {
        super();
    }

    tick(): number {
        let delta = super.tick();
        if (delta > this.max_timestep) return this.max_timestep;
        return delta;
    }
}

class Timer {
    time_started: number;
    time_elapsed: number;

    constructor(public clock:Clock) {}

    start(): number {
        return this.time_started = this.clock.time_ticked;
    }

    stop(): number {
        return this.time_elapsed += this.clock.time_ticked - this.time_started;
    }

}

class FrameLimiter {
    delay: number;
    clock: Clock;

    constructor(frame_rate:number, clock?:Clock) {
        this.delay = 1000 / frame_rate;
        this.clock = clock || new Clock();
    }
    tick(): number {
        // Return how many frames elapsed
        // FIXME: This could be optimized if made private
        if(this.clock.delta() < this.delay) return 0; // None yet

        return ~~(this.clock.tick() / this.delay);
    }
    tick_partial(): number {
        // Returns partial frame number, ticks over at >= 1
        let delta = this.clock.delta();
        if(delta >= this.delay) delta = this.clock.tick();

        return delta / this.delay;
    }
}
