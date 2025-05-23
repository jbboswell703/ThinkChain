# Change Log

## [Unreleased]
### Fixed
- Resolved fatal `[Object: null prototype]` crash when using `@anthropic-ai/sdk` with ESM/TypeScript/ts-node on Windows by switching to CommonJS (`.cjs`) for Anthropic integration/testing.
- Added `dotenv` support to ensure `.env` variables (including `ANTHROPIC_API_KEY`) are loaded correctly in CommonJS scripts.
- Now properly surfaces Anthropic API errors (invalid key, no credits) instead of runtime crashes.

### Changed
- Created `lib/api-services/test-anthropic.cjs` as a CommonJS test for Anthropic integration.
- Updated troubleshooting steps for Anthropic integration, clarifying ESM/TypeScript/Windows incompatibility and the workaround using `.cjs` files.

### Added
- Dynamic LLM chain: The ThinkChain LLM chain is now built at runtime, always ensuring at least 5 working models.
- Automatic fallback: If any provider (Anthropic, DeepSeek, HuggingFace, etc.) is unavailable (e.g. out of credits), an OpenRouter free model is automatically used in its place.
- Full list of OpenRouter free models is included and used for fallback.
- Health checks: Each provider is pinged before use to verify operational status.

### Fixed
- Relative import paths in `llm-service.ts` now use explicit file extensions for Node ESM compatibility (fixed import lint errors).
- Debugged persistent JSX syntax error in `app/refinement/page.tsx` by removing stray parenthesis, verifying JSX tag balance, clearing node_modules and build cache, and retyping the return line to eliminate invisible character/encoding issues. Awaiting confirmation of final error resolution.

### Notes
- Extensive troubleshooting performed on `app/refinement/page.tsx` due to persistent `Unexpected token 'div'` JSX error. Steps included code review, dependency and cache clearing, and file encoding checks. The file is now ready for further verification upon next session.
- Call `buildLLMChain()` to get the current working chain at any time; it will always include 5 healthy models, filling with OpenRouter free models as needed.
- If using TypeScript/ESM for other services, continue using `.cjs` for Anthropic until upstream compatibility is improved.
- Ensure your Anthropic account has credits to avoid 400 errors.



## [Initial State] - 2025-05-20

### Added
- Created CHANGELOG.md to track project changes systematically
- Initial project structure established
- Partial integration of AI API services
- Updated Gemini and Anthropic service implementations
- Updated Deepseek service implementation
- Updated HuggingFace service implementation
- Added OpenRouter service implementation

### Changed
- Updated environment variable format in Gemini, Anthropic, Deepseek, HuggingFace, and OpenRouter services
- Updated dependency versions for compatibility:
  - React and React DOM downgraded to 18.2.0
  - Added specific versions for AI SDKs (@anthropic-ai/sdk, @google/generative-ai)
  - Updated ws package to compatible version

## [TROUBLESHOOTING LOCAL DEV] - 2025-05-21
### Node.js Setup & Local Preview
- Attempting to run ThinkChain locally at http://localhost:3000 for development/testing
- Encountered error: 'node' not recognized as a command
- Discovered Node.js is installed on external drive (D:\Storage2\nodejs)
- Added Node.js folder to PATH environment variable
- Currently unable to reopen environment variables dialog to verify PATH
- Next steps: Restart computer to ensure PATH changes take effect, then verify Node.js installation with 'node -v' and try 'npm run dev' again
- Purpose: Ensuring project can be run and previewed locally for development and testing

## [0.2.0] - 2025-05-21
### Security, Git, and Deployment
- **All hardcoded secrets and credentials fully removed from codebase and git history**
- **All API keys and sensitive config now stored ONLY in `.env` (and `.gitignore`)**
- **Git history re-initialized for a clean, safe project state**
- **Successfully pushed to both `ThinkChain` and `ThinkChain.v0.2` repositories with no secrets**
- **Security best practices now enforced for all future development**
- **Project is ready for safe Vercel deployment from either repo**

### Notes
- Node.js and dependencies successfully installed
- Ready to proceed with remaining AI service updates
- Next steps:
  1. Verify all API service integrations
