## Team Propel

briefly describing all of their contributions to your team's project.

### Team Members & Contributions
#### Grace Chen
* Added place recommendations with Firebase
* Added and set up access to NPS and Trails APIs
* Set subtle animations and overall structure of page
* Automated generating map circles
* Dynamically generated Google Maps links based on park coordinates 

#### Aaron Liu
* Generate trail markers when clicking a trail/spot
* Display corresponding information when clicking a map circle
* 

#### Katya Noble
* Added Spots category
* Cleaned up files
* 

#### Lam Pham
* Set up Leaflet map and its functionality
* General styling
* Added image carousel for more efficient loading

---

### Source Code Files
#### server.js
This is the main Node.js file that utilizes the Express and Unirest frameworks to get and serve data to the user.

#### backendjs/parkCoords.js
This uses the National Park Service’s API to generate coordinates of parks that we select. This information is used for various map functions (e.g. circles, trail markers, etc.) and to generate corresponding links to Google Maps.

#### static/index2.html
This is the main HTML file utilizing Bootstrap and containing the structure and elements of Point Poppy, including its buttons, map, and textboxes.

#### static/styles/styles.css
This is the main stylesheet for Point Poppy. It holds all the stylings that make Point Poppy unique and a joy to use, such as the colors, fonts, and spacing.

#### static/scripts/leaflet.js
This is the Javascript file that controls user interactions with the map. It generates circles based on coordinates and allows the user to zoom in on an area or show where a selected trailhead is, as well as filling in the corresponding information for each location (e.g. trails, weather, image gallery, etc.) when necessary.

#### static/scripts/pointPoppy.js
This is the Javascript file that controls all user interactions (excluding the map). It generates corresponding information for each location (e.g. trails, weather, image gallery, etc.) when necessary.

#### static/scripts/resize_map.js
This is the Javascript file that allows the map to dynamically resize according to the window size.

---

### Demo Video
[Point Poppy demo video](www.youtube.com)
