export const ssr: boolean = false;

import { getCookies } from "$lib/Cookies"
import { redirect } from "@sveltejs/kit";

export async function load() : Promise<void> {
	if (getCookies("USER_TOKEN") && getCookies("type"))
		throw redirect(302, "/home");
}