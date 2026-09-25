import { spawnSync } from 'node:child_process';

const env = { ...process.env, NEXT_PUBLIC_BASE_PATH: '/aion2-guide' };
for (const args of [['scripts/validate-snapshot.mjs'], ['node_modules/next/dist/bin/next', 'build'], ['scripts/check-export.mjs']]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
