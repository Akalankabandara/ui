import * as XLSX from "xlsx";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function App() {
  const [result, setResult] = useState([]);

  const addFile = (event) => {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = () => {
      let arrayBuffer = fileReader.result;
      let data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for (let i = 0; i < data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");
      let workbook = XLSX.read(bstr, { type: "binary" });
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];
      let arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      setResult(arraylist);
      addData(arraylist); // Call addData here after result is set
      console.log(arraylist);
    };
  };

  const addData = (result) => {
    try {
      fetch("http://127.0.0.1:8000", {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <>
      <input
        type="file"
        placeholder="Upload file"
        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={(event) => addFile(event)}
      />
    </>
  );
}
