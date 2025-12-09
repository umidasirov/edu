import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./ck-editor.scss";

const CkEditor = ({ value, onChange }) => {
  const [content, setContent] = useState("");

  return (
    <div>
      <ReactQuill
        className="ck-editor"
        theme="snow"
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
        }}
      />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default CkEditor;
