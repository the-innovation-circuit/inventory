export default async function handler(req, res) {
    const { eventsAirtable } = require('../../lib/airtable')
    try{
        const findCall = await eventsAirtable.find(req.query.item)
        if(!findCall.fields.Name){
            res.json({success: false})
            return
        }
        res.json({success: true})
    }
    catch(e){
        console.error(e)
        res.json({success: false})
    }
  }
  