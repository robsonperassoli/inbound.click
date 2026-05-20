/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as accounts_domain from "../accounts/domain.js";
import type * as accounts_mutations from "../accounts/mutations.js";
import type * as accounts_queries from "../accounts/queries.js";
import type * as accounts_validators from "../accounts/validators.js";
import type * as auth from "../auth.js";
import type * as cron from "../cron.js";
import type * as custom from "../custom.js";
import type * as emails from "../emails.js";
import type * as feedback from "../feedback.js";
import type * as files from "../files.js";
import type * as forms_domain from "../forms/domain.js";
import type * as forms_mutations from "../forms/mutations.js";
import type * as forms_queries from "../forms/queries.js";
import type * as forms_validators from "../forms/validators.js";
import type * as frontend from "../frontend.js";
import type * as http from "../http.js";
import type * as links_domain from "../links/domain.js";
import type * as links_mutations from "../links/mutations.js";
import type * as links_queries from "../links/queries.js";
import type * as links_validators from "../links/validators.js";
import type * as profiles_domain from "../profiles/domain.js";
import type * as profiles_mutations from "../profiles/mutations.js";
import type * as profiles_queries from "../profiles/queries.js";
import type * as profiles_validators from "../profiles/validators.js";
import type * as public_ from "../public.js";
import type * as stripe from "../stripe.js";
import type * as stripe_domain from "../stripe/domain.js";
import type * as support from "../support.js";
import type * as system from "../system.js";
import type * as threads_actions from "../threads/actions.js";
import type * as threads_agents from "../threads/agents.js";
import type * as threads_agents_designer from "../threads/agents/designer.js";
import type * as threads_agents_formBuilder from "../threads/agents/formBuilder.js";
import type * as threads_agents_formSubmission from "../threads/agents/formSubmission.js";
import type * as threads_agents_tools from "../threads/agents/tools.js";
import type * as threads_domain from "../threads/domain.js";
import type * as threads_mutations from "../threads/mutations.js";
import type * as threads_queries from "../threads/queries.js";
import type * as threads_validators from "../threads/validators.js";
import type * as users_domain from "../users/domain.js";
import type * as utils_names from "../utils/names.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "accounts/domain": typeof accounts_domain;
  "accounts/mutations": typeof accounts_mutations;
  "accounts/queries": typeof accounts_queries;
  "accounts/validators": typeof accounts_validators;
  auth: typeof auth;
  cron: typeof cron;
  custom: typeof custom;
  emails: typeof emails;
  feedback: typeof feedback;
  files: typeof files;
  "forms/domain": typeof forms_domain;
  "forms/mutations": typeof forms_mutations;
  "forms/queries": typeof forms_queries;
  "forms/validators": typeof forms_validators;
  frontend: typeof frontend;
  http: typeof http;
  "links/domain": typeof links_domain;
  "links/mutations": typeof links_mutations;
  "links/queries": typeof links_queries;
  "links/validators": typeof links_validators;
  "profiles/domain": typeof profiles_domain;
  "profiles/mutations": typeof profiles_mutations;
  "profiles/queries": typeof profiles_queries;
  "profiles/validators": typeof profiles_validators;
  public: typeof public_;
  stripe: typeof stripe;
  "stripe/domain": typeof stripe_domain;
  support: typeof support;
  system: typeof system;
  "threads/actions": typeof threads_actions;
  "threads/agents": typeof threads_agents;
  "threads/agents/designer": typeof threads_agents_designer;
  "threads/agents/formBuilder": typeof threads_agents_formBuilder;
  "threads/agents/formSubmission": typeof threads_agents_formSubmission;
  "threads/agents/tools": typeof threads_agents_tools;
  "threads/domain": typeof threads_domain;
  "threads/mutations": typeof threads_mutations;
  "threads/queries": typeof threads_queries;
  "threads/validators": typeof threads_validators;
  "users/domain": typeof users_domain;
  "utils/names": typeof utils_names;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  workOSAuthKit: import("@convex-dev/workos-authkit/_generated/component.js").ComponentApi<"workOSAuthKit">;
  migrations: import("@convex-dev/migrations/_generated/component.js").ComponentApi<"migrations">;
  stripe: import("@convex-dev/stripe/_generated/component.js").ComponentApi<"stripe">;
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
};
