const fs = require('fs');
const path = require('path');

// Carpetas que queremos escanear automáticamente
const directoriesToClean = [
    path.resolve(__dirname, 'tests'),
    path.resolve(__dirname, 'pages'),
    path.resolve(__dirname, 'fixtures')
];

function removeCommentsFromFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Esta expresión regular remueve comentarios de tipo // y de tipo /* */
    const cleanedContent = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    fs.writeFileSync(filePath, cleanedContent, 'utf8');
}

function scanAndClean(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanAndClean(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            removeCommentsFromFile(fullPath);
        }
    });
}

// Ejecutar la limpieza
directoriesToClean.forEach(dir => scanAndClean(dir));
console.log('🧹 SUCCESS: All internal comments have been stripped before commit.');
