const flightModel = require('../models/flightCacheModel')

const flightSearch = async (req, res, next) => {
  try {
    const {
      origin,
      destination,
      adult,
      child,
      infant,
      DepartureDate,
      tripType,
      returnDate,
    } = req.body;
    const { accessToken } = req;
    const cachedFlight = await flightModel.findOne({
      origin,
      destination,
      adult,
      child,
      infant,
      DepartureDate,
      tripType,
      returnDate,
    });

    if (cachedFlight) {
      return res.status(200).json({
        success: true,
        cached: true,
        data: cachedFlight.result,
      });
    }
    const travelers = [];
    let idCounter = 1;
    for (let i = 0; i < adult; i++) {
      travelers.push({ id: idCounter++, travelerType: "ADULT" });
    }
    for (let i = 0; i < child; i++) {
      travelers.push({ id: idCounter++, travelerType: "CHILD" });
    }
    for (let i = 0; i < infant; i++) {
      travelers.push({ id: idCounter++, travelerType: "INFANT" });
    }
    const requestBody = {
      currencyCode: "USD",
      originDestinations: [
        {
          id: "1",
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDateTimeRange: {
            date: DepartureDate, //YYYY-MM-DD
          },
        },
      ],
      travelers: travelers,
      sources: ["GDS"],
      searchCriteria: {
        maxFlightOffers: 250,
        flightFilters: {
          cabinRestrictions: [
            {
              cabin: "BUSINESS",
              coverage: "MOST_SEGMENTS",
              originDestinationIds: ["1"],
            },
          ],
        },
      },
    };

    const getAvailableFlights = await fetch(
      "https://test.api.amadeus.com/v2/shopping/flight-offers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const data = await getAvailableFlights.json();
    const newCache = new flightModel({
      origin,
      destination,
      adult,
      child,
      infant,
      DepartureDate,
      tripType,
      returnDate,
      result: data,
    });
    
    try {
      await newCache.save();
    } catch (err) {
      console.error("Error saving new cache:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to save flight cache.",
        error: err.message,
      });
    }
    

    return res.status(200).json(data);
  } catch (e) {
    res.send(e);
  }
};
module.exports = flightSearch;
