import sgMail from "@sendgrid/mail";
const sendgridApiKey =
  "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";
sgMail.setApiKey(sendgridApiKey);

export default async function (req, res) {
  const { subject, text, toAddress, fromAddress } = req.body;

  try {
    // const fromAddress = "rakib@think-engineer.com";
    // const toAddress = "rakibkhan@live.co.uk";

    const msg = {
      to: toAddress,
      from: fromAddress,
      subject,
      html: text,
    };

    await sgMail.send(msg);

    console.log("Email sent");
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}
