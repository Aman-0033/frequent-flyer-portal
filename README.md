# Frequent Flyer Portal (ENG-163087)
## Airline Floor Staff Digital Operations Portal

### Architectural Overview
This application is designed to replace paper and Excel-based floor workflows for airline ground staff managing Frequent Flyer loyalty passengers. It provides fast search, roster inspection, member enrollment, mileage crediting, and offline persistence during airport Wi-Fi intermittency.

### Strict Test-Driven Development (TDD) Workflow
- **Phase 1 (Current)**: Specification, scaffolding, skeleton stubs, and comprehensive failing test suite.
- **Phase 2 (Next)**: UI Component architecture, domain logic, offline queue synchronization, accessibility optimization, and green test suite.

### Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Test Runner**: Vitest + React Testing Library + JSDOM
- **Icons**: Lucide React

### Running the Test Suite
```bash
npm test
```
