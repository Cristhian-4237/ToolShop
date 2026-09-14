let source = '';

function removeComments(input) {
    let output = '';
    let state = 'code';

    for (let index = 0; index < input.length; index += 1) {
        const current = input[index];
        const next = input[index + 1];

        if (state === 'line-comment') {
            if (current === '\n') {
                output += current;
                state = 'code';
            }
            continue;
        }

        if (state === 'block-comment') {
            if (current === '*' && next === '/') {
                index += 1;
                state = 'code';
            } else if (current === '\n') {
                output += current;
            }
            continue;
        }

        if (state === 'single-quoted' || state === 'double-quoted' || state === 'template') {
            output += current;
            if (current === '\\') {
                output += next || '';
                index += 1;
            } else if (
                (state === 'single-quoted' && current === "'") ||
                (state === 'double-quoted' && current === '"') ||
                (state === 'template' && current === '`')
            ) {
                state = 'code';
            }
            continue;
        }

        if (current === '/' && next === '/') {
            index += 1;
            state = 'line-comment';
        } else if (current === '/' && next === '*') {
            index += 1;
            state = 'block-comment';
        } else {
            output += current;
            if (current === "'") state = 'single-quoted';
            if (current === '"') state = 'double-quoted';
            if (current === '`') state = 'template';
        }
    }

    return output;
}

process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
    source += chunk;
});

process.stdin.on('end', () => {
    process.stdout.write(removeComments(source));
});
