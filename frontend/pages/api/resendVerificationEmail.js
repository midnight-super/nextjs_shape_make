import sgClient from "@sendgrid/client";

const sendgridApiKey =
  "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";
sgClient.setApiKey(sendgridApiKey);

export default async function (req, res) {
  const { senderId } = req.body;

  const request = {
    url: `/v3/verified_senders/resend/${senderId}`,
    method: "POST",
  };

  try {
    const [response, body] = await sgClient.request(request);
    console.log("Resent verification stuff");
    res.json({ success: true, body });
  } catch (error) {
    console.log("There has been an error!");
    res.json(error);
  }
}
