/* All content lives in data.json — this file only renders it. */
(function () {
	"use strict";

	fetch("data.json")
		.then(function (r) { return r.json(); })
		.then(init)
		.catch(function (err) {
			console.error("Failed to load data.json", err);
		});

	function init(data) {
		document.title = data.meta.title;
		var brand = document.querySelector(".brand");
		if (brand) brand.textContent = data.meta.name;

		var board = document.getElementById("board");
		board.textContent = "";
		board.appendChild(renderAbout(data));
		board.appendChild(renderCareer(data.career));
		board.appendChild(renderHighlightedWork(data.highlightedWork));
		board.appendChild(renderProjects(data.projects));
		board.appendChild(renderAchievements(data.achievements));
		board.appendChild(renderBlogs(data.blogs, data.meta));

		wireArrows();
		wireCopyEmail();
		initPixelPortrait(data.meta.portrait);
	}

	/* ===== DOM helpers ===== */

	function el(tag, props, children) {
		var n = document.createElement(tag);
		if (props) {
			Object.keys(props).forEach(function (k) {
				if (props[k] != null) n.setAttribute(k, props[k]);
			});
		}
		(children || []).forEach(function (c) {
			if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
		});
		return n;
	}

	function extLink(cls, href, children) {
		return el("a", { class: cls, href: href, target: "_blank", rel: "noopener" }, children);
	}

	function column(cls, id, title, bodyChildren) {
		return el("section", { class: "col " + cls, "aria-labelledby": id }, [
			el("h2", { class: "col-title", id: id }, [title]),
			el("div", { class: "col-body" }, bodyChildren)
		]);
	}

	/* ===== SVG icons for projects ===== */

	var SVG_NS = "http://www.w3.org/2000/svg";

	var ICONS = {
		spiral: [
			{ tag: "path", d: "M12 3a9 9 0 1 0 9 9" },
			{ tag: "path", d: "M12 7a5 5 0 1 0 5 5" },
			{ tag: "circle", cx: "12", cy: "12", r: "1.2", fill: "currentColor", stroke: "none" }
		],
		candles: [
			{ tag: "path", d: "M7 4v3M7 17v3M17 2v3M17 15v3" },
			{ tag: "rect", x: "4.5", y: "7", width: "5", height: "10", rx: "1" },
			{ tag: "rect", x: "14.5", y: "5", width: "5", height: "10", rx: "1" }
		],
		swap: [
			{ tag: "path", d: "M4 8h13l-3-3M20 16H7l3 3" }
		],
		barrier: [
			{ tag: "path", d: "M4 6h2M9 6h2M14 6h2M19 6h1" },
			{ tag: "path", d: "M4 19c3 0 4-9 8-9 3 0 4 5 8 5" }
		],
		trend: [
			{ tag: "path", d: "M4 18 10 12l3 3 7-8" },
			{ tag: "path", d: "M20 12V7h-5" }
		],
		gauge: [
			{ tag: "path", d: "M5 19a8 8 0 1 1 14 0" },
			{ tag: "path", d: "M12 13l4-4" },
			{ tag: "circle", cx: "12", cy: "14", r: "1.4", fill: "currentColor", stroke: "none" }
		],
		wallet: [
			{ tag: "rect", x: "3", y: "7", width: "18", height: "13", rx: "2.5" },
			{ tag: "path", d: "M16 13.5h2.5M7 7V5.5A1.5 1.5 0 0 1 8.5 4H17" }
		]
	};

	function svgIcon(name) {
		var spec = ICONS[name];
		var svg = document.createElementNS(SVG_NS, "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("fill", "none");
		svg.setAttribute("stroke", "currentColor");
		svg.setAttribute("stroke-width", "2");
		svg.setAttribute("stroke-linecap", "round");
		svg.setAttribute("stroke-linejoin", "round");
		svg.setAttribute("aria-hidden", "true");
		if (!spec) return svg;
		spec.forEach(function (shape) {
			var node = document.createElementNS(SVG_NS, shape.tag);
			Object.keys(shape).forEach(function (k) {
				if (k !== "tag") node.setAttribute(k, shape[k]);
			});
			svg.appendChild(node);
		});
		return svg;
	}

	/* ===== about ===== */

	function renderAbout(data) {
		var m = data.meta;
		var a = data.about;

		var facts = el("dl", { class: "facts" }, a.facts.map(function (f) {
			return el("div", { class: "fact" }, [
				el("dt", null, [f.label]),
				el("dd", null, [f.href ? el("a", { href: f.href }, [f.value]) : f.value])
			]);
		}));

		var skills = a.skills.map(function (g) {
			return el("div", { class: "skill-group" }, [
				el("p", { class: "skill-label" }, [g.label]),
				el("ul", { class: "skill-pills" }, g.items.map(function (s) {
					return el("li", null, [s]);
				}))
			]);
		});

		return column("col-about", "t-about", a.title, [
			el("div", { class: "pixel-wrap" }, [el("canvas", { id: "pixel-canvas" })]),
			el("p", { class: "intro" }, [a.intro]),
			el("p", { class: "intro-sub" }, [a.introSub]),
			el("div", { class: "about-actions" }, [
				el("button", { class: "action-btn", id: "copy-email", "data-email": m.email }, ["Copy email"]),
				extLink("action-btn", m.github, ["GitHub"]),
				extLink("action-btn", m.linkedin, ["LinkedIn"]),
				el("a", { class: "action-btn", href: m.resume, download: "" }, ["Download CV"])
			]),
			facts,
			el("h2", { class: "col-subtitle" }, ["Skills"])
		].concat(skills));
	}

	/* ===== career ===== */

	function renderCareer(c) {
		var axisSpans = [];
		for (var y = c.axis.startYear; y >= c.axis.endYear; y--) {
			var top = c.axis.topStart + (c.axis.startYear - y) * c.axis.step;
			axisSpans.push(el("span", { style: "top:" + top + "px" }, [String(y)]));
		}

		var cards = c.items.map(function (it) {
			var cls = "tl-card";
			if (it.edu) cls += " edu";
			if (it.lane) cls += " lane-" + it.lane;
			if (it.size) cls += " " + it.size;
			return el("article", {
				class: cls,
				style: "top:" + it.top + "px;height:" + it.height + "px"
			}, [
				el("h3", null, [it.role]),
				el("p", { class: "tl-org" }, [it.org]),
				el("p", { class: "tl-dates" }, [it.dates]),
				el("p", { class: "tl-desc" }, [it.desc])
			]);
		});

		var markers = (c.markers || []).map(function (mk) {
			return el("p", { class: "tl-marker", style: "top:" + mk.top + "px" }, [
				el("span", { class: "dot" }),
				mk.text
			]);
		});

		return column("col-career", "t-career", c.title, [
			el("div", { class: "timeline" }, [
				el("div", { class: "tl-axis", "aria-hidden": "true" }, axisSpans),
				el("div", { class: "tl-canvas" }, cards.concat(markers))
			])
		]);
	}

	/* ===== highlighted work ===== */

	function renderHighlightedWork(w) {
		var cards = w.items.map(function (it) {
			var media;
			if (it.media.type === "video") {
				media = el("video", {
					autoplay: "", muted: "", loop: "", playsinline: "",
					"aria-label": it.media.alt
				}, [el("source", { src: it.media.src, type: "video/mp4" })]);
				media.muted = true;
			} else {
				media = el("img", { src: it.media.src, alt: it.media.alt, loading: "lazy" });
			}

			var mediaWrap = it.url
				? extLink("work-media", it.url, [media])
				: el("div", { class: "work-media" }, [media]);

			var heading = el("h3", null, [
				it.url ? extLink(null, it.url, [it.name]) : it.name
			]);

			var badgeCls = "badge" + (it.badge.style ? " badge-" + it.badge.style : "");

			return el("article", { class: "work-card" }, [
				mediaWrap,
				el("div", { class: "work-meta" }, [
					heading,
					el("span", { class: badgeCls }, [it.badge.text])
				]),
				el("p", { class: "work-desc" }, [it.desc])
			]);
		});

		return column("col-work", "t-work", w.title, cards);
	}

	/* ===== projects ===== */

	function renderProjects(p) {
		var items = p.items.map(function (it) {
			return extLink("proj", it.url, [
				el("span", { class: "proj-icon", style: "--c:" + it.color }, [svgIcon(it.icon)]),
				el("span", { class: "proj-info" }, [
					el("span", { class: "proj-name" }, [it.name + " ", el("em", null, [it.date])]),
					el("span", { class: "proj-desc" }, [it.desc]),
					el("span", { class: "proj-url" }, [it.domain])
				])
			]);
		});

		return column("col-projects", "t-projects", p.title, items);
	}

	/* ===== achievements & certs ===== */

	function renderAchievements(a) {
		var achs = a.items.map(function (it) {
			return el("article", { class: "ach" }, [
				el("div", { class: "ach-head" }, [
					el("h3", null, [it.url ? extLink(null, it.url, [it.name]) : it.name]),
					el("span", { class: "ach-amount" }, [it.amount])
				]),
				el("p", { class: "ach-desc" }, [it.desc]),
				el("span", { class: "ach-year" }, [it.year])
			]);
		});

		var certs = a.certifications.map(function (c) {
			return el("article", { class: "cert" }, [
				el("img", {
					class: "cert-thumb", src: c.image,
					alt: c.name + " certificate", loading: "lazy"
				}),
				el("div", { class: "cert-info" }, [
					el("h3", null, [c.name]),
					el("p", { class: "cert-issuer" }, [c.issuer])
				])
			]);
		});

		return column("col-more", "t-more", a.title,
			achs.concat([el("h2", { class: "col-subtitle" }, [a.certificationsTitle])], certs));
	}

	/* ===== blogs ===== */

	function renderBlogs(b, meta) {
		var posts = b.items.map(function (it) {
			return extLink("post", it.url, [
				el("time", { datetime: it.datetime }, [it.date]),
				el("span", { class: "post-title" }, [it.name]),
				el("span", { class: "post-desc" }, [it.desc]),
				el("span", { class: "proj-url" }, [it.domain])
			]);
		});

		var footer = el("p", { class: "board-footer" }, [
			"© " + new Date().getFullYear() + " " + meta.name + " · " + meta.location
		]);

		return column("col-writing", "t-writing", b.title, posts.concat([footer]));
	}

	/* ===== board arrow navigation ===== */

	function wireArrows() {
		var board = document.getElementById("board");
		var left = document.getElementById("scroll-left");
		var right = document.getElementById("scroll-right");
		var STEP = 386;
		if (!board || !left || !right) return;
		left.addEventListener("click", function () {
			board.scrollBy({ left: -STEP, behavior: "smooth" });
		});
		right.addEventListener("click", function () {
			board.scrollBy({ left: STEP, behavior: "smooth" });
		});
	}

	/* ===== copy email ===== */

	function wireCopyEmail() {
		var btn = document.getElementById("copy-email");
		if (!btn) return;
		btn.addEventListener("click", function () {
			navigator.clipboard.writeText(btn.getAttribute("data-email")).then(function () {
				var original = btn.textContent;
				btn.textContent = "Copied!";
				setTimeout(function () { btn.textContent = original; }, 1600);
			});
		});
	}

	/* ===== animated pixel portrait ===== */

	function initPixelPortrait(src) {
		var canvas = document.getElementById("pixel-canvas");
		if (!canvas) return;

		var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		var ctx = canvas.getContext("2d");
		var img = new Image();
		img.src = src;

		// NYU violet ramp, dark -> light
		var RAMP = [
			"#120c18", "#1a1124", "#261735", "#341e49",
			"#43265e", "#532e74", "#622f8c", "#753ba3",
			"#894eb6", "#9e66c9", "#b481da", "#cda4ec"
		];
		var CELL = 4;

		var cols = 0, rows = 0, lum = null, running = false, rafId = 0;

		function sample() {
			var w = canvas.clientWidth;
			var h = canvas.clientHeight;
			if (!w || !h) return false;
			var dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = Math.round(w * dpr);
			canvas.height = Math.round(h * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			cols = Math.ceil(w / CELL);
			rows = Math.ceil(h / CELL);

			var off = document.createElement("canvas");
			off.width = cols;
			off.height = rows;
			var octx = off.getContext("2d", { willReadFrequently: true });

			// cover-fit the image into the grid
			var ir = img.width / img.height;
			var gr = cols / rows;
			var sw, sh, sx, sy;
			if (ir > gr) {
				sh = img.height;
				sw = sh * gr;
				sx = (img.width - sw) / 2;
				sy = 0;
			} else {
				sw = img.width;
				sh = sw / gr;
				sx = 0;
				sy = 0; // crop from the top to keep the face
			}
			octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);

			var data = octx.getImageData(0, 0, cols, rows).data;
			lum = new Float32Array(cols * rows);
			for (var i = 0; i < cols * rows; i++) {
				var r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
				lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) * (a / 255);
			}
			return true;
		}

		// 4x4 Bayer matrix for an ordered-dither feel
		var BAYER = [
			0, 8, 2, 10,
			12, 4, 14, 6,
			3, 11, 1, 9,
			15, 7, 13, 5
		];

		function paint(t) {
			var n = RAMP.length;
			for (var y = 0; y < rows; y++) {
				for (var x = 0; x < cols; x++) {
					var v = lum[y * cols + x];
					// slow drifting shimmer
					var noise =
						Math.sin(x * 0.32 + t * 0.0011) * 9 +
						Math.sin(y * 0.41 - t * 0.0009) * 9 +
						Math.sin((x + y) * 0.18 + t * 0.0006) * 7;
					var dither = (BAYER[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * 26;
					var idx = Math.floor(((v + noise + dither) / 255) * n);
					if (idx < 0) idx = 0;
					if (idx >= n) idx = n - 1;
					ctx.fillStyle = RAMP[idx];
					ctx.fillRect(x * CELL, y * CELL, CELL - 1, CELL - 1);
				}
			}
		}

		function loop(t) {
			paint(t);
			rafId = requestAnimationFrame(loop);
		}

		function start() {
			if (running || reduceMotion) return;
			running = true;
			rafId = requestAnimationFrame(loop);
		}

		function stop() {
			running = false;
			cancelAnimationFrame(rafId);
		}

		img.onload = function () {
			if (!sample()) return;
			paint(0);
			if (reduceMotion) return;

			// animate only while visible
			if ("IntersectionObserver" in window) {
				new IntersectionObserver(function (entries) {
					entries[0].isIntersecting ? start() : stop();
				}, { threshold: 0.05 }).observe(canvas);
			} else {
				start();
			}
		};

		var resizeTimer;
		window.addEventListener("resize", function () {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				if (img.complete && sample()) paint(performance.now());
			}, 150);
		});
	}
})();
