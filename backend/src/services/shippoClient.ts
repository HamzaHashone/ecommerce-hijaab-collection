// shippoClient.js
const shippo = require('shippo');

const shippoClient = shippo('YOUR_SHIPPO_API_KEY');

export default shippoClient;

export const createShippoShipment = async (parcels: any[], address_from: any, address_to: any) => {
  const shipment = await shippoClient.shipment.create(
    {
      address_from: address_from,
      address_to: address_to,
      parcels: parcels,
      object_purpose: "PURCHASE",
      async: false,
      shipment_date: new Date().toISOString()
    }
  );
  return shipment;
};