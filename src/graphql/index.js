import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

const typesArray = fileLoader(path.join(__dirname, './types/*.graphql'));
const resolversArray = fileLoader(path.join(__dirname, './resolvers/root'));

export const typeDefs = mergeTypes(typesArray, { all: true });
export const rootValue = mergeResolvers(resolversArray);
