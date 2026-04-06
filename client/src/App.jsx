import { useEffect, useState } from "react";

export default function App() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState("");

  useEffect(() => {
    const getApiMessage = async () => {
      if (!apiBaseUrl) {
        setError("VITE_API_BASE_URL is missing in .env");
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}/api`);

        if (!response.ok) {
          throw new Error("Failed to fetch API");
        }

        const data = await response.json();
        setMessage(data.message);
      } catch {
        setError("Unable to connect to server API");
      }
    };

    getApiMessage();
  }, [apiBaseUrl]);

  return (
    <div>
      <h1 className="text-3xl font-bold underline">Client side</h1>
      <p className="mt-4">{error || message}</p>
    </div>
  );
}
