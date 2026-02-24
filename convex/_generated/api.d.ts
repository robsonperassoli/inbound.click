/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as domain_auth from "../domain/auth.js";
import type * as files from "../files.js";
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
import type * as threads_actions from "../threads/actions.js";
import type * as threads_agents from "../threads/agents.js";
import type * as threads_agents_formBuilder from "../threads/agents/formBuilder.js";
import type * as threads_agents_formSubmission from "../threads/agents/formSubmission.js";
import type * as threads_agents_tools from "../threads/agents/tools.js";
import type * as threads_domain from "../threads/domain.js";
import type * as threads_mutations from "../threads/mutations.js";
import type * as threads_queries from "../threads/queries.js";
import type * as threads_validators from "../threads/validators.js";
import type * as users_queries from "../users/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "domain/auth": typeof domain_auth;
  files: typeof files;
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
  "threads/actions": typeof threads_actions;
  "threads/agents": typeof threads_agents;
  "threads/agents/formBuilder": typeof threads_agents_formBuilder;
  "threads/agents/formSubmission": typeof threads_agents_formSubmission;
  "threads/agents/tools": typeof threads_agents_tools;
  "threads/domain": typeof threads_domain;
  "threads/mutations": typeof threads_mutations;
  "threads/queries": typeof threads_queries;
  "threads/validators": typeof threads_validators;
  "users/queries": typeof users_queries;
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
