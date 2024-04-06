// export function middleware(request) {
//     const currentUser = request.cookies.get('token')?.value
   
//     if (currentUser && !request.nextUrl.pathname.startsWith('/user')) {
//       return Response.redirect(new URL('/user', request.url))
//     }
   
//     if (!currentUser && !request.nextUrl.pathname.startsWith('/auth/login')) {
//       return Response.redirect(new URL('/auth/login', request.url))
//     }
//   }
   
// export const config = {
//     matcher: ['/((?!^/user$).*)'],
// };
   
  