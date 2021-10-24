
import React from "react";
import { useDropzone } from "react-dropzone";
const Dropzone = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  return (
    <section>
      <div {...getRootProps()} style={{ height: '115px', textAlign: 'center', alignItems: 'center' }}>
        <input {...getInputProps()} />
        <p className="pt-5">
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>
    </section>
  );
}; 
export default Dropzone;