# File Tree: messio-api

**Generated:** 10/11/2026, 3:17:10 AM
**Root Path:** `d:\Project\Messio\messio-api`

```
├── 📁 .codegraph
│   ├── ⚙️ .gitignore
│   └── 📄 codegraph.db
├── 📁 prisma
│   ├── 📁 migrations
│   │   ├── 📁 0000_init
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   └── 📄 schema.prisma
├── 📁 src
│   ├── 📁 common
│   │   ├── 📁 authentication
│   │   │   ├── 📁 decorators
│   │   │   │   └── 📄 current-user.decorator.ts
│   │   │   ├── 📁 dto
│   │   │   │   ├── 📄 payload.token.dto.ts
│   │   │   │   ├── 📄 payload.token.google.dto.ts
│   │   │   │   ├── 📄 request-with-user-google.type.ts
│   │   │   │   └── 📄 request-with-user.type.ts
│   │   │   ├── 📁 guards
│   │   │   │   ├── 📄 google-auth.guard.ts
│   │   │   │   └── 📄 jwt-auth.guard.ts
│   │   │   ├── 📁 strategies
│   │   │   │   ├── 📄 google.strategy.ts
│   │   │   │   └── 📄 jwt.strategy.ts
│   │   │   ├── 📄 auth.module.ts
│   │   │   └── 📄 auth.service.ts
│   │   ├── 📁 authorization
│   │   │   ├── 📁 decorators
│   │   │   │   └── 📄 permissions.decorator.ts
│   │   │   ├── 📁 guards
│   │   │   │   └── 📄 permission.guard.ts
│   │   │   └── 📄 authorization.module.ts
│   │   ├── 📁 middleware
│   │   │   └── 📄 logger.middleware.ts
│   │   └── 📁 types
│   │       └── 📄 find-or-create-result.type.ts
│   ├── 📁 generated
│   │   └── 📁 prisma
│   │       ├── 📁 internal
│   │       │   ├── 📄 class.ts
│   │       │   ├── 📄 prismaNamespace.ts
│   │       │   └── 📄 prismaNamespaceBrowser.ts
│   │       ├── 📁 models
│   │       │   ├── 📄 Customers.ts
│   │       │   ├── 📄 FaceBookPage.ts
│   │       │   ├── 📄 GoogleAuth.ts
│   │       │   ├── 📄 Messages.ts
│   │       │   ├── 📄 PageSetting.ts
│   │       │   ├── 📄 Permission.ts
│   │       │   ├── 📄 PictureUserFacebook.ts
│   │       │   ├── 📄 Rooms.ts
│   │       │   ├── 📄 User.ts
│   │       │   ├── 📄 UserAccessToken.ts
│   │       │   ├── 📄 UserFacebook.ts
│   │       │   └── 📄 WorkSpace.ts
│   │       ├── 📄 browser.ts
│   │       ├── 📄 client.ts
│   │       ├── 📄 commonInputTypes.ts
│   │       ├── 📄 enums.ts
│   │       └── 📄 models.ts
│   ├── 📁 infrastructure
│   │   ├── 📁 crypto
│   │   │   ├── 📄 crypto.module.ts
│   │   │   └── 📄 token-encryption.service.ts
│   │   ├── 📁 prisma
│   │   │   ├── 📄 prisma.module.ts
│   │   │   └── 📄 prisma.service.ts
│   │   ├── 📁 queues
│   │   │   ├── 📁 alert-email
│   │   │   │   ├── 📄 alert-email.constants.ts
│   │   │   │   ├── 📄 alert-email.events.ts
│   │   │   │   ├── 📄 alert-email.processor.ts
│   │   │   │   └── 📄 alert-email.producer.ts
│   │   │   └── 📄 queues.module.ts
│   │   ├── 📁 redis
│   │   │   ├── 📁 pages
│   │   │   │   ├── 📁 mappers
│   │   │   │   │   └── 📄 pages-cache.mapper.ts
│   │   │   │   ├── 📁 types
│   │   │   │   │   └── 📄 set-pages-graph.input.ts
│   │   │   │   ├── 📄 page-cache.type.ts
│   │   │   │   └── 📄 pages.service.ts
│   │   │   ├── 📁 permission
│   │   │   │   ├── 📁 dto
│   │   │   │   └── 📄 permission.service.ts
│   │   │   ├── 📄 redis.module.ts
│   │   │   ├── 📄 redis.provider.ts
│   │   │   └── 📄 redis.service.ts
│   │   └── 📁 websocket
│   │       ├── 📄 websocket.gateway.ts
│   │       ├── 📄 websocket.module.ts
│   │       └── 📄 websocket.service.ts
│   ├── 📁 modules
│   │   ├── 📁 auth
│   │   │   ├── 📁 facebook
│   │   │   │   ├── 📄 auth.controller.ts
│   │   │   │   ├── 📄 auth.module.ts
│   │   │   │   └── 📄 auth.service.ts
│   │   │   ├── 📁 google
│   │   │   │   ├── 📄 google.controller.ts
│   │   │   │   ├── 📄 google.module.ts
│   │   │   │   └── 📄 google.service.ts
│   │   │   └── 📁 permissions
│   │   │       ├── 📁 dto
│   │   │       │   └── 📄 create-permission.dto.ts
│   │   │       ├── 📁 repositories
│   │   │       │   ├── 📄 facebook-page.repository.ts
│   │   │       │   ├── 📄 permission.repository.ts
│   │   │       │   ├── 📄 room.repository.ts
│   │   │       │   └── 📄 workspace.repository.ts
│   │   │       ├── 📄 permissions.module.ts
│   │   │       └── 📄 permissions.service.ts
│   │   ├── 📁 chats
│   │   │   ├── 📁 customer
│   │   │   │   ├── 📁 repositories
│   │   │   │   │   └── 📄 customer.repository.ts
│   │   │   │   ├── 📁 types
│   │   │   │   │   └── 📄 create-customer.input.ts
│   │   │   │   ├── 📄 customer.module.ts
│   │   │   │   └── 📄 customer.service.ts
│   │   │   ├── 📁 messages
│   │   │   │   ├── 📁 repositories
│   │   │   │   │   └── 📄 messages.repository.ts
│   │   │   │   ├── 📁 types
│   │   │   │   │   └── 📄 create-message.input.ts
│   │   │   │   ├── 📄 messages.module.ts
│   │   │   │   └── 📄 messages.service.ts
│   │   │   ├── 📁 rooms
│   │   │   │   ├── 📁 dto
│   │   │   │   ├── 📁 repositories
│   │   │   │   │   └── 📄 room.repository.ts
│   │   │   │   ├── 📄 rooms.module.ts
│   │   │   │   └── 📄 rooms.service.ts
│   │   │   ├── 📄 chats.controller.ts
│   │   │   ├── 📄 chats.module.ts
│   │   │   └── 📄 chats.service.ts
│   │   ├── 📁 pages
│   │   │   ├── 📁 dtos
│   │   │   │   ├── 📁 schemas
│   │   │   │   │   ├── 📄 get-pages.schema.ts
│   │   │   │   │   └── 📄 register-pages.schema.ts
│   │   │   │   ├── 📄 register-pages-response.dto.ts
│   │   │   │   └── 📄 register-pages.request.dto.ts
│   │   │   ├── 📁 repositories
│   │   │   │   ├── 📄 access-token.repository.ts
│   │   │   │   ├── 📄 facebook-account.repository.ts
│   │   │   │   └── 📄 page.repository.ts
│   │   │   ├── 📁 setting
│   │   │   │   ├── 📁 repositories
│   │   │   │   │   └── 📄 setting.repository.ts
│   │   │   │   ├── 📁 types
│   │   │   │   │   └── 📄 create-setting.input.ts
│   │   │   │   ├── 📄 setting.module.ts
│   │   │   │   └── 📄 setting.service.ts
│   │   │   ├── 📁 types
│   │   │   │   ├── 📄 create-page.input.ts
│   │   │   │   ├── 📄 get-all-pages.result.ts
│   │   │   │   └── 📄 get-pages.result.ts
│   │   │   ├── 📄 pages.controller.ts
│   │   │   ├── 📄 pages.mapper.ts
│   │   │   ├── 📄 pages.module.ts
│   │   │   └── 📄 pages.service.ts
│   │   ├── 📁 users
│   │   │   ├── 📁 dtos
│   │   │   ├── 📁 repositories
│   │   │   │   └── 📄 user.repository.ts
│   │   │   ├── 📁 types
│   │   │   │   ├── 📄 create-google-auth.result.ts
│   │   │   │   ├── 📄 upsert-facebook-user.input.ts
│   │   │   │   └── 📄 upsert-google-auth.input.ts
│   │   │   ├── 📄 user.service.ts
│   │   │   └── 📄 users.module.ts
│   │   ├── 📁 webhooks
│   │   │   ├── 📁 meta
│   │   │   │   ├── 📁 dto
│   │   │   │   │   ├── 📄 facebook-messages-webhooks.response.dto.ts
│   │   │   │   │   └── 📄 facebook-webhook-verification.request.dto.ts
│   │   │   │   ├── 📄 meta.controller.ts
│   │   │   │   ├── 📄 meta.module.ts
│   │   │   │   └── 📄 meta.service.ts
│   │   │   └── 📄 webhooks.module.ts
│   │   └── 📁 workspaces
│   │       ├── 📁 dtos
│   │       │   └── 📁 schemas
│   │       │       └── 📄 assign-users-for-page.schema.ts
│   │       ├── 📁 repositories
│   │       │   └── 📄 workspaces.repository.ts
│   │       ├── 📁 types
│   │       │   └── 📄 create-workspace.input.ts
│   │       ├── 📄 workspaces.controller.ts
│   │       ├── 📄 workspaces.module.ts
│   │       └── 📄 workspaces.service.ts
│   ├── 📁 providers
│   │   └── 📁 facebook
│   │       ├── 📁 clients
│   │       │   └── 📄 facebook-graph.client.ts
│   │       ├── 📁 dtos
│   │       │   ├── 📄 facebook-me.graph.response.ts
│   │       │   ├── 📄 facebook-oauth-access-token.graph.response.ts
│   │       │   ├── 📄 facebook-page-subscribed.response.ts
│   │       │   ├── 📄 facebook-page.graph.response.ts
│   │       │   └── 📄 facebook-psid.graph.response.ts
│   │       ├── 📁 services
│   │       │   ├── 📄 facebook-customer-api.service.ts
│   │       │   ├── 📄 facebook-page-api.service.ts
│   │       │   └── 📄 facebook-user-api.service.ts
│   │       └── 📄 facebook.module.ts
│   ├── 📄 app.module.ts
│   ├── 📄 main.ts
│   └── ⚙️ note.json
├── 📁 test
│   ├── 📄 app.e2e-spec.ts
│   └── ⚙️ jest-e2e.json
├── ⚙️ .gitignore
├── ⚙️ .prettierrc
├── 📝 README.md
├── 📝 contructure.md
├── 📄 eslint.config.mjs
├── ⚙️ nest-cli.json
├── ⚙️ package-lock.json
├── ⚙️ package.json
├── 📄 prisma.config.ts
└── ⚙️ tsconfig.json
```

---
*Generated by FileTree Pro Extension*