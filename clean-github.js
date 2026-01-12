const fs = require('fs');
const path = require('path');

const GITHUB_DIR = path.join(process.cwd(), '.github');

const KEEP_FILES = [
  path.join(GITHUB_DIR, 'workflows', 'deploy.yml'),
  path.join(GITHUB_DIR, 's.yml'),
];

function shouldKeep(targetPath) {
  return KEEP_FILES.some(keep =>
    path.resolve(targetPath) === path.resolve(keep)
  );
}

function cleanDir(dir) {
  if (!fs.existsSync(dir)) return;

  for (const name of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, name);

    if (shouldKeep(fullPath)) {
      continue;
    }

    // 如果是 workflows 目录，需要特殊处理
    if (fullPath.endsWith(path.join('.github', 'workflows'))) {
      for (const wf of fs.readdirSync(fullPath)) {
        const wfPath = path.join(fullPath, wf);
        if (!shouldKeep(wfPath)) {
          fs.rmSync(wfPath, { recursive: true, force: true });
        }
      }
      // workflows 目录如果为空则删除
      if (fs.readdirSync(fullPath).length === 0) {
        fs.rmdirSync(fullPath);
      }
      continue;
    }

    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

cleanDir(GITHUB_DIR);

console.log('✔ .github cleaned, deploy.yml and s.yml preserved');
