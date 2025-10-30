export { default } from "next-auth/middleware"

export const config = {
  matcher: ["/dashboard/:path*", "/servicios/:path*", "/trabajadores/:path*", "/ingresos/:path*", "/gastos/:path*", "/trabajos/:path*"]
}
