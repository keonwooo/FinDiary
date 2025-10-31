# Repository Guidelines

## Project Structure & Module Organization
- Java source: `src/main/java/com/kwfw/findiary` (layers: `controller/api`, `controller/view`, `service`, `mapper`, `model`).
- Resources: `src/main/resources`
  - Views (Thymeleaf): `templates/` (e.g., `templates/pages`, `layout`, `fragments`).
  - Static assets: `static/` (feature folders under `css`, `js`, `images`, `fonts`).
  - MyBatis XML mappers: `resources/mapper/*.xml`.
- Tests: `src/test/java/com/kwfw/findiary`.
- Build files: `build.gradle`, `settings.gradle`, `gradlew(.bat)`.

## Build, Test, and Development Commands
- Build jar: `./gradlew clean build` (Windows: `gradlew.bat clean build`).
- Run locally: `./gradlew bootRun` to start Spring Boot.
- Run tests: `./gradlew test` (JUnit Platform enabled).
- Useful flags: `-x test` to skip tests during build when appropriate.

## Coding Style & Naming Conventions
- Java 21 toolchain; use 4-space indentation, UTF-8.
- Packages: lowercase dot-separated; classes/interfaces: PascalCase; methods/fields: camelCase.
- Suffix conventions: `*Controller`, `*Service`, `*Mapper`, `*Dto`, `*VO`.
- Prefer Lombok where present (e.g., `@Getter`, `@Setter`, `@Builder`) to reduce boilerplate.
- Frontend assets: group by feature under `static/js/<feature>` and `static/css/<feature>`; pages in `templates/pages`.

## Testing Guidelines
- Frameworks: Spring Boot Test + JUnit 5; MyBatis test support included.
- Location: mirror source package under `src/test/java`.
- Naming: end with `*Tests.java` (e.g., `DiaryServiceTests.java`).
- Types: use `@SpringBootTest` for integration, `@WebMvcTest` for controller slices.
- Run locally with `./gradlew test`; aim to cover service logic and critical controllers.

## Commit & Pull Request Guidelines
- Commits: concise, present-tense; include scope (e.g., "dashboard: refactor view"). The history shows date-tagged messages; keeping `[YYYY.MM.DD]` is acceptable but not required.
- Reference issues in the body (e.g., `Closes #123`).
- PRs must include: summary, rationale, screenshots for UI changes, test notes, and any DB/migration impacts.
- Checklist: build passes (`./gradlew build`), tests added/updated, no secrets or local configs committed.

## Security & Configuration Tips
- Do not commit credentials. Use environment variables or local-only `application-local.yml` (gitignored).
- MariaDB driver is used; ensure local DB access for features touching mappers.
- Logging configured via `logback-spring.xml`; avoid excessive debug logs in commits.

