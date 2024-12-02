import {NextRequest} from "next/server";
import {notFound} from "next/navigation";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return notFound();
  }

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret	: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();

  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;

  // 한줄로 쓰기
  // const accessTokenData = await (await fetch(accessTokenURL)).json();

  // 두줄로 쓰기
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });
  const accessTokenData = await accessTokenResponse.json();

  if("error" in accessTokenData) {
    return new Response(null, {
      status: 400,
    });
  }

  return Response.json({accessTokenData});
}