const fs = require('fs')
const xml2json = require('xml2json')

async function convertXmlToJson(inPath, outPath) {
    const data = fs.readFileSync(inPath, 'utf-8')
    const json = xml2json.toJson(data)
    fs.writeFileSync(outPath, json)
}

// Conver export file from wordlist to JSON
convertXmlToJson('words.xml', 'words.json')

// Convert lexicon file to JSON
convertXmlToJson('Lexicon.xml', 'Lexicon.json')