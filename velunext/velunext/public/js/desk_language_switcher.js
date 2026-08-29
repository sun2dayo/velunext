// VeluNext — Desk navbar language switcher
//
// Copyright (c) 2026, NovaDX <ola@novadx.pt>
// Licensed under the MIT License.
//
// Frappe already ships a language picker, but it only ever shows for a
// Guest on public/login pages (Website Settings > "Show Language
// Picker" gates frappe.show_language_picker(), which itself is hard-
// coded to `frappe.session.user === "Guest"` — see
// frappe/website/js/website.js). There is no equivalent for a logged-
// in Desk user; requested after seeing other commercial themes put one
// in the Desk navbar itself.
//
// Rather than build a new persistence mechanism, this reuses the
// EXACT same one Frappe's own "My Settings" dialog already uses: the
// User doctype's "language" field. Every user already has permission
// to edit their own User record's language (confirmed: this is how
// My Settings > Language has always worked, with no special role
// needed) — so frappe.client.set_value here is not a new capability,
// just a faster path to a save that was already possible in two more
// clicks.
//
// First version used a plain native <select>. Dropped after user
// feedback: a native <select>'s OPEN option list is rendered by the
// OS/browser, not the page — its hover/selected highlight colour is
// NOT overridable via CSS in any mainstream browser, so it always
// showed the platform's default blue regardless of this theme's
// purple. Rebuilt using the exact same Bootstrap dropdown pattern
// Frappe's own navbar already uses for notifications/avatar (confirmed
// live: <div class="dropdown"><button data-toggle="dropdown">...
// <div class="dropdown-menu">) — a real DOM menu, not a native widget,
// so every state is a plain CSS rule, and it gets Bootstrap's existing
// open/close/outside-click/Escape handling for free (already loaded
// globally, nothing new to wire up).
//
// Second version added Unicode flag emoji per language. Dropped after
// user feedback (confirmed on their own Windows machine): several
// flag emoji don't have a colour glyph in Windows' emoji font and
// render as plain two-letter text instead of a flag image — a real
// OS/font limitation, not something fixable from CSS/HTML. Rather than
// hand-building ~80 flag SVGs (no reliable source to verify each one
// against in this environment, and a real accuracy/maintenance risk),
// switched to showing the language CODE itself in a small badge — it
// renders identically everywhere with zero font dependency, and is a
// pattern plenty of real products already use for exactly this reason.
(function () {
	function current_language() {
		return frappe.boot.lang || "en";
	}

	function label_for(lang_code) {
		const match = selectable_languages().find((lang) => lang.value === lang_code);
		return match ? match.label : lang_code;
	}

	// "eo" is listed by frappe.get_languages() as "In-Context
	// Translation", but it is NOT a real display language: confirmed
	// live (and in frappe/www/desk.html's own source) that setting the
	// user's language to "eo" makes the Desk template inject Crowdin's
	// JIPT script and _jipt project config — Frappe's own maintainers'
	// tool for crowd-translating the frappe/frappe project on Crowdin,
	// completely unrelated to this customer's ERPNext instance. Picking
	// it here hijacked the whole page with a Crowdin login modal instead
	// of changing anything — excluded from the selectable list entirely.
	function selectable_languages() {
		return frappe.get_languages().filter((lang) => lang.value !== "eo");
	}

	function switch_language(lang_code) {
		frappe.dom.freeze();
		frappe
			.call({
				method: "frappe.client.set_value",
				args: {
					doctype: "User",
					name: frappe.session.user,
					fieldname: "language",
					value: lang_code,
				},
			})
			.then(() => window.location.reload())
			.catch(() => frappe.dom.unfreeze());
	}

	function build_menu(container, selected) {
		selectable_languages().forEach((lang) => {
			const item = document.createElement("a");
			item.className = "dropdown-item velunext-language-item";
			if (lang.value === selected) item.classList.add("is-selected");
			item.href = "#";
			item.dataset.lang = lang.value;
			item.innerHTML =
				'<span class="velunext-language-code">' +
				frappe.utils.escape_html(lang.value.toUpperCase()) +
				"</span><span>" +
				frappe.utils.escape_html(lang.label) +
				"</span>";
			item.addEventListener("click", (e) => {
				e.preventDefault();
				switch_language(lang.value);
			});
			container.appendChild(item);
		});
	}

	function inject_switcher() {
		if (document.querySelector(".velunext-language-switcher")) return;
		// .desktop-notifications is the bell icon's own wrapper inside the
		// navbar's right-hand icon group (header.desktop-navbar > .flex) —
		// confirmed live via the real Desk DOM, not assumed. Inserted right
		// before it so the switcher sits in that same icon row, ahead of
		// notifications/avatar, matching where other themes place theirs.
		const notifications = document.querySelector(".desktop-notifications");
		if (!notifications || !notifications.parentElement) return;

		const selected = current_language();

		const wrapper = document.createElement("div");
		wrapper.className = "dropdown velunext-language-switcher";
		wrapper.innerHTML =
			'<button type="button" class="btn-reset nav-link text-muted velunext-language-btn" ' +
			'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" aria-label="' +
			__("Change language") +
			'"><span class="velunext-language-code">' +
			frappe.utils.escape_html(selected.toUpperCase()) +
			'</span><span class="velunext-language-label">' +
			frappe.utils.escape_html(label_for(selected)) +
			'</span><svg class="icon icon-xs velunext-language-caret"><use href="#icon-chevron-down"></use></svg></button>' +
			'<div class="dropdown-menu dropdown-menu-right velunext-language-menu" role="menu"></div>';

		build_menu(wrapper.querySelector(".velunext-language-menu"), selected);
		notifications.parentElement.insertBefore(wrapper, notifications);
	}

	// frappe.ready does not exist in this Frappe version (confirmed
	// live: calling it throws "frappe.ready is not a function") — and
	// since app_include_js concatenates every imported module into one
	// script, an uncaught exception here would abort every module after
	// this one in the bundle, not just this file. Call directly in case
	// the navbar is already in the DOM, then let the observer below
	// catch it otherwise/on future re-renders — no dependency on an API
	// that may not exist.
	inject_switcher();

	new MutationObserver(inject_switcher).observe(document.body, {
		childList: true,
		subtree: true,
	});
})();
