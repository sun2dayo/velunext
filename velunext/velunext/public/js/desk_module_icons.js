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

	function relink_icons() {
		document.querySelectorAll(".desktop-icon .icon-container img.app-icon").forEach((img) => {
			const src = img.getAttribute("src") || "";
			if (!src.startsWith(SOURCE_PREFIX)) return;
			const replacement = REPLACEMENT_PREFIX + src.slice(SOURCE_PREFIX.length);
			if (img.dataset.velunextRelinked === replacement) return;
			img.src = replacement;
			img.dataset.velunextRelinked = replacement;
		});
	}

	relink_icons();

	new MutationObserver(relink_icons).observe(document.body, {
		childList: true,
		subtree: true,
	});
})();
