import { BACKEND_URL, FRONTEND_URL } from "@/extra_config";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const API_URL = `${BACKEND_URL}/api/uploadFile`;

export default function test() {
  async function init() {
    try {
      console.log("starting test...");
      let res = await axios.post(`${BACKEND_URL}/api/uploadFile`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // init();
  }, []);

  const getStorage = async () => {
    try {
      console.log("starting test...");
      let res = await axios.post(`${BACKEND_URL}/api/uploadFile`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [file, setFile] = useState(null);

  const fileChangedHandler = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadHandler = async () => {
    const formData = new FormData();
    formData.append("file", file);

    let res = await fetch(`${BACKEND_URL}/upload-file`, {
      method: "POST",
      body: formData,
    });

    res = await res.json();

    console.log(res);
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-8">
      <button className="btn btn-primary w-fit" onClick={getStorage}>
        Get storage stuff
      </button>
      <input type="file" onChange={fileChangedHandler} />
      <button onClick={uploadHandler} className="btn btn-secondary w-fit">
        Upload
      </button>
    </div>
  );
}
