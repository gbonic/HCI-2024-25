import { createClient } from 'contentful';

const client = createClient({
  space: 'ocm9154cjmz1', // Zamijeni s tvojim Space ID
  accessToken: 'r7B6-Fb1TqITT79XXiA3igrdqBEtOwlHiS2hazq2T6o', // Tvoj Delivery API ključ
});

export default client;
