import sgMail from "@sendgrid/mail";
import client from "@sendgrid/client";

const sendgridApiKey =
  "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";
client.setApiKey(sendgridApiKey);

export default async function (req, res) {
  const { subject, text, toAddress } = req.body;

  try {
    const request = {
      url: `/v3/verified_senders`,
      method: "GET",
    };

    client.request(request).then(([response, body]) => {
      console.log("got the stuff");

      console.log(response.statusCode);
      //   console.log(body);

      console.log(response.body);

      res.json({
        success: true,
        senders: body.results,
      });
    });
  } catch (error) {
    // console.log(error);
    console.log("an error");
    res.json(error);
  }
}
