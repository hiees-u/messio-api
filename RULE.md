# Messio API — Development Rules

## 1. Project Overview

Messio API is a backend application built with NestJS and TypeScript.

The project integrates with:

- **Database:** PostgreSQL via Prisma ORM.
- **Cache:** Redis.
- **Queue:** Background job processing.
- **Authentication:** JWT, Google OAuth, and Facebook OAuth.
- **External API:** Facebook Graph API.
- **Real-time communication:** Socket.IO / WebSocket.

### Core principles

1. Keep code readable, maintainable, and consistent.
2. Separate business logic from infrastructure concerns.
3. Follow single-responsibility principles.
4. Prefer explicit types over implicit or unsafe types.
5. Reuse existing project patterns before introducing new abstractions.
6. Avoid unnecessary complexity and premature optimization.
7. Prioritize correctness, security, and testability.

---

## 2. Project Structure

Organize code according to business responsibilities and technical boundaries.

```text
src/
├── common/
│   ├── authentication/
│   ├── authorization/
│   ├── middleware/
│   └── types/
├── generated/
│   └── prisma/
├── infrastructure/
│   ├── crypto/
│   ├── prisma/
│   ├── queues/
│   ├── redis/
│   └── websocket/
├── modules/
│   ├── auth/
│   ├── chats/
│   ├── pages/
│   ├── users/
│   ├── webhooks/
│   └── workspace/
├── providers/
│   └── facebook/
├── app.module.ts
└── main.ts
```

### Rules

- `modules/`: Contains business features and application use cases.
- `common/`: Contains reusable cross-cutting components shared across modules.
- `infrastructure/`: Contains integrations with databases, caches, queues, encryption, and other technical infrastructure.
- `providers/`: Contains clients, services, and data contracts for external providers.
- `generated/`: Contains generated code. Never manually modify generated Prisma files.
- `main.ts`: Application bootstrap and global configuration.
- `app.module.ts`: Root module that composes application modules.

### Module boundaries

1. A module should own a clearly defined business responsibility.
2. Group files by feature rather than creating large global folders for every file type.
3. Keep related functionality together when it belongs to the same business domain.
4. Do not create a new module solely to make the folder tree look cleaner.
5. Do not place business logic in `common/` or `infrastructure/` merely because multiple modules use it.
6. Before moving code between modules, verify its responsibility and dependencies.

---

## 3. Naming Conventions

### 3.1. File and folder names

Use `kebab-case` for file names and directory names.

Examples:

```text
workspace.service.ts
workspace.repository.ts
facebook-graph.client.ts
create-workspace.input.ts
get-pages.result.ts
pages-cache.mapper.ts
```

Avoid inconsistent naming:

```text
useWorkspace.repository.ts
work-space.repository.ts
pagesCache.mapper.ts
FaceBookPage.service.ts
```

Use consistent terminology throughout the project. Prefer `workspace`, `Facebook`, `user-access-token`, and `permissions`.

### 3.2. TypeScript identifiers

| Element | Convention | Example |
|---|---|---|
| Class | PascalCase | `WorkspaceService` |
| Type | PascalCase | `CreateWorkspaceInput` |
| Interface | PascalCase | `FacebookPage` |
| Variable | camelCase | `workspaceId` |
| Function | camelCase | `getWorkspaceById()` |
| Enum | PascalCase | `WorkspaceRole` |
| Enum member | Follow existing enum convention | `ADMIN` |
| Constant | Follow existing constant convention | `DEFAULT_CACHE_TTL` |

Use descriptive names that communicate purpose.

Avoid vague names such as `data`, `temp`, `item`, or `result` when a more meaningful name is available. Short names are acceptable for small, obvious scopes.

### 3.3. Repository naming

Use:

```text
user.repository.ts
page.repository.ts
workspace.repository.ts
message.repository.ts
permission.repository.ts
```

Do not use the `use` prefix for repository file names or repository classes. The prefix is unnecessary in standard NestJS service/repository naming.

---

## 4. Module Responsibilities

### 4.1. Controller

Controllers handle transport-level concerns.

Responsibilities:

- Receive HTTP requests.
- Extract route parameters, query parameters, and request bodies.
- Apply guards, decorators, and validation.
- Call the appropriate service.
- Return the appropriate response.

