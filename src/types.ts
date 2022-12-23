export interface PokemonRoot {
    results: Pokemon[];
}

export interface Pokemon {
    id?: number;
    name: string;
    url?: string;
    height?: number;
    weight?: number;
    sprites?: Sprites;
}

export interface Sprites {
    front_default: string;
}