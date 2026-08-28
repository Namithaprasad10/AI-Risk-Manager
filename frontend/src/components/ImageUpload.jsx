import { useRef, useState } from "react";
import "./ImageUpload.css";

function ImageUpload({ onImageSelect }) {
const inputRef = useRef(null);
const [preview, setPreview] = useState(null);
const [fileName, setFileName] = useState("");

const handleFileChange = (event) => {
const file = event.target.files?.[0];


if (!file) {
  return;
}

if (!file.type.startsWith("image/")) {
  alert("Please upload an image file.");
  return;
}

setFileName(file.name);

const imageUrl = URL.createObjectURL(file);
setPreview(imageUrl);

if (onImageSelect) {
  onImageSelect(file);
}


};

const handleRemove = () => {
setPreview(null);
setFileName("");


if (inputRef.current) {
  inputRef.current.value = "";
}

if (onImageSelect) {
  onImageSelect(null);
}


};

return ( <div className="image-upload">


  <div className="image-upload-header">
    <div>
      <h3>Upload Transaction Image</h3>

      <p>
        Upload a payment screenshot, receipt, or
        transaction document for verification.
      </p>
    </div>
  </div>

  {!preview ? (
    <button
      type="button"
      className="upload-box"
      onClick={() => inputRef.current?.click()}
    >
      <div className="upload-icon">
        ↑
      </div>

      <strong>
        Upload an image
      </strong>

      <span>
        PNG, JPG or JPEG
      </span>

      <small>
        Click to browse files
      </small>
    </button>
  ) : (
    <div className="image-preview">

      <img
        src={preview}
        alt="Uploaded transaction"
      />

      <div className="image-preview-info">

        <div>
          <strong>
            {fileName}
          </strong>

          <span>
            Image uploaded successfully
          </span>
        </div>

        <button
          type="button"
          onClick={handleRemove}
          className="remove-image-button"
        >
          Remove
        </button>

      </div>

    </div>
  )}

  <input
    ref={inputRef}
    type="file"
    accept="image/png,image/jpeg,image/jpg"
    onChange={handleFileChange}
    hidden
  />

</div>

);
}

export default ImageUpload;
