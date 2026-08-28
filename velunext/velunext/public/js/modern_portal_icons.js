// VeluNext — Customer Portal sidebar icons
//
// Copyright (c) 2026, NovaDX <ola@novadx.pt>
// Licensed under the MIT License.
//
// Prepends a native Frappe SVG icon to each .web-sidebar link, mapped
// by route. Web pages load 3 icon sprites (frappe/hooks.py's
// web_include_icons: lucide, timeless, espresso — erpnext adds its own
// pos-icons.svg), all merged server-side into one #all-symbols pool,
// so any id from any of them works via <use href="#id">. Verified each
// id below actually exists in one of those files before using it —
// several ids implied by the original brief (icon-bill, icon-location,
// icon-dot, icon-document) don't exist in any of them.
(function () {
	// Routes taken from erpnext/hooks.py's standard_portal_menu_items —
	// several routes in the original brief didn't match reality either
	// (it's /project not /projects, /issues not /tickets).
	const ROUTE_ICONS = {
		"/project": "icon-project",
		"/rfq": "icon-file-text",
		"/supplier-quotations": "icon-file-text",
		"/purchase-orders": "icon-shopping-cart",
		"/purchase-invoices": "icon-receipt",
		"/quotations": "icon-file-text",
		"/orders": "icon-shopping-bag",
		"/invoices": "icon-receipt",
		"/shipments": "icon-truck",
		"/issues": "icon-ticket",
		"/addresses": "icon-map-pin",
		"/timesheets": "icon-clock",
		"/newsletters": "icon-mail",
		"/material-requests": "icon-clipboard-list",
		"/book_appointment": "icon-calendar-clock",
		"/me": "icon-user",
	};
	// Generic fallback for anything not in the map above — other
	// installed apps (e.g. portugal_compliance) add their own portal
	// menu items this script has no way to know about in advance.
	const DEFAULT_ICON = "icon-primitive-dot";

	function icon_id_for(href) {
		let pathname;
		try {
			pathname = new URL(href, window.location.origin).pathname;
		} catch (e) {
			return DEFAULT_ICON;
		}
		if (pathname.length > 1 && pathname.endsWith("/")) {
			pathname = pathname.slice(0, -1);
		}
		return ROUTE_ICONS[pathname] || DEFAULT_ICON;
	}

	// .web-sidebar .sidebar-item a is the desktop sidebar
	// (templates/includes/web_sidebar.html, inside .sidebar-column,
	// which is display:none on mobile — confirmed live).
	// .d-block.d-lg-none .nav-item a.nav-link is a SEPARATE, THIRD
	// render of the exact same sidebar_items list, specifically for the
	// collapsed mobile nav (templates/includes/navbar/navbar_items.html:
	// `{% if show_sidebar and sidebar_items %}<div class="d-block
	// d-lg-none">...<a class="nav-link ...">`) — a different template
	// entirely, using Bootstrap's own nav classes instead of
	// .sidebar-item/.web-sidebar. Confirmed live: without this second
	// selector, icons only ever appeared on desktop; the mobile menu
	// (which is what's actually visible below the lg breakpoint) had
	// none at all, because this script never even queried it.
	const SIDEBAR_LINK_SELECTOR =
		".web-sidebar .sidebar-item a, .d-block.d-lg-none .nav-item a.nav-link";

	function add_sidebar_icons() {
		document.querySelectorAll(SIDEBAR_LINK_SELECTOR).forEach((link) => {
			const href = link.getAttribute("href");
			if (!href || link.querySelector(".icon")) return;
			const icon_id = icon_id_for(href);
			link.insertAdjacentHTML(
				"afterbegin",
				`<svg class="icon icon-md"><use href="#${icon_id}"></use></svg>`
			);
		});
	}

	function init() {
		if (!document.querySelector(SIDEBAR_LINK_SELECTOR)) return;
		add_sidebar_icons();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
