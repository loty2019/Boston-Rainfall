import Visualize from "./mapVisualize";
import Visualize5y from "./mapVisualize5y";
import Visualize10y from "./mapVisualize10y";
import { useState, useEffect} from "react";
import Papa from "papaparse";

function App() {
  const [year, setYear] = useState(localStorage.getItem("year") || 2023);
  const [data, setData] = useState([]);
  const [aggregatedData5y, setAggregatedData5y] = useState([]);
  const [aggregatedData10y, setAggregatedData10y] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      let dataAggregator = {};

      for (let year = 2014; year <= 2024; year++) {
        const response = await fetch(`/Data/${year}.csv`);
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          complete: (results) => {
            results.data.forEach((row) => {
              const { Site, Inches } = row;
              if (dataAggregator[Site+"10y"]) {
                dataAggregator[Site + "10y"] += parseFloat(Inches);
              } else {
                dataAggregator[Site + "10y"] = parseFloat(Inches);
              }
            });
          }
        });
      }

      // Transform the data
      const outputData = Object.keys(dataAggregator).map((site) => ({
        Site: site,
        Inches: dataAggregator[site].toFixed(2)
      }));
      setAggregatedData10y(outputData);
    };
    loadData();
    
  }, []);

  useEffect(() => {
    const loadData = async () => {
      let dataAggregator = {};

      for (let year = 2019; year <= 2024; year++) {
        const response = await fetch(`/Data/${year}.csv`);
        const text = await response.text();

        Papa.parse(text, {
          header: true,
          complete: (results) => {
            results.data.forEach((row) => {
              const { Site, Inches } = row;
              if (dataAggregator[Site+"5y"]) {
                dataAggregator[Site + "5y"] += parseFloat(Inches);
              } else {
                dataAggregator[Site + "5y"] = parseFloat(Inches);
              }
            });
          }
        });
      }

      // Transform the data
      const outputData = Object.keys(dataAggregator).map((site) => ({
        Site: site,
        Inches: dataAggregator[site].toFixed(2)
      }));
      setAggregatedData5y(outputData);
    };
    loadData();
    
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/Data/${year}.csv`);
        const reader = response.body.getReader();
        const result = await reader.read(); // Read the stream
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value); // Convert the Uint8Array to string
        Papa.parse(csv, {
          header: true,
          complete: (results) => {
            //console.log("Parsed CSV data: ", results.data);
            setData(results.data);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    };
    console.log("Year changed:", year);
    localStorage.setItem("year", year);
    fetchData();
  }, [year]);

  return (
    <div className="bg-slate-600 min-h-screen flex flex-col items-center justify-center px-4">
  <header className="text-center mb-5">
    <h1 className="text-6xl text-white font-bold">
      Boston Rainfall Distribution
    </h1>
  </header>
  <div className="flex flex-row-reverse gap-32 mt-5">
    <form className="flex flex-col items-center">
      <label htmlFor="year" className="text-xl text-white font-bold mb-2">
        Select a year:
      </label>
      <select
        id="year"
        name="year"
        value={year}
        onChange={(event) => {
          setYear(event.target.value);
          window.location.reload();
        }}
        className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
      >
        {Array.from({ length: 15 }, (_, i) => 2010 + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </form>
    <div className="">
    <div className="text-center text-white font-bold">
      Rainfall Intensity Legend
    </div>
    <div className="w-full h-8 mt-2 bg-gradient-to-r from-[#ccddff] to-[#003399]"></div>
    <div className="flex justify-between text-white font-bold mt-1">
      <span>Less Rain</span>
      <span>More Rain</span>
    </div>
  </div>
  </div>
  
  <div className="flex flex-wrap justify-center items-start mt-5 w-full ">
    <div className="w-full lg:w-1/2 px-4 mb-4 mt-10 lg:mb-0">
      <Visualize key={year} data={data} />
    </div>
    <div className="w-full lg:w-1/2 px-4">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-white font-bold">Site</th>
            <th className="px-4 py-2 text-white font-bold">Rainfall (Inches)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="bg-white bg-opacity-10">
              <td className="border px-4 py-2 text-white">{row.Site}</td>
              <td className="border px-4 py-2 text-white">{row.Inches}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  <h1 className="text-6xl mt-10 mb-5 text-white font-sans font-bold">
      Over 5 Years of Data
    </h1>
  <div className="flex flex-wrap justify-center items-start mt-10 w-full ">
    <div className="w-full lg:w-1/2 px-4 mb-4 mt-10 lg:mb-0">
      <Visualize5y data={aggregatedData5y} />
    </div>
    <div className="w-full lg:w-1/2 px-4">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-white font-bold">Site</th>
            <th className="px-4 py-2 text-white font-bold">Rainfall (Inches)</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData5y.map((row, index) => (
            <tr key={index} className="bg-white bg-opacity-10">
                <td className="border px-4 py-2 text-white">{ row.Site.slice(0, -2) }</td>
              <td className="border px-4 py-2 text-white">{row.Inches}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  <h1 className="text-6xl mt-10 mb-5 text-white font-sans font-bold">
      Over 10 Years of Data
    </h1>
  <div className="flex flex-wrap justify-center items-start mt-10 w-full ">
    <div className="w-full lg:w-1/2 px-4 mb-4 mt-10 lg:mb-0">
      <Visualize10y data={aggregatedData10y} />
    </div>
    <div className="w-full lg:w-1/2 px-4">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-white font-bold">Site</th>
            <th className="px-4 py-2 text-white font-bold">Rainfall (Inches)</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData10y.map((row, index) => (
            <tr key={index} className="bg-white bg-opacity-10">
                <td className="border px-4 py-2 text-white">{ row.Site.slice(0, -3) }</td>
              <td className="border px-4 py-2 text-white">{row.Inches}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  <p className="my-6 text-center text-white font-bold">
    Data Source: <a href="https://www.bwsc.org/environment-education/rainfall-garden" className="underline">Boston Water and Sewer</a>
  </p>
</div>

  );
}

export default App;
