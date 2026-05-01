const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configurações
const OUTPUT_DIR = `code_extracted_${new Date().toISOString().replace(/[:.]/g, '-')}`;
const ROOT_DIR = process.cwd();

// Padrões de inclusão (arquivos/pastas para copiar)
const INCLUDE_PATTERNS = [
    'src/**/*',
    'app/**/*',
    'components/**/*',
    'lib/**/*',
    'utils/**/*',
    'hooks/**/*',
    'styles/**/*',
    'public/**/*',
    '*.ts',
    '*.tsx',
    '*.js',
    '*.jsx',
    '*.json',
    '*.css',
    '*.scss',
    '*.sql',
    '*.env.example',
    '*.env.local.example',
    'next.config.js',
    'next.config.ts',
    'tailwind.config.js',
    'postcss.config.js',
    'middleware.ts',
    '.eslintrc.json',
    'tsconfig.json',
    'package.json',
    'README.md'
];

// Padrões de exclusão
const EXCLUDE_PATTERNS = [
    'node_modules/**',
    '.next/**',
    'out/**',
    'dist/**',
    'build/**',
    '.git/**',
    '**/*.log',
    'coverage/**',
    '.vercel/**',
    'code_extracted_*/**'
];

// Função para verificar se o arquivo deve ser incluído
function shouldInclude(filePath) {
    // Verificar exclusões primeiro
    for (const pattern of EXCLUDE_PATTERNS) {
        const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
        if (regex.test(filePath)) {
            return false;
        }
    }

    // Verificar inclusões
    for (const pattern of INCLUDE_PATTERNS) {
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*');
        const regex = new RegExp(`^${regexPattern}$`);

        if (regex.test(filePath) || filePath.includes(pattern.replace('*', ''))) {
            return true;
        }
    }

    return false;
}

// Função para listar arquivos recursivamente
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const relativePath = path.relative(ROOT_DIR, fullPath);

        if (fs.statSync(fullPath).isDirectory()) {
            // Verificar se a pasta deve ser excluída
            let excludeDir = false;
            for (const pattern of EXCLUDE_PATTERNS) {
                if (pattern.includes('**') && relativePath.includes(pattern.replace('/**', ''))) {
                    excludeDir = true;
                    break;
                }
            }
            if (!excludeDir) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            }
        } else {
            if (shouldInclude(relativePath)) {
                arrayOfFiles.push(fullPath);
            }
        }
    });

    return arrayOfFiles;
}

// Função principal
async function main() {
    console.log(`📁 Extraindo código para: ${OUTPUT_DIR}/\n`);

    // Criar pasta de saída
    const outputPath = path.join(ROOT_DIR, OUTPUT_DIR);
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath);
    }

    // Obter todos os arquivos
    console.log('🔍 Coletando arquivos...');
    const allFiles = getAllFiles(ROOT_DIR);

    console.log(`📄 Encontrados ${allFiles.length} arquivos para extrair\n`);

    // Copiar arquivos
    let copiedCount = 0;
    for (const file of allFiles) {
        const relativePath = path.relative(ROOT_DIR, file);
        const destPath = path.join(outputPath, relativePath);
        const destDir = path.dirname(destPath);

        // Criar diretório destino
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copiar arquivo
        fs.copyFileSync(file, destPath);
        copiedCount++;

        if (copiedCount % 20 === 0) {
            console.log(`✅ ${copiedCount} arquivos copiados...`);
        }
    }

    console.log(`\n✨ Copiados ${copiedCount} arquivos!`);

    // Criar arquivo de estrutura
    console.log('\n📊 Gerando estrutura de diretórios...');
    const structure = generateStructure(outputPath);
    fs.writeFileSync(path.join(outputPath, 'estrutura.txt'), structure);

    // Criar lista de arquivos
    const fileList = allFiles.map(f => path.relative(ROOT_DIR, f)).sort().join('\n');
    fs.writeFileSync(path.join(outputPath, 'lista_completa.txt'), fileList);

    // Criar manifest.json com metadados
    const manifest = {
        extractedAt: new Date().toISOString(),
        totalFiles: copiedCount,
        projectType: 'Next.js + Supabase',
        rootDir: ROOT_DIR,
        outputDir: OUTPUT_DIR
    };
    fs.writeFileSync(path.join(outputPath, 'manifest.json'), JSON.stringify(manifest, null, 2));

    console.log('\n✨ Extração concluída!');
    console.log(`📂 Pasta: ${OUTPUT_DIR}/`);
    console.log(`📄 Total de arquivos: ${copiedCount}`);
    console.log('\nArquivos importantes:');
    console.log('  - estrutura.txt (organização das pastas)');
    console.log('  - lista_completa.txt (todos os arquivos)');
    console.log('  - manifest.json (metadados da extração)');

    // Sugestão de compactação
    console.log('\n📦 Para compactar (Linux/Mac):');
    console.log(`  tar -czf ${OUTPUT_DIR}.tar.gz ${OUTPUT_DIR}/`);
    console.log('\n📦 Para compactar (Windows PowerShell):');
    console.log(`  Compress-Archive -Path ${OUTPUT_DIR} -DestinationPath ${OUTPUT_DIR}.zip`);
}

// Função para gerar estrutura de diretórios
function generateStructure(dir, prefix = '') {
    let result = '';
    const items = fs.readdirSync(dir);

    const files = items.filter(item => {
        const fullPath = path.join(dir, item);
        return fs.statSync(fullPath).isFile() && !item.includes('estrutura') && !item.includes('lista_');
    }).sort();

    const dirs = items.filter(item => {
        const fullPath = path.join(dir, item);
        return fs.statSync(fullPath).isDirectory() && item !== 'node_modules';
    }).sort();

    dirs.forEach((dirName, index) => {
        const isLast = index === dirs.length - 1 && files.length === 0;
        result += `${prefix}${isLast ? '└── ' : '├── '}${dirName}/\n`;
        result += generateStructure(path.join(dir, dirName), `${prefix}${isLast ? '    ' : '│   '}`);
    });

    files.forEach((fileName, index) => {
        const isLast = index === files.length - 1;
        result += `${prefix}${isLast ? '└── ' : '├── '}${fileName}\n`;
    });

    return result;
}

// Executar
main().catch(console.error);