import { useState, useEffect } from "react";

export const SUPPORTED_COUNTRIES = ["US", "MX", "CA", "AU"];

const SESSION_KEY = "caliche-country";

async function detectCountryFromIP() {
  const cached = sessionStorage.getItem(SESSION_KEY);
  if (cached && SUPPORTED_COUNTRIES.includes(cached)) return cached;

  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) throw new Error("geo failed");
  const data = await res.json();
  const code = data.country_code?.toUpperCase();
  const result = SUPPORTED_COUNTRIES.includes(code) ? code : "US";
  sessionStorage.setItem(SESSION_KEY, result);
  return result;
}

export function useCountry() {
  const [country, setCountry] = useState("US");

  useEffect(() => {
    detectCountryFromIP()
      .then(setCountry)
      .catch(() => {}); // silently keep "US" on error
  }, []);

  function changeCountry(code) {
    sessionStorage.setItem(SESSION_KEY, code);
    setCountry(code);
  }

  return { country, setCountry: changeCountry };
}
