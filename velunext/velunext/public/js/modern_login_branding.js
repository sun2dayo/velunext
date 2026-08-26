// VeluNext — login page branding (favicon + "Powered by NovaDX" credit)
//
// Copyright (c) 2026, NovaDX <ola@novadx.pt>
// Licensed under the MIT License.
//
// Public web-page script (web_include_js) — runs on every website page,
// but the footer injection only does anything on pages that actually
// render a .login-content card (login/signup/forgot-password).
(function () {
	const LOGO_URL = "/assets/velunext/images/X_Overlay.png";

	function set_favicon() {
		const existing = document.querySelectorAll(
			'link[rel="icon"], link[rel="shortcut icon"]'
		);
		if (existing.length) {
			existing.forEach((link) => {
				link.href = LOGO_URL;
			});
			return;
		}
		const link = document.createElement("link");
		link.rel = "shortcut icon";
		link.href = LOGO_URL;
		document.head.appendChild(link);
	}

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
		set_favicon();
		add_login_footer();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
