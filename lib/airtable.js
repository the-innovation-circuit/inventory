const AirtablePlus = require('airtable-plus')

export const eventsAirtable = new AirtablePlus({
  baseID: 'appy7h1bQFoSBqvFN',
  apiKey: process.env.AIRTABLE,
  tableName: 'Events'
})

export const cardsAirtable = new AirtablePlus({
    baseID: 'appy7h1bQFoSBqvFN',
    apiKey: process.env.AIRTABLE,
    tableName: 'Cards'
})

export const itemsAirtable = new AirtablePlus({
    baseID: 'appy7h1bQFoSBqvFN',
    apiKey: process.env.AIRTABLE,
    tableName: 'Items'
})
