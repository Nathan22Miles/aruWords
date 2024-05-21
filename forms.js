const fs = require('fs')
const log = console.log

function asArray(obj) {
    if (!obj) return []
    if (Array.isArray(obj)) return obj
    return [obj]
}

// form = { stem, suffixes, glosses }
// item = { word, count, morphology  }

const isStem = (morpheme) => { return !morpheme.includes('+') }
const stems = (morphology) => morphology.split(' ').filter(isStem).length

const forms = {}  // forms keyed by stem

const items = JSON.parse(fs.readFileSync('words.json', 'utf-8')).wordlist.item

// For each item in the wordlist export file
//    Skip items with specificcase - they are mostly proper names
//    Skip items without morphology
//    Skip items with more than one stem or less than one stem
//    Skip items with a non-stem as the first morpheme
//    Create one entry for each stem and gather the suffixes for that stem
for (let item of items) {
    const { word, count, morphology, specificcase } = item
    if (specificcase) continue // mostly proper names

    if (!morphology) continue
    const morphemes = morphology.split(' ')

    if (stems(morphology) > 1) continue
    if (stems(morphology) === 0) continue
    if (!isStem(morphemes[0])) continue

    const stem = morphemes[0]

    const form = forms[stem] || { stem, suffixes: [], glosses: [] }
    forms[stem] = form

    const suffix = morphemes.slice(1).join('').replace(/\+/g, '')
    if (!form.suffixes.includes(suffix)) form.suffixes.push(suffix)
}

// For each item in the Lexicon file
//    Skip items that are not stems
//    For each sense of the stem, add the gloss to the stem's glosses
const _items = JSON.parse(fs.readFileSync('Lexicon.json', 'utf-8')).Lexicon.Entries.item
for (let item of _items) {
    const type = item.Lexeme?.Type
    if (type !== 'Stem') continue

    const stem = item.Lexeme?.Form
    if (!stem || !forms[stem]) continue

    const senses = asArray(item.Entry?.Sense)
    for (let sense of senses) {
        const _gloss = sense.Gloss
        if (!_gloss) continue

        const gloss = _gloss['$t']
        if (!gloss) continue

        const glosses = forms[stem].glosses
        if (!glosses.includes(gloss)) glosses.push(gloss)
    }
}

fs.writeFileSync('forms.json', JSON.stringify(forms, null, 4))

const roots = Object.keys(forms).sort()
const dict = []

// Write the dictionary entry for each stem with its suffixes and glosses
for (let root of roots) {
    const form = forms[root]
    suffixes = form.suffixes.sort()
    glosses = form.glosses.sort()
    dict.push(`${root}\t${suffixes.join('/')}\t${glosses.join(', ')}`)
}

fs.writeFileSync('dict.tsv', dict.join('\n'))



