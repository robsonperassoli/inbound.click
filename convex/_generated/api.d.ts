/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agents_actions from "../agents/actions.js";
import type * as agents_domain from "../agents/domain.js";
import type * as agents_mutations from "../agents/mutations.js";
import type * as auth from "../auth.js";
import type * as chats_domain from "../chats/domain.js";
import type * as chats_mutations from "../chats/mutations.js";
import type * as chats_queries from "../chats/queries.js";
import type * as domain_auth from "../domain/auth.js";
import type * as files from "../files.js";
import type * as formSubmissionChatSessions_domain from "../formSubmissionChatSessions/domain.js";
import type * as forms_domain from "../forms/domain.js";
import type * as forms_mutations from "../forms/mutations.js";
import type * as forms_queries from "../forms/queries.js";
import type * as http from "../http.js";
import type * as links_mutations from "../links/mutations.js";
import type * as links_queries from "../links/queries.js";
import type * as profiles_domain from "../profiles/domain.js";
import type * as profiles_mutations from "../profiles/mutations.js";
import type * as profiles_queries from "../profiles/queries.js";
import type * as public_ from "../public.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "agents/actions": typeof agents_actions;
  "agents/domain": typeof agents_domain;
  "agents/mutations": typeof agents_mutations;
  auth: typeof auth;
  "chats/domain": typeof chats_domain;
  "chats/mutations": typeof chats_mutations;
  "chats/queries": typeof chats_queries;
  "domain/auth": typeof domain_auth;
  files: typeof files;
  "formSubmissionChatSessions/domain": typeof formSubmissionChatSessions_domain;
  "forms/domain": typeof forms_domain;
  "forms/mutations": typeof forms_mutations;
  "forms/queries": typeof forms_queries;
  http: typeof http;
  "links/mutations": typeof links_mutations;
  "links/queries": typeof links_queries;
  "profiles/domain": typeof profiles_domain;
  "profiles/mutations": typeof profiles_mutations;
  "profiles/queries": typeof profiles_queries;
  public: typeof public_;
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

export declare const components: {};
