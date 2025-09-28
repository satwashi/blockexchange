import { useEffect, useState } from "react";

export function useBinanceTickers() {
  const [tickers, setTickers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setTickers(data); // array of tickers
    };

    return () => ws.close();
  }, []);

  return tickers;
}
