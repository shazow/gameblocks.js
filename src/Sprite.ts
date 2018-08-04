/** Sprites: */

// Cache image objects
let sprite_images:{[key:string]: HTMLImageElement} = {};

interface DOMCallback {
    (this:HTMLElement, ev:Event): any;
}

// Cache-aware helper
function get_sprite_image(src:string, callback:DOMCallback): HTMLImageElement {
    // TODO: Convert to promise, maybe something like https://stackoverflow.com/questions/38252194/how-can-i-convert-an-onload-promise-into-async-await
    // TODO: (Outdated?) Add some kind of is_loading attribute and a callback queue?
    let img = sprite_images[src];
    if(img) {
        callback.call(img);
        return img;
    }
    img = sprite_images[src] = document.createElement("img");
    img.onload = callback;
    img.src = src;
    return img;
}

function get_sprite_boxes(box?:Box, dim?:Size2D): Box[] {
    let r: Box[] = [];
    if (box===undefined || dim===undefined) {
        return r;
    }

    // TODO: Does TypeScript optimize this now? Convert it to something TS is happy with.
    for(let y=box.y, ystop=box.y+box.height, yincr = dim.height; y+yincr<=ystop; y += yincr) {
        for(let x=box.x, xstop=box.x+box.width, xincr = dim.width; x+xincr<=xstop; x += xincr) {
            // FIXME: Should we only push the x, y because we can get
            //        the height and width from self.dim?
            r.push({x: x, y: y, width: xincr, height: yincr});
        }
    }

    return r;
}


class SpriteSheet {
    img: HTMLImageElement;
    dim: Size2D = {width: 16, height: 16};
    box: Box;
    sprite_boxes: Box[];
    num_sprites: number = 0;

    /**
     * @param {string} src Image src url.
     * @param {Size} dim Dimensions of the sprites in the sheet.
     * @param {Box} [box] Bounding box of sprites to load within image
     *     (default to full image size).
     */
    constructor(src:string, dim?:Size2D, box?:Box, callback?:DOMCallback) {
        // TODO: Add support for offsets
        // TODO: Add support for scaling

        this.dim = dim || this.dim;
        this.box = box;

        let sprite_boxes = this.sprite_boxes = get_sprite_boxes(box, dim);

        let self = this;
        this.img = get_sprite_image(src, function() {
            if(box===undefined) {
                self.box = box = {x: 0, y: 0, width: self.img.width, height: self.img.height};
                self.sprite_boxes = sprite_boxes = get_sprite_boxes(box, dim);
                self.num_sprites = sprite_boxes.length;
            }

            callback && callback.call(self);
        });
    }
}

interface SpriteRender {
    draw(ctx:CanvasRenderingContext2D, pos:Position2D): void;
}

class Sprite implements SpriteRender {
    box: Box;
    dim: Size2D;
    sheet: SpriteSheet;

    /**
     * @param {SpriteSheet} sheet SpriteSheet containing the sprite.
     * @param {number} i Index position of the sprite in the sprite sheet (0-indexed).
     */
    constructor(sheet:SpriteSheet, i:number) {
        this.sheet = sheet;
        this.box = sheet.sprite_boxes[i];
        this.dim = sheet.dim;
    }

    draw(ctx:CanvasRenderingContext2D, pos:Position2D): void {
        let width = this.dim.width, height = this.dim.height;
        ctx.drawImage(this.sheet.img,
                      this.box.x, this.box.y,
                      width, height,
                      pos.x, pos.y,
                      width, height);
    }
}

class SpriteBlank implements SpriteRender {
    style: string;
    dim: Size2D;

    constructor(style:string, dim:Size2D) {
        this.style = style;
        this.dim = dim;
    }

    draw(ctx:CanvasRenderingContext2D, pos:Position2D): void {
        ctx.fillStyle = this.style;
        ctx.fillRect(pos.x, pos.y, this.dim.width, this.dim.height);
    }
}

class SpriteAnimation implements SpriteRender {
    sheet: SpriteSheet;

    frame_limiter: FrameLimiter;
    frame_sequence: number[];
    frame_pos: number = 0;
    is_playing: boolean = true;

    /**
     * @param {SpriteSheet} sheet SpriteSheet containing the sprite.
     * @param {number|FrameLimiter} frame_limiter Desired frame rate for sprite animation.
     * @param {number[]} frame_sequence Sequence of sprites to play as frames from the SpriteSheet.
     */
    constructor(sheet:SpriteSheet, frame_limiter:(number|FrameLimiter), frame_sequence:number[]) {
        this.sheet = sheet;

        if(typeof frame_limiter === 'number') {
            this.frame_limiter = new FrameLimiter(frame_limiter);
        } else {
            this.frame_limiter = frame_limiter;
        }

        this.frame_sequence = frame_sequence;
    }

    draw(ctx:CanvasRenderingContext2D, pos:Position2D): void {
        // TODO: This can be optimized with better closures for attribute-access and by caching the last frame

        var delta_frames = this.frame_limiter.tick();

        if(delta_frames && this.is_playing) {
            this.frame_pos = (this.frame_pos + delta_frames) % this.frame_sequence.length;
        }

        var box = this.sheet.sprite_boxes[this.frame_sequence[this.frame_pos]];
        var dim = this.sheet.dim;

        ctx.drawImage(this.sheet.img, box.x, box.y, dim.width, dim.height, pos.x, pos.y, dim.width, dim.height);
    }

    pause(frame?:number): void {
        this.is_playing = false;
        if(frame!==undefined) this.frame_pos = frame;
    }

    play(frame?:number): void {
        this.is_playing = true;
        if(frame!==undefined) this.frame_pos = frame;
    }

    rewind(): void {
        this.frame_pos = 0;
    }

    skip(frame?:number): void {
        this.frame_pos = frame || 0;
    }

    skip_random(): void {
        this.frame_pos = ~~(Math.random() * this.frame_sequence.length);
    }

}
