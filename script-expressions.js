//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZGVzczAwNCIsImEiOiJjbHQ3bmE4b3QwbXhtMmptZzg1M3prMjhxIn0.cSHypfTdZswzMU2HDZGXVQ';

//Initialize map
const map = new mapboxgl.Map({
    container: 'map', //container id in HTML
    style: 'mapbox://styles/mapbox/dark-v11',  //stylesheet location
    center: [-79.39, 43.65],  // starting point, longitude/latitude 43.652652, -79.393014
    zoom: 10, // starting zoom level

});

map.on('load', () => {

    //Add datasource from GeoJSON
    map.addSource('toronto-rinks', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/SVG3141/Lab3/main/data/indoor-ice-rinks-data.geojson'

    });

    map.addLayer({
        'id': 'toronto-rinks-pnts',
        'type': 'circle',
        'source': 'toronto-rinks',
        'paint': {
            'circle-radius': 5,
            'circle-color': 'blue',
        }
    });

    // Draw GeoJSON labels using 'name' property
    map.addLayer({
        'id': 'toronto-rink-labels',
        'type': 'symbol',
        'source': 'toronto-rinks',
        'layout': {
            'text-field': ['get', 'Parent Asset Name'],
            'text-variable-anchor': ['bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': 'white'
        }
    });

});

//Add zoom and rotation controls to the map.
map.addControl(
    new MapboxGeocoder({
        accessToken:mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        countries: "ca"

    })
);

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.39, 43.65],
        zoom: 10,
        essential: true
    });
});

map.on('click', 'toronto-rinks-pnts', (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    const address = e.features[0].properties.Address;
    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(address)
        .addTo(map);
});

map.on('mouseenter', 'places', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'places', () => {
    map.getCanvas().style.cursor = '';
});


let communityvalue;

document.getElementById("communityfieldset").addEventListener('change',(e) => {   
    communityvalue = document.getElementById('boundary').value;

    console.log(communityvalue); // Useful for testing whether correct values are returned from dropdown selection

    if (communityvalue == 'All') {
        map.setFilter(
            'toronto-rinks-pnts',
            ['has', 'Community Council Area'] // Returns all points from layer that have a value in field
        );
    } else {
        map.setFilter(
            'toronto-rinks-pnts',
            ['==', ['get', 'Community Council Area'], communityvalue] // returns points with value that matches dropdown selection
        );
    }

});
