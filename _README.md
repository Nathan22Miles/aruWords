* In Paratext export the wordlist into file words.xml
    * This will give you the morphology info and also info about words that are always capitalized likely proper names
* Get the Lexicon.xml file for the Paratext project
    * This has glosses that have been reviewed by a person (not guesses)
* run: node toJson.js
* run: node forms.js
* Resulting data is in dict.tsv
    * Shows stems, suffixes, and stem gloss