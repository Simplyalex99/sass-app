import { relations } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  boolean,
  real,
  primaryKey,
  pgEnum,
  integer,
} from 'drizzle-orm/pg-core'
import { subscriptionTiers, TierNames } from '#enums'

const createdAt = timestamp('created_at', { withTimezone: true })
  .notNull()
  .defaultNow()
const updatedAt = timestamp('updated_at', { withTimezone: true })
  .defaultNow()
  .$onUpdate(() => new Date())
export const UserTable = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified'),
  emailIsVerified: boolean('email_is_verified').notNull().default(false),
  createdAt,
})

export const VerificationTokenTable = pgTable('verification_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  emailResetTokenExpiresAt: timestamp('email_reset_token_expires_at'),
  emailResetToken: text('email_reset_token'),
  email: text('email')
    .unique()
    .notNull()
    .references(() => UserTable.email, { onDelete: 'cascade' }),
})

export const UserAccountTable = pgTable('user_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email')
    .unique()
    .notNull()
    .references(() => UserTable.email, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
  passwordSalt: text('password_salt').notNull(),
  oneTimePasscode: text('one_time_passcode'),
  oneTimePasscodeExpiresAt: timestamp('one_time_passcode_expires_at'),
  failedAttempts: integer('failed_attempts'),
  lockUntil: timestamp('lock_until'),
})

export const ThirdPartyAccountTable = pgTable('third_party_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type'),
  provider: text('provider'),
  providerAccount: text('provider_account'),
  scope: text('scope'),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  idToken: text('id_token'),
  sessionState: text('session_state'),
  email: text('email')
    .unique()
    .notNull()
    .references(() => UserTable.email, { onDelete: 'cascade' }),
})
export const ProductTable = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email')
    .notNull()
    .references(() => UserTable.email, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  createdAt,
  updatedAt,
})

export const productRelations = relations(ProductTable, ({ one, many }) => ({
  productCustomization: one(ProductCustomizationTable),
  productViews: many(ProductViewTable),
  countryGroupDiscounts: many(CountryGroupDiscountTable),
}))
export const ProductCustomizationTable = pgTable('product_customizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  classPrefix: text('class_prefix'),
  productId: uuid('product_id')
    .notNull()
    .references(() => ProductTable.id, { onDelete: 'cascade' })
    .unique(),
  backgroundColor: text('background_color')
    .notNull()
    .default('hsl(193,82%,31%)'),
  textColor: text('text_color').notNull().default('hsl(0,0,100%)'),
  fontSize: text('font_size').notNull().default('1rem'),
  isSticky: boolean('is_sticky').notNull().default(true),
  bannerContainer: text('banner_container').notNull().default('body'),
  locationMessage: text('location_message')
    .notNull()
    .default(
      'Hey! It looks like you are from <b>{country}</b>. We support Bensellit Purchasing Power, so if you need it, use code <b>"{coupon}"</b> to get <b>{discount}%</b> off.'
    ),
  createdAt,
  updatedAt,
})

export const productCustomizationRelations = relations(
  ProductCustomizationTable,
  ({ one }) => ({
    product: one(ProductTable, {
      fields: [ProductCustomizationTable.productId],
      references: [ProductTable.id],
    }),
  })
)

export const ProductViewTable = pgTable('product_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => ProductTable.id, { onDelete: 'cascade' }),
  countryId: uuid('country_id').references(() => CountryTable.id, {
    onDelete: 'cascade',
  }),
  visitedAt: timestamp('visited_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
export const productViewRelations = relations(ProductViewTable, ({ one }) => ({
  product: one(ProductTable, {
    fields: [ProductViewTable.productId],
    references: [ProductTable.id],
  }),
  country: one(CountryTable, {
    fields: [ProductViewTable.countryId],
    references: [CountryTable.id],
  }),
}))

export const CountryTable = pgTable('countries', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(),
  countryGroupId: uuid('country_group_id')
    .notNull()
    .references(() => CountryGroupTable.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
})
export const countryRelations = relations(CountryTable, ({ many, one }) => ({
  countryGroups: one(CountryGroupTable, {
    fields: [CountryTable.countryGroupId],
    references: [CountryGroupTable.id],
  }),
  productViews: many(ProductViewTable),
}))

export const CountryGroupTable = pgTable('country_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  recommendedDiscountPercentage: real('recommended_discount_percentage'),
  createdAt,
  updatedAt,
})

export const CountryGroupDiscountTable = pgTable(
  'country_group_discounts',
  {
    countryGroupId: uuid('country_group_id')
      .notNull()
      .references(() => CountryGroupTable.id, { onDelete: 'cascade' }),
    productId: uuid('product_id')
      .notNull()
      .references(() => ProductTable.id, { onDelete: 'cascade' }),
    coupon: text('coupon').notNull(),
    discountPercentage: real('discount_percentage').notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    pk: primaryKey({ columns: [table.countryGroupId, table.productId] }),
  })
)
export const countryGroupRelations = relations(
  CountryGroupTable,
  ({ many }) => ({
    countries: many(CountryTable),
    countryGroupDiscounts: many(CountryGroupDiscountTable),
  })
)

export const countryGroupDiscountRelations = relations(
  CountryGroupDiscountTable,
  ({ one }) => ({
    product: one(ProductTable, {
      fields: [CountryGroupDiscountTable.productId],
      references: [ProductTable.id],
    }),
    countryGroup: one(CountryGroupTable, {
      fields: [CountryGroupDiscountTable.countryGroupId],
      references: [CountryGroupTable.id],
    }),
  })
)

export const TierEnum = pgEnum(
  'tier',
  Object.keys(subscriptionTiers) as [TierNames]
)

export const UserSubscriptionTable = pgTable(
  'user_subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email')
      .notNull()
      .unique()
      .references(() => UserTable.email, { onDelete: 'cascade' }),
    stripeSubscriptionItemId: text('stripe_subscription_item_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeCustomerId: text('stripe_customer_id'),
    tier: TierEnum('tier').notNull(),
    createdAt,
    updatedAt,
  },
  (table) => ({
    stripeCustomerIdIndex: index(
      'user_subscriptions.stripe_customer_id_index'
    ).on(table.stripeCustomerId),
  })
)
