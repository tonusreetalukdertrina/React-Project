import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import Plot from "react-plotly.js";
import './index.css';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

function App() {
  const [FormData, setFormData] = useState({
    projectname: "",
    projectdes: "",
    client: "",
    contractor: "",
    minX: "",
    maxX: "",
    minY: "",
    maxY: "",
    minZ: "",
    maxZ: ""
  });
  const[step, setStep] = useState(1);
  const [csvfile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [chartData, setChartData] = useState(null);
  

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({...FormData, [e.target.name]: e.target.value});
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(step===1){
      setStep(2);
    }
    else if(step===2){
      setStep(3);
    }
    else{
      setStep(1);
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        const data = result.data;
        setCsvData(data);

        const chartLabels = data.map((entry) => entry.KP);
        const chartdata = data.map((entry) => entry.X);

        setChartData({
          x: chartLabels,
          y: chartdata,
          type: "scatter",
          mode: "lines+markers",
          line: { color: "rgba(75, 192, 192, 1)" }
        });
      }
    });
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const lines = contents.split("\n");
        if (lines.length > 1) {
          const dataRows = lines.slice(1);
          let xValues = [];
          let yValues = [];
          let zValues = [];

          dataRows.forEach((row) => {
            const columns = row.split(",");
            if (columns.length >= 4) {
              const x = parseFloat(columns[1]);
              const y = parseFloat(columns[2]);
              const z = parseFloat(columns[3]);
              xValues.push(x);
              yValues.push(y);
              zValues.push(z);
            }
          });
          FormData.minX = Math.min(...xValues);
          FormData.maxX = Math.max(...xValues);
          FormData.minY = Math.min(...yValues);
          FormData.maxY = Math.max(...yValues);
          FormData.minZ = Math.min(...zValues);
          FormData.maxZ = Math.max(...zValues);

        }
      };
      reader.readAsText(file);
      setCsvFile(file);
    }
  };

  const getPdf = async () => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.autoTable({
      html: "#result",
    });

    doc.save("Result.pdf");
  };

  return (
    <div>
      {step===1 && (
      <div>
        <div className='data'>
          <form className='form' onSubmit={handleSubmit}>
            <h2><b>XYZ Engine</b></h2>
              <input 
              type = "text"
              name = "projectname"
              placeholder = 'Project Name'
              value = {FormData.projectname}
              onChange = {handleChange}
              required
              />
              <input 
              type = "text"
              name = "projectdes"
              placeholder = 'Project Description'
              value = {FormData.projectdes}
              onChange = {handleChange}
              required
              />
              <input 
              type = "text"
              name = "client"
              placeholder = 'Client Name'
              value = {FormData.client}
              onChange = {handleChange}
              required
              />
              <input 
              type = "text"
              name = "contractor"
              placeholder = 'Contractor Name'
              value = {FormData.contractor}
              onChange = {handleChange}
              required
              />
              <button className='button'>Submit Data</button>
          </form>
      </div>
    </div>
    )} 
    {step===2 && (
      <div className='data'>
          <form className='form' onSubmit={handleSubmit}>
          <h2>XYZ Engine</h2>
            <h1>Project Data</h1>
              <input type="text" placeholder='Project Name' value={FormData.projectname} readOnly />
              <input type="text" placeholder='Project Description' value={FormData.projectdes} readOnly />
              <input type="text" placeholder='Client' value={FormData.client} readOnly />
              <input type="text" placeholder='Contractor' value={FormData.contractor} readOnly />
              <label><b>Data File</b></label>
              <input type="file" accept=".csv" placeholder='Enter .csv file' onChange={handleFileUpload} required />
              <input placeholder='Min X' value={FormData.minX} onChange={handleFileUpload} readOnly />
              <input placeholder='Max X' value={FormData.maxX} onChange={handleFileUpload} readOnly />
              <input placeholder='Min Y' value={FormData.minY} onChange={handleFileUpload} readOnly />
              <input placeholder='Max Y' value={FormData.maxY} onChange={handleFileUpload} readOnly />
              <input placeholder='Min Z' value={FormData.minZ} onChange={handleFileUpload} readOnly />
              <input placeholder='Max Z' value={FormData.maxZ} onChange={handleFileUpload} readOnly />
              <button className='button'>Result Data</button>
              <h1>Data Graph</h1>
              <div className='plot-container'>
                <Plot 
                    data={[chartData]}
                    layout={{
                    width: "100%",
                    height: "60vh",
                    xaxis: { title: "KP" },
                    yaxis: { title: "X" }
                    }}
                    style={{ margin: "auto" }}
                />
              </div>
              <button className='button1' onClick={handleSubmit}>Home Page</button>
          </form>
    </div>
    )}
    {step===3 && (
      <div className='table'>
        <h2><b>XYZ Engine</b></h2>
      <h2>Result</h2>
        <table id="result">
        <thead>
          <tr>
            <th>Content</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><b>Project Name</b></td>
            <td>{FormData.projectname}</td>
          </tr>
          <tr>
            <td><b>Project Description</b></td>
            <td>{FormData.projectdes}</td>
          </tr>
          <tr>
            <td><b>Client</b></td>
            <td>{FormData.client}</td>
          </tr>
          <tr>
            <td><b>Contractor</b></td>
            <td>{FormData.contractor}</td>
          </tr>
          <tr>
            <td><b>Min X</b></td>
            <td>{FormData.minX}</td>
          </tr>
          <tr>
            <td><b>Max X</b></td>
            <td>{FormData.maxX}</td>
          </tr>
          <tr>
            <td><b>Min Y</b></td>
            <td>{FormData.minY}</td>
          </tr>
          <tr>
            <td><b>Max Y</b></td>
            <td>{FormData.maxY}</td>
          </tr>
          <tr>
            <td><b>Min Z</b></td>
            <td>{FormData.minZ}</td>
          </tr>
          <tr>
            <td><b>Max Z</b></td>
            <td>{FormData.maxZ}</td>
          </tr>
        </tbody>
      </table>
      <button className='button1' onClick={getPdf}>Download</button>
      <button className='button1' onClick={handleSubmit}>Home Page</button>
    </div>
    )}
    </div>
  );
}

export default App;