Rules:

- Do not put complex business logic in controllers.
- Do not perform database queries directly in controllers.
- Do not put Redis operations directly in controllers.
- Keep controllers thin and focused on HTTP concerns.

### 4.2. Service

Services coordinate business operations and implement use cases.

Responsibilities:

- Apply business rules.
- Coordinate repositories and other services.
- Validate business conditions.
- Handle transaction boundaries where appropriate.
- Transform or coordinate data through dedicated mappers when needed.

Rules:

- Do not make controllers responsible for business logic.
- Avoid duplicating the same business rules across multiple services.
- Do not access another module's private implementation directly.
- Use exported providers and module contracts when communicating across modules.
- Do not introduce an interface or abstraction without a concrete benefit.

### 4.3. Repository

Repositories encapsulate data access.

Responsibilities:

- Query, create, update, and delete database records.
- Encapsulate reusable Prisma query logic.
- Return appropriately typed results.
- Handle data persistence concerns.

Rules:

- Do not place HTTP request handling in repositories.
- Do not place controller-specific response formatting in repositories.
- Avoid duplicating identical Prisma queries across multiple repositories.
- Use transactions when multiple database operations must succeed or fail together.
- Do not assume that a database record exists unless the query or business flow guarantees it.
- Keep query selection and relation loading as narrow as practical.

### 4.4. Mapper

Mappers convert data between different representations.

Examples:

- Facebook Graph API responses to internal data structures.
- Prisma records to application results.
- Cache records to application data.

Rules:

- Use a mapper when transformation logic is meaningful or reused.
- Keep mapping behavior explicit and predictable.
- Avoid embedding database queries, Redis operations, or HTTP requests in a pure mapper.
- Do not create a mapper for a trivial one-line transformation unless it improves clarity or reuse.

---

## 5. DTO, Input, Result, and Schema Rules

These concepts serve different purposes and must not be treated as interchangeable.

### 5.1. DTO

Use DTOs for transport contracts, such as HTTP requests and responses.

Examples:

```text
register-pages.request.dto.ts
register-pages.response.dto.ts
facebook-webhook-verification.request.dto.ts
```

Rules:

- HTTP request DTOs describe accepted request data.
- HTTP response DTOs describe the API response contract.
- Use the project's existing validation approach for incoming requests.
- Do not expose internal database models directly as public API contracts without reviewing the fields and security implications.

### 5.2. Input

Use `*.input.ts` for internal operation inputs that are not HTTP DTOs.

Examples:

```text
create-workspace.input.ts
create-customer.input.ts
set-pages-graph.input.ts
```

Example:

```ts
export type CreateWorkspaceInput = {
  pageId: string;
  userId: number;
};
```

Rules:

- Internal inputs should represent the data required by a specific operation.
- Do not add HTTP-specific decorators to plain internal input types.
- Avoid using a large generic input type when a smaller operation-specific type is clearer.

### 5.3. Result

Use `*.result.ts` for internal operation results.

Examples:

```text
get-pages.result.ts
get-all-pages.result.ts
create-google-auth.result.ts
```

Rules:

- A result type represents the output of an internal operation.
- Do not name an internal result `*.response.dto.ts` unless it is actually an API response DTO.
- Use explicit result types instead of relying on implicit inference for complicated public service contracts.

### 5.4. Schema

Use `*.schema.ts` for schemas that define or validate data structures, according to the validation library already used in the project.

Examples:

```text
register-pages.schema.ts
get-pages.schema.ts
assign-users-for-page.schema.ts
```

Rules:

- Keep schemas close to the feature or contract they validate.
- Do not introduce a second validation library for the same purpose without a clear reason.
- Do not assume that a TypeScript type alone performs runtime validation.

### 5.5. External provider contracts

External API response types belong to their corresponding provider.

Example:

```text
providers/
└── facebook/
    └── dtos/
        └── facebook-page.graph.response.ts
```

Rules:

- Keep external API contracts separate from internal application types.
- Do not assume external API fields are always present unless guaranteed by the provider contract.
- Handle nullable and optional fields explicitly.
- Map external responses to internal representations when the two contracts have different responsibilities.

---

## 6. TypeScript Rules

### 6.1. Avoid `any`

