/* ==========================================================================
   EDIT MODE — change the website by clicking on it

   HOW STAFF USE IT
   Open any page of the site and add  ?edit=1  to the end of the web address.
   An "Editing" bar appears at the bottom. Click any heading, paragraph or
   list item and type. Click a photo to replace it. Press "Save changes" and
   the live website updates about a minute later.

   The first time, the bar asks for a GitHub access key. Paste it once and
   this browser remembers it. The README explains how to create that key.

   WHAT IT DOES NOT TOUCH
   The top menu and the footer are shared by every page, so they are not
   editable here. Same for the project list and anything inside a form.
   Those are edited in the files, as described in the README.

   IF THE WEBSITE MOVES to a different address or repository, change the
   four settings directly below. Nothing else in this file needs editing.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- SETTINGS ---------- */
  var OWNER  = "BrianVKENGSE";              // GitHub account that owns the site
  var REPO   = "-vk-engineers-website";     // repository name
  var BRANCH = "main";                      // branch the live site is built from
  var SITE_BASE = "/-vk-engineers-website/"; // the part of the address after the domain

  var TOKEN_KEY = "vk-edit-token";   // where the access key is remembered
  var MODE_KEY  = "vk-edit-mode";    // remembers that edit mode is on

  /* Which things can be clicked and typed over. */
  var EDITABLE =
    "h1,h2,h3,h4,h5,h6,p,li,dt,dd,td,th,blockquote,figcaption," +
    ".kicker,.eyebrow,.lead,.stat-num,.stat-label,.page-intro-lead";

  /* Things that must not be edited on the page: shared menu and footer,
     lists that are built from other files, forms, and buttons. */
  var LOCKED =
    "header,footer,nav,form,button,.btn,.nav-links,.review-bar," +
    "#site-header,#site-footer,#projects-grid,#projects-count," +
    "#project-meta,#project-description,#discipline-tabs,#status-tabs";

  /* Photo slots: real images, and the empty grey panels waiting for photos. */
  var PHOTO = "img,.photo-placeholder,.office-photo,.project-media";

  /* ---------- turn edit mode on/off ---------- */
  var asked = /[?&]edit=1/.test(location.search) || location.hash === "#edit";
  if (asked) sessionStorage.setItem(MODE_KEY, "1");
  if (sessionStorage.getItem(MODE_KEY) !== "1") return;

  var changes = {};      // path -> { html: "..." , attrs: {src: "..."} }
  var uploads = [];      // photos waiting to be sent { file, name, el, path, mode }
  var bar, statusEl;

  document.addEventListener("DOMContentLoaded", start);
  if (document.readyState !== "loading") start();
  var started = false;

  function start() {
    if (started) return;
    started = true;
    injectStyles();
    buildBar();
    makeEditable();
    window.addEventListener("beforeunload", function (e) {
      if (!dirty()) return;
      e.preventDefault();
      e.returnValue = "";
    });
  }

  /* ---------- which file on GitHub is this page? ---------- */
  function repoPath() {
    var p = decodeURIComponent(location.pathname);
    if (p.indexOf(SITE_BASE) === 0) p = p.slice(SITE_BASE.length);
    else p = p.replace(/^\//, "");
    if (p === "" || /\/$/.test(p)) p += "index.html";
    return p;
  }
  function folder() {
    var p = repoPath();
    var i = p.lastIndexOf("/");
    return i === -1 ? "" : p.slice(0, i + 1);
  }

  /* ---------- finding the same element inside the saved file ---------- */
  function pathOf(el) {
    var parts = [], n = el;
    while (n && n.parentElement) {
      parts.unshift(Array.prototype.indexOf.call(n.parentElement.children, n));
      n = n.parentElement;
    }
    return parts.join(",");
  }
  function atPath(doc, path) {
    var n = doc.documentElement;
    var bits = path.split(",");
    for (var i = 0; i < bits.length; i++) {
      if (!n) return null;
      n = n.children[Number(bits[i])];
    }
    return n || null;
  }

  /* ---------- make the page editable ---------- */
  function makeEditable() {
    // 1. ordinary blocks of text: headings, paragraphs, list items, table cells
    Array.prototype.slice.call(document.querySelectorAll(EDITABLE)).forEach(function (el) {
      if (el.querySelector(EDITABLE)) return;          // only the innermost piece of text
      mark(el);
    });

    // 2. small bold or plain labels that sit on their own, such as the title
    //    line of each of the Five Agreements
    Array.prototype.slice.call(document.querySelectorAll("strong,b,span,small,em")).forEach(function (el) {
      if (el.children.length) return;                  // plain text only
      if (el.closest(".vk-editable")) return;          // already part of a bigger block
      mark(el);
    });

    // 3. photo slots
    Array.prototype.slice.call(document.querySelectorAll(PHOTO)).forEach(function (el) {
      if (el.closest(LOCKED)) return;
      if (el.closest("#vk-edit-bar")) return;
      // never offer to overwrite something that is not a photo slot, such as
      // the Google map or the drawn illustrations
      if (el.tagName !== "IMG") {
        if (el.querySelector("iframe,video,svg,form,a")) return;
        var odd = Array.prototype.slice.call(el.children).some(function (c) {
          return ["SPAN", "IMG", "BR"].indexOf(c.tagName) === -1;
        });
        if (odd) return;
      }
      el.classList.add("vk-photo");
      el.title = "Click to choose a photo";
      el.addEventListener("click", function (e) {
        e.preventDefault();
        pickPhoto(el);
      });
    });
  }

  /* make one thing on the page clickable and typeable */
  function mark(el) {
    if (el.closest(LOCKED) || el.closest("#vk-edit-bar")) return;
    if (el.classList.contains("vk-editable")) return;
    if (!el.textContent.trim()) return;
    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "true");
    el.classList.add("vk-editable");
    el.addEventListener("input", function () {
      el.classList.add("vk-changed");
      record(el);
      refresh();
    });
    // pasting keeps plain text, so Word formatting never leaks in
    el.addEventListener("paste", function (e) {
      e.preventDefault();
      var text = (e.clipboardData || window.clipboardData).getData("text/plain");
      document.execCommand("insertText", false, text);
    });
  }

  function record(el) {
    var path = pathOf(el);
    var entry = changes[path] || (changes[path] = {});
    entry.html = clean(el.innerHTML);
    // the four big numbers on the home page animate; keep their data in step
    if (el.hasAttribute("data-count")) {
      var txt = el.textContent.trim();
      var digits = txt.replace(/[^0-9]/g, "");
      if (digits) {
        entry.attrs = entry.attrs || {};
        entry.attrs["data-count"] = digits;
        entry.attrs["data-suffix"] = txt.slice(txt.lastIndexOf(digits.slice(-1)) + 1);
        entry.attrs["data-prefix"] = txt.slice(0, txt.indexOf(digits[0]));
      }
    }
  }

  /* strip editing leftovers and pasted styling */
  function clean(html) {
    var box = document.createElement("div");
    box.innerHTML = html;
    Array.prototype.slice.call(box.querySelectorAll("*")).forEach(function (n) {
      n.removeAttribute("style");
      n.removeAttribute("contenteditable");
      n.removeAttribute("spellcheck");
      n.classList.remove("vk-editable", "vk-changed", "vk-photo");
      if (n.classList.length === 0) n.removeAttribute("class");
      if (n.tagName === "SPAN" && n.attributes.length === 0) n.replaceWith.apply(n, n.childNodes);
    });
    return box.innerHTML.replace(/ /g, " ").trim();
  }

  /* ---------- photos ---------- */
  function pickPhoto(el) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", function () {
      var file = input.files && input.files[0];
      if (!file) return;
      if (file.size > 9 * 1024 * 1024) {
        say("That photo is larger than 9 MB. Please use a smaller one.", true);
        return;
      }
      var name = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
      var url = URL.createObjectURL(file);
      var isImg = el.tagName === "IMG";
      if (isImg) {
        el.src = url;
        changes[pathOf(el)] = changes[pathOf(el)] || {};
      } else {
        el.innerHTML = '<img src="' + url + '" alt="">';
        el.classList.add("vk-has-photo");
      }
      el.classList.add("vk-changed");
      uploads.push({ file: file, name: name, path: pathOf(el), mode: isImg ? "src" : "html" });
      refresh();
    });
    input.click();
  }

  /* ---------- the bar at the bottom ---------- */
  function buildBar() {
    bar = document.createElement("div");
    bar.id = "vk-edit-bar";
    bar.innerHTML =
      '<div class="vk-left">' +
        '<strong>Editing this page</strong>' +
        '<span class="vk-hint">Click any text and type. Click a photo to replace it.</span>' +
      '</div>' +
      '<div class="vk-status" id="vk-status"></div>' +
      '<div class="vk-right">' +
        '<button type="button" id="vk-save">Save changes</button>' +
        '<button type="button" id="vk-undo" class="vk-ghost">Undo all</button>' +
        '<button type="button" id="vk-exit" class="vk-ghost">Done</button>' +
      '</div>';
    document.body.appendChild(bar);
    statusEl = bar.querySelector("#vk-status");

    bar.querySelector("#vk-save").addEventListener("click", save);
    bar.querySelector("#vk-undo").addEventListener("click", function () {
      if (dirty() && !confirm("Throw away the changes you just made on this page?")) return;
      changes = {}; uploads = [];
      location.reload();
    });
    bar.querySelector("#vk-exit").addEventListener("click", function () {
      if (dirty() && !confirm("You have unsaved changes. Leave edit mode anyway?")) return;
      sessionStorage.removeItem(MODE_KEY);
      changes = {}; uploads = [];
      location.href = location.pathname;
    });
    refresh();
  }

  function dirty() { return Object.keys(changes).length > 0 || uploads.length > 0; }

  function refresh() {
    var n = Object.keys(changes).length;
    var p = uploads.length;
    var msg = [];
    if (n) msg.push(n + (n === 1 ? " change" : " changes"));
    if (p) msg.push(p + (p === 1 ? " photo" : " photos"));
    say(msg.length ? msg.join(", ") + " not saved yet" : "No changes yet");
    bar.querySelector("#vk-save").disabled = !dirty();
  }

  function say(text, bad) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = "vk-status" + (bad ? " vk-bad" : "");
  }

  /* ---------- the access key ---------- */
  function token() { return localStorage.getItem(TOKEN_KEY) || ""; }

  function askForToken() {
    var t = prompt(
      "Paste the website access key.\n\n" +
      "You only do this once on this computer. The README explains how to " +
      "create one (GitHub, Settings, Developer settings, Fine-grained tokens)."
    );
    if (t) {
      localStorage.setItem(TOKEN_KEY, t.trim());
      return t.trim();
    }
    return "";
  }

  /* ---------- talking to GitHub ---------- */
  function api(path, options) {
    var url = "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + path;
    options = options || {};
    options.headers = {
      Authorization: "Bearer " + token(),
      Accept: "application/vnd.github+json"
    };
    return fetch(url, options);
  }

  function decode(b64) {
    var bin = atob(b64.replace(/\n/g, ""));
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }
  function encode(text) {
    var bytes = new TextEncoder().encode(text);
    var bin = "";
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result).split(",")[1]); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  /* ---------- saving ---------- */
  async function save() {
    if (!token() && !askForToken()) return;
    var btn = bar.querySelector("#vk-save");
    btn.disabled = true;
    try {
      // 1. send any new photos first, then point the page at them
      for (var i = 0; i < uploads.length; i++) {
        var up = uploads[i];
        say("Uploading photo " + (i + 1) + " of " + uploads.length + "…");
        var target = folder() + "images/" + up.name;
        var existing = await api(target + "?ref=" + BRANCH);
        var sha = existing.ok ? (await existing.json()).sha : undefined;
        var put = await api(target, {
          method: "PUT",
          body: JSON.stringify({
            message: "Add photo " + up.name + " (edited on the website)",
            content: await fileToBase64(up.file),
            branch: BRANCH,
            sha: sha
          })
        });
        if (!put.ok) throw new Error(await message(put));
        var rel = "images/" + up.name;
        changes[up.path] = changes[up.path] || {};
        if (up.mode === "src") {
          changes[up.path].attrs = changes[up.path].attrs || {};
          changes[up.path].attrs.src = rel;
        } else {
          changes[up.path].html = '<img src="' + rel + '" alt="">';
        }
      }
      uploads = [];

      // 2. fetch this page's file, apply the edits, send it back
      say("Saving the page…");
      var path = repoPath();
      var got = await api(path + "?ref=" + BRANCH);
      if (!got.ok) throw new Error(await message(got));
      var info = await got.json();
      var source = decode(info.content);

      var out = applyEdits(source, changes);
      var sent = await api(path, {
        method: "PUT",
        body: JSON.stringify({
          message: "Edit " + path + " on the website",
          content: encode(out),
          sha: info.sha,
          branch: BRANCH
        })
      });
      if (!sent.ok) throw new Error(await message(sent));

      changes = {};
      document.querySelectorAll(".vk-changed").forEach(function (el) {
        el.classList.remove("vk-changed");
      });
      say("Saved. The live website updates in about a minute.");
    } catch (err) {
      say(String(err.message || err), true);
    } finally {
      btn.disabled = !dirty();
    }
  }

  /* ----------------------------------------------------------------------
     Putting the edits back into the file.

     The file is changed a piece at a time instead of being rewritten, so the
     saved file still looks exactly like the one a person wrote by hand — only
     the words that were edited change. Nothing is reformatted.
     ---------------------------------------------------------------------- */
  function applyEdits(source, edits) {
    var doc = new DOMParser().parseFromString(source, "text/html");
    var skip = maskedParts(source);   // comments and scripts are left alone
    var jobs = [];

    Object.keys(edits).forEach(function (p) {
      var el = atPath(doc, p);
      if (!el) throw new Error("This page changed since you opened it. Reload the page and edit again.");
      var tag = el.tagName.toLowerCase();
      var sameTag = Array.prototype.indexOf.call(doc.getElementsByTagName(tag), el);
      var open = nthTag(source, tag, sameTag, skip);
      if (open === -1) throw new Error("Could not find that text in the saved file. Reload and try again.");
      var openEnd = endOfTag(source, open);
      if (openEnd === -1) throw new Error("The saved file looks damaged near that text.");

      var c = edits[p];
      if (c.attrs) {
        Object.keys(c.attrs).forEach(function (a) {
          if (c.attrs[a] === "") el.removeAttribute(a);
          else el.setAttribute(a, c.attrs[a]);
        });
        var html = el.outerHTML;
        jobs.push({ start: open, end: openEnd + 1, text: html.slice(0, html.indexOf(">") + 1) });
      }
      if (typeof c.html === "string") {
        var close = closingTag(source, tag, openEnd + 1, skip);
        if (close === -1) throw new Error("The saved file looks damaged near that text.");
        jobs.push({ start: openEnd + 1, end: close, text: c.html });
      }
    });

    jobs.sort(function (a, b) { return b.start - a.start; });   // back to front
    var out = source;
    jobs.forEach(function (j) { out = out.slice(0, j.start) + j.text + out.slice(j.end); });
    return out;
  }

  function maskedParts(src) {
    var ranges = [];
    var re = /<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi, m;
    while ((m = re.exec(src))) ranges.push([m.index, m.index + m[0].length]);
    return ranges;
  }
  function masked(ranges, pos) {
    for (var i = 0; i < ranges.length; i++) {
      if (pos >= ranges[i][0] && pos < ranges[i][1]) return true;
    }
    return false;
  }
  function nthTag(src, tag, n, skip) {
    var re = new RegExp("<" + tag + "(?=[\\s/>])", "gi"), m, seen = -1;
    while ((m = re.exec(src))) {
      if (masked(skip, m.index)) continue;
      seen++;
      if (seen === n) return m.index;
    }
    return -1;
  }
  function endOfTag(src, start) {
    var quote = null;
    for (var i = start; i < src.length; i++) {
      var ch = src.charAt(i);
      if (quote) { if (ch === quote) quote = null; }
      else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === ">") return i;
    }
    return -1;
  }
  function closingTag(src, tag, from, skip) {
    var re = new RegExp("<" + tag + "(?=[\\s/>])|</" + tag + "\\s*>", "gi");
    re.lastIndex = from;
    var depth = 1, m;
    while ((m = re.exec(src))) {
      if (masked(skip, m.index)) continue;
      if (m[0].charAt(1) === "/") { depth--; if (depth === 0) return m.index; }
      else depth++;
    }
    return -1;
  }

  async function message(res) {
    var text = "";
    try { text = (await res.json()).message || ""; } catch (e) {}
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem(TOKEN_KEY);
      return "The access key was refused. Press Save again and paste a new key.";
    }
    if (res.status === 409) return "Someone else saved this page first. Reload and redo your change.";
    if (res.status === 404) return "Could not find this page in the website's files.";
    return text || ("Save failed (" + res.status + ").");
  }

  /* ---------- look of the editing bar ---------- */
  function injectStyles() {
    var css = document.createElement("style");
    css.textContent =
      "#vk-edit-bar{position:fixed;left:0;right:0;bottom:0;z-index:9999;display:flex;" +
      "align-items:center;gap:18px;flex-wrap:wrap;padding:12px 20px;background:#101826;" +
      "color:#e9eef7;font:500 13px/1.4 Inter,system-ui,sans-serif;" +
      "box-shadow:0 -6px 24px rgba(0,0,0,.28)}" +
      "#vk-edit-bar .vk-left{display:flex;flex-direction:column}" +
      "#vk-edit-bar strong{font-size:13px;letter-spacing:.04em;text-transform:uppercase}" +
      "#vk-edit-bar .vk-hint{color:#9fb0cb;font-size:12px}" +
      "#vk-edit-bar .vk-status{flex:1;color:#9fb0cb;font-size:12.5px}" +
      "#vk-edit-bar .vk-status.vk-bad{color:#ffb4a8}" +
      "#vk-edit-bar .vk-right{display:flex;gap:10px;margin-left:auto}" +
      "#vk-edit-bar button{font:600 12.5px Inter,system-ui,sans-serif;border:0;border-radius:3px;" +
      "padding:9px 16px;background:#0372ba;color:#fff;cursor:pointer}" +
      "#vk-edit-bar button:disabled{opacity:.45;cursor:default}" +
      "#vk-edit-bar .vk-ghost{background:transparent;border:1px solid rgba(255,255,255,.28);color:#cfd9ea}" +
      "body{padding-bottom:84px}" +
      ".vk-editable:hover{outline:2px dashed rgba(3,114,186,.75);outline-offset:3px;cursor:text}" +
      ".vk-editable:focus{outline:2px solid #0372ba;outline-offset:3px}" +
      ".vk-photo{cursor:pointer}" +
      ".vk-photo:hover{outline:2px dashed rgba(3,114,186,.75);outline-offset:3px}" +
      ".vk-changed{background:rgba(3,114,186,.10)}" +
      ".vk-has-photo{background:none!important}" +
      ".vk-has-photo span{display:none}";
    document.head.appendChild(css);
  }

  /* exposed so a future developer can inspect what is pending */
  window.VKEdit = {
    changes: function () { return changes; },
    pathOf: pathOf, atPath: atPath, applyEdits: applyEdits
  };
})();
