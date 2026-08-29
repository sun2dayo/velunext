// VeluNext — Desk navbar language switcher
//
// Copyright (c) 2026, NovaDX <ola@novadx.pt>
// Licensed under the MIT License.
//
// Frappe already ships a native language picker, but it only ever
// shows for a Guest on public/login pages (Website Settings >
// "Show Language Picker" gates frappe.show_language_picker(), which
// itself is hard-coded to `frappe.session.user === "Guest"` — see
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
(function () {
	function current_language() {
		return frappe.boot.lang || "en";
	}

	function build_options(select, selected) {
		frappe.get_languages().forEach((lang) => {
			const option = document.createElement("option");
			option.value = lang.value;
			option.textContent = lang.label;
			if (lang.value === selected) option.selected = true;
			select.appendChild(option);
		});
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

	function inject_switcher() {
		if (document.querySelector(".velunext-language-switcher")) return;
		// .desktop-notifications is the bell icon's own wrapper inside the
		// navbar's right-hand icon group (header.desktop-navbar > .flex) —
		// confirmed live via the real Desk DOM, not assumed. Inserted right
		// before it so the switcher sits in that same icon row, ahead of
		// notifications/avatar, matching where other themes place theirs.
		const notifications = document.querySelector(".desktop-notifications");
		if (!notifications || !notifications.parentElement) return;

		const wrapper = document.createElement("div");
		wrapper.className = "velunext-language-switcher";

		const select = document.createElement("select");
		select.className = "velunext-language-select";
		select.setAttribute("aria-label", __("Change language"));
		build_options(select, current_language());

		select.addEventListener("change", () => switch_language(select.value));

		wrapper.appendChild(select);
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
