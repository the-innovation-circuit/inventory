export default async function handler(req, res) {
    const { eventsAirtable } = require('../../lib/airtable')
    try{
        const findCall = await eventsAirtable.find(req.query.item)
        res.json({success: true})
    }
    catch(e){
        console.error(e)
        res.json({success: false})
    }
  }
  