Prefer explicit types. Use `unknown` when the type is genuinely unknown.

Avoid:

```ts
function handleError(error: any) {
  console.log(error.message);
}
```

Prefer:

```ts
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
    return;
  }

  console.error('An unknown error occurred');
}
```

Rules:

- Do not use `any` to bypass type errors.
- Narrow `unknown` before accessing properties.
- Define explicit types for complex function inputs and outputs.
- Use generated Prisma types where appropriate.
- Avoid unnecessary type assertions.
- Do not use non-null assertions (`!`) without a clear invariant that guarantees the value exists.

### 6.2. Prefer precise types

Avoid broad object types when the actual shape is known.

Prefer:

```ts
type WorkspaceSummary = {
  id: number;
  name: string;
};
```

Instead of:

```ts
type WorkspaceSummary = object;
```

Rules:

- Use `null` and `undefined` intentionally.
- Distinguish optional fields from required fields.
- Use union types when an operation has multiple valid outcomes.
- Avoid duplicating existing types unless the new type represents a genuinely different contract.

### 6.3. Avoid unsafe type conversions

Do not cast data into a type simply to make the compiler accept it.

When data comes from an external provider, database, cache, or webhook, verify its shape at the appropriate boundary.

---

## 7. Async and Collection Operations

### 7.1. Promise handling

Rules:

- Await asynchronous operations when their results are required.
- Handle errors at an appropriate boundary.
- Do not create unhandled promises.
- Use `Promise.all()` for independent operations that should run concurrently.
- Use sequential execution when operation order or data dependencies require it.
- Consider concurrency limits when processing large collections.

Example:

```ts
const [user, workspace] = await Promise.all([
  this.userRepository.findById(userId),
  this.workspaceRepository.findById(workspaceId),
]);
```

Only parallelize operations that are safe to execute independently.

### 7.2. `map()` versus `forEach()`

Use `map()` when transforming values into a new array.

```ts
const workspaceIds = workspaces.map(
  (workspace) => workspace.id,
);
```

Use `forEach()` when performing synchronous side effects without producing a new array.

```ts
workspaces.forEach((workspace) => {
  this.processWorkspace(workspace);
});
```

Do not use `map()` only for side effects.

For asynchronous side effects, explicitly choose between sequential `for...of`, `Promise.all()`, or a concurrency-limited approach.

### 7.3. Redis pipelines

Rules:

- Keep metadata associated with each pipeline command.
- Remember that pipeline results correspond to individual commands, not necessarily to the original input groups.
- Do not correlate pipeline result indexes with a different array unless both arrays are guaranteed to have identical ordering and length.
- Handle individual command errors returned by the Redis client.
- Initialize collection values before calling methods such as `.push()`.
- Do not assume that a successful pipeline execution means every command succeeded.
- Apply cache consistency rules explicitly when a command fails.

Example:

```ts
type PipelinePage = {
  accountId: number;
  page: PagesCacheType;
};
```

Maintain one metadata entry for each queued command when command-level results must be mapped back to the original account or page.

---

## 8. Error Handling and Logging

Rules:

1. Do not silently swallow errors.
2. Do not return an empty object or empty array for every error unless that behavior is part of the explicit contract.
3. Preserve enough context to diagnose failures.
4. Do not log passwords, access tokens, refresh tokens, OAuth secrets, or other sensitive information.
5. Use NestJS exceptions for HTTP-facing business errors.
6. Handle external provider errors separately from internal application errors when their recovery behavior differs.
7. Use `finally` for cleanup that must occur regardless of success or failure.

Avoid:

```ts
try {
  return await this.repository.findAll();
} catch (error) {
  console.log(error);
  return {};
}
```

Prefer handling the error according to the method's contract:

```ts
try {
  return await this.repository.findAll();
} catch (error: unknown) {
  this.logger.error(
    'Failed to retrieve records',
    error instanceof Error ? error.stack : undefined,
  );

  throw error;
}
```

Do not blindly rethrow every infrastructure error as an HTTP 500. Translate errors only where the application boundary requires it, and preserve useful diagnostic information.

---

## 9. Prisma and Database Rules

Rules:

