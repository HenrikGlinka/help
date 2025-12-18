import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, 'data', 'cor1.5.1.0.tsv');

const wordData = fs.readFileSync(dataPath, 'utf-8').split('\n');
const wordList = wordData.map(line => {
    const [corId, lemma, gloss, designation, form, standardizedForm] = line.split('\t');

    if (corId && lemma && gloss && designation && form && standardizedForm) {
        return { corId, lemma, gloss, designation, form, standardizedForm };
    }
});

export function randomSentence(wordCount, options = {}) {
    const {
        minLength = 0,
        maxLength = Infinity,
        designation = undefined,
        separator = ' ',
        capitalize = false
    } = options;

    const randomWords = wordList.filter(
        word => word?.lemma?.length >= minLength && word?.lemma?.length <= maxLength && (designation === undefined || word?.designation === designation));

    let sentence = [];
    for (let i = 0; i < wordCount; i++) {
        const randomIndex = Math.floor(Math.random() * randomWords.length);
        let randomWord = randomWords[randomIndex].lemma;

        if (capitalize) {
            randomWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);
        }

        sentence.push(randomWord);
    }

    return sentence.join(separator);
}