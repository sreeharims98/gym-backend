# Graph Report - .  (2026-05-27)

## Corpus Check
- Corpus is ~8,237 words - fits in a single context window. You may not need a graph.

## Summary
- 230 nodes · 388 edges · 15 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Project Dependencies & Packages|Project Dependencies & Packages]]
- [[_COMMUNITY_Prisma Config & Payment Models|Prisma Config & Payment Models]]
- [[_COMMUNITY_Payment & Membership Controllers|Payment & Membership Controllers]]
- [[_COMMUNITY_Gym Branch Controllers|Gym Branch Controllers]]
- [[_COMMUNITY_User Management & Authentication|User Management & Authentication]]
- [[_COMMUNITY_Member Registration & Schema|Member Registration & Schema]]
- [[_COMMUNITY_Gym Schema & Repository|Gym Schema & Repository]]
- [[_COMMUNITY_Swagger Docs & Middleware APIs|Swagger Docs & Middleware APIs]]
- [[_COMMUNITY_Todo Feature Models|Todo Feature Models]]
- [[_COMMUNITY_Membership Plan Models|Membership Plan Models]]
- [[_COMMUNITY_Member Route Controllers|Member Route Controllers]]
- [[_COMMUNITY_Plan Route Controllers|Plan Route Controllers]]
- [[_COMMUNITY_TypeScript Compiler Configuration|TypeScript Compiler Configuration]]
- [[_COMMUNITY_Dev Dependencies & Build Scripts|Dev Dependencies & Build Scripts]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 9 edges
2. `prisma` - 9 edges
3. `scripts` - 8 edges
4. `registry` - 7 edges
5. `validate()` - 7 edges
6. `authenticate()` - 6 edges
7. `findTodoByIdRepository()` - 4 edges
8. `findUserByEmailRepository()` - 4 edges
9. `registerUser()` - 4 edges
10. `loginUser()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `AuthenticatedRequest` --references--> `TokenPayload`  [EXTRACTED]
  src/middlewares/auth.ts → src/utils/jwt.ts
- `authenticate()` --calls--> `verifyToken()`  [EXTRACTED]
  src/middlewares/auth.ts → src/utils/jwt.ts
- `createTodo()` --calls--> `createTodoRepository()`  [EXTRACTED]
  src/services/todo.service.ts → src/repositories/todo.repository.ts
- `getAllTodos()` --calls--> `findAllTodosRepository()`  [EXTRACTED]
  src/services/todo.service.ts → src/repositories/todo.repository.ts
- `getTodoById()` --calls--> `findTodoByIdRepository()`  [EXTRACTED]
  src/services/todo.service.ts → src/repositories/todo.repository.ts

## Communities (15 total, 0 thin omitted)

### Community 0 - "Project Dependencies & Packages"
Cohesion: 0.09
Nodes (21): dependencies, @asteasolutions/zod-to-openapi, cors, dotenv, express, pg, @prisma/adapter-pg, @prisma/client (+13 more)

### Community 1 - "Prisma Config & Payment Models"
Cohesion: 0.14
Nodes (6): adapter, pool, prisma, Payment, RecordPaymentDTO, RenewMembershipDTO

### Community 2 - "Payment & Membership Controllers"
Cohesion: 0.18
Nodes (15): getOverdueDashboardController(), getPaymentStatsController(), getWhatsAppReminderController(), payPaymentController(), renewMembershipController(), authenticate(), AuthenticatedRequest, requireRole() (+7 more)

### Community 3 - "Gym Branch Controllers"
Cohesion: 0.17
Nodes (14): createGymController(), deleteGymController(), getAllGymsController(), getGymByIdController(), updateGymController(), validate(), router, router (+6 more)

### Community 4 - "User Management & Authentication"
Cohesion: 0.20
Nodes (12): LoginUserDTO, RegisterUserDTO, User, UserResponseDTO, createUserRepository(), findUserByEmailRepository(), loginUser(), registerUser() (+4 more)

### Community 5 - "Member Registration & Schema"
Cohesion: 0.17
Nodes (4): Member, RegisterMemberDTO, UpdateMemberDTO, MemberFilters

### Community 6 - "Gym Schema & Repository"
Cohesion: 0.18
Nodes (3): CreateGymDTO, Gym, UpdateGymDTO

### Community 7 - "Swagger Docs & Middleware APIs"
Cohesion: 0.21
Nodes (9): getSwaggerSpec(), registry, loginController(), registerController(), errorHandler(), router, app, loginSchema (+1 more)

### Community 8 - "Todo Feature Models"
Cohesion: 0.28
Nodes (13): CreateTodoDTO, Todo, UpdateTodoDTO, createTodoRepository(), deleteTodoRepository(), findAllTodosRepository(), findTodoByIdRepository(), updateTodoRepository() (+5 more)

### Community 9 - "Membership Plan Models"
Cohesion: 0.18
Nodes (3): CreatePlanDTO, Plan, UpdatePlanDTO

### Community 10 - "Member Route Controllers"
Cohesion: 0.27
Nodes (10): deleteMemberController(), getAllMembersController(), getMemberByIdController(), registerMemberController(), updateMemberController(), router, getMemberSchema, listMembersQuerySchema (+2 more)

### Community 11 - "Plan Route Controllers"
Cohesion: 0.29
Nodes (9): createPlanController(), deletePlanController(), getAllPlansController(), getPlanByIdController(), updatePlanController(), router, createPlanSchema, getPlanSchema (+1 more)

### Community 12 - "TypeScript Compiler Configuration"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, outDir, rootDir, skipLibCheck, strict (+2 more)

### Community 13 - "Dev Dependencies & Build Scripts"
Cohesion: 0.20
Nodes (10): devDependencies, nodemon, prisma, ts-node, @types/cors, @types/express, @types/node, @types/pg (+2 more)

## Knowledge Gaps
- **47 isolated node(s):** `name`, `version`, `description`, `main`, `start` (+42 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `prisma` connect `Prisma Config & Payment Models` to `User Management & Authentication`, `Member Registration & Schema`, `Gym Schema & Repository`, `Todo Feature Models`, `Membership Plan Models`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `validate()` connect `Gym Branch Controllers` to `Plan Route Controllers`, `Member Route Controllers`, `Payment & Membership Controllers`, `Swagger Docs & Middleware APIs`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `registry` connect `Swagger Docs & Middleware APIs` to `Payment & Membership Controllers`, `Plan Route Controllers`, `Member Route Controllers`, `Gym Branch Controllers`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _47 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Project Dependencies & Packages` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `Prisma Config & Payment Models` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._