import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL,
);

export const getGoogleAuthUrl = () => {
    
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: 'consent'
  });
  return authUrl
};


export const getGoogleUserInfo = async (code: string) => {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID as string 
    });

    const payload = ticket.getPayload();

    return {
        id: payload?.sub,
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture
    }
}