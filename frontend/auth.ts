import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
if (process.env.GITHUB_CLIENT_ID === undefined) {
  throw new Error('Github client ID not defined')
}
if (process.env.GITHUB_CLIENT_SECRET === undefined) {
  throw new Error('Github client secret not defined')
}
if (process.env.GOOGLE_CLIENT_ID === undefined) {
  throw new Error('Google client id not defined')
}
if (process.env.GOOGLE_CLIENT_SECRET === undefined) {
  throw new Error('Google client secret not defined')
}
export const { signIn, signOut, auth, handlers } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.nickname,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
  ],

  secret: process.env.NEXT_AUTH_SCRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }

      return token
    },
    async session({ session, token, user }) {
      const accessToken = token.accessToken as string

      const userId = token.id

      return { ...session, accessToken, userId }
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true

      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
})
