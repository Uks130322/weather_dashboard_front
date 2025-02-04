import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 
  const [suggestions, setSuggestions] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);

  const geoNamesApiKey = "nataliatkachuk"; 

  const fetchCitySuggestions = async (input) => {
    if (input.length < 5) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `http://api.geonames.org/searchJSON?q=${input}&maxRows=5&username=${geoNamesApiKey}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch city suggestions");
      }
      const data = await response.json();
      if (data.geonames && data.geonames.length > 0) {
        const cities = data.geonames.map((item) => item.name);
        setSuggestions(cities);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error(err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setCity(input);

    if (input.length >= 5) {
      fetchCitySuggestions(input);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };


  const selectSuggestion = (selectedCity) => {
    setCity(selectedCity);
    setSuggestions([]);
    setShowSuggestions(false);
  };


  const fetchWeather = async () => {
    if (city.trim().length < 3) {
      setError("Please enter at least 5 characters");
      return;
    }

    setError(""); 
    setLoading(true); 

    try {
      const response = await fetch(`http://127.0.0.1:8000/weather/${city}`);
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-200 to-indigo-200">
  <div className="w-full p-6 md:p-8 lg:p-10 bg-white rounded-lg shadow-lg mx-4 md:mx-8">
        <h1 className="text-2xl font-bold text-purple-800 mb-4 text-center">Weather Dashboard</h1>
        <div className="relative mb-4">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
            style={{ color: "#333" }}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute w-full bg-purple-100 border border-purple-300 rounded-md shadow-md mt-1 z-10 text-gray-800">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="cursor-pointer p-2 hover:bg-purple-200"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-center">
          <button
            onClick={fetchWeather}
            className="p-2 bg-gray-200 text-white rounded-md shadow-md hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            disabled={loading || city.trim().length < 3}
            style={{ color: "white" }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-center mt-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {weather && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-center"
            >
              <h2 className="text-xl font-semibold text-blue-800">
                {weather.city}, {weather.country}
              </h2>
              <p className="text-gray-700">
                Temperature: <span className="font-bold">{weather.temperature}°C</span>
              </p>
              <p className="text-gray-700">
                Weather: <span className="font-bold">{weather.weather_description}</span>
              </p>
              <div className="mt-2 mx-auto bg-purple-300 rounded-full p-2 max-w-[100px]">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt="Weather icon"
                  className="mx-auto"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Weather;