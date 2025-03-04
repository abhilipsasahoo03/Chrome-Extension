let canvasToDataURL,
  saveScreenShotToFsDebounced,
  screenshot = chrome.extension.getBackgroundPage().screenshot;
localStorage.lastTool || (localStorage.lastTool = "house");
const screenShotFilename =
  new Date().toISOString().replace(/\.\w+/, "").replace(/:/g, "-") + ".png";
function Editor_obj() {
  let e,
    t,
    o,
    r,
    n,
    s,
    c,
    l,
    d,
    h,
    u,
    p,
    f,
    g = "#ff0000",
    y = { current: "Line", status: "ready" },
    v = { rx1: 0, rx2: 0, ry1: 0, ry2: 0 };
  (y.house = {}),
    (y.Ellipse = {}),
    (y.Crop = {}),
    (y.Back = {}),
    (y.Reset = {}),
    (y.Next = {}),
    (y.Line = {}),
    (y.Draw = {}),
    (y.Rectangle = {}),
    (y.Full = {}),
    (y.Arrow = {}),
    (y.Move = {}),
    (y.Highlight = {}),
    (y.Text = {}),
    (y.Spray = {});
  const x = {
    hasBorders: !1,
    hasControls: !0,
    selectable: !1,
    hoverCursor: "default",
  };
  function m() {
    if (s) return;
    (fabric.Canvas.prototype.__historySaveResize = function (e) {
      this.historyProcessing ||
        (this.historyUndo.push(e),
        this.fire("history:append:size", { size: e }));
    }),
      (fabric.Canvas.prototype._historyEvents = function () {
        return {
          "object:added": this._historySaveAction,
          "object:removed": this._historySaveAction,
          "object:modified": this._historySaveAction,
          "object:skewing": this._historySaveAction,
          "canvas:crop": this.__historySaveResize,
        };
      }),
      (fabric.Canvas.prototype.redo = function (e) {
        this.historyProcessing = !0;
        const t = this.historyRedo.pop();
        if (t)
          if (t.size) {
            const { before: e, after: o } = t.size;
            this.historyUndo.push({ size: { before: e, after: o } }),
              this.fire("history:redo:size", { ...o }),
              (this.historyProcessing = !1);
          } else
            this.historyUndo.push(this._historyNext()),
              (this.historyNextState = t),
              this._loadHistory(t, "history:redo", e);
        else this.historyProcessing = !1;
      }),
      (fabric.Canvas.prototype.undo = function (e) {
        this.historyProcessing = !0;
        const t = this.historyUndo.pop();
        if (t)
          if (t.size) {
            const { before: e, after: o } = t.size;
            this.historyRedo.push({ size: { before: e, after: o } }),
              this.fire("history:undo:size", { ...e }),
              (this.historyProcessing = !1);
          } else
            this.historyRedo.push(this._historyNext()),
              (this.historyNextState = t),
              this._loadHistory(t, "history:undo", e);
        else this.historyProcessing = !1;
      }),
      (fabric.Canvas.prototype.reset = function (e) {
        this.historyProcessing = !0;
        const t = this.historyUndo.pop();
        if (t)
          if (t.size) {
            const { before: e, after: o } = t.size;
            this.historyRedo.push({ size: { before: e, after: o } }),
              this.fire("history:undo:size", { ...e }),
              (this.historyProcessing = !1),
              s.reset();
          } else
            this._loadHistory("{}", "history:reset", () => {
              this.clearHistory();
            });
        else this.historyProcessing = !1;
      }),
      $(
        '<div id="fabricWrapper"><canvas id="fabricCanvas"></canvas></div>'
      ).appendTo($("#clipper")),
      $("#fabricWrapper").css({
        position: "absolute",
        width: f.width(),
        height: f.height(),
        top: 0,
        left: 0,
      }),
      (s = new fabric.Canvas("fabricCanvas", {
        isDrawingMode: !1,
        renderOnAddRemove: !0,
        selection: !1,
        cornerColor: "blue",
        cornerStyle: "circle",
        transparentCorners: !1,
      })),
      (saveScreenShotToFsDebounced = _.debounce(function () {
        editor.createLastCanvas((e) => {
          saveFile(e, screenShotFilename);
        });
      }, 2e3)),
      s.on({
        "object:added": () => {
          saveScreenShotToFsDebounced();
        },
        "object:removed": () => {
          saveScreenShotToFsDebounced();
        },
        "object:modified": () => {
          saveScreenShotToFsDebounced();
        },
        "canvas:crop": saveScreenShotToFsDebounced,
        "history:redo:size": saveScreenShotToFsDebounced,
        "history:undo:size": saveScreenShotToFsDebounced,
        "history:reset:size": saveScreenShotToFsDebounced,
        "history:append:size": saveScreenShotToFsDebounced,
        "history:append": saveScreenShotToFsDebounced,
        "history:redo": saveScreenShotToFsDebounced,
        "history:undo": saveScreenShotToFsDebounced,
        "history:reset": saveScreenShotToFsDebounced,
      }),
      s.setWidth(f.width()),
      s.setHeight(f.height()),
      (fabric.Object.prototype.transparentCorners = !1),
      (fabric.Object.prototype.cornerColor = "blue"),
      (fabric.Object.prototype.cornerStyle = "circle");
    const e = (e) => {
      (v = { ...e }), S(), D();
    };
    s.on("history:redo:size", e),
      s.on("history:undo:size", e),
      s.on("history:reset:size", e),
      s.on("history:append:size", D),
      s.on("history:append", D),
      s.on("history:redo", D),
      s.on("history:undo", D),
      s.on("history:reset", D),
      s.on("selection:cleared", () => {
        y.status = "ready";
      }),
      s.on("object:modified", () => {
        y.status = "selected";
      }),
      s.on("object:selected", () => {
        y.status = "selected";
      }),
      s.on("object:moving", () => {
        y.status = "selected";
      }),
      s.on("object:scaling", () => {
        y.status = "selected";
      }),
      s.on("object:rotating", () => {
        y.status = "selected";
      }),
      $("body").keydown(function (e) {
        if (46 !== e.keyCode && 8 !== e.keyCode) return;
        const t = s.getActiveObject();
        t && !t._objects && (s.remove(t), s.renderAll()),
          t._objects.forEach((e) => {
            s.remove(e);
          }),
          s.discardActiveObject(),
          s.remove(t),
          s.renderAll();
      });
  }
  function w(t) {
    const o = 15,
      r = t[0],
      i = t[1],
      n = t[2],
      s = t[3],
      a = n - r,
      c = s - i,
      l = Math.atan2(c, a),
      d = n - o * Math.cos(l),
      h = s - o * Math.cos(l);
    let u = [
      { x: r, y: i },
      {
        x: r - 3.75 * Math.cos(l - Math.PI / 2),
        y: i - 3.75 * Math.sin(l - Math.PI / 2),
      },
      {
        x: d - 3.75 * Math.cos(l - Math.PI / 2),
        y: h - 3.75 * Math.sin(l - Math.PI / 2),
      },
      {
        x: d - o * Math.cos(l - Math.PI / 2),
        y: h - o * Math.sin(l - Math.PI / 2),
      },
      { x: d + o * Math.cos(l), y: h + o * Math.sin(l) },
      {
        x: d - o * Math.cos(l + Math.PI / 2),
        y: h - o * Math.sin(l + Math.PI / 2),
      },
      {
        x: d - 3.75 * Math.cos(l + Math.PI / 2),
        y: h - 3.75 * Math.sin(l + Math.PI / 2),
      },
      {
        x: r - 3.75 * Math.cos(l + Math.PI / 2),
        y: i - 3.75 * Math.sin(l + Math.PI / 2),
      },
      { x: r, y: i },
    ];
    return new fabric.Polyline(u, {
      fill: g,
      stroke: g,
      opacity: 1,
      strokeWidth: e || 2,
      originX: "left",
      originY: "top",
      selectable: !1,
      objectCaching: !1,
      mtype: "arrow",
    });
  }
  function k(e) {
    return (
      (ans = {
        x:
          v.rx1 +
          e.pageX -
          $("#canvasWrapper").offset().left +
          $("#canvasWrapper").scrollLeft(),
        y:
          v.ry1 +
          e.pageY -
          $("#canvasWrapper").offset().top +
          $("#canvasWrapper").scrollTop(),
      }),
      !(ans.x < 0 || ans.y < 0) &&
        !(
          e.pageX >
          $("#canvasWrapper").offset().left + $("#canvasWrapper").width() - l
        ) &&
        !(
          e.pageY >
          $("#canvasWrapper").offset().top + $("#canvasWrapper").height() - d
        ) &&
        !(e.pageX < $("#canvasWrapper").offset().left) &&
        !(e.pageY < $("#canvasWrapper").offset().top) &&
        ans
    );
  }
  function W() {
    "started" === y.status && (T(y[y.current].up), T(y[y.current].finish));
  }
  function C(e) {
    ("Back" === e.type && "Next" === e.type && "Crop" === e.type) ||
      (localStorage.lastTool = e),
      W(),
      $(".button [tag=" + e + "]").trigger("mousedown"),
      (y.current = e),
      (y.status = "ready"),
      s &&
        (s.discardActiveObject(),
        s.requestRenderAll(),
        s.set({ selection: !1 }),
        s.getObjects().forEach((e) => {
          e.set("selectable", !1), e.set("hoverCursor", "default");
        }));
  }
  function T(e) {
    $.isFunction(e) && e();
  }
  function S() {
    const { rx1: e, rx2: t, ry1: r, ry2: i } = v;
    (canvasWidth = v.rx2 - v.rx1),
      (canvasHeight = v.ry2 - v.ry1),
      $("#clipper").css({
        height: canvasHeight,
        overflow: "hidden",
        width: canvasWidth,
        position: "absolute",
      }),
      p && o.attr("height", canvasHeight),
      o.css({ clip: `clip.rect(${r} ${t} ${i} ${e})`, position: "absolute" }),
      $("#cborder")
        .add("#clipper img")
        .add("#fabricWrapper")
        .each(function () {
          $(this).css({ "margin-left": -e, "margin-top": -r });
        }),
      (maxWidth = window.innerWidth),
      (maxHeight = window.innerHeight - $("#header").height()),
      $("#header").width(maxWidth),
      (canvasWrapper = $("#canvasWrapper"));
    let n = canvasHeight;
    n > maxHeight && (n = maxHeight),
      [canvasWrapper].forEach((e) => {
        e.css({
          left: canvasWidth > maxWidth ? 0 : maxWidth / 2 - canvasWidth / 2,
          width: canvasWidth > maxWidth ? maxWidth : canvasWidth,
          height: n,
          "overflow-x": canvasWidth + 16 < maxWidth ? "hidden" : "auto",
          "overflow-Y": canvasHeight < maxHeight ? "hidden" : "auto",
          top: "50%",
          "margin-top": $("#header").height() / 2 - n / 2 + "px",
        });
      }),
      (d = canvasWidth < maxWidth ? 0 : 16),
      (l = canvasHeight < maxHeight ? 0 : 16),
      P();
  }
  function D() {
    const e = s && s.historyRedo.length,
      t = s && s.historyUndo.length;
    $(".button[tag=Back]").attr("status", t ? "on" : "Disable"),
      $(".button[tag=Back]")[t ? "removeClass" : "addClass"]("disable"),
      $(".button[tag=Next]").attr("status", e ? "on" : "Disable"),
      $(".button[tag=Next]")[e ? "removeClass" : "addClass"]("disable"),
      $(".button[tag=Reset]").attr("status", t ? "on" : "Disable"),
      $(".button[tag=Reset]")[t ? "removeClass" : "addClass"]("disable"),
      $("#toolbar .button").each(function () {
        $(this).attr("title", $(this).attr("tag")),
          "on" === $(this).attr("status")
            ? ($(this)
                .attr({
                  src:
                    "images/drawing/" +
                    $(this).attr("tag") +
                    ($(this).attr("tag") === y.current ? "On" : "Off") +
                    ".png",
                })
                .css({ cursor: "pointer" }),
              $(this)[
                $(this).attr("tag") === y.current ? "addClass" : "removeClass"
              ]("on"))
            : $(this)
                .attr({
                  src: "images/drawing/" + $(this).attr("tag") + "Disable.png",
                })
                .css({ cursor: "not-allowed" });
      });
  }
  function P() {
    (h = $("#canvasWrapper").scrollLeft()),
      (u = $("#canvasWrapper").scrollTop());
  }
  (y.Back.click = function () {
    s && s.undo();
  }),
    (y.Next.click = function () {
      s && s.redo();
    }),
    (y.Reset.click = function () {
      s && s.reset();
    }),
    (y.Move.click = function () {
      s.set({ selection: !0 }), (s.hoverCursor = "grabbing");
      let e = s.getObjects(),
        t = new fabric.ActiveSelection(e);
      s.setActiveObject(t),
        e.forEach((e) => {
          e.set("selectable", !0), e.set("hoverCursor", "grabbing");
        }),
        s.add(t),
        s.remove(t);
    }),
    (y.Move.begin = () => {}),
    (this.createLastCanvas = function (e = () => {}) {
      let t = document.createElement("canvas");
      (t.width = v.rx2 - v.rx1), (t.height = v.ry2 - v.ry1);
      let o = t.getContext("2d");
      if (
        (o.drawImage(
          p,
          v.rx1,
          v.ry1,
          v.rx2 - v.rx1,
          v.ry2 - v.ry1,
          0,
          0,
          v.rx2 - v.rx1,
          v.ry2 - v.ry1
        ),
        0 === $(".lower-canvas").length)
      )
        return (canvasToDataURL = t.toDataURL()), t.toBlob(e);
      if (window.devicePixelRatio < 2)
        return (
          o.drawImage(
            $(".lower-canvas")[0],
            v.rx1,
            v.ry1,
            v.rx2 - v.rx1,
            v.ry2 - v.ry1,
            0,
            0,
            v.rx2 - v.rx1,
            v.ry2 - v.ry1
          ),
          (canvasToDataURL = t.toDataURL()),
          t.toBlob(e)
        );
      const r = new Image();
      (r.onload = () => (
        o.drawImage(
          r,
          v.rx1,
          v.ry1,
          v.rx2 - v.rx1,
          v.ry2 - v.ry1,
          0,
          0,
          v.rx2 - v.rx1,
          v.ry2 - v.ry1
        ),
        (canvasToDataURL = t.toDataURL()),
        t.toBlob(e)
      )),
        (r.src = s.toDataURL({ format: "png" }));
    }),
    (this.reloadCanvas = function () {
      screenshot.url && $("title").html(screenshot.url),
        (v.rx1 = 0),
        (v.rx2 = p.width),
        (v.ry1 = 0),
        (v.ry2 = p.height),
        S(),
        D(),
        $("#toolbar .button[tag=" + localStorage.lastTool + "]").trigger(
          "click"
        );
    }),
    (this.init = function () {
      if (
        ($("#wColorPicker2_3")
          .wColorPicker({
            theme: "blue",
            mode: "hover",
            showSpeed: 300,
            hideSpeed: 300,
            buttonSize: 26,
            initColor: localStorage.color || "#FF0000",
            onSelect: function (e) {
              (localStorage.color = e),
                (g = e),
                s &&
                  s.isDrawingMode &&
                  s.freeDrawingBrush &&
                  (s.freeDrawingBrush.color =
                    "Highlight" === y.current ? hexToRGB(g, 0.5) : g);
            },
          })
          .on("mousedown", function (e) {
            return e.stopPropagation(), !1;
          }),
        (o = $("#canvasId")),
        (t = o[0]),
        $(".linePickerOverlay hr").click(function () {
          (e = parseInt(this.style.height)),
            (y.status = "ready"),
            $(".linePickerOverlay").slideUp(),
            s &&
              s.isDrawingMode &&
              s.freeDrawingBrush &&
              (s.freeDrawingBrush.width = e);
        }),
        $("#LineWidthPicker")
          .mouseenter(function () {
            let e = $(".linePickerOverlay");
            e.is(":visible") || ((y.status = "changingWidth"), e.slideDown());
          })
          .mouseleave(function () {
            (y.status = "ready"), $(".linePickerOverlay").slideUp();
          }),
        $(document.body).bind("mousedown", function (e) {
          if (0 === e.button) {
            let t = k(e);
            if (
              (t || W(),
              t && "Text" === y.current && W(),
              t && "ready" === y.status)
            ) {
              if (s && s.getActiveObject()) return;
              y[y.current].begin(t, e);
            } else
              "function" == typeof y[y.current].end && y[y.current].end(t, e);
            if ("page-editor" === e.delegateTarget.id) return !1;
          }
        }),
        $(document.body).bind("mousemove", function (e) {
          (dime = k(e)),
            $("#canvasWrapper").css("default"),
            $("#canvasWrapper").css("cursor", "default"),
            dime &&
              (("ready" !== y.status && "started" !== y.status) ||
                $("#canvasWrapper").css("cursor", "crosshair"),
              "started" === y.status &&
                $.isFunction(y[y.current].move) &&
                y[y.current].move(dime));
        }),
        $(window).resize(S),
        $(document.body).bind("mouseup", function (e) {
          (dime = k(e)), y.current && T(y[y.current].up);
        }),
        $("#toolbar .button").click(function () {
          ($this = $(this)),
            "on" === $this.attr("status") &&
              (m(),
              C($this.attr("tag")),
              (s.isDrawingMode = $(this).data("free-drawing")),
              $.isFunction(y[$this.attr("tag")].click) &&
                y[$this.attr("tag")].click(),
              $this.attr({
                src: "images/drawing/" + $this.attr("tag") + "On.png",
              }),
              $this.addClass("on"),
              D());
        }),
        $("#canvasWrapper").bind("scroll", P),
        D(),
        screenshot.canvas)
      ) {
        (c = $("canvas")[1]),
          (f = $("#imgFixForLong")),
          (p = f[0]),
          (p.onload = function () {
            (c.width = this.width),
              (c.height = this.height),
              (p = this),
              c.getContext("2d").drawImage(this, 0, 75, c.width, c.height),
              m(),
              editor.reloadCanvas();
          });
        try {
          p.src = screenshot.canvas.toDataURL();
        } catch (e) {}
        (screenshot.canvas.width = screenshot.canvas.height = 1),
          screenshot.canvas.remove(),
          (screenshot.canvas = null),
          delete screenshot.canvas;
      }
      performance.navigation.type == performance.navigation.TYPE_RELOAD &&
        s &&
        s.reset();
    }),
    (y.Line.begin = function (t, o) {
      if ("ready" !== y.status) return;
      y.status = "started";
      const { x: r, y: i } = s.getPointer(o);
      let n = new fabric.Line([r, i, r + 100, i + 100], {
        stroke: g,
        fill: g,
        strokeWidth: e || 2,
        selectable: !0,
        ...x,
      });
      s.add(n);
      let a = !0;
      function c(e) {
        if (!a || !n) return;
        const { x: t, y: o } = s.getPointer(e.e);
        n.set({ x2: t, y2: o }), s.renderAll();
      }
      s.on("mouse:move", c),
        s.on("mouse:up", function e(t) {
          if (!n) return;
          const { x: o, y: r } = s.getPointer(t.e);
          n.set({ x2: o, y2: r }),
            s.renderAll(),
            (a = !1),
            s.off("mouse:move", c),
            s.off("mouse:up", e),
            (n = null),
            (y.status = "ready");
        });
    }),
    (y.Rectangle.begin = function (t, o) {
      if ("ready" !== y.status) return;
      y.status = "started";
      const { x: r, y: i } = s.getPointer(o);
      let n = r,
        a = i,
        c = new fabric.Rect({
          left: n,
          top: a,
          fill: "transparent",
          width: 150,
          height: 150,
          objectCaching: !1,
          stroke: g,
          strokeWidth: e || 2,
          ...x,
        });
      s.add(c);
      let l = !0;
      function d(e) {
        if (!l || !c) return;
        const { x: t, y: o } = s.getPointer(e.e);
        let r = t,
          i = o;
        c.set({ width: r - n, height: i - a }), s.renderAll();
      }
      s.on("mouse:move", d),
        s.on("mouse:up", function e(t) {
          if (!c) return;
          const { x: o, y: r } = s.getPointer(t.e);
          let i = o,
            h = r;
          c.set({ width: i - n, height: h - a }),
            s.renderAll(),
            (l = !1),
            s.off("mouse:move", d),
            s.off("mouse:up", e),
            (c = null),
            (y.status = "ready");
        });
    }),
    (y.Full.begin = function (e, t) {
      if ("ready" !== y.status) return;
      y.status = "started";
      const { x: o, y: r } = s.getPointer(t);
      let i = o,
        n = r,
        a = new fabric.Rect({
          left: i,
          top: n,
          fill: g,
          width: 150,
          height: 150,
          objectCaching: !1,
          stroke: g,
          ...x,
        });
      s.add(a);
      let c = !0;
      function l(e) {
        if (!c || !a) return;
        const { x: t, y: o } = s.getPointer(e.e);
        let r = t,
          l = o;
        a.set({ width: r - i, height: l - n }), s.renderAll();
      }
      s.on("mouse:move", l),
        s.on("mouse:up", function e(t) {
          if (!a) return;
          const { x: o, y: r } = s.getPointer(t.e);
          let d = o,
            h = r;
          a.set({ width: d - i, height: h - n }),
            s.renderAll(),
            (c = !1),
            s.off("mouse:move", l),
            s.off("mouse:up", e),
            (a = null),
            (y.status = "ready");
        });
    }),
    (y.Ellipse.begin = function (t, o) {
      if ("ready" !== y.status) return;
      (y.status = "started"), (y.Ellipse.data = {});
      const { x: r, y: i } = s.getPointer(o);
      let n = r,
        a = i,
        c = new fabric.Ellipse({
          left: n,
          top: a,
          originX: "left",
          originY: "top",
          rx: r - n,
          ry: i - a,
          angle: 0,
          fill: "transparent",
          stroke: g,
          strokeWidth: e || 2,
          ...x,
        });
      s.add(c);
      let l = !0;
      function d(e) {
        if (!l || !c) return;
        let { x: t, y: r } = s.getPointer(o),
          i = Math.abs(n - t) / 2,
          d = Math.abs(a - r) / 2;
        i > c.strokeWidth && (i -= c.strokeWidth / 2),
          d > c.strokeWidth && (d -= c.strokeWidth / 2),
          c.set({ rx: i, ry: d }),
          n > t ? c.set({ originX: "right" }) : c.set({ originX: "left" }),
          a > r ? c.set({ originY: "bottom" }) : c.set({ originY: "top" }),
          s.renderAll();
      }
      s.on("mouse:move", d),
        s.on("mouse:up", function e(t) {
          if (!c) return;
          let { x: r, y: i } = s.getPointer(o),
            h = Math.abs(n - r) / 2,
            u = Math.abs(a - i) / 2;
          h > c.strokeWidth && (h -= c.strokeWidth / 2),
            u > c.strokeWidth && (u -= c.strokeWidth / 2),
            c.set({ rx: h, ry: u }),
            n > r ? c.set({ originX: "right" }) : c.set({ originX: "left" }),
            a > i ? c.set({ originY: "bottom" }) : c.set({ originY: "top" }),
            s.renderAll(),
            (l = !1),
            s.off("mouse:move", d),
            s.off("mouse:up", e),
            (c = null),
            (y.status = "ready");
        });
    }),
    (y.Arrow.begin = function (e) {
      (s.isDrawingMode = !1), (s.selection = !1);
      let t = null;
      if ("ready" !== y.status) return;
      y.status = "started";
      const { x: o, y: r } = s.getPointer(event);
      let i = o,
        n = r,
        a = !0;
      function c(e) {
        if (!a) return;
        const { x: o, y: r } = s.getPointer(e.e);
        if (t) {
          const { points: e } = w([i, n, o, r]);
          e.forEach((e, o) => {
            t.points[o] = e;
          }),
            s.renderAll();
        } else (t = w([i, n, o, r])), s.add(t);
      }
      s.on("mouse:move", c),
        s.on("mouse:up", function e(o) {
          const { x: r, y: l } = s.getPointer(o.e);
          (a = !1),
            s.off("mouse:move", c),
            s.off("mouse:up", e),
            (y.status = "ready"),
            t && (s.remove(t), (t = null)),
            s.add(w([i, n, r, l])),
            s.renderAll(),
            (s.isDrawingMode = !1),
            (s.hoverCursor = ""),
            (s.selection = !1);
        });
    }),
    (y.Highlight.click = function () {
      s.isDrawingMode = !0;
      let t = hexToRGB(g, 0.5);
      const o = new fabric.PencilBrush(s);
      (o.color = t), (o.width = e || 20), (s.freeDrawingBrush = o);
    }),
    (y.Highlight.begin = () => {
      y.Highlight.click();
    }),
    (y.Draw.click = function () {
      s.isDrawingMode = !0;
      const t = new fabric.PencilBrush(s);
      (t.color = g), (t.width = e || 2), (s.freeDrawingBrush = t);
    }),
    (y.Draw.begin = () => {}),
    (y.Spray.click = function () {
      s.isDrawingMode = !0;
      const t = new fabric.SprayBrush(s);
      (t.color = g), (t.width = e || 20), (s.freeDrawingBrush = t);
    }),
    (y.Spray.begin = () => {}),
    (y.Text.begin = function (e, t) {
      if ("ready" !== y.status) return y.Text.end();
      t.stopImmediatePropagation(),
        (y.status = "started"),
        (r = e.x),
        (n = e.y),
        $("#text_helper").remove(),
        $(
          '<div id=text_helper style="position:absolute;border:none">adf</div>'
        ).appendTo("#canvasWrapper"),
        (x1 = r),
        (y1 = n),
        (x2 = e.x),
        (y2 = e.y),
        x1 < x2 ? ((rx1 = x1), (rx2 = x2)) : ((rx1 = x2), (rx2 = x1)),
        y1 < y2 ? ((ry1 = y1), (ry2 = y2)) : ((ry1 = y2), (ry2 = y1)),
        $("#text_helper").css({
          "z-index": 1e4,
          left: -v.rx1 + rx1 - 8,
          top: -v.ry1 + ry1 - 8,
          height: 40,
          width: 40,
          padding: "5px",
        }),
        (b = [
          "left",
          "top",
          "z-index",
          "width",
          "height",
          "position",
          "font-weight",
          "width",
          "fontWeight",
        ]);
      let o = $(
        '<textarea id="txtInput" class="textareaHelper" wrap="off" width="20px"></textarea>'
      );
      for (i in b) o.css(b[i], $("#text_helper").css(b[i]));
      o.css({
        "background-color": "transparent",
        padding: 0,
        margin: 0,
        color: g,
        "font-size": "20px",
        "line-height": "1",
        resize: "none",
        overflow: "hidden",
        fontFamily: "Helvetica",
      }),
        o.mousedown(function (e) {
          e.stopImmediatePropagation();
        }),
        o.bind("input", function (e) {
          let t = (function (e) {
            let t = e.split("\n"),
              o = 0;
            return (
              t.forEach((e) => {
                if (e.length > o) return (o = e.length), o;
              }),
              o
            );
          })($(this).val());
          var o;
          $(this).css({ width: t / 2 + 5 + "em" }),
            $(this).css({
              height:
                ((o = $(this).val()),
                20 + 20 * (o.match(/\n/g) || []).length + 12 + 2 + "px"),
            });
        }),
        o.appendTo("#canvasWrapper").focus(),
        $("#text_helper").remove();
    }),
    (y.Text.end = function () {
      if ($("#txtInput").length) {
        (a = {
          text: $("#txtInput").val(),
          fontSize: "16px",
          fontWeight: $("#txtInput").css("font-weight"),
          fontFamily: "Helvetica",
          lineHeight: "10px",
          width: $("#txtInput").css("width"),
          x: r,
          y: n,
        }),
          $(".textareaHelper").remove(),
          (y.status = "ready");
        var e = new fabric.Text(a.text, {
          fontSize: 20,
          left: a.x - 8,
          top: a.y - 8,
          lineHeight: 1,
          fill: g,
          originX: "left",
          fontFamily: "Helvetica",
        });
        s.add(e);
      }
    }),
    (y.Crop.begin = function (e) {
      (y.Crop.size = { before: { ...v }, after: null }),
        (y.status = "started"),
        (r = e.x),
        (n = e.y);
    }),
    (y.Crop.click = function () {
      S();
    }),
    (y.Crop.up = function () {
      if (ry2 - ry1 + rx2 - rx1 < 100) return;
      const e = v.rx2 - v.rx1,
        t = v.ry2 - v.ry1,
        o = rx2 - rx1,
        r = ry2 - y1;
      (e - o < 10 && t - r < 10) ||
        ((v.rx1 = rx1),
        (v.rx2 = rx2),
        (v.ry1 = ry1),
        (v.ry2 = ry2),
        (y.Crop.size.after = { ...v }),
        y.Crop.draw());
    }),
    (y.Crop.draw = function () {
      $("#crop_helper").remove(),
        S(),
        s.fire("canvas:crop", { size: { ...y.Crop.size } }),
        $("#canvasWrapper").scrollTop(0).scrollLeft(0),
        $(".lower-canvas").scrollTop(0).scrollLeft(0),
        (y.status = "ready"),
        D();
    }),
    (y.Crop.move = function (e) {
      (x1 = r), (y1 = n), (x2 = e.x), (y2 = e.y);
      let {
        rx1Origin: t,
        ry1Origin: i,
        rx2Origin: s,
        ry2Origin: a,
      } = y.Crop.size.before;
      $("#canvasWrapper").scrollTop() + $("#canvasWrapper").height() - e.y <
        35 &&
        v.ry2 < a &&
        (($("#canvasWrapper")[0].scrollTop += 30), (e.y += 30)),
        $("#canvasWrapper").scrollLeft() + $("#canvasWrapper").width() - e.x <
          35 &&
          v.rx2 < s &&
          (($("#canvasWrapper")[0].scrollLeft += 30), (e.x += 30)),
        e.y - $("#canvasWrapper").scrollTop() < 35 &&
          v.ry2 < a &&
          (($("#canvasWrapper")[0].scrollTop -= 30), (e.y -= 30)),
        e.x - $("#canvasWrapper").scrollLeft() < 35 &&
          v.rx2 < s &&
          (($("#canvasWrapper")[0].scrollLeft -= 30), (e.x -= 30)),
        0 !== $(".lower-canvas").length &&
          ($(".lower-canvas").scrollTop() + $(".lower-canvas").height() - e.y <
            35 &&
            v.ry2 < a &&
            (($(".lower-canvas")[0].scrollTop += 30), (e.y += 30)),
          $(".lower-canvas").scrollLeft() + $(".lower-canvas").width() - e.x <
            35 &&
            v.rx2 < s &&
            (($(".lower-canvas")[0].scrollLeft += 30), (e.x += 30)),
          e.y - $(".lower-canvas").scrollTop() < 35 &&
            v.ry2 < a &&
            (($(".lower-canvas")[0].scrollTop -= 30), (e.y -= 30)),
          e.x - $(".lower-canvas").scrollLeft() < 35 &&
            v.rx2 < s &&
            (($(".lower-canvas")[0].scrollLeft -= 30), (e.x -= 30))),
        x1 < x2 ? ((rx1 = x1), (rx2 = x2)) : ((rx1 = x2), (rx2 = x1)),
        y1 < y2 ? ((ry1 = y1), (ry2 = y2)) : ((ry1 = y2), (ry2 = y1)),
        $("#crop_helper").remove(),
        $(
          "<div id=crop_helper><div id=crop_helper_bottom></div><div id=crop_helper_left></div><div id=crop_helper_top></div><div id=crop_helper_right></div></div>"
        ).appendTo("#canvasWrapper"),
        $("#crop_helper *").css({
          "background-color": "blue",
          opacity: "0.6",
          position: "absolute",
          "z-index": 1e4,
        }),
        $("#crop_helper_left").css({
          "ackground-color": "blue",
          left: 0,
          top: o.position().top,
          top: 0,
          width: rx1 - v.rx1,
          height: o.height() + u,
        }),
        $("#crop_helper_top").css({
          "ackground-color": "red",
          left: rx1 - v.rx1,
          top: 0,
          width: v.rx2 - (rx1 - v.rx1),
          height: ry1 - v.ry1,
        }),
        $("#crop_helper_bottom").css({
          "ackground-color": "yellow",
          left: rx1 - v.rx1,
          top: ry2 - v.ry1,
          width: v.rx2 - (rx1 - v.rx1),
          height: v.ry2 - ry2,
        }),
        $("#crop_helper_right").css({
          "ackground-color": "green",
          left: rx2 - v.rx1,
          top: ry1 - v.ry1,
          width: v.rx2 - (rx2 - v.rx1),
          height: ry2 - ry1,
        });
    }),
    (y.house.begin = function (e) {}),
    (y.house.move = function (e) {}),
    (y.house.draw = function (e) {}),
    (y.house.up = function () {}),
    (window.changeTool = C);
}
let editor = new Editor_obj();
(editor.window = window),
  (editor.close = window.close),
  $(function () {
    editor.init(),
      editor.appick ||
        editor.intent ||
        setTimeout(screenshot.createScreenShot, 0);
  });