- Keep Prisma access inside repositories or explicitly designated data-access components.
- Use generated Prisma types instead of manually duplicating database model definitions.
- Do not modify generated Prisma files manually.
- Keep database transactions at the appropriate application or repository boundary.
- Avoid N+1 query patterns when relation loading or batching can solve the problem.
- Select only the fields needed for the operation when practical.
- Handle unique constraints, foreign-key constraints, and missing records explicitly.
- Do not assume that multiple database calls are atomic unless they are inside a transaction.
- Use migrations to manage database schema changes.
- Never edit a production database schema without an appropriate migration and deployment plan.

For multi-step operations, determine whether partial success is acceptable. If it is not, use a transaction or another consistency mechanism appropriate to the involved systems.

---

## 10. Redis and Cache Rules

Rules:

- Centralize Redis key construction where it improves consistency.
- Use consistent key naming conventions.
- Define cache TTLs explicitly.
- Avoid duplicating cache serialization and deserialization logic.
- Handle cache misses separately from Redis failures.
- Do not treat cached data as the authoritative source when the database is the source of truth.
- Consider cache invalidation whenever the underlying data changes.
- Do not assume that a Redis pipeline is an atomic transaction.
- Keep cache data structures separate from HTTP DTOs unless they intentionally share the same contract.
- Avoid logging serialized cache values if they may contain sensitive information.

Cache failures should follow an explicit policy: fail the operation, return database data, retry, or omit only the affected cache entry, depending on the business requirements.

---

## 11. Authentication and Authorization

Authentication and authorization are separate responsibilities.

- **Authentication:** establishes the identity of the current user.
- **Authorization:** determines whether that user may perform a particular operation.

Rules:

- Use guards and decorators for request-level access control where appropriate.
- Centralize reusable permission checks.
- Do not rely on frontend checks as a security boundary.
- Verify resource ownership and membership on the backend.
- Do not trust user IDs, page IDs, workspace IDs, or permissions supplied by a client without verification.
- Apply authorization to WebSocket events and other non-HTTP entry points as well as HTTP endpoints.
- Keep token validation and permission evaluation explicit.
- Use least-privilege access by default.

For Workspace-related operations, verify that the current user has the required relationship and permission for the target resource.

---

## 12. Facebook Graph API and Webhooks

Rules:

- Keep Graph API HTTP communication inside the Facebook provider layer.
- Keep provider-specific request and response contracts inside `providers/facebook/`.
- Keep application business logic inside the relevant business module.
- Handle access-token expiration, permission errors, rate limits, and transient provider failures explicitly.
- Do not assume external API responses always contain every expected field.
- Validate webhook verification requests according to Meta's documented requirements.
- Validate and safely parse incoming webhook payloads.
- Acknowledge webhook requests according to the provider's requirements, without treating acknowledgement as proof that every downstream operation succeeded.
- Design webhook processing to tolerate duplicate deliveries where applicable.
- Use idempotency or deduplication mechanisms for operations that must not be applied twice.
- Do not expose access tokens or app secrets in logs or API responses.

For Facebook Messenger events, keep external identifiers such as Page IDs and PSIDs clearly distinguished from internal database IDs.

---

## 13. WebSocket Rules

Rules:

- Authenticate socket connections before allowing protected operations.
- Validate authorization for rooms and events, not only at connection time.
- Do not trust room IDs or user IDs supplied by clients without verification.
- Keep socket event handling separate from unrelated business logic.
- Reuse business services for shared operations rather than duplicating the same logic in HTTP and WebSocket handlers.
- Validate event payloads.
- Handle disconnects and asynchronous failures safely.
- Avoid exposing private message or workspace data to unauthorized clients.

A successful socket connection does not automatically grant permission to join every room.

---

## 14. Security and Environment Configuration

Rules:

- Never commit real secrets, passwords, access tokens, private keys, or OAuth client secrets.
- Use environment variables or an appropriate secret manager for sensitive configuration.
- Keep local environment files out of version control.
- Validate required configuration during application startup.
- Use HTTPS in production.
- Apply appropriate CORS, rate-limiting, and request-validation policies.
- Avoid returning internal stack traces or sensitive infrastructure details to clients.
- Encrypt sensitive stored tokens when required by the application's security model.
- Rotate secrets if they have been exposed.
- Treat incoming external data as untrusted.

