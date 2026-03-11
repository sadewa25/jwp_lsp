export const formulaSegitiga = ({
  alas,
  tinggi,
}: {
  alas: number;
  tinggi: number;
}) => {
  return 0.5 * alas * tinggi;
};

export const formulaPersegi = ({ sisi }: { sisi: number }) => {
  return sisi * sisi;
};
