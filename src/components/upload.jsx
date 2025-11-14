import React, { useState } from "react";
import { openUploadWidget } from "../lib/storage";

const Sample = () => {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div>
      <button onClick={() => openUploadWidget((url) => setImageUrl(url))}>
        Upload Image
      </button>

      {imageUrl && <img src={imageUrl} alt="Uploaded" width={300} />}
    </div>
  );
};

export default Sample;
