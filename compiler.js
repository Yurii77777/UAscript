const fs = require('fs');
const path = require('path');

const syntaxMap = require('./uaScriptSyntax');
const transliterationTable = require('./transliterationTable');

// Зчитуємо вміст файлу .uajs
const readUAscriptFile = (filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Там вилізла шляпа при зчитуванні файлу ${filePath}: ${error.message}`);
      process.exit(1);
    }
};

// Функція для транслітерації змінних
const transliterate = (word) => {
    return word
        .replace(/'/g, '')
        .split('')
        .map(char => transliterationTable[char] || char)
        .join('');
};

const getConsoleLogVariable = (consoleLog) => {
    const regex = /\(([^)]+)(?:,([^)]+))?\)/;
    const matches = consoleLog.match(regex);

    console.log('matches', matches);
};

// Компіляція UAscript в JavaScript
const compileUAscript = (uaScriptCode = '') => {
    // Замінюємо синтаксис UAscript на синтаксис JavaScript
    let jsCode = uaScriptCode;

    for (const key in syntaxMap) {
        if (syntaxMap.hasOwnProperty(key)) {
            if (key === '*виведи_консоль') {
                const regex = new RegExp(`\\*${key}\\(([^)]+)\\)`, 'g');

                jsCode = jsCode.replace(regex, (_, argumentsStr) => {
                    // Розділяємо аргументи функції, якщо вони є
                    const argumentsArray = argumentsStr.split(',').map(arg => arg.trim());

                    const lastValue = argumentsArray.pop();
                    const transliteratedValue = transliterate(lastValue);

                    return `console.log('${transliteratedValue}', ${transliteratedValue})`;
                });
            }

            const value = syntaxMap[key];
            const regex = new RegExp(`\\*${key}`, 'g');

            jsCode = jsCode.replace(regex, value);
        }
    }

    // Додаємо транслітерацію для слова перед "="
    jsCode = jsCode.replace(/(\S+)\s*=/g, (_, word) => `${transliterate(word)} =`);

    return jsCode;
}

// Отримуємо вхідний файл UAscript та вихідний файл JavaScript
const uaScriptFilePath = process.argv[2];

if (!uaScriptFilePath) {
    console.error('🤦 не вказана назва файлу UAscript з розширенням .uajs!');
}

// Створюємо директорію "dist", якщо вона не існує
const distDirectory = path.join(__dirname, 'dist');
if (!fs.existsSync(distDirectory)) {
    fs.mkdirSync(distDirectory);
};

// Формуємо шлях до вихідного файлу JavaScript у директорії "dist"
const jsOutputFilePath = path.join(distDirectory, path.basename(uaScriptFilePath, '.uajs') + '.js');

if (!uaScriptFilePath || !uaScriptFilePath.endsWith('.uajs')) {
    console.error('Не заганяйся, давай вхідний файл UAscript з розширенням .uajs');
    process.exit(1);
};

// Зчитуємо та компілюємо UAscript код
const uaScriptCode = readUAscriptFile(uaScriptFilePath);
const jsCode = compileUAscript(uaScriptCode);

// Записуємо скомпільований код у вихідний файл JavaScript
try {
    fs.writeFileSync(jsOutputFilePath, jsCode, 'utf-8');
    console.log(`МАРАДЄЦ! Код успішно скомпільовано. Результат ось тут ${jsOutputFilePath}`);
} catch (error) {
    console.error(`ПЕЧАЛЬКА! Помилка при запису у файл ${jsOutputFilePath}: ${error.message}`);
    process.exit(1);
}