Do not include real credentials in source code, test fixtures, screenshots, documentation, or logs.

---

## 15. Testing Rules

Write tests for behavior and business requirements, not only for implementation details.

Prioritize tests for:

- Authentication and authorization.
- Workspace membership and permission checks.
- Page registration and account relationships.
- Message and customer persistence.
- Facebook webhook processing.
- Redis cache behavior and partial pipeline failures.
- Error handling and important edge cases.

Rules:

- Unit tests should isolate the component under test where appropriate.
- Integration tests should verify important interactions with databases, Redis, and other dependencies.
- End-to-end tests should cover critical application flows.
- Do not rely exclusively on happy-path tests.
- Test missing records, invalid input, duplicate events, permission denial, and external service failures where relevant.
- Keep tests deterministic and avoid depending on live external APIs unless explicitly intended.

---

## 16. Code Quality and Refactoring

Rules:

- Follow the existing ESLint and Prettier configuration.
- Prefer small, focused functions with clear responsibilities.
- Avoid deeply nested conditionals when early returns improve readability.
- Extract repeated business logic when duplication is meaningful.
- Avoid premature abstraction and unnecessary design patterns.
- Do not introduce a new dependency without a clear reason.
- Keep imports organized and avoid circular dependencies.
- Remove dead code and unused imports.
- Update related types, tests, and documentation when changing a contract.
- Refactor incrementally rather than rewriting unrelated modules.

Before introducing a new convention, check whether the project already has an established pattern. If the existing pattern is inconsistent, improve it deliberately rather than adding another variation.

---

## 17. Git and Change Management

Rules:

- Keep commits focused on a single logical change.
- Avoid committing generated build artifacts, local databases, or secrets unless explicitly required by the project's workflow.
- Review the diff before committing.
- Do not overwrite unrelated changes when refactoring.
- Update Prisma migrations when database schema changes require them.
- Ensure linting, type checking, and relevant tests pass before merging.
- Document breaking API or data-contract changes.

A refactor should preserve existing behavior unless a behavior change is intentional and documented.

---

## 18. AI-Assisted Development Rules

When using AI tools to develop this project:

1. Inspect the relevant existing files before proposing changes.
2. Follow the project's current architecture and naming conventions.
3. Do not invent functions, types, modules, environment variables, or third-party API fields.
4. Verify external API behavior against official documentation when correctness depends on it.
5. Avoid rewriting entire files when a smaller change is sufficient.
6. Explain important assumptions and potential breaking changes.
7. Preserve existing business behavior unless the task explicitly requires a change.
8. Do not use `any` or unsafe casts merely to make generated code compile.
9. Include error handling for external services and asynchronous operations.
10. Update tests and related types when changing behavior.
11. Do not expose secrets or personal data in examples or generated documentation.
12. If requirements are ambiguous, state the assumption or ask a focused clarification question rather than silently choosing a risky behavior.

Generated code must be reviewed, type-checked, and tested before being treated as production-ready.

---

## 19. Definition of Done

Before considering a change complete, verify the applicable items:

- [ ] Naming follows the project conventions.
- [ ] The code is placed in the correct module and layer.
- [ ] Input and output types accurately describe the contract.
- [ ] External data is validated or safely handled.
- [ ] Authorization is enforced where required.
- [ ] Errors are handled according to the operation's contract.
- [ ] No secrets or sensitive data are exposed.
- [ ] Database and cache consistency requirements are addressed.
- [ ] Relevant tests are added or updated.
- [ ] Type checking and linting pass.
- [ ] Existing behavior remains unchanged unless intentionally modified.
- [ ] Related documentation is updated when necessary.

---

## 20. Final Principles

When making implementation decisions, apply these principles in order:

1. **Correctness:** Does the code implement the required behavior?
2. **Security:** Can unauthorized users access or modify protected data?
3. **Consistency:** Does the implementation follow established project conventions?
4. **Maintainability:** Can another developer understand and modify it safely?
5. **Performance:** Does it avoid unnecessary queries, network calls, and resource consumption?
6. **Simplicity:** Is this the simplest design that satisfies the actual requirements?

Do not optimize for folder structure or abstraction at the expense of clear business logic.

The goal is a maintainable, secure, and reliable NestJS application—not maximum architectural complexity.
