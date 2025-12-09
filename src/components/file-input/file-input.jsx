// React
import React, { useState } from "react";

// Style 
import "./file-input.scss";

// Function
const FileInput = () => {
  const [fileName, setFileName] = useState("");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="input-row file">
        <label htmlFor="file-input">Rasmi</label>
      <label htmlFor="file-input" className="file-label">
        {fileName || "Rasm tanlang"}
      </label>
      <input
        type="file"
        name="img"
        id="file-input"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileInput;
