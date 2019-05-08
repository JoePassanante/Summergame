<style scoped>
#holder {
  margin: 0px 0px 0px 0px !important;
  overflow: hidden;
  overflow-y: hidden;
}

canvas {
  display: block;
  background: rgb(0, 0, 0);
}
</style>
<template>
  <div id="holder">
    <canvas ref="game-canvas"></canvas>
  </div>
</template>
<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      tick: 0,
      numEnt: 15000,
      dist: 100000,
      fps: 60,
      renderTick: null,
      scaleFactor: 1.1,
      start: new Date(),
      current_scale: 1,
      lastX: null,
      entities: [
        {
          x: 0,
          y: 0,
          s_x: 400,
          s_y: 2,
          id: "sun",
          move: 0,
          color: "orange"
        },
        {
          x: -40000,
          y: 13000,
          s_x: 400,
          s_y: 2,
          id: "sun",
          move: 0,
          color: "orange"
        }
      ],
      //https://codepen.io/pen/
      lines: []
    };
  },
  methods: {
    generatePlanets(){
            for (var i = 0; i < this.numEnt; i++) {
            let s = 100
            let distance = this.dist
            let n = {
                x: (Math.random() * distance * 2) - distance,
                y: (Math.random() * distance * 2) - distance,
                s_x: s,
                s_y: s,
                id: i,
            }
            let good = true;
            let close = null;
            let min = Number.MAX_SAFE_INTEGER;
            this.entities.forEach(f => {
                if (this.getDistance(f, n) < 400) {
                    good = false;
                } else {

                }

            })
            let sun = false;
            this.entities.forEach(f => {
                if ((this.getDistance(f, n) > f.s_x + 600 && this.getDistance(f, n) < f.s_x + 6000) && f.id == "sun") {
                    sun = true;
                    // saveLine(n.x, n.y, f.x, f.y);

                }
            })

            if (close != null && good && min < 600) {
            }
            if (good && sun) {
                this.entities.push(n);
            }
        }
    },
    configureCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight - 300;
      this.trackTransforms(this.ctx);
    },
    /**
     * @description Adds functionality to CTX.
     */
    trackTransforms(ctx) {
      var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      var xform = svg.createSVGMatrix();
      ctx.getTransform = function() {
        return xform;
      };

      var savedTransforms = [];
      var save = ctx.save;
      ctx.save = function() {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
      };

      ctx.getTransforms = function() {
        return savedTransforms;
      };

      var restore = ctx.restore;
      ctx.restore = function() {
        xform = savedTransforms.pop();
        return restore.call(ctx);
      };

      var scale = ctx.scale;
      ctx.scale = function(sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
      };

      var rotate = ctx.rotate;
      ctx.rotate = function(radians) {
        xform = xform.rotate((radians * 180) / Math.PI);
        return rotate.call(ctx, radians);
      };

      var translate = ctx.translate;
      ctx.translate = function(dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
      };

      var transform = ctx.transform;
      ctx.transform = function(a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
      };

      var setTransform = ctx.setTransform;
      ctx.setTransform = function(a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
      };

      var pt = svg.createSVGPoint();
      ctx.transformedPoint = function(x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
      };
    },
    /**
     * @author Joe Passanante
     * @description Gets the distance between two entities.
     * @typedef {Object} ent
     * @property {Number} x
     * @property {Number} y
     * @property {Number} s_x
     * @property {Number} s_y
     * @param {ent} a
     * @param {ent} b
     */
    getDistance(a, b) {
      let distance = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
      return Math.abs(distance);
    },
    /**
     * @description Refreshes the canvas
     */
    redraw() {
      //Make it easier on me...
      let vue = this;
      let ctx = this.ctx;
      let canvas = this.canvas;
      let entities = this.entities;
      let current_scale = this.current_scale;
      let tick = this.tick;

      // Clear the entire canvas
      var p1 = ctx.transformedPoint(0, 0);
      var p2 = ctx.transformedPoint(canvas.width, canvas.height);
      ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      // Green rectangle
      //Render Game
      let rendered = 0;
      let killed = 0;
      // lines.forEach(object => {
      //     let realX = ctx.getTransform().e + (object.a * current_scale);
      //     let realY = ctx.getTransform().f + (object.b * current_scale);
      //     // console.log("Real", object.id, Math.round(realX), Math.round(realY));

      //     if (realX < 0 || realX > canvas.width) {
      //         killed++
      //         return;
      //     }
      //     if (realY < 0 || realY > canvas.height) {
      //         killed++
      //         return;
      //     }
      //     rendered++;
      //     drawLine(object);
      // })
      // let pt=null;
      entities.forEach(object => {
        if (object.move) {
          object.x = object.x + object.move;
        }
        // console.log(object.id, ctx.transformedPoint(object.x, object.y))
        let pt = ctx.transformedPoint(object.x, object.y);

        //Block render;
        let maxY = canvas.height / current_scale;
        let maxX = canvas.width / current_scale;

        let realX = ctx.getTransform().e + object.x * current_scale;
        let realY = ctx.getTransform().f + object.y * current_scale;
        // console.log("Real", object.id, Math.round(realX), Math.round(realY));

        if (realX < 0 || realX > canvas.width) {
          killed++;
          return;
        }
        if (realY < 0 || realY > canvas.height) {
          killed++;
          return;
        }

        // console.log(pt)
        if (rendered >= 3000) {
          killed++;
          return;
        }
        rendered++;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = "1";
        // ctx.rect(object.x, object.y, object.s_x, object.s_y);
        ctx.arc(object.x, object.y, object.s_x, 0, 2 * Math.PI);
        ctx.fillStyle = object.color || "green";
        ctx.fill();
        ctx.fillStyle = "white";
        let t = pt.y - object.y;
        ctx.fillText(
          `ID: ${object.id}  X: ${Math.round(realX)} Y:${Math.round(
            realY
          )}  Height: ${Math.round(
            canvas.height / current_scale
          )} Scale: ${current_scale}`,
          object.x - 100,
          object.y - 10
        );
        ctx.fillStyle = "white";
        ctx.rect(object.x - 1, object.y - 1, 2, 2);
        ctx.stroke();
      });
      this.tick = this.tick + 1;
      if (this.tick >= 1000 / this.renderTick) {
        console.log(
          "Render Time: ",
          Math.round(
            (new Date().valueOf() - this.start.valueOf()) /
              (9000 / this.renderTick)
          ),
          "ms"
        );
        console.log("Offset", ctx.getTransform().e);
        console.log(rendered, killed);
        this.tick = 0;
        this.start = new Date();
      }
    },
    handleZoom(clicks) {
      var pt = this.ctx.transformedPoint(this.lastX, this.lastY);
      this.ctx.translate(pt.x, pt.y);
      var factor = Math.pow(this.scaleFactor, clicks);
      this.ctx.scale(factor, factor);
      this.current_scale = this.current_scale * factor;
      this.ctx.translate(-pt.x, -pt.y);
    },
    handleScroll(evt) {
      var delta = evt.wheelDelta
        ? evt.wheelDelta / 40
        : evt.detail
        ? -evt.detail
        : 0;
      if (delta) this.handleZoom(delta);
      return evt.preventDefault() && false;
    },
    addZoomListeners() {
      this.canvas.addEventListener("DOMMouseScroll", this.handleScroll, false);
      this.canvas.addEventListener("mousewheel", this.handleScroll, false);
    },
    addMouseListeners() {
      let vue = this;
      this.canvas.addEventListener(
        "mousedown",
        function(evt) {
          vue.lastX = evt.offsetX || evt.pageX - vue.canvas.offsetLeft;
          vue.lastY = evt.offsetY || evt.pageY - vue.canvas.offsetTop;
          vue.dragStart = vue.ctx.transformedPoint(vue.lastX, vue.lastY);
          vue.dragged = false;
        },
        false
      );

      this.canvas.addEventListener(
        "mousemove",
        function(evt) {
          vue.lastX = evt.offsetX || evt.pageX - vue.canvas.offsetLeft;
          vue.lastY = evt.offsetY || evt.pageY - vue.canvas.offsetTop;
          vue.dragged = true;
          if (vue.dragStart) {
            var pt = vue.ctx.transformedPoint(vue.lastX, vue.lastY);
            vue.ctx.translate(pt.x - vue.dragStart.x, pt.y - vue.dragStart.y);
            // redraw();
          }
        },
        false
      );
      this.canvas.addEventListener(
        "mouseup",
        function(evt) {
          vue.dragStart = null;
          // if (!dragged) zoom(evt.shiftKey ? -1 : 1);
        },
        false
      );
    }
  },
  mounted() {
    this.canvas = this.$refs["game-canvas"];
    this.ctx = this.$refs["game-canvas"].getContext("2d");
    this.renderTick = 1000 / this.fps;
    this.lastX = this.canvas.width / 2;
    this.lastY = this.canvas.height / 2;
    this.configureCanvas();
    this.generatePlanets()
    this.redraw();
    this.addZoomListeners();
    this.addMouseListeners();
    this.timerId = setInterval(() => {
      this.redraw();
    }, this.renderTick);
  },
  beforeDestroy() {
    console.log("Remove timer");
    clearInterval(this.timerId);
  }
};
</script>
