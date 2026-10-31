/* Store language layer: Norsk (default), English, Svenska, Polski.
   Norwegian markup is the source; i18n-dict.js holds translations keyed by the Norwegian text.
   Language comes from ?lang=, then localStorage, then the #en anchor used by /terms and /privacy. */
(function () {
  "use strict";
  var LANGS = [["nb", "NO", "Norsk"], ["en", "EN", "English"], ["sv", "SV", "Svenska"], ["pl", "PL", "Polski"]];
  var VALID = { nb: 1, en: 1, sv: 1, pl: 1 };
  var KEY = "store_lang";
  function pick() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (_) {}
    if (q === "no" || q === "nn") q = "nb";
    if (q && VALID[q]) { try { localStorage.setItem(KEY, q); } catch (_) {} return q; }
    if (location.hash === "#en" && !document.getElementById("en")) return "en";
    var s = null;
    try { s = localStorage.getItem(KEY); } catch (_) {}
    return s && VALID[s] ? s : "nb";
  }
  var lang = pick();
  window.STORE_LANG = lang;
  document.documentElement.setAttribute("lang", lang);
  var LOCALE = { nb: "nb-NO", en: "en-GB", sv: "sv-SE", pl: "pl-PL" };
  window.STORE_LOCALE = LOCALE[lang];

  var map = null;
  var norm = function (s) { return s.replace(/\s+/g, " ").trim(); };
  var outputs = new Set();
  function tr(raw) {
    if (!map || !raw) return null;
    var k = norm(raw);
    if (!k || outputs.has(k)) return null;
    var v = map[k];
    if (v == null) {
      /* numbers inside a known sentence (prices, counts, days) */
      var nums = k.match(/\d+(?:[.,]\d+)?/g);
      if (nums) {
        var t = map[k.replace(/\d+(?:[.,]\d+)?/g, "#")];
        if (t != null) { var i = 0; v = t.replace(/#/g, function () { return nums[i++] || "#"; }); }
      }
    }
    if (v == null && /[.!?]\s/.test(k)) {
      /* longer text built from known sentences (e.g. generated product descriptions) */
      var parts = k.split(/(?<=[.!?])\s+/), hit = 0;
      var out = parts.map(function (p) { var r = map[p]; if (r == null) { var n = p.match(/\d+(?:[.,]\d+)?/g); if (n) { var t2 = map[p.replace(/\d+(?:[.,]\d+)?/g, "#")]; if (t2 != null) { var j = 0; r = t2.replace(/#/g, function () { return n[j++] || "#"; }); } } } if (r != null) hit++; return r == null ? p : r; });
      if (hit) v = out.join(" ");
    }
    if (v == null) return null;
    outputs.add(norm(v));
    var lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
    return lead + v + tail;
  }
  window.storeT = function (s) { var r = tr(s); return r == null ? s : r; };
  var ATTRS = ["placeholder", "aria-label", "title", "alt", "data-label"];
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, TEXTAREA: 1 };
  function walk(root) {
    if (!map || !root) return;
    if (root.nodeType === 3) { var r = tr(root.nodeValue); if (r != null && r !== root.nodeValue) root.nodeValue = r; return; }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) {
      if (SKIP[root.tagName] || root.hasAttribute("data-no-i18n")) return;
      for (var a = 0; a < ATTRS.length; a++) {
        var av = root.getAttribute(ATTRS[a]);
        if (av) { var ar = tr(av); if (ar != null) root.setAttribute(ATTRS[a], ar); }
      }
      if (root.tagName === "INPUT" && /^(submit|button)$/i.test(root.type) && root.value) { var vr = tr(root.value); if (vr != null) root.value = vr; }
      if (root.tagName === "META" && /description|title/i.test(root.getAttribute("name") || root.getAttribute("property") || "")) {
        var mc = root.getAttribute("content"); var mr = mc && tr(mc); if (mr) root.setAttribute("content", mr);
      }
    }
    var c = root.firstChild;
    while (c) { var n = c.nextSibling; walk(c); c = n; }
  }
  function switcher() {
    if (document.getElementById("langSwitch")) return;
    var box = document.createElement("div");
    box.id = "langSwitch";
    box.setAttribute("data-no-i18n", "");
    box.setAttribute("role", "navigation");
    box.setAttribute("aria-label", "Språk / Language");
    box.style.cssText = "display:inline-flex;gap:2px;align-items:center;font:600 12px/1 system-ui,Arial,sans-serif;margin:0 6px;flex:0 0 auto";
    LANGS.forEach(function (l) {
      var b = document.createElement("a");
      var u = new URL(location.href); u.searchParams.set("lang", l[0]); if (u.hash === "#en") u.hash = "";
      b.href = u.pathname + u.search + u.hash;
      b.textContent = l[1];
      b.title = l[2];
      b.hreflang = l[0] === "nb" ? "nb" : l[0];
      b.setAttribute("lang", l[0]);
      if (l[0] === lang) b.setAttribute("aria-current", "true");
      b.style.cssText = "padding:5px 6px;border:1px solid currentColor;border-radius:4px;text-decoration:none;color:inherit;opacity:" + (l[0] === lang ? "1" : ".55");
      b.addEventListener("click", function () { try { localStorage.setItem(KEY, l[0]); } catch (_) {} });
      box.appendChild(b);
    });
    var host = document.querySelector(".site-nav .nav-actions, .navright, .nav-actions, header .lg-nav, .lg-nav, nav, header");
    if (host) host.insertBefore(box, host.firstChild);
    else { box.style.cssText += ";position:fixed;top:8px;right:8px;z-index:99;background:#fff;color:#111;padding:4px;border-radius:6px"; document.body.appendChild(box); }
  }
  /* keep internal links in the chosen language without a reload flicker */
  function keepLang() {
    if (lang === "nb") return;
    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
      if (!a || a.closest("#langSwitch")) return;
      try { var u = new URL(a.href, location.href); if (u.origin === location.origin && !u.searchParams.has("lang") && !/^\/api\//.test(u.pathname)) { u.searchParams.set("lang", lang); a.href = u.href; } } catch (_) {}
    }, true);
  }
  function start() {
    switcher();
    keepLang();
    if (!map) return;
    if (document.title) { var t = tr(document.title); if (t) document.title = t; }
    walk(document.head); walk(document.body);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        if (m.type === "characterData") walk(m.target);
        else if (m.type === "attributes") walk(m.target);
        else m.addedNodes.forEach(walk);
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "title", "alt"] });
  }
  function ready(fn) { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn); else fn(); }
  if (lang === "nb") { ready(start); return; }
  var sc = document.createElement("script");
  sc.src = "/i18n/" + lang + ".js?v=20261031";
  sc.onload = function () { map = (window.I18N_DICT || {})[lang] || null; ready(start); };
  sc.onerror = function () { ready(start); };
  (document.head || document.documentElement).appendChild(sc);
})();
