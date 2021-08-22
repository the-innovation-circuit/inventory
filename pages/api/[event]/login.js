export default async function handler(req, res) {
    const { cardsAirtable } = require('../../../lib/airtable')
    try{
        console.log(req.query.item)
        const findCall = await cardsAirtable.find(req.query.item)
        console.log(findCall)
        console.log(findCall)
        res.json({success: true, ...findCall.fields})
    }
    catch(e){
        console.error(e)
        res.json({success: false})
    }
  }
  