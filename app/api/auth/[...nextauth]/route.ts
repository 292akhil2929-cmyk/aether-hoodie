import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const googleClientId = process.env.GOOGLE_CLIENT_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

const handler = NextAuth({
  providers: googleClientId && googleClientSecret ? [GoogleProvider({ clientId: googleClientId, clientSecret: googleClientSecret })] : [],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
