import React, { useState } from "react";

const ReceiptCapture = ({ onCapture }) => {
  const [image, setImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setImage(imageData);
        onCapture(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {image && <img src={image} alt="Receipt Preview" style={{ maxWidth: "100%", marginTop: "10px" }} />}
    </div>
  );
};

export default ReceiptCapture;
