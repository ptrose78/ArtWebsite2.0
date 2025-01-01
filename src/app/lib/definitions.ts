// This file contains type definitions for the data.
// It describes the shape of the data, and what data type each property should accept.
// If I use an ORM such as Prisma, these can be generated automatically.

export type LatestArt = {
    id: string;
    image_url: string;
    price: string;
    type: string;
    date: string;
  };

export type LatestArtRaw = Omit<LatestArt, 'amount'> & {
  price: number;
  };