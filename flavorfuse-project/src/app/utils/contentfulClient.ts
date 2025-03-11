import { createClient, Entry, Asset } from 'contentful';

const client = createClient({
    space: 'ocm9154cjmz1',
    accessToken: 'r7B6-Fb1TqITT79XXiA3igrdqBEtOwlHiS2hazq2T6o'
});

type Recept = {
    contentTypeId: string;
    sys: {
        id: string;
    };
    fields: {
        nazivRecepta: string;
        sastojci: string;
        uputeZaPripremu: string;
        opisRecepta?: string;
        kategorija?: string[];
        podkategorija?: string[];
        slikaRecepta?: Asset | string;
    };
};

const mapEntryToRecept = (entry: Entry<Recept>): Recept => {
    const nazivRecepta = typeof entry.fields.nazivRecepta === 'string' ? entry.fields.nazivRecepta : 'Nepoznato ime';
    const sastojci = typeof entry.fields.sastojci === 'string' ? entry.fields.sastojci : 'Nepoznati sastojci';
    const uputeZaPripremu = typeof entry.fields.uputeZaPripremu === 'string' ? entry.fields.uputeZaPripremu : 'Nema uputa';
    const opisRecepta = typeof entry.fields.opisRecepta === 'string' ? entry.fields.opisRecepta : '';
    const kategorija = Array.isArray(entry.fields.kategorija)
        ? entry.fields.kategorija.map((kat) => (typeof kat === 'string' ? kat : kat.fields.nazivKategorije))
        : [];

    const podkategorija = Array.isArray(entry.fields.podkategorija)
        ? entry.fields.podkategorija.map((kat) => (typeof kat === 'string' ? kat : kat.fields.nazivPodkategorije))
        : [];

    const slikaRecepta = entry.fields.slikaRecepta && entry.fields.slikaRecepta.sys && entry.fields.slikaRecepta.fields
        ? {
            sys: entry.fields.slikaRecepta.sys,
            fields: entry.fields.slikaRecepta.fields,
            metadata: entry.fields.slikaRecepta.metadata,
        }
        : undefined;

    return {
        contentTypeId: entry.sys.contentType.sys.id,
        sys: {
            id: entry.sys.id,
        },
        fields: {
            nazivRecepta,
            sastojci,
            uputeZaPripremu,
            opisRecepta,
            kategorija,
            podkategorija,
            slikaRecepta,
        },
    };
};

const fetchRecipes = async (): Promise<Recept[]> => {
    const response = await client.getEntries({ content_type: 'recept' });
    return response.items.map(mapEntryToRecept);
};

export { fetchRecipes };
export type { Asset };
export type { Recept };