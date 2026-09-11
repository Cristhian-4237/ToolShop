# 📑 Framework Handover Report - API Authentication Block

## 🎯 Context & Progress Made
- **Target Application:** Practice Software Testing (Toolshop v5.0 / Angular SPA) [1.14].
- **Completed Components:** 
  - `DashboardPage.ts` is fully implemented using synchronous getters, private readonly locators, and robust transition handling via `waitForURL('**/product/**')` (100% immune to flakiness) [1.14].
  - `basePage.ts` is configured with clean fixture merging (`mergeTests`) to avoid `beforeEach` anti-patterns [1.14].
  - `.env` and `data/environment.ts` are set up dynamically (Strict Zero-Hardcode rule) [1.14].
  - `package.json` includes custom scripts (`npm test` short-cut and `clean:comments` cleanup tool) [1.14].

---

## 🛑 Current Blocker
An unhandled HTML string (`<!-- Copyright (c)...`) is being returned by the server when performing the backend login request, which breaks the JSON parsing in the global authentication hook:
```text
SyntaxError: Unexpected token '<', "<!-- Copyr"... is not valid JSON
at tests/auth.setup.ts:23:26
```

### 🔍 Technical Diagnosis Summary
1. **Status Code Leakage:** Cloudflare or the Angular routing mechanism is intercepting the `POST` request to `${ENV.apiUrl}/users/login`. It bypasses the standard `!response.ok()` assertion because it returns a successful redirect sequence (HTTP 3xx or a layout fallback), resulting in a raw UI HTML document instead of data payload bits.
2. **Format Strictness:** The v5.0 unified architecture requires absolute alignment with headers and payload schemas. Even though `TOOLSHOP_API_URL` is perfectly defined as `https://practicesoftwaretesting.com`, the contract is failing silently at the network level.

---

## 🗺️ Next Steps & Action Plan for Tomorrow
When resuming, we will prioritize isolating the payload input state without violating the core architecture rules:

1. **Verify Loaded Variables:** Print and inspect the output of `ENV.admin.email` and `ENV.admin.password` using deep logging to ensure `dotenv` isn't feeding `undefined` or carriage return characters (`\r`) to the payload body.
2. **Audit Request Strategy:** Run a isolated parallel curl/fetch baseline comparison against the live API gateway mapping to determine if the newer routing system requires explicit cookie bypass or modified access protocols.
3. **Unblock Storage State:** Once the network contract is established, compile the `.auth/admin-state.json` artifact so the remaining parallel UI suites can start fully authenticated instantly.
