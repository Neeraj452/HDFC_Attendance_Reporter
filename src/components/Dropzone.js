
import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop }) => {

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,

  });
  return (
    <section>
      <div {...getRootProps()} style={{ height: '80px', textAlign: 'center', alignItems: 'center' }}>
        <input type="file" className="dropzone-input" {...getInputProps()} />
        <div className="text-center">
          <p className="dropzone-content">
            Drag 'n' drop some files here, or click to select files
          </p>

        </div>
      </div>
    </section>
  );
};

export default Dropzone;