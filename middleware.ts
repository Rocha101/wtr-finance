import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/", "/sing-in", "/sign-up"],
  afterAuth(auth, request, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({
        returnBackUrl: request.url,
      });
    }
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
