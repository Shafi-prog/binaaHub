// Address utility functions

export const getFormattedAddress = (address: any) => {
  if (!address) return [];
  
  const lines = [];
  if (address.address_1) lines.push(address.address_1);
  if (address.address_2) lines.push(address.address_2);
  
  const cityLine = [
    address.city,
    address.province,
    address.postal_code
  ].filter(Boolean).join(", ");
  
  if (cityLine) lines.push(cityLine);
  if (address.country_code) lines.push(address.country_code);
  
  return lines;
};

export const isSameAddress = (address1: any, address2: any) => {
  if (!address1 || !address2) return false;
  
  return (
    address1.address_1 === address2.address_1 &&
    address1.address_2 === address2.address_2 &&
    address1.city === address2.city &&
    address1.province === address2.province &&
    address1.postal_code === address2.postal_code &&
    address1.country_code === address2.country_code
  );
};