let multiFillText = function (e, t, o, r, i, n) {
  let s = e.getContext("2d"),
    a = null !== o && null !== r;
  (t = t.replace(/(\r\n|\n\r|\r|\n)/g, "\n")), (sections = t.split("\n"));
  let c,
    l,
    d,
    h,
    u = 0,
    p = 0,
    f = function (e) {
      a && s.fillText(e, o, r + i * u),
        u++,
        (d = s.measureText(e).width),
        d > p && (p = d);
    };
  for (c = 0; c < sections.length; c++) {
    for (
      h = sections[c].split(" "), index = 1;
      h.length > 0 && index <= h.length;

    )
      (l = h.slice(0, index).join(" ")),
        (d = s.measureText(l).width),
        d > n
          ? (1 === index
              ? ((l = h.slice(0, 1).join(" ")), (h = h.splice(1)))
              : ((l = h.slice(0, index - 1).join(" ")),
                (h = h.splice(index - 1))),
            f(l),
            (index = 1))
          : index++;
    index > 0 && f(h.join(" "));
  }
  if (((maxHeight = i * u), !a)) return { height: maxHeight, width: p };
};
function saveFile(e, t, o = () => {}, r = () => {}) {
  function i() {
    let e =
      "filesystem:chrome-extension://" + chrome.runtime.id + "/temporary/" + t;
    o(e);
  }
  let n = e.size + 512;
  (window.requestFileSystem || window.webkitRequestFileSystem)(
    window.TEMPORARY,
    n,
    function (o) {
      o.root.getFile(
        t,
        { create: !0 },
        function (t) {
          t.createWriter(function (t) {
            (t.onwriteend = i), t.write(e);
          }, r);
        },
        r
      );
    },
    r
  );
}
function dataURLtoBlob(e) {
  for (
    var t = e.split(","),
      o = t[0].match(/:(.*?);/)[1],
      r = atob(t[2] || t[1]),
      i = r.length,
      n = new Uint8Array(i);
    i--;

  )
    n[i] = r.charCodeAt(i);
  return new Blob([n], { type: o });
}
function hexToRGB(e, t) {
  var o = parseInt(e.slice(1, 3), 16),
    r = parseInt(e.slice(3, 5), 16),
    i = parseInt(e.slice(5, 7), 16);
  return t
    ? "rgba(" + o + ", " + r + ", " + i + ", " + t + ")"
    : "rgb(" + o + ", " + r + ", " + i + ")";
}
setTimeout(() => {
  editor.createLastCanvas((e) => {
    saveFile(e, screenShotFilename);
  });
}, 1e3),
  $(function () {
    new Toolbar({
      plugins: [],
      element: document.getElementById("toolbarContainer"),
      namespace: "editor",
      enlargable: !1,
      page_title: screenshot.title,
      page_url: screenshot.url,
      doNotRenderDefaults: !0,
      whiteIcons: !0,
      button_size: 20,
      icon_base: "images/",
      position: "static",
      type: "image",
      theme: !0,
      request: function (e) {
        editor.createLastCanvas(function (t) {
          e(t);
        });
      },
    }),
      changeTool("house"),
      $(".save").on("click", function () {
        editor.createLastCanvas(() => {
          chrome.downloads.download({
            url: canvasToDataURL,
            filename: Date.now() + ".png",
            saveAs: !0,
          });
        });
      }),
      $(".download").on("click", function () {
        $(".download").fadeOut("slow"),
          $("#upload_area").hide(),
          $(".upload").fadeIn("slow"),
          $("#download_area").fadeIn("slow");
      }),
      $(".download-active").on("click", function () {
        $("#download_area").fadeOut("slow"), $(".download").fadeIn("slow");
      }),
      $(".upload").on("click", function () {
        $(".upload").fadeOut("slow"),
          $("#upload_area").fadeIn("slow"),
          $("#download_area").hide(),
          $(".download").fadeIn("slow");
      }),
      $(".upload-active").on("click", function () {
        $("#upload_area").fadeOut("slow"), $(".upload").fadeIn("slow");
      }),
      $(".progress").css({ display: "none" }),
      $(".save-to-google-drive").on("click", function () {
        editor.createLastCanvas(() => {
          uploadVideo
            .uploadToGoogleDrive(
              dataURLtoBlob(canvasToDataURL),
              Date.now() + ".png",
              (e) => {
                $(".save-to-google-drive").css({ display: "none" }),
                  $(".progress").css({ display: "block" }),
                  $("#progress-bar").css({ width: Math.floor(e) + "%" });
              }
            )
            .then((e) => {
              $(".progress").css({ display: "none" });
              const t = document.createElement("div");
              (t.id = "btnGetGoogleDriveLink"),
                (t.innerHTML = `\n                    <input id="linkForGoogleDrive" type="text" readonly value="${e.alternateLink}" />\n                `),
                document.getElementById("upload_area").appendChild(t),
                $(".save-to-google-drive").hide(),
                (document.getElementById("btnGetGoogleDriveLink").onclick =
                  () => {
                    document.getElementById("linkForGoogleDrive").select(),
                      document.execCommand("copy"),
                      alert("Copied"),
                      window.getSelection().empty();
                  });
            });
        });
      }),
      $(".save-to-pdf").on("click", function () {
        editor.createLastCanvas(() => {
          const t = new Image(),
            o = 595.28,
            r = 841.89;
          let i = 0.5,
            n = o,
            s = r,
            a = "p";
          (t.src = canvasToDataURL),
            (t.onload = () => {
              t.width * i > n - 2 * e &&
                ((a = "l"), (n = r), (s = o), (i = (n - 2 * e) / t.width));
              let c = 0,
                l = document.createElement("canvas");
              const d = new jsPDF(a, "pt");
              for (; c < t.height; ) {
                0 !== c && d.addPage();
                const o = l.getContext("2d");
                (l.width = t.width),
                  (l.height = (s - e) / i),
                  o.rect(0, 0, l.width, l.height),
                  (o.fillStyle = "white"),
                  o.fill(),
                  o.drawImage(
                    t,
                    0,
                    c,
                    t.width,
                    t.height - c,
                    0,
                    0,
                    t.width,
                    t.height - c
                  );
                const r = l.toDataURL("image/jpeg", 1);
                d.addImage(r, "JPEG", e / 2, e / 2, l.width * i, l.height * i),
                  (c += l.height);
              }
              chrome.downloads.download({
                url: d.output("datauristring"),
                filename: Date.now() + ".pdf",
                saveAs: !0,
              });
            });
        });
        const e = 20;
      }),
      $(".buttons .copy").on("click", function () {
        changeTool("house"),
          $(".button[tag]").removeClass("on"),
          editor.createLastCanvas(),
          $(".copy-modal").remove(),
          $(
            `\n            <div class="copy-modal">\n                <div class="copy-modal-box">\n                    <div class="copy-modal-close">✕</div>\n                    <h2>Right click the image and choose "Copy Image" for copying the image to the clipboard (buffer).</h2>\n                    <img src="${canvasToDataURL}">\n                </div>\n            </div>`
          ).appendTo(document.body);
      }),
      $(document.body).on("click", ".copy-modal", (e) => {
        e.target.closest(".copy-modal-box") || $(".copy-modal").remove();
      }),
      $(document.body).on("click", ".copy-modal-close", () =>
        $(".copy-modal").remove()
      ),
      $(document.body).on("keyup", (e) => {
        27 === e.keyCode && $(".copy-modal").remove();
      });
  });
