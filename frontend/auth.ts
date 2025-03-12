import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { fetchData } from '@/utils/others/fetchData'
import { userService } from '@/utils/services/db/user'
import { userAccountService } from '@/utils/services/db/userAccount'
import { providerService } from '@/utils/services/db/thirdPartyProvider'
import { subscriptionService } from '@/utils/services/db/subscription'
import { subscriptionTiers } from '@/constants/subscriptionTiers'
import { JWTUtil } from '@/utils/auth/jwt'
import { JWTCookieUtil } from '@/utils/auth/cookie'
import { cookies } from 'next/headers'
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if (!user.email) {
        return false
      }
      const existingUsers = await Promise.all([
        userAccountService.getUserByEmail(user.email),

        providerService.getUserByEmail(user.email),
      ])
      const userAccounts = existingUsers[0]
      if (userAccounts.length !== 0) {
        return false
      }
      const oauthAccounts = existingUsers[1]
      if (
        oauthAccounts.length !== 0 &&
        oauthAccounts[0].provider !== account?.provider
      ) {
        return false
      }
      if (
        oauthAccounts.length !== 0 &&
        oauthAccounts[0].provider === account?.provider
      ) {
        return true
      }
      const accessToken = account?.access_token

      const response = await fetchData<
        Array<{
          email: string
          primary: boolean
          verified: boolean
        }>
      >('https://api.github.com/user/emails', {
        method: 'GET',
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      const userData = response.body.find((data) => {
        return data.verified && email === user.email
      })
      if (!userData) {
        return false
      }
      const users = await userService.getUserByEmail(userData.email)
      if (users.length !== 0) {
        return false
      }
      const userResult = await userService.createUser(userData.email)
      if (userResult.length === 0) {
        return false
      }
      const { id } = userResult[0]
      subscriptionService.createSubscription({
        userId: id,
        email: userData.email,
        subscriptionTier: subscriptionTiers.Free.name,
      })
      providerService.createUser({
        email: userData.email,
        userId: id,
        provider: account?.provider,
      })
      const authAccessToken = await JWTUtil.createAccessToken({ userId: id })
      const authRefreshToken = await JWTUtil.createRefreshToken({ userId: id })
      const jwtUtilCookie = new JWTCookieUtil()
      const cookieStore = await cookies()
      jwtUtilCookie.saveCookie([authAccessToken, authRefreshToken], cookieStore)

      return true
    },
  },
})
