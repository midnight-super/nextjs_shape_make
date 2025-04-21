export default async function (req, res) {
  const { file } = req.files;
  const base64 = file.buffer.toString("base64");
  const imageBase64String = `data:${file.mimetype};base64,${base64}`;

  return res.json({ success: true });

  // Use Feathers client to send the base64 string to your backend
  // const feathersClient = ... // Initialize your Feathers client
  // await feathersClient.service('images').create({
  //   image: imageBase64String,
  // });

  // return res.status(200).json({ message: 'Image uploaded successfully.' });
}
