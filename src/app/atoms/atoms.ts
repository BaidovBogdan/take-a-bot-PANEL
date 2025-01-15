import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const accessTokenAtom = atomWithStorage<string | null | undefined>(
	'access_token',
	null
);
export const burgerCheckAtom = atom<boolean>(true);
