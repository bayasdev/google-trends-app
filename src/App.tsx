import { useState } from 'react';
import axios from 'axios';

import './App.css';
import { TopSearch } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import Card from './components/Card';

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dayInterval, setDayInterval] = useState<number>(7);
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);

  const fetchTopSearches = () => {
    setIsLoading(true);

    const endpoint = import.meta.env.VITE_ENDPOINT_URL || '';

    const body = {
      dayInterval: dayInterval,
    };

    axios
      .post(endpoint, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        setTopSearches(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-base-200">
        <div className="space-y-6 py-8 container mx-auto">
          <div className="flex gap-4">
            <select
              onChange={(event) => {
                setDayInterval(Number(event.target.value));
              }}
              value={dayInterval}
              className="select select-bordered w-full max-w-xs"
            >
              <option disabled selected>
                Selecciona un intervalo de días
              </option>
              <option value="7">7 días</option>
              <option value="30">30 días</option>
              <option value="90">90 días</option>
            </select>
            <button onClick={fetchTopSearches} className="btn btn-primary">
              Obtener top búsquedas
            </button>
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            topSearches.length > 0 && (
              <>
                <div className="space-y-2">
                  <div className="text-2xl font-semibold tracking-tight">
                    Top búsquedas a nivel global
                  </div>
                  <div className="text-sm">Últimos {dayInterval} días</div>
                </div>
                {topSearches.map((topSearch) => (
                  <Card key={topSearch.day} data={topSearch} />
                ))}
              </>
            )
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
