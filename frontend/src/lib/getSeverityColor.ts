const getSeverityColor = (value: number) => {
  if (value <= 50) {
    // Green to yellow
    const ratio = value / 50;
    return `hsl(${120 - 60 * ratio}, 100%, 50%)`;
  } else {
    // Yellow to red
    const ratio = (value - 50) / 50;
    return `hsl(${60 - 60 * ratio}, 100%, 50%)`;
  }
};

export default getSeverityColor;