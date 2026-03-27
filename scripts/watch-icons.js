import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';

const ICON_DIR = path.resolve('public/icons');
const OUTPUT = path.resolve(ICON_DIR, 'icon-map.ts');

// Windows / Mac 줄바꿈 통일
function normalize(str) {
  return str.replace(/\r\n/g, '\n');
}

function camel(str) {
  return (
    'Icon' +
    str
      .split('-')
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join('')
  );
}

function generate() {
  const files = fs
    .readdirSync(ICON_DIR)
    .filter((f) => f.startsWith('icon_') && f.endsWith('.svg'))
    .sort();

  const imports = files
    .map((f) => {
      const name = f.replace('icon_', '').replace('.svg', '');
      return `import ${camel(name)} from "public/icons/${f}";`;
    })
    .join('\n');

  const map = `export const ICON_MAP = {\n${files
    .map((f) => {
      const name = f.replace('icon_', '').replace('.svg', '');
      return `  ${name}: ${camel(name)},`;
    })
    .join('\n')}\n} as const;`;

  const types = `export type IconName = keyof typeof ICON_MAP;`;

  const nextContent = normalize(`${imports}\n\n${map}\n\n${types}\n`);

  const prevContent = fs.existsSync(OUTPUT) ? normalize(fs.readFileSync(OUTPUT, 'utf-8')) : '';

  if (prevContent !== nextContent) {
    fs.writeFileSync(OUTPUT, nextContent);
    console.log('🔁 icon map regenerated');
  }
}

// 최초 1회 (변경 있을 때만 write)
generate();

// watch
chokidar
  .watch(ICON_DIR, {
    ignoreInitial: true,
    ignored: /icon-map\.ts$/,
  })
  .on('add', generate)
  .on('unlink', generate);
