const path = require('path');
const fs = require('fs');

const testEslint = filenames => {
    const eslintIgnore = fs
        .readFileSync('.eslintignore', 'utf8')
        .split('\n')
        .filter(Boolean);
    const filteredFilenames = filenames.filter(name => {
        return !eslintIgnore.some(pattern => {
            const isNegated = pattern.startsWith('!');
            const testPattern = isNegated ? pattern.slice(1) : pattern;
            const regex = new RegExp(testPattern.replace(/\/\*$/, '.*'));
            return regex.test(name) !== isNegated;
        });
    });

    return `next lint --fix --file ${filteredFilenames
        .map(name => path.relative(process.cwd(), name))
        .join(' --file ')}`;
};
const testPrettier = filenames => {
    const prettierignore = fs
        .readFileSync('.prettierignore', 'utf8')
        .split('\n')
        .filter(Boolean);
    const filteredFilenames = filenames.filter(name => {
        return !prettierignore.some(pattern => {
            const isNegated = pattern.startsWith('!');
            const testPattern = isNegated ? pattern.slice(1) : pattern;
            const regex = new RegExp(testPattern.replace(/\/\*$/, '.*'));
            return regex.test(name) !== isNegated;
        });
    });
    return `npx prettier -w ${filteredFilenames
        .map(name => path.relative(process.cwd(), name))
        .join(' ')}`;
};

module.exports = {
    '*.{js,jsx,ts,tsx,json}': [testEslint, testPrettier],
};

// 旧版
// const path = require('path')

// const testEslint = filenames =>
//   `next lint --fix --file ${filenames
//     .map(name => path.relative(process.cwd(), name))
//     .join(' --file ')}`
// const testPrettier = filenames =>
//   `npx prettier -w ${filenames
//     .map(name => path.relative(process.cwd(), name))
//     .join(' ')}`

// module.exports = {
//   '*.{js,jsx,ts,tsx}': [testEslint, testPrettier],
// }
