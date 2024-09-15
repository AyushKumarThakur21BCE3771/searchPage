// src/components/SearchPage.js
import React, { useState } from "react";
import axios from "axios";
import moment from "moment";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("");
  const [lawFirm, setLawFirm] = useState("");
  const [attorney, setAttorney] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/v3/us`, {
        query,
        owner,
        lawFirm,
        attorney,
        status,
      });

      const hits = response.data.body.hits.hits;
      setResults(hits);
    } catch (err) {
      setError("Error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Search for a trademark..."
          className="border rounded-md p-2 mb-4 w-full max-w-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap justify-between mb-4 w-full max-w-md">
          <input
            type="text"
            placeholder="Owner"
            className="border rounded-md p-2 mb-2"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          />
          <input
            type="text"
            placeholder="Law Firm"
            className="border rounded-md p-2 mb-2"
            value={lawFirm}
            onChange={(e) => setLawFirm(e.target.value)}
          />
          <input
            type="text"
            placeholder="Attorney"
            className="border rounded-md p-2 mb-2"
            value={attorney}
            onChange={(e) => setAttorney(e.target.value)}
          />
          <input
            type="text"
            placeholder="Status"
            className="border rounded-md p-2 mb-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-md w-full max-w-md"
        >
          Search
        </button>
      </div>

      {/* Status Indicator */}
      {loading && <p className="text-center mt-4">Searching...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p className="text-center mt-4">No Results Found</p>
      )}

      {/* Display Results */}
      <div className="mt-4">
        {results.map((result) => {
          const {
            registration_number,
            registration_date,
            status_date,
            status_code,
            mark_identification,
          } = result._source;
          return (
            <div key={result._id} className="border p-4 rounded-md mb-4">
              <h2 className="text-xl font-bold">{mark_identification}</h2>
              <p>Registration Number: {registration_number}</p>
              <p>
                Registration Date:{" "}
                {moment.unix(registration_date).format("MM/DD/YYYY")}
              </p>
              <p>
                Status Date: {moment.unix(status_date).format("MM/DD/YYYY")}
              </p>
              <p>Status Code: {status_code}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchPage;
