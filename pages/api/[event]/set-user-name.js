export default async function handler(req, res) {
    const { cardsAirtable } = require('../../../lib/airtable')
    try{
        const updateCall = await cardsAirtable.update(req.query.item, {
            "Assigned To @ Event": req.query.name
        })
        res.json({success: true})
    }
    catch(e){
        console.error(e)
        res.json({success: false})
    }
  }
  