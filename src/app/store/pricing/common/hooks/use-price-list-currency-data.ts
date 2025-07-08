"use client"
import { useState, useEffect } from "react";

interface CurrencyData {
  code: string;
  name: string;
  symbol: string;
}

interface RegionData {
  id: string;
  name: string;
  currency_code: string;
}

interface PricePreferences {
  currency_code: string;
  includes_tax: boolean;
}

export function usePriceListCurrencyData() {
  const [isReady, setIsReady] = useState(false);
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [pricePreferences, setPricePreferences] = useState<PricePreferences>({
    currency_code: "USD",
    includes_tax: false,
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockRegions: RegionData[] = [
      { id: "reg_1", name: "North America", currency_code: "USD" },
      { id: "reg_2", name: "Europe", currency_code: "EUR" },
    ];

    const mockCurrencies: CurrencyData[] = [
      { code: "USD", name: "US Dollar", symbol: "$" },
      { code: "EUR", name: "Euro", symbol: "€" },
    ];

    setRegions(mockRegions);
    setCurrencies(mockCurrencies);
    setIsReady(true);
  }, []);

  return {
    isReady,
    regions,
    currencies,
    pricePreferences,
  };
}
