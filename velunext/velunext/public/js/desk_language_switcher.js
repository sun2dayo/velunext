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
(function () {
	// Only assigned where a language maps to one clearly uncontroversial
	// sovereign country, or where Frappe's own label already names one
	// explicitly (the "(Country)" variants). Left as a neutral globe for
	// stateless/regional languages (Catalan, Kurdish, Tibetan) and for
	// "eo", which Frappe repurposes as its in-context translation tool
	// rather than actual Esperanto — picking a flag for any of those
	// would be a political statement this theme has no business making.
	const FLAGS = {
		af: "🇿🇦",
		am: "🇪🇹",
		ar: "🇸🇦",
		bg: "🇧🇬",
		bn: "🇧🇩",
		bo: "🌐",
		bs: "🇧🇦",
		ca: "🌐",
		cs: "🇨🇿",
		da: "🇩🇰",
		de: "🇩🇪",
		el: "🇬🇷",
		en: "🇬🇧",
		"en-GB": "🇬🇧",
		"en-US": "🇺🇸",
		eo: "🌐",
		es: "🇪🇸",
		"es-AR": "🇦🇷",
		"es-BO": "🇧🇴",
		"es-CL": "🇨🇱",
		"es-CO": "🇨🇴",
		"es-DO": "🇩🇴",
		"es-EC": "🇪🇨",
		"es-GT": "🇬🇹",
		"es-MX": "🇲🇽",
		"es-NI": "🇳🇮",
		"es-PE": "🇵🇪",
		et: "🇪🇪",
		fa: "🇮🇷",
		fi: "🇫🇮",
		fil: "🇵🇭",
		fr: "🇫🇷",
		gu: "🇮🇳",
		he: "🇮🇱",
		hi: "🇮🇳",
		hr: "🇭🇷",
		hu: "🇭🇺",
		id: "🇮🇩",
		is: "🇮🇸",
		it: "🇮🇹",
		ja: "🇯🇵",
		km: "🇰🇭",
		kn: "🇮🇳",
		ko: "🇰🇷",
		ku: "🌐",
		lo: "🇱🇦",
		lt: "🇱🇹",
		lv: "🇱🇻",
		mk: "🇲🇰",
		ml: "🇮🇳",
		mn: "🇲🇳",
		mr: "🇮🇳",
		ms: "🇲🇾",
		my: "🇲🇲",
		nb: "🇳🇴",
		nl: "🇳🇱",
		no: "🇳🇴",
		pl: "🇵🇱",
		ps: "🇦🇫",
		pt: "🇵🇹",
		"pt-BR": "🇧🇷",
		ro: "🇷🇴",
		ru: "🇷🇺",
		rw: "🇷🇼",
		si: "🇱🇰",
		sk: "🇸🇰",
		sl: "🇸🇮",
		sq: "🇦🇱",
		sr: "🇷🇸",
		"sr-CS": "🇷🇸",
		sv: "🇸🇪",
		sw: "🇹🇿",
		ta: "🇮🇳",
		te: "🇮🇳",
		th: "🇹🇭",
		tr: "🇹🇷",
		uk: "🇺🇦",
		ur: "🇵🇰",
		uz: "🇺🇿",
		vi: "🇻🇳",
		zh: "🇨🇳",
		"zh-TW": "🇹🇼",
	};

	function flag_for(lang_code) {
		return FLAGS[lang_code] || "🌐";
	}

	function current_language() {
		return frappe.boot.lang || "en";
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
		frappe.get_languages().forEach((lang) => {
			const item = document.createElement("a");
			item.className = "dropdown-item velunext-language-item";
			if (lang.value === selected) item.classList.add("is-selected");
			item.href = "#";
			item.dataset.lang = lang.value;
			item.innerHTML =
				'<span class="velunext-language-flag">' +
				flag_for(lang.value) +
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
			'"><span class="velunext-language-flag">' +
			flag_for(selected) +
			'</span></button>' +
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
