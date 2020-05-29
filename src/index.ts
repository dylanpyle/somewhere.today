interface Place {
  type: "PLACE";
  starting: Date;
  location: string;
}

interface Travel {
  type: "TRAVEL";
  method: string;
  destination: string;
  starting: Date;
}

type Point = Place | Travel;

const points: Point[] = [
  {
    type: "PLACE",
    starting: new Date("2020-01-01"),
    location: "New York, NY",
  },
  {
    type: "PLACE",
    starting: new Date("2020-03-25T12:00-05:00"),
    location: "Detroit, MI",
  },
  {
    type: "TRAVEL",
    method: "driving",
    destination: "Brooklyn, NY",
    starting: new Date("2020-05-30T08:00-05:00"),
  },
  {
    type: "PLACE",
    location: "Brooklyn, NY",
    starting: new Date("2020-05-30T20:00-05:00"),
  },
  {
    type: "TRAVEL",
    method: "driving",
    destination: "Detroit, MI",
    starting: new Date("2020-06-09T08:00-05:00"),
  },
  {
    type: "PLACE",
    location: "Detroit, MI",
    starting: new Date("2020-06-09T20:00-05:00"),
  },
];

function getElement(selector: string): Element {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`Could not find element ${selector}`);
  }
  return el;
}

function getCurrentPoint(): Point {
  const point = [...points]
    .reverse()
    .find((point: Point) => point.starting <= new Date());
  if (!point) {
    throw new Error("Could not find a current point");
  }
  return point;
}

function getPointDescription(point: Point): string {
  switch (point.type) {
    case "PLACE":
      return `in ${point.location}`;
    case "TRAVEL":
      return `${point.method} to ${point.destination}`;
  }
}

function getPointDate(point: Point): string {
  return point.starting.toLocaleDateString();
}

function getUpcomingTravel(): Point[] {
  return points.filter((point: Point) => point.starting > new Date());
}

function uppercase(str: string): string {
  return str.toUpperCase();
}

function capitalize(str: string): string {
  return str.replace(/[a-z]/, uppercase);
}

function render() {
  const currentLocationEl = getElement(".current-location");
  const arrivalDateEl = getElement(".arrival-date");
  const upcomingTravelEl = getElement(".upcoming-travel");

  const currentPoint = getCurrentPoint();
  const pointDescription = getPointDescription(currentPoint);
  currentLocationEl.innerHTML = pointDescription;
  arrivalDateEl.innerHTML = getPointDate(currentPoint);

  const upcomingTravel = getUpcomingTravel();

  for (const point of upcomingTravel) {
    const li = document.createElement("li");
    const emoji = point.type === "PLACE" ? "📍" : "🚙";

    const description = `${emoji} ${capitalize(getPointDescription(point))}`;
    li.innerHTML = `${description} on ${getPointDate(point)}`;
    upcomingTravelEl.appendChild(li);
  }
}

function onGoogleMapsLoaded() {
  const mapEl = getElement(".map");
  const maps = (window as any).google.maps;

  const currentPoint = getCurrentPoint();
  const geocoder = new maps.Geocoder();
  const locationDescription =
    currentPoint.type === "PLACE"
      ? currentPoint.location
      : currentPoint.destination;

  geocoder.geocode({ address: locationDescription }, function (
    results: any,
    status: any
  ) {
    if (status !== "OK") {
      alert(status);
    }

    new maps.Map(mapEl, {
      center: results[0].geometry.location,
      zoom: 6,
      disableDefaultUI: true,
    });
  });
}

render();
