async function validateRecaptchaToken(token: string) {
  // Replace these with your actual site key and secret key
  const siteKey = process.env.RECAPTCHA_SITE_KEY;
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
  );

  if (!response.ok) {
    throw new Error("Failed to validate recaptcha token");
  } else {
    console.log("Recaptcha token validated successfully");
  }

  const data = await response.json();

  return data;
}

export default validateRecaptchaToken;
