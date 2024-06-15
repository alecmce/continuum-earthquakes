## Getting Started

This assumes that you have been able to clone this repository to a local directory, and your terminal is currently set
to that directory. To setup, run:

```bash
yarn
yarn dev
```

This will install the dependencies defined by `package.json`, and run a development environment for the project. The
output will tell you which port on localhost to open to see it running. It will also spin-up a hot-reloading context,
but be aware that if you make changes to the code the Map will not correctly preserve the earthquake data across hot
reloads, so you will need to cmd/ctrl+R to hard-reload after code changes.

To create a production build use:

```bash
yarn build
```

To preview a production build use:

```bash
yarn preview
```

To run tests, use:

```bash
yarn test:unit
```

To run the linter, use:

```bash
yarn lint
```

## About

This project was built to satisfy a FrontEnd Engineer Interview Assignment from Continuum Industries. The following
items are the spec, with commentary added as blockquotes below each item:

Data Fetching: Use Axios or other framework to fetch earthquake data from the following URL:
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson. This URL provides data on significant earthquakes that have occurred in the past month.

> `src/state/use-earthquake-data.ts` uses `fetch` to pull the data from the given URL. It calls `console.error` with failures, but since it wasn't in the spec, the app does not yet handle errors elegantly. The returned data is a GeoJSON `FeatureCollection<Geometry, GeoJsonProperties>`.

2. Map Integration: Display the fetched earthquake data on a map using the Mapbox library. Each earthquake should be represented as a point on the map.

> `src/components/MapBux.vue` uses `src/components/use-map.ts` to compose its view-model and behaviour. It constructs a MapBoxGL instance, then watches `earthquakeData` and adds a layer when the data becomes available, as a small circle.

3. List Display: Alongside the map, display a list of the earthquakes. Each item in the list should include at least the earthquake's place and magnitude.

> `src/components/EarthquakeList.vue` manages a list of `src/components/EarthquakeItem.vue`; each item corresponds to a `Feature` in the earthquake data, which is passed in as a prop. `src/components/use-earthquake-item.ts` composes the `EarthquakeItem` view-model and behaviour.

4. Interactions:

- Hover: When the user hovers over an item in the list, the corresponding point on the map should be enlarged or highlighted. Similarly, the list item should be highlighted.
- Click: When the user clicks on an item in the list, adjust the user's viewport to center on the corresponding point on the map.

> `use-earthquake-item.ts` behaviour satisfies thee hover and click requirements by modifying `Pinia` stores surfaced by `src/state/use-hover.ts` and `src/state/use-selection.ts`. This state is then consumed by the `MapBox` component which manages the manipulation of thee data layer using MapBox's [feature-state](https://docs.mapbox.com/help/tutorials/create-interactive-hover-effects-with-mapbox-gl-js/) logic. This manipulates each circle in the earthquake data layer to enlarge the circle when selected, and to recolour the circle when hovered.
>
> Additionally, shift-click multiply-selects state, as I was curious how achievable that was. This creates multiple selection, which is
reconciled in the `MapBox` component by establishing `LngLatBounds` around the multiple selection. Unfortunately there appears to be a bug in this code, as selecting earthquakes in Tonga and Vanuatu appear to give `LngLatBounds` that center on Antarctica.

5. TypeScript: Using TypeScript for this project is optional. If you are comfortable with TypeScript, you are encouraged to use it.

> The project is written in TypeScript.

6. Search Functionality: Implement a search box above the list that allows users to filter the list and map based on the search query. The filtering should work for earthquake places.

> `src/components/SearchBar.vue` renders an input text field, which manipulates the state of the `Pinia` store in `useEarthquakeData` to filter the surfaced earthquake data. Any value entered into the text field is used to substring match in the earthquake's place listing, and the `EarthquakeList` updates correspondingly.

7. State Management: Use a state management framework (e.g. Vuex, Pinia, etc.) to manage the application's state, especially for storing the fetched earthquake data and managing the filter state.

> `Pinia` is used throughout, as described.

8. Testing: Employ testing framework(s) to demonstrate effective test coverage of your application” and leave it up to the candidate to determine what effective coverage is?

> The discrete library functions used for some isolated logic is tested, but I was not able to successfully work out how to test the Vue components' integrations with `Pinia` and `MapBox`, so tests of the `Vue` components are not included.

## Commentary

Other than toy projects to understand the basic structure of `Vue`, this is the first `Vue` project I've ever written, and it took longer than expected to understand how to interact with the composable API, especially as I did not initially integrate `Pinia` and was attempting to use more `React`-like patterns.

For this reason, I stopped attempting to push harder on part 8. as I had invested more time than I had anticipated ensuring that my code worked within `Vue`'s reactive architecture. `Pinia` helped with that. But my attempts to test `MapBox.vue` were caught out by the earthquake data not being loaded, and being unable to work out how to await that in the tests, or how to appropriately work around that.
