/*
  PROJECT LIST — edit this file to add, remove, or update projects.
  Each project is one { } entry in the array below. Copy an existing
  entry and change the values to add a new one — no other file needs
  to change. The homepage, Projects page, and each project's own detail
  page (project.html?slug=...) are all built from this one list.

  Fields:
    slug        - unique, url-safe id, e.g. "canoga-7218" (used in the
                  project detail page link: project.html?slug=canoga-7218)
    name        - project / client name
    location    - city, state (or "International")
    status      - "current" or "past"
    discipline  - "architecture", "structural", "civil", or "specialty"
                  (controls which tab it shows under on the Projects page)
    sqft        - square footage as a string, e.g. "4,200 SF" — leave ""
                  if unknown, the detail page will hide it
    description - a paragraph about the project — leave "" to show a
                  generic placeholder note instead
    images      - { actual: "path/to/photo.jpg", render: "path/to/render.jpg" }
                  both optional, leave "" to show a placeholder
*/

const PROJECTS = [
  // ----- CURRENT PROJECTS -----
  { slug: "canoga-7218", name: "Canoga 7218", location: "Los Angeles, CA", status: "current", discipline: "structural", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "canoga-7281-half", name: "Canoga 7281 ½", location: "Los Angeles, CA", status: "current", discipline: "structural", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "artsakh", name: "Artsakh", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "orange-cafe", name: "Orange Cafe", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "lemon-mint-cafe", name: "Lemon Mint Cafe", location: "Glendora, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "route-66-cafe", name: "Route 66 Cafe", location: "Rialto, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "esso-cafe-current", name: "Esso Cafe", location: "Beverly Hills / Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },

  // ----- RESTAURANTS & HOSPITALITY (mostly ongoing/recent architecture work) -----
  { slug: "van-bakery", name: "Van Bakery", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "steffanos", name: "Steffano's – Two Guys From Italy", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "pandain", name: "Pandain Restaurant", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "old-gyumri", name: "Old Gyumri Restaurant", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "elysee-house", name: "Elysee House", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "urartu-coffee", name: "Urartu Coffee", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "greek-bistro", name: "Greek Bistro", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "tavern-on-brand", name: "Tavern on Brand", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "crazy-rockin-sushi", name: "Crazy Rockin Sushi", location: "Glendale, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "frenchifornia", name: "Frenchifornia", location: "Pasadena, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "sarkis-party", name: "Sarkis Party", location: "Multiple Locations", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "farmer-boys", name: "Farmer Boys", location: "Multiple Locations", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "divina-cucina", name: "Divina Cucina", location: "Montrose, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "basement-bar", name: "Basement Bar", location: "Long Beach, CA", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "lazy-bear-cafe", name: "Lazy Bear Cafe", location: "West Glacier, MT", status: "current", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },

  // ----- PAST PROJECTS -----
  { slug: "karas", name: "Karas Restaurant", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "phoenicia", name: "Phoenicia Restaurant", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "carousel", name: "Carousel Restaurant", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "farniente", name: "Farniente Restaurant", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "gennaros", name: "Gennaro's Ristorante", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "il-gazibo", name: "Il Gazibo", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "blue-pyramid-cafe", name: "Blue Pyramid Cafe", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "mini-kebab", name: "Mini Kebab", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "shiraz-place", name: "Shiraz Place", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "raffis-place", name: "Raffi's Place", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "eden-on-brand", name: "Eden on Brand", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "foxys", name: "Foxy's Restaurant", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "oak-and-vine", name: "Oak and Vine", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "my-cafe-lounge", name: "My Cafe and Lounge", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "giggles-nightclub", name: "Giggles Nightclub", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "esso-cafe-glendale", name: "Esso Cafe", location: "Glendale, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "atx-crossing", name: "ATX Crossing", location: "Los Angeles, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "momed", name: "MOMED", location: "Los Angeles, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "fiddlers-on-third", name: "Fiddler's on Third", location: "Los Angeles, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "starbucks", name: "Starbucks", location: "Los Angeles, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "il-pastaio", name: "Il Pastaio", location: "Beverly Hills, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "esso-cafe-bh", name: "Esso Cafe", location: "Beverly Hills, CA", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "9021-pho", name: "9021 Pho Restaurant", location: "Multiple Locations", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "johnny-rockets", name: "Johnny Rockets", location: "CA / OR / WA / Vancouver", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "skaffs", name: "Skaffs Restaurant", location: "Multiple Locations", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "55-degree-wine", name: "55 Degree Wine", location: "Multiple Locations", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
  { slug: "bourbon-steaks", name: "Bourbon Steaks", location: "Multiple Locations", status: "past", discipline: "architecture", sqft: "", description: "", images: { actual: "", render: "" } },
];
