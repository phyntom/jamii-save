import { metadata } from './../app/layout';
import { member } from './../drizzle/schemas/member';
import VerifyEmailTemplate from '@/components/emails/verify-email-template';
import ResetPasswordTemplate from '@/components/emails/reset-password-template';
import { db } from '@/drizzle/db';
import { User } from '@/drizzle/schemas/auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { createAuthMiddleware } from 'better-auth/api';
import { Resend } from 'resend';
import WelcomeEmailTemplate from '@/components/emails/welcome-email-template';
import { organization } from 'better-auth/plugins';
import { admin } from 'better-auth/plugins';
import CommunityInviteEmailTemplate from '@/components/emails/community-invite-email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // Replace the callbackURL to redirect to sign-in page
      url = url.replace('callbackURL=/', 'callbackURL=/sign-in');
      resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: 'Verify your email',
        react: VerifyEmailTemplate({ username: user.name, verifyUrl: url }),
      });
    },
    async afterEmailVerification(user, request) {
      // Your custom logic here, e.g., grant access to premium features
      // Use Next.js redirect server method
      console.debug('afterEmailVerification', user, request);
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
    // callbackURL: '/sign', // 1 hour
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      // Replace the callbackURL to redirect to sign-in page
      resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: 'Reset your password',
        react: ResetPasswordTemplate({
          username: user.name,
          resetUrl: `${url}?token=${token}`,
          email: user.email as string,
        }),
      });
    },
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      // Optional
      tenantId: 'common',
      authority: 'https://login.microsoftonline.com', // Authentication authority URL
      prompt: 'select_account', // Forces account selection
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith('/sign-up')) {
        const user = ctx.context.newSession?.user ?? {
          name: ctx.body.name,
          email: ctx.body.email,
        };
        if (user != null) {
          resend.emails.send({
            from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
            to: user.email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            react: WelcomeEmailTemplate({ name: user.name }),
          });
        }
      }
    }),
  },
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'],
  session: {
    cookieCache: {
      enabled: true,
      expiresIn: 60 * 60 * 24, // 1 day
      updateAge: 60 * 60 * 24, // 1 day
    },
  },
  rateLimiting: {
    window: 10,
    max: 100,
  },
  plugins: [
    organization({
      async sendInvitationEmail(data) {
        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitation/${data.id}`;
        resend.emails.send({
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: data.email,
          subject: "You've been invited to join our organization",
          react: CommunityInviteEmailTemplate({
            email: data.email,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            communityName: data.organization.name,
            inviteLink,
          }),
        });
      },
      schema: {
        organization: {
          modelName: 'community',
          fields: {
            name: 'name',
            slug: 'slug',
            logo: 'logo',
            createdAt: 'created_at',
            metadata: 'metadata',
          },
          additionalFields: {
            description: {
              type: 'string',
              input: true,
              required: false,
            },
            visibility: {
              type: 'string',
              input: true,
              required: false,
            },
            contributionFrequency: {
              type: 'string',
              input: true,
              required: false,
            },
            country: {
              type: 'string',
              input: true,
              required: false,
            },
            currency: {
              type: 'string',
              input: true,
              required: false,
            },
            targetAmount: {
              type: 'number',
              input: true,
              required: false,
            },
            currentMemberCount: {
              type: 'number',
              input: true,
              required: false,
            },
            additionalMemberCount: {
              type: 'number',
              input: true,
              required: false,
            },
            isActive: {
              type: 'boolean',
              input: true,
              required: false,
            },
            adminEmail: {
              type: 'string',
              input: true,
              required: false,
            },
            maxMembers: {
              type: 'number',
              input: true,
              required: false,
            },
            planType: {
              type: 'number',
              input: true,
              required: false,
            },
            contributionStartDate: {
              type: 'date',
              input: true,
              required: false,
            },
            communityStartDate: {
              type: 'date',
              input: true,
              required: false,
            },
            updatedAt: {
              type: 'date',
              input: true,
              required: false,
            },
          },
        },
        member: {
          modelName: 'member',
          fields: {
            user_id: 'user_id',
            organizationId: 'communityId',
            role: 'role',
            createdAt: 'created_at',
          },
          additionalFields: {
            status: {
              type: 'string',
            },
            updatedAt: {
              type: 'date',
            },
            metadata: {
              type: 'string',
            },
          },
        },
        invitation: {
          modelName: 'invitation',
          fields: {
            organizationId: 'communityId',
            email: 'email',
            role: 'role',
            status: 'status',
            expiresAt: 'expiresAt',
            inviterId: 'inviterId',
          },
        },
      },
      teams: {
        enabled: false,
      },
    }),
    nextCookies(),
  ],
});
