export default async function handler(req, res) {
    const { itemsAirtable } = require('../../../../lib/airtable')
    try{
        const updateCall = await itemsAirtable.update(req.query.item, {
            "Currently At": []
        })
        res.json({success: true, name: updateCall.fields.Name})
    }
    catch(e){
        console.error(e)
        res.json({success: false})
    }
  }
  