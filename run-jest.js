const { execSync } = require('child_process');
const fs = require('fs');

try {
    execSync('npx jest --colors=false', { stdio: 'pipe' });
    fs.writeFileSync('jest-out.txt', 'All Passed');
} catch (error) {
    let out = '';
    if (error.stdout) out += error.stdout.toString();
    if (error.stderr) out += error.stderr.toString();
    fs.writeFileSync('jest-out.txt', out);
}
