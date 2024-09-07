import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        });

        setResponse(res.data);
      } catch (error) {
        console.log("error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1>test</h1>
        <h1>{response}</h1>
      </div>
    </>
  );
}

export default App;
