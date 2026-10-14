# Cinema Management

A Vietnamese cinema administration demo built with HTML, CSS, and plain JavaScript. It includes movie and genre management, screening schedules, a theater directory, product management, and sample bookings.

The application runs entirely in the browser. There is no backend or database server.

## Run locally

No build step or application dependencies are required. From the project root, start a local web server:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://localhost:8000](http://localhost:8000) and sign in:

| Field | Demo value |
| --- | --- |
| Username | `utcadmin` |
| Password | `12345678` |

Use the root `index.html` as the entry point. Opening the login page directly redirects to it. Opening local files may work, but a local server avoids browser restrictions around storage and embedded pages.

The demo login is checked in client-side JavaScript. It is intended for demonstration, not real account security.

## Features

| Page | What it does |
| --- | --- |
| Overview | Displays the current date/time, total movies, movies currently showing, and booking count. |
| Movies | Lists 13 sample movies; supports search, status filtering, adding, editing, and deleting movies. |
| Genres | Supports searching, adding, editing, and deleting genres. |
| Screenings | Supports adding, editing, deleting, and filtering screenings by date, movie, and theater. Checks release dates, room availability, and overlapping screenings. |
| Theaters | Shows theater contact information, search, and status controls. |
| Products | Supports search, status filtering, and adding, editing, or deleting food, drinks, and combos. |
| Bookings | Displays 9 sample bookings, searches by booking code/customer/movie, and sorts by screening date and time, newest first. |

Movie posters and product images support file selection and drag and drop, with a preview. Accepted formats are JPG, PNG, and GIF, up to 5 MB per image.

The sidebar uses hash routes such as `#movies`, `#showtimes`, and `#booking`. Each page loads in an iframe. Movie release dates link to the screening page with the movie and date selected.

## Demo data and persistence

- Movies, genres, and screenings use `sessionStorage` to share changes between pages in the same tab.
- Reloading the root application resets movies, screenings, bookings, and genres to their default data. The login flag remains until logout or the browser session ends.
- Products are stored in memory. Leaving and reopening the Products page resets its changes.
- Theater status changes are temporary UI changes.
- Bookings are sample records, separate from the editable screening schedule. Clicking a booking code currently displays an alert rather than a detail page.
- Uploaded images are read as data URLs; they are not uploaded to a server. Large posters may reach the browser's storage limit.
- Movie status is calculated from the release date: upcoming before release, showing for the first 21 days, then ended. This is a demo rule, not a live cinema schedule.
- Ratings are stored values, not a live IMDb integration. Poster and rating references are recorded in [the image sources file](pages/movies/images/sources.md).

Google Fonts, Bootstrap Icons, and some sample product images load from external websites. Local movie posters and the login background are included in the repository.

## Project structure

```text
BTL/
├── index.html              # Application shell and sidebar
├── app.js                  # Routing, demo login, iframe messages
├── shared-state.js         # Sample data, storage, screening validation
├── styles.css              # Application layout
├── control.css             # Shared controls
├── form-dialog.js          # Shared dialog behavior
├── form-dialog.css         # Shared dialog styles
├── pages/
│   ├── lam/
│   │   ├── login/          # Login page and background
│   │   └── tongquan/       # Overview
│   ├── movies/             # Movies, genres, and poster assets
│   ├── doanthai/           # Screenings and theaters
│   ├── booking/            # Sample booking list
│   └── products/           # Products
└── tests/                  # Node.js and Playwright checks
```

Edit `shared-state.js` to change the default movie and booking data. Initial product data lives in `pages/products/products.js`.

## Tests

The data checks require Node.js and use only its built-in modules:

```sh
node tests/shared-state.test.js
node tests/booking-sort.test.js
```

Browser checks additionally require Playwright and Chromium. Install the test dependencies locally:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Then run:

```sh
node tests/form-dialog.test.js
node tests/image-upload.test.js
```

These tests cover shared data, screening validation, booking order, dialogs, image selection, drag and drop, and image validation. Browser tests open local HTML files; the development server does not need to be running.

To use an installed Chrome instead of Playwright's Chromium, set `CHROME_PATH` to the Chrome executable when running a browser test.
