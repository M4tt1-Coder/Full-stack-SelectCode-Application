import type { ParamMatcher } from '@sveltejs/kit';

/**
 * Should make sure that a passed url parameter is a valid uuid of version 4.s
 *
 * @param param the url parameter
 * @returns Result of the test
 */
export const match: ParamMatcher = (param) => {
	return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/gim.test(param);
	//5f36a786-3846-11ee-9517-947caef5c0e1
};
