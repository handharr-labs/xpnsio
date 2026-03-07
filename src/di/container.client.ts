import 'client-only';

// Client-side DI container — new instance per DIProvider mount.
// Wire use cases here as features are added (use /wire-di skill).

export function createClientContainer() {
  return {};
}

export type ClientContainer = ReturnType<typeof createClientContainer>;
