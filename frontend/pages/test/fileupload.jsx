import { AuthContext } from "@/context/AuthContext";
import client from "@/feathers";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useState } from "react";

import Compressor from "compressorjs";

export default function FileUpload() {
  const { user } = useContext(AuthContext);

  const [file, setFile] = useState(null);
  const [image64, setImage64] = useState(null);

  const [compressedFile, setCompressedFile] = useState(null);

  const uploadFile = async () => {
    try {
      let x = await fetch("/api/uploadFile");
      x = await x.json();
      console.log(x);
      return;

      const filename = encodeURIComponent(file.name);

      const res = await fetch(`/api/uploadFile?file=${filename}`);
      const { url, fields } = await res.json();
      const formData = new FormData();

      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log(fields);
      console.log(url);

      const upload = await fetch(url, {
        method: "POST",
        body: formData,
      });

      console.log("here is the upload thing...");
      console.log(upload);

      if (upload.ok) {
        console.log("Uploaded successfully!");
      } else {
        console.error("Upload failed.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    console.log(e.target.files);
    setFile(e.target.files[0]);
  };

  const uploadBinary = async () => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        const base64data = reader.result;
        setImage64(base64data);

        console.log(base64data);
      };
    } catch (error) {
      console.log(error);
    }
  };

  const saveBinary = async () => {
    try {
      // console.log(image64);

      console.log(user._id);

      await client.service("users").patch(user._id, {
        image: image64,
        // lplp: "kkoko",
      });

      console.log("saved...");
    } catch (error) {
      console.log(error);
    }
  };

  const sendFileToApi = async () => {
    try {
    } catch (error) {}
  };

  const compressImage = async () => {
    new Compressor(file, {
      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        console.log(compressedResult);
        setCompressedFile(compressedResult);
        // setCompressedFile(res);
      },
    });
  };

  const fullUpload = async () => {
    new Compressor(file, {
      quality: 0.8,
      success: async (compressedFile) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);

        reader.onloadend = async () => {
          const base64File = reader.result;

          await client.service("users").patch(user._id, {
            image: base64File,
          });
        };
      },
    });

    // get a binary

    // save binary to image
  };

  return (
    <div className="flex-1 p-4">
      <input type="file" onChange={handleFileChange} />
      <Button onClick={uploadFile}>Upload File</Button>
      <Button onClick={uploadBinary}>Upload Binary</Button>
      <Button onClick={saveBinary}>Save Binary</Button>
      <Button onClick={compressImage}>Compress Image</Button>
      <Button onClick={fullUpload}>Full Upload</Button>

      <h1>preview image</h1>

      {file ? <img src={file} /> : "No file selected..."}

      <h1>user image</h1>

      {user.image && <img src={user.image} />}
    </div>
  );
}
