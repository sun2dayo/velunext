// VeluNext — theme toggle injected at the bottom of the Desk sidebar.
// Drives Frappe's native theme mechanism (data-theme-mode attribute + the
// desk.js MutationObserver + user.switch_theme) instead of a separate
// dark-mode flag, so it stays in sync with the native theme switcher
// (Shift+Ctrl+G) and the preference persists server-side per user.
(function () {
	function current_theme() {
		return document.documentElement.getAttribute("data-theme") || "light";
	}

	function set_icon(knob) {
		knob.innerHTML = frappe.utils.icon(current_theme() === "dark" ? "moon" : "sun", "xs");
	}

	function apply_theme(theme) {
		document.documentElement.setAttribute("data-theme-mode", theme);
		frappe
			.xcall("frappe.core.doctype.user.user.switch_theme", {
				theme: theme === "dark" ? "Dark" : "Light",
			})
			.catch(() => {});
	}

	function inject_toggle() {
		if (document.querySelector(".velunext-theme-toggle-panel")) return;
		const bottom = document.querySelector(".body-sidebar-bottom");
		if (!bottom) return;

		const panel = document.createElement("div");
		panel.className = "velunext-theme-toggle-panel";
		panel.innerHTML =
			'<button type="button" class="velunext-theme-toggle" aria-label="' +
			__("Toggle dark mode") +
			'"><span class="velunext-toggle-knob"></span></button>';
		bottom.insertBefore(panel, bottom.firstChild);

		const knob = panel.querySelector(".velunext-toggle-knob");
		set_icon(knob);

		panel.querySelector(".velunext-theme-toggle").addEventListener("click", () => {
			apply_theme(current_theme() === "dark" ? "light" : "dark");
			set_icon(knob);
		});

		new MutationObserver(() => set_icon(knob)).observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
	}

	new MutationObserver(inject_toggle).observe(document.body, {
		childList: true,
		subtree: true,
	});

	frappe.ready(inject_toggle);
})();
