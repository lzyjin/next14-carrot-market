import {NextRequest} from "next/server";

export async function GET(request: NextRequest) {
  console.log(request)

  return Response.json({
    ok: true
  });
}

export async function POST(request: NextRequest) {
  // 쿠키 정보 가져오기:
  // request.cookies.get("");
  const data = await request.json();
  console.log("log the user in!!!")
  return Response.json(data);
}