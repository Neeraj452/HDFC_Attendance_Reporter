
import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop}) => {
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,

  });
  return (
    <div {...getRootProps()}>
      <input type="file" className="dropzone-input" {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="dropzone-content">Release to drop the files here</p>
        ) : (
          <p className="dropzone-content pb-4 pt-1">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>
    </div>
  );
};

export default Dropzone;