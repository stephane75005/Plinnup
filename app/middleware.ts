import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/choix", "/dashboard/:path*", "/profile/:path*", "/admin/:path*"],
};
