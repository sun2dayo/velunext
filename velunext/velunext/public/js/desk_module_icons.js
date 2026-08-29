// VeluNext — Desk home/module grid icons (icon-only, no background)
//
// Copyright (c) 2026, NovaDX <ola@novadx.pt>
// Licensed under the MIT License.
//
// Experiment requested for the Desk "Início" module grid: instead of
// a solid accent-coloured square with a white glyph on top, show just
// the purple glyph with no background, and reveal the coloured square
// only on hover (see modern_desk_sidebar.scss for the hover flip).
//
// ERPNext's own module icons (assets/erpnext/icons/desktop_icons/
// solid/*.svg) bake the coloured square AND the white glyph into a
// single flat image — a CSS filter on the <img> can only recolour the
// whole flat image at once (confirmed: that's what the pre-existing
// hue-rotate filter already did), it can't strip just one shape and
// keep the other. So the actual pixels have to come from a different
// file: modern_desk_sidebar.scss's own image folder ships a
// background-stripped, pre-recoloured copy of each of the 22 solid
// icons (generated once from the original files — same filenames, so
// a plain basename swap below is all that's needed). Anything NOT in
// that set (a future ERPNext icon, or another installed app's own
// module icon) is left completely alone rather than guessed at.
(function () {
	const SOURCE_PREFIX = "/assets/erpnext/icons/desktop_icons/solid/";
	const REPLACEMENT_PREFIX = "/assets/velunext/images/desktop_icons_line/";
	// These SVGs are served as plain static files, not through the
	// content-hashed bundle pipeline — confirmed live (curl -I) they
	// carry `Cache-Control: max-age=31536000` (1 year), same raw-asset
	// caching behaviour already hit once before in this project. Fixing
	// taxes.svg on the server alone left every browser that had already
	// loaded the old broken copy stuck showing it for up to a year,
	// since the URL never changed. A cache-busting query string is the
	// fix — bump ASSET_VERSION any time a file in desktop_icons_line/
	// (or accounting.svg) changes again.
	const ASSET_VERSION = "2";

	function versioned(path) {
		return REPLACEMENT_PREFIX + path + "?v=" + ASSET_VERSION;
	}

	function relink_icons() {
		document.querySelectorAll(".desktop-icon .icon-container img.app-icon").forEach((img) => {
			const src = img.getAttribute("src") || "";
			if (!src.startsWith(SOURCE_PREFIX)) return;
			const replacement = versioned(src.slice(SOURCE_PREFIX.length));
			if (img.dataset.velunextRelinked === replacement) return;
			img.src = replacement;
			img.dataset.velunextRelinked = replacement;
		});
	}

	// The "Accounting" tile has no single dedicated icon of its own —
	// confirmed live (and via `bench console`: no "Accounting" Workspace
	// document exists at all) that it's a client-side GROUPING of
	// several sibling workspaces that share the "Accounts" module
	// (Invoicing, Payments, Financial Reports, ...), each with its own
	// icon but none flagged as the group's. With no single icon to show,
	// Frappe falls back to a 2x2 mosaic preview of up to 4 of the
	// group's own children (.icon-container.folder-icon > .icons-container)
	// — confirmed live this is exactly what rendered. Replaced with a
	// single dedicated glyph instead (a ledger/ruled-book icon, reused
	// from ERPNext's OWN "subtle" icon set rather than invented from
	// scratch) so it reads as one deliberate module icon like every
	// sibling tile, not a busy 4-way preview grid.
	function replace_accounting_mosaic() {
		const folder = document.querySelector('.desktop-icon[data-id="Accounting"] .icon-container.folder-icon');
		if (!folder || folder.dataset.velunextReplaced) return;
		folder.dataset.velunextReplaced = "true";
		folder.classList.remove("folder-icon");
		folder.innerHTML =
			'<img class="app-icon" src="' + versioned("accounting.svg") + '" alt="Accounting">';
	}

	function run() {
		relink_icons();
		replace_accounting_mosaic();
	}

	run();

	new MutationObserver(run).observe(document.body, {
		childList: true,
		subtree: true,
	});
})();
