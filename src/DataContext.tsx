import { createContext } from "react";
import {Pokemon} from "./types";

interface DataContext {
    pokemon: Pokemon[];
}

const DataContext = createContext<DataContext>({pokemon: []});

export default DataContext;