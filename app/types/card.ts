export type Card = {
  id: string;
  name: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
};

export type CardInput = Omit<Card, "id">;
