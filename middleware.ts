import {NextRequest, NextResponse} from "next/server";
import getSession from "@/lib/session";
// import {notFound} from "next/navigation";

interface Routes {
  [key: string]: boolean;
}

// 인증되지 않은 사용자가 갈 수 있는 url(로그아웃 상태로 방문 가능)
// 로그인한 사용자는 갈 수 없다.
// 배열이 아니라 객체로 만든 이유는 객체에서 검색하는게 조금 더 빠르기 때문
const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();

  // 사용자가 public url로 이동하려고 하는지 여부
  const exists = publicOnlyUrls[request.nextUrl.pathname];

  // 로그아웃 상태
  if(!session.id) {
    // 이동하려는 페이지가 public url이 아니면
    if(!exists) {
      return NextResponse.redirect(new URL("/", request.url));
    }

  // 로그인 상태
  } else {
    // 이동하려는 페이지가 public url이면
    if(exists) {
      return NextResponse.redirect(new URL("/home", request.url));

      // redirect 대신 404페이지인 not found 페이지를 보여주는 방법도 있다.
      // notFound();
    }
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};