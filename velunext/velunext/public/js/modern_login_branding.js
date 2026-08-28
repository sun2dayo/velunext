// VeluNext — login page branding ("Powered by NovaDX" credit)
//
// Copyright (c) 2026, NovaDX <ola@novadx.pt>
// Licensed under the MIT License.
//
// Public web-page script (web_include_js) — runs on every website page,
// but only does anything on pages that actually render a .login-content
// card (login/signup/forgot-password).
//
// Favicon is NOT handled here. It used to be: this script replaced
// <link rel="icon"/"shortcut icon"> client-side, which only ever ran
// on public web pages (web_include_js doesn't load on /desk at all —
// confirmed the tab icon stayed native there). Frappe already has a
// proper mechanism that covers both: desk.html and templates/base.html
// both render the SAME `favicon` context variable, sourced from
// Website Settings.favicon. Set once there
// (Website Settings > favicon = /assets/velunext/images/X_Overlay.png)
// it's server-rendered on every page, desk included, with no
// client-side flash of the native icon first.
(function () {
	const LOGO_URL = "/assets/velunext/images/X_Overlay.png";

	function add_login_footer() {
		const card = document.querySelector(".login-content");
		if (!card || card.querySelector(".novadx-login-footer")) return;

		const footer = document.createElement("div");
		footer.className = "novadx-login-footer";

		const img = document.createElement("img");
		img.src = LOGO_URL;
		img.alt = "NovaDX";
		img.width = 16;
		img.height = 16;

		const link = document.createElement("a");
		link.href = "https://novadx.pt";
		link.target = "_blank";
		link.rel = "noopener";
		link.textContent = "Powered by NovaDX";

		footer.appendChild(img);
		footer.appendChild(link);
		card.appendChild(footer);
	}

	function init() {
		add_login_footer();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
