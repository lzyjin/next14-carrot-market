export function GET() {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    // allow_signup: "false",
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseUrl}?${formattedParams}`;

  return Response.redirect(finalUrl);
}