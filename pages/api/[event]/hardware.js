export default async function handler(req, res) {
  const { itemsAirtable } = require('../../../lib/airtable')
  try {
    const readCall = await itemsAirtable.find(req.query.item)
    const updateCall = await itemsAirtable.update(req.query.item, {
      'Currently At': [req.query.event],
      'Currently Rented To Record': readCall.fields[
        'Currently Rented To Record'
      ]
        ? []
        : [req.query.attendee]
    })
    res.json({
      success: true,
      name: updateCall.fields.Name,
      checkedType: readCall.fields['Currently Rented To Record']
        ? 'backed in'
        : 'out'
    })
  } catch (e) {
    console.error(e)
    res.json({ success: false })
  }
}
