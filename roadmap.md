# UDVIJ Website + Distribution Admin Panel — Task Roadmap

Client: UDVIJ INDUSTRIES PVT LTD (premium mineral water manufacturer & distributor)
Stack: React + Vite + Tailwind CSS only. No backend, no UI libraries, no animation libs. Mock data + local state only.

## Done
- [x] Brand imagery generated (hero banner, bottle cutout, 6 product shots, 6 gallery photos)
- [x] Design system tokens in src/styles.css (UDVIJ palette, glass, gradients, CSS animations)
- [x] Mock data files (products, routes, dealers, orders, drivers, tempos, notifications, testimonials, gallery, users, registrations, banners)
- [x] Shared app state (AppProvider store + reducer actions + local state)
- [x] Public layout (Navbar with logo/links, Footer with Admin Login -> /admin)
- [x] Homepage (Hero, About, Manufacturing Process, Why Choose Us, Products, Route Network, Dealer Benefits, Testimonials, Gallery, Contact)
- [x] Public pages: /about, /products, /dealer-network (registration form), /routes, /why-choose-us, /gallery, /contact, /privacy, /terms
- [x] Admin auth (mock login admin/admin123, session remembered in localStorage)
- [x] Admin layout (sidebar + topbar with unread badge, mobile drawer)
- [x] Dashboard with CSS charts, Route Analytics (highest demand + demand groups), Tempo Recommendation with Dispatch action, Notifications
- [x] Admin modules: Orders (filters + status flow + add order), Routes (CRUD + performance), Dealers (CRUD + registrations), Products (CRUD), Drivers (CRUD), Tempo (CRUD + assignment notifications), Notifications (filter/read/delete), Gallery (CRUD), Testimonials (CRUD), Banner Manager (active slide), Contact Messages (read/delete), Website Settings, Reports (revenue by product, status counts, route performance)
- [x] Route-level head() metadata on all pages
- [x] Analytics unit tests (demand classification, highest-demand route, revenue) + routing test
- [x] Verified build, typecheck, tests and end-to-end preview check (login, wrong-password error, dispatch, sections, public site)
