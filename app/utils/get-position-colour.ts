const getPositionColour = (position: number, hex?: boolean): string => {
  switch (position) {
    case 1:
      return hex ? '#ffeb3b' : 'text-yellow-500';
    case 2:
      return hex ? '#9e9e9e' : 'text-gray-500';
    case 3:
      return hex ? '#ff9800' : 'text-orange-500';
    default:
      return hex ? '#000' : 'text-black';
  }
};

export default getPositionColour;
