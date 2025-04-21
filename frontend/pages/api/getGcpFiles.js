import { Storage } from "@google-cloud/storage";

const key = {
  type: "service_account",
  project_id: "xzist-software",
  private_key_id: "f33513c85ecc45d60fb2b89bbe2e8da6bfb9a0aa",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCo43jTTHNj1rEg\n4mrA04s+XSWzIBGQZwpp3PMk2AvBAUW4WSJ7RdCsTbyCJ9nfu6d1gLCmgDfvcsCV\n02sKbCw+WpguxGhGga1jY2ndxDEQVcAD2Hc35O+b34eVwsMqcnlbGprvtjoT/pTk\nlWGbu8yjYVSHeIc3iGg/4rNlwslNIhEC99ddH0mm0/TQJ8yOTnMHRlO8Qm3OYyee\nlmmLOr/Ia1jkBk79pZ5+CHftslukGA9r32Z0N4Eur7JDrJcoqbsY/YiMg10I2A7G\noMr/5sVvQ5GCT4FST8CBpXcTlDKBEv1SGBh9aZVqRA1VfhYsmmpPocSpr+g0kQhK\nE3rt9LNjAgMBAAECggEALvWU3ne26+9BsAmUskn/wRboSR6lE5g7AoV/i+KQnhlK\n9/+8wTb/1zEENdJ716RXYyoltB4Zr3giSWaQMEU0ph/Nic9tyRD8k5KMWK/ZDpgx\nPEB/oaiD4Tztd7xARPiwep7yrq1mB7I1Vzub+M/mjhUdik9+lXfVuNHBnQ1kqI/Z\nLQK+R0J7pzxcAZC+dJwQwxqGUeDV0nsF/zMAIwVdA/ucqyXUTHRLU6x31UHCOGzR\nicVABLYXfslHpJ7yT3y52TmHkF2WN/++hBFNXIKIhyXVwoI4LPBqqLhNHXOOjCmB\nksMGi2PeodbaZDzA32tyAwjO+FEqJaaZr9X8nWes8QKBgQDVMlkdSu6ThQucfzZU\n6FxIp2L6osCB9eazoSajGLtNA2p576btypxb4PcPVhViFZrMG86cWaRFWotPZPA8\nzj84qc8etGlycipMZ22VQbKnA4Cwm4uzLNEIZ0Ar8CM0KvJoK3jspzRadHiq/Z8C\nkuIcxyZxVi729d1N8XMbvuXWMQKBgQDKy9LV/+Nq3ud68J9sZ4cjaT9W0W+pj2Er\nzF1xsSPxRaMmmwt35dofkeGWT2UuZ5v+pGGLKOVmn1DPC6BusH25Jaq319/U1Usx\nvplxPcXoRKizR+k2yPSu/2p8nSt3l/N59MMTN8MrcMho3hbgPInRLrpcgVI5b6MD\nLMOu/sh50wKBgHcEVm9d53X/Lg49ji00UmBU4ZKdzO5AQnxBGHqwUc+aepR7zyqs\nk0FPg1zSZ7mL6hDL7TmnaWc2NtMpvFuVoAGX+oJfoQY86ZQhoTFTrdJCyFLPYtux\nxzfzvAVLV7vFxfGVYzpp1XYx0zNRxrT/Hq+GFdXrkOhZNSRQCDyTA2fhAoGARQt6\nQAP8QMGdnDzaeoUQ/JxzxTJPSzKWydutoOzHqPiloJo/IFYwmnkHji5/63m5IcyD\nrWaCHBt33tY9jBIo6+WIJ0mnWoY4MLqM8YIvpHHj4g5Et7NZo08wyTaVuwUQD2Cn\nHh7pIxwmD5Y1wai6326CYsZg4U9B9+3Avg7e4KMCgYEAvWsfeUwPnBlkIhTyN9K4\nlYUutMVGaIovrwjvAbEL+UY3TuKaj3gwGtk88guXBgUih6wI2MkGXkH6CX/DJaKb\nC5x2nHKR6RwTqphXtU/YUQ3oiKVC79Q5BLOqffT6f8oSbPnWplMTR44aaq7pfsvI\nU2ktSrwXSH+B9I2X31HFiKc=\n-----END PRIVATE KEY-----\n",
  client_email: "test-storage-acc@xzist-software.iam.gserviceaccount.com",
  client_id: "103388277809269315935",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/test-storage-acc%40xzist-software.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function (req, res) {
  const storage = new Storage({
    credentials: key,
    projectId: "xzist-software",
  });

  const bucketName = "xzist_test_bucket_0";
  const bucket = storage.bucket(bucketName);

  try {
    const [files] = await bucket.getFiles();

    const fileNames = files.map((file) => ({
      name: file.name,
      contentType: file.metadata.contentType,
      size: file.metadata.size,
      updated: file.metadata.updated,
    }));

    console.log(files.length);
    console.log(files[0].metadata);

    console.log("GOT THE FILES!!");
    res.status(200).json({ fileNames });

    return;
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}
