// This file contains the parsed itinerary data from the attached text file
// It's used to initialize the in-memory storage

export const itineraryData = [
  {
    date: "Friday, 11 July",
    day: 11,
    title: "Arrival & Beach Day",
    weather: "Partly Sunny",
    temperature: 25,
    activities: [
      {
        type: "arrival",
        description: "Arrive & check in at Gwalia Falls, Tresaith",
        mapsUrl: "https://maps.google.com/maps?q=Gwalia+Falls,+Tresaith"
      },
      {
        type: "beach",
        description: "Relax on Tresaith Beach – explore the famous waterfall & swim",
        mapsUrl: "https://maps.google.com/maps?q=Tresaith+Beach"
      },
      {
        type: "optional",
        description: "Optional sunset walk along the coast path to Aberporth",
        mapsUrl: "https://maps.google.com/maps?q=Aberporth"
      }
    ],
    dining: [
      {
        type: "lunch",
        name: "Light bite from the beach or local shop",
        location: "Tresaith"
      },
      {
        type: "dinner",
        name: "The Ship Inn",
        location: "Tresaith",
        description: "great seafood pub with sea views"
      }
    ]
  },
  // ... more days would be added here
];
