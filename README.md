# VeluNext

Tema visual moderno para o ERPNext/Frappe — branding, cores, tipografia e micro-interações aplicadas ao Desk, ao ecrã de login e ao Portal de Cliente, mantendo total compatibilidade com o core (nenhum ficheiro nativo do Frappe/ERPNext é alterado).

Desenvolvido pela [NovaDX](https://novadx.pt) para as suas instâncias ERPNext.

**Versão atual:** 1.1.0

## Capturas de ecrã

| | |
|---|---|
| **Login** | **Desk (Início)** |
| ![Login](asset/screenshots/login.png) | ![Desk](asset/screenshots/desk-home.png) |
| **Workspace (Selling)** | **Dashboard (Payments)** |
| ![Selling](asset/screenshots/selling.png) | ![Dashboard](asset/screenshots/dashboard-payments.png) |
| **Modo escuro** | **Sidebar recolhida** |
| ![Dark mode](asset/screenshots/dark-mode.png) | ![Sidebar collapsed](asset/screenshots/sidebar-collapsed.png) |

## Identidade visual

| | |
|---|---|
| Cor primária (roxo) | `#8B5CF6` |
| Cor secundária (âmbar) | `#F59E0B` |

## Funcionalidades

### Desk

- Sidebar, formulários, listas, checkboxes, dashboards e gráficos recoloridos consistentemente para a paleta da marca, sem tocar em ficheiros nativos (tudo via CSS/JS injetados pela app).
- Ícones dos módulos no ecrã "Início" mostrados apenas com a cor da marca (sem fundo), revelando o quadrado sólido + ícone branco ao passar o rato.
- Gráficos de donut/pizza (ex.: *Accounts Receivable Ageing*) com um degradê roxo→âmbar coerente com a marca, mantendo vermelho no escalão mais crítico como sinal de alerta.
- Seletor de idioma na navbar (bandeira/código + nome do idioma), reaproveitando o mecanismo nativo do Frappe (`User.language`) sem introduzir nenhuma capacidade nova.
- Campo de pesquisa da navbar com contorno visível e ícone na cor da marca.
- Alternador de modo claro/escuro persistente por utilizador (mecanismo nativo do Frappe).
- Suporte total ao modo escuro em todos os componentes personalizados.

### Login / Autenticação

- Cartão de login centrado, moderno, com inputs e botões estilizados.
- Favicon e crédito "Theme Powered by NovaDX" (removível, sem qualquer mecanismo de bloqueio ligado à sua presença).

### Portal de Cliente

- Sidebar do portal, cartões de listagem, badges de estado e formulários (ex. criação de ticket) redesenhados.
- Ícones de navegação injetados dinamicamente por rota.
- Rodapé "Theme Powered by NovaDX" nas páginas do portal.

## Instalação

```bash
bench get-app velunext git@github.com:sun2dayo/velunext.git
bench --site <nome-do-site> install-app velunext
bench --site <nome-do-site> clear-cache
bench build --app velunext
```

## Estrutura do projeto

```
velunext/
├── hooks.py                  # app_include_css/js, web_include_css/js
├── public/
│   ├── css/                  # modern_desk_sidebar.scss, modern_login.scss, modern_portal.scss
│   ├── js/                   # theme_toggle.js, desk_language_switcher.js, desk_module_icons.js, ...
│   └── images/               # ícones e assets recoloridos para a marca
├── templates/
└── www/
```

## Desenvolvimento

- Branch de trabalho: `develop`. Alterações só chegam a `main` ao finalizar uma fase de desenvolvimento.
- Sempre que uma cor/ícone nativo é alterado, o objetivo é reaproveitar o mecanismo existente do Frappe (variáveis CSS, `content: url()`, hooks) em vez de patchar ficheiros do core — o que garante que `bench update` nunca desfaz o tema.

## Licença

MIT — ver [license.txt](license.txt).

---

Copyright (c) 2026, [NovaDX](https://novadx.pt) &lt;odaio@novadx.pt&gt;
