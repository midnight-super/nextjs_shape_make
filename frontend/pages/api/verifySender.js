import sgMail from "@sendgrid/mail";
import client from "@sendgrid/client";

const sendgridApiKey =
  "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";
client.setApiKey(sendgridApiKey);

export default async function (req, res) {
  const { email, name, address, city, country } = req.body;

  // const email = "rakibacademia@gmail.com";

  const senderData = {
    from_email: email,
    from_name: name, // replace with actual name or a default name
    reply_to: email, // can be the user's email or a default one
    address, // physical address
    city,
    country,
    nickname: email, // or any identifier you find suitable
  };

  const request = {
    url: `/v3/verified_senders`,
    method: "POST",
    body: senderData,
  };
  try {
    const [response, body] = await client.request(request);
    res.json({ message: "Verification email sent!", body });
  } catch (error) {
    // console.log(error);
    console.log("an error");
    res.json(error);
  }
}
