import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jc@carmonaweb.com',
    subject: 'Thanks for joinint in!',
    text: `Welcome to the Task Manager app ${name}!`
  });
};

export const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'jc@carmonaweb.com',
    subject: "Oh no, don't go!",
    text: `We are sorry to see you go ${name}! \nIs there anything that we could do to get you back?`
  });
